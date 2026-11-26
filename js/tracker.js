// Rastreador propio de atención de PRCPTA. Sin librerías de terceros.
// No mide nada hasta que se llame a start() (después de "Acepto").

const ENDPOINT = '/.netlify/functions/collect';
const FLUSH_MS = 5000;
const SAMPLE_MS = 100;            // cursor a 10 Hz
const MAX_POINTS = 4000;          // tope por tipo y sesión en el cliente
const SCROLL_MARKS = [25, 50, 75, 100];

let on = false;
let sid = null;
let started = 0;
let seq = 0;
let device = null;
const aoiMs = {};                  // acumulado por sección
let aoiDirty = false;
let scrollMax = 0;
const scrollHit = new Set();
let buf = newBuf();
const counts = { moves: 0, clicks: 0, gaze: 0 };
const visible = new Map();         // aoi -> true si cuenta como visible
let lastTick = 0;
let mouse = null, mouseMoved = false;
let timers = [];
let io = null;
const once = new Set();

function newBuf() { return { events: [], moves: [], clicks: [], gaze: [], scroll: [] }; }
const now = () => Math.round(performance.now());

function uid() {
  const a = new Uint8Array(12);
  crypto.getRandomValues(a);
  return Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
}

function getSid() {
  try {
    let s = sessionStorage.getItem('prcpta_sid');
    let t = Number(sessionStorage.getItem('prcpta_started'));
    if (!s) { s = uid(); t = Date.now(); sessionStorage.setItem('prcpta_sid', s); sessionStorage.setItem('prcpta_started', String(t)); }
    return [s, t || Date.now()];
  } catch { return [uid(), Date.now()]; }
}

function deviceInfo() {
  const w = window.innerWidth;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const type = w < 768 ? 'celular' : (coarse && w < 1200 ? 'tableta' : 'computador');
  const q = new URLSearchParams(location.search);
  const utm = (q.get('utm_source') || '').slice(0, 60).replace(/[^\w.\-]/g, '');
  return { type, w, h: window.innerHeight, utm: utm || null, experto: q.get('experto') === '1' };
}

// Convierte un punto de la ventana en coordenadas relativas a la sección que lo contiene
export function locate(clientX, clientY) {
  const el = document.elementFromPoint(clientX, clientY);
  const sec = el && el.closest('[data-aoi]');
  if (!sec) return null;
  const r = sec.getBoundingClientRect();
  if (!r.width || !r.height) return null;
  const rx = (clientX - r.left) / r.width, ry = (clientY - r.top) / r.height;
  if (rx < 0 || rx > 1 || ry < 0 || ry > 1) return null;
  return [sec.dataset.aoi, Math.round(rx * 1000), Math.round(ry * 1000)];
}

function push(kind, p) {
  if (!p || counts[kind] >= MAX_POINTS) return;
  counts[kind]++;
  buf[kind].push([p[0], p[1], p[2], Math.round((Date.now() - started) / 100)]); // t en décimas de segundo
}

function onMove(e) { mouse = [e.clientX, e.clientY]; mouseMoved = true; }
function onDown(e) { push('clicks', locate(e.clientX, e.clientY)); }

function sample() {
  if (!mouseMoved || !mouse) return;
  mouseMoved = false;
  push('moves', locate(mouse[0], mouse[1]));
}

function tick() {
  const t = now();
  const dt = Math.min(t - lastTick, 1000);
  lastTick = t;
  if (document.hidden) return;
  visible.forEach((v, aoi) => { if (v) { aoiMs[aoi] = (aoiMs[aoi] || 0) + dt; aoiDirty = true; } });
}

function onScroll() {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const p = h <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / h) * 100));
  if (p > scrollMax) scrollMax = p;
  SCROLL_MARKS.forEach(m => {
    if (scrollMax >= m - 1 && !scrollHit.has(m)) { scrollHit.add(m); buf.scroll.push(m); }
  });
}

function observe() {
  const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
  io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      const aoi = en.target.dataset.aoi;
      // Visible si ≥50 % de la sección está en pantalla, o si ocupa ≥50 % de la pantalla (secciones altas en celular)
      const vis = en.isIntersecting && (en.intersectionRatio >= 0.5 || en.intersectionRect.height >= window.innerHeight * 0.5);
      visible.set(aoi, vis);
    });
  }, { threshold: thresholds });
  document.querySelectorAll('[data-aoi]').forEach(el => io.observe(el));
}

function payload() {
  const b = buf;
  const has = b.events.length || b.moves.length || b.clicks.length || b.gaze.length || b.scroll.length || aoiDirty;
  if (!has) return null;
  buf = newBuf();
  aoiDirty = false;
  const ms = {};
  Object.keys(aoiMs).forEach(k => { ms[k] = Math.round(aoiMs[k]); });
  return JSON.stringify({ v: 1, sid, started, seq: ++seq, device, aoi_ms: ms, scroll_max: scrollMax, ...b });
}

export function flush(useBeacon = false) {
  if (!on) return;
  const body = payload();
  if (!body) return;
  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
    return;
  }
  fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: body.length < 60000 }).catch(() => {});
}

function onHide() { if (document.visibilityState === 'hidden') flush(true); }

export function start() {
  if (on) return;
  on = true;
  [sid, started] = getSid();
  device = deviceInfo();
  lastTick = now();
  observe();
  onScroll();
  addEventListener('mousemove', onMove, { passive: true });
  addEventListener('pointerdown', onDown, { passive: true });
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('pagehide', () => flush(true));
  document.addEventListener('visibilitychange', onHide);
  timers = [setInterval(sample, SAMPLE_MS), setInterval(tick, 250), setInterval(() => flush(false), FLUSH_MS)];
  event('visita', { path: location.pathname });
}

export function stop() {
  if (!on) return;
  event('medicion_detenida');
  flush(true);
  on = false;
  timers.forEach(clearInterval);
  timers = [];
  io && io.disconnect();
  removeEventListener('mousemove', onMove);
  removeEventListener('pointerdown', onDown);
  removeEventListener('scroll', onScroll);
  document.removeEventListener('visibilitychange', onHide);
}

// Evento clave. `unique` evita repetirlo en la misma página.
export function event(type, data = null, unique = false) {
  if (!on) return;
  if (unique) { if (once.has(type)) return; once.add(type); }
  buf.events.push({ t: Math.round((Date.now() - started) / 100), type, data });
}

// Punto de mirada (modo laboratorio), en coordenadas de ventana
export function gaze(x, y) { if (on) push('gaze', locate(x, y)); }

export const isOn = () => on;
export const sessionId = () => sid;
