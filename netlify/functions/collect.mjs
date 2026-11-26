// Recibe lotes del rastreador, valida el esquema, limita el tamaño y guarda en Netlify Blobs.
// Clave: sesiones/AAAA-MM-DD/{session_id}.json. No se lee ni se guarda la IP.
import { getStore } from '@netlify/blobs';

const MAX_BODY = 120_000;          // bytes por lote
const CAP = { moves: 6000, clicks: 1500, gaze: 8000, events: 600 };
const AOI_RE = /^aoi-[a-z]{2,20}$/;
const SID_RE = /^[a-f0-9]{24}$/;
const EVENT_RE = /^[a-z_]{2,40}$/;
const DEVICES = new Set(['celular', 'tableta', 'computador']);

const json = (status, body) => new Response(body ? JSON.stringify(body) : null, {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
});

const int = (v, min, max) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
};
const str = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max) : '');

function points(arr, max) {
  if (!Array.isArray(arr)) return [];
  const out = [];
  for (const p of arr.slice(0, max)) {
    if (!Array.isArray(p) || !AOI_RE.test(p[0])) continue;
    const x = int(p[1], 0, 1000), y = int(p[2], 0, 1000), t = int(p[3], 0, 864000);
    if (x === null || y === null || t === null) continue;
    out.push([p[0], x, y, t]);
  }
  return out;
}

function cleanData(d, type) {
  if (!d || typeof d !== 'object' || Array.isArray(d)) return null;
  if (type === 'opinion_enviada') {
    const o = {};
    for (const k of ['claridad', 'credibilidad', 'diseno', 'recomendacion']) o[k] = int(d[k], 1, 5);
    for (const k of ['primero', 'cambiarias', 'pagarias']) o[k] = str(d[k], 1200);
    for (const k of ['nombre', 'rol']) o[k] = str(d[k], 80);
    return o;
  }
  const o = {};
  for (const [k, v] of Object.entries(d).slice(0, 6)) {
    if (!/^[a-z_]{1,20}$/.test(k)) continue;
    if (typeof v === 'string') o[k] = str(v, 80);
    else if (typeof v === 'number') o[k] = int(v, -1e9, 1e9);
    else if (Array.isArray(v)) o[k] = v.slice(0, 10).map(x => str(String(x), 40));
  }
  return o;
}

function validate(b) {
  if (!b || typeof b !== 'object' || b.v !== 1 || !SID_RE.test(b.sid)) return null;
  const nowMs = Date.now();
  let started = int(b.started, 0, 9e15);
  if (!started || started < nowMs - 3 * 864e5 || started > nowMs + 864e5) started = nowMs;
  const dv = b.device || {};
  const device = {
    type: DEVICES.has(dv.type) ? dv.type : 'computador',
    w: int(dv.w, 0, 10000) || 0,
    h: int(dv.h, 0, 10000) || 0,
    utm: dv.utm ? str(String(dv.utm), 60).replace(/[^\w.\-]/g, '') || null : null,
    experto: dv.experto === true,
  };
  const aoi_ms = {};
  if (b.aoi_ms && typeof b.aoi_ms === 'object') {
    for (const [k, v] of Object.entries(b.aoi_ms).slice(0, 20)) if (AOI_RE.test(k)) aoi_ms[k] = int(v, 0, 864e5);
  }
  const events = (Array.isArray(b.events) ? b.events.slice(0, 200) : [])
    .filter(e => e && EVENT_RE.test(e.type))
    .map(e => ({ t: int(e.t, 0, 864000) || 0, type: e.type, data: cleanData(e.data, e.type) }));
  return {
    sid: b.sid, started, seq: int(b.seq, 0, 1e6) || 0, device, aoi_ms,
    scroll_max: int(b.scroll_max, 0, 100) || 0,
    scroll: (Array.isArray(b.scroll) ? b.scroll : []).map(n => int(n, 0, 100)).filter(n => [25, 50, 75, 100].includes(n)),
    events,
    moves: points(b.moves, 3000), clicks: points(b.clicks, 800), gaze: points(b.gaze, 3000),
  };
}

function bogotaDate(ms) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(ms));
}

function merge(prev, b) {
  const s = prev || {
    session_id: b.sid, started: b.started, device: b.device, aoi_ms: {}, scroll_max: 0, scroll: [],
    events: [], moves: [], clicks: [], gaze: [], opinion: null, batches: 0,
  };
  s.updated = Date.now();
  s.batches = (s.batches || 0) + 1;
  s.device = { ...s.device, ...b.device, experto: s.device?.experto || b.device.experto };
  // aoi_ms es acumulado en el cliente: se queda el mayor valor
  for (const [k, v] of Object.entries(b.aoi_ms)) s.aoi_ms[k] = Math.max(s.aoi_ms[k] || 0, v);
  s.scroll_max = Math.max(s.scroll_max, b.scroll_max);
  s.scroll = [...new Set([...s.scroll, ...b.scroll])].sort((a, z) => a - z);
  for (const k of ['moves', 'clicks', 'gaze']) {
    const room = CAP[k] - s[k].length;
    if (room > 0) s[k].push(...b[k].slice(0, room));
  }
  const room = CAP.events - s.events.length;
  if (room > 0) s.events.push(...b.events.slice(0, room));
  const op = b.events.filter(e => e.type === 'opinion_enviada').pop();
  if (op && op.data) s.opinion = { ...op.data, at: Date.now() };
  return s;
}

export default async (req) => {
  if (req.method === 'OPTIONS') return json(204);
  if (req.method !== 'POST') return json(405, { error: 'Método no permitido' });
  const len = Number(req.headers.get('content-length') || 0);
  if (len > MAX_BODY) return json(413, { error: 'Lote demasiado grande' });
  const text = await req.text();
  if (text.length > MAX_BODY) return json(413, { error: 'Lote demasiado grande' });
  let body;
  try { body = JSON.parse(text); } catch { return json(400, { error: 'JSON inválido' }); }
  const b = validate(body);
  if (!b) return json(400, { error: 'Esquema inválido' });

  const store = getStore({ name: 'prcpta', consistency: 'strong' });
  const key = `sesiones/${bogotaDate(b.started)}/${b.sid}.json`;
  const prev = await store.get(key, { type: 'json' });
  await store.setJSON(key, merge(prev, b));
  return json(204);
};
