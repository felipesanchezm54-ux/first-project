// Devuelve los datos agregados para /panel. Protegido con la variable de entorno PANEL_PASSWORD.
import { getStore } from '@netlify/blobs';
import { createHash, timingSafeEqual } from 'node:crypto';

const KEY_AOIS = ['aoi-hero', 'aoi-precios', 'aoi-cta'];
const AOI_ORDER = ['aoi-hero', 'aoi-demo', 'aoi-problema', 'aoi-proceso', 'aoi-precios', 'aoi-casos', 'aoi-etica', 'aoi-equipo', 'aoi-cta', 'aoi-opinion'];

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
});
const h = s => createHash('sha256').update(String(s)).digest();

function authorized(req) {
  const pw = process.env.PANEL_PASSWORD || globalThis.Netlify?.env?.get?.('PANEL_PASSWORD');
  if (!pw) return null;
  let given = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  try { given = decodeURIComponent(given); } catch { /* se usa tal cual */ }
  return given.length > 0 && timingSafeEqual(h(given), h(pw));
}

const has = (s, type) => s.events.some(e => e.type === type);

function summarize(sessions) {
  const n = sessions.length;
  const totalMs = {};
  let timeSum = 0;
  const f = { visita: n, demo: 0, precios: 0, form_inicio: 0, form_envio: 0 };
  let opiniones = 0;
  for (const s of sessions) {
    const t = Object.values(s.aoi_ms || {}).reduce((a, b) => a + b, 0);
    timeSum += t;
    for (const [k, v] of Object.entries(s.aoi_ms || {})) totalMs[k] = (totalMs[k] || 0) + v;
    const demo = has(s, 'demo_completada');
    const precios = (s.aoi_ms?.['aoi-precios'] || 0) >= 1000 || has(s, 'clic_precios');
    const fi = has(s, 'form_inicio');
    const fe = has(s, 'form_envio');
    if (demo) f.demo++;
    if (precios) f.precios++;
    if (fi) f.form_inicio++;
    if (fe) f.form_envio++;
    if (s.opinion) opiniones++;
  }
  const all = Object.values(totalMs).reduce((a, b) => a + b, 0) || 1;
  const share = AOI_ORDER.filter(a => totalMs[a] !== undefined)
    .map(a => ({ aoi: a, ms: totalMs[a], pct: +(100 * totalMs[a] / all).toFixed(1) }))
    .sort((a, b) => b.ms - a.ms);
  const alerts = n ? KEY_AOIS.map(a => ({ aoi: a, pct: share.find(x => x.aoi === a)?.pct || 0 })).filter(x => x.pct < 15) : [];
  const pct = v => (n ? +(100 * v / n).toFixed(1) : 0);
  return {
    kpis: {
      sesiones: n,
      tiempo_promedio_s: n ? +(timeSum / n / 1000).toFixed(1) : 0,
      pct_precios: pct(f.precios),
      pct_demo: pct(f.demo),
      envios_formulario: f.form_envio,
      opiniones_expertos: opiniones,
    },
    share, alerts, funnel: f,
  };
}

export default async (req) => {
  const ok = authorized(req);
  if (ok === null) return json(503, { error: 'Falta configurar PANEL_PASSWORD en Netlify.' });
  if (!ok) return json(401, { error: 'Contraseña incorrecta.' });

  const url = new URL(req.url);
  const desde = url.searchParams.get('desde') || '';   // AAAA-MM-DD opcional
  const store = getStore({ name: 'prcpta', consistency: 'strong' });
  const { blobs } = await store.list({ prefix: 'sesiones/' });
  const keys = blobs.map(b => b.key).filter(k => !desde || k.slice(9, 19) >= desde);

  const sessions = [];
  for (let i = 0; i < keys.length; i += 25) {
    const chunk = await Promise.all(keys.slice(i, i + 25).map(k => store.get(k, { type: 'json' }).catch(() => null)));
    for (const s of chunk) if (s && s.session_id) sessions.push(s);
  }
  sessions.sort((a, b) => (b.started || 0) - (a.started || 0));
  return json(200, { generado: new Date().toISOString(), ...summarize(sessions), sessions });
};
