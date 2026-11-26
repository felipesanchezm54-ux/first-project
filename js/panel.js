// Panel de resultados de PRCPTA
const $ = s => document.querySelector(s);
const LABEL = {
  'aoi-hero': 'Propuesta de valor', 'aoi-demo': 'Demo', 'aoi-problema': 'Problema', 'aoi-proceso': 'Cómo funciona',
  'aoi-precios': 'Precios', 'aoi-casos': 'Casos', 'aoi-etica': 'Datos y ética', 'aoi-equipo': 'Equipo',
  'aoi-cta': 'Llamado / formulario', 'aoi-opinion': 'Opinión experto',
};
const AOIS = Object.keys(LABEL);
const KEY = new Set(['aoi-hero', 'aoi-precios', 'aoi-cta']);
const HEAT = ['#3E7BD6', '#2FB6A3', '#FFB23E', '#FF5A3C'];
const DEV_W = { computador: 1280, tableta: 820, celular: 390, todos: 1280 };
let data = null;
let pw = '';
try { pw = sessionStorage.getItem('prcpta_panel') || ''; } catch { /* */ }

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n, d = 0) => Number(n || 0).toLocaleString('es-CO', { maximumFractionDigits: d, minimumFractionDigits: d });
const has = (s, t) => (s.events || []).some(e => e.type === t);
const dateOf = ms => new Date(ms).toLocaleString('es-CO', { timeZone: 'America/Bogota', dateStyle: 'short', timeStyle: 'short' });

async function load() {
  const msg = $('#login-msg');
  msg.textContent = '';
  let r;
  try {
    r = await fetch('/.netlify/functions/panel-data', { headers: { Authorization: 'Bearer ' + encodeURIComponent(pw) }, cache: 'no-store' });
  } catch { msg.textContent = 'No hay conexión con el servidor.'; return; }
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    msg.textContent = body.error || `Error ${r.status}`;
    $('#login').hidden = false; $('#dash').hidden = true; $('#actions').hidden = true;
    return;
  }
  try { sessionStorage.setItem('prcpta_panel', pw); } catch { /* */ }
  data = body;
  $('#login').hidden = true; $('#dash').hidden = false; $('#actions').hidden = false;
  render();
}

function render() {
  const k = data.kpis;
  $('#gen').textContent = `Actualizado: ${dateOf(Date.parse(data.generado))}`;
  $('#kpis').innerHTML = [
    [fmt(k.sesiones), 'Sesiones medidas'],
    [fmt(k.tiempo_promedio_s, 1) + ' s', 'Tiempo promedio visible'],
    [fmt(k.pct_precios, 1) + ' %', 'Llegó a precios'],
    [fmt(k.pct_demo, 1) + ' %', 'Completó la demo'],
    [fmt(k.envios_formulario), 'Envíos de formulario'],
    [fmt(k.opiniones_expertos), 'Opiniones de expertos'],
  ].map(([v, l]) => `<div class="kpi"><b>${v}</b><span>${l}</span></div>`).join('');

  // Reparto de la atención
  const max = Math.max(1, ...data.share.map(s => s.pct));
  $('#alerts').innerHTML = data.alerts.map(a =>
    `<p class="alert"><strong>Alerta:</strong> ${esc(LABEL[a.aoi])} recibe solo ${fmt(a.pct, 1)} % de la atención (umbral 15 %).</p>`).join('');
  $('#share').innerHTML = data.share.length ? data.share.map((s, i) => {
    const c = s.pct >= 15 ? HEAT[3] : s.pct >= 10 ? HEAT[2] : s.pct >= 5 ? HEAT[1] : HEAT[0];
    return `<div class="bar ${KEY.has(s.aoi) ? 'is-key' : ''}"><span class="name"><span class="rk">${i + 1}.</span>${esc(LABEL[s.aoi] || s.aoi)}</span>
      <span class="track" role="img" aria-label="${fmt(s.pct, 1)} %"><span class="fill" style="width:${(s.pct / max) * 100}%;background:${c}"></span></span>
      <span class="v">${fmt(s.pct, 1)} %</span></div>`;
  }).join('') : '<p class="empty">Aún no hay sesiones medidas.</p>';

  // Embudo
  const f = data.funnel;
  const steps = [['visita', 'Visita'], ['demo', 'Completó la demo'], ['precios', 'Llegó a precios'], ['form_inicio', 'Inició formulario'], ['form_envio', 'Envió formulario']];
  const top = Math.max(1, f.visita);
  $('#funnel').innerHTML = steps.map(([key, l]) => `<div class="bar"><span class="name">${l}</span>
    <span class="track" role="img" aria-label="${f[key]} sesiones"><span class="fill" style="width:${(f[key] / top) * 100}%;background:${HEAT[1]}"></span></span>
    <span class="v">${f[key]} · ${fmt(100 * f[key] / top, 0)} %</span></div>`).join('');

  // Selectores del mapa de calor
  const aoiSel = $('#hm-aoi');
  if (!aoiSel.options.length) aoiSel.innerHTML = AOIS.map(a => `<option value="${a}">${LABEL[a]}</option>`).join('');
  const sidSel = $('#hm-sid');
  const cur = sidSel.value;
  sidSel.innerHTML = '<option value="">Todas</option>' + data.sessions.map(s =>
    `<option value="${s.session_id}">${s.session_id.slice(0, 8)} · ${s.device?.type || ''} · ${dateOf(s.started)}${s.opinion ? ' · experto' : ''}</option>`).join('');
  sidSel.value = cur;

  renderOpinions();
  renderSessions();
  heatmap();
}

function miniShare(s) {
  const tot = Object.values(s.aoi_ms || {}).reduce((a, b) => a + b, 0) || 1;
  return '<div class="mini">' + Object.entries(s.aoi_ms || {}).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) =>
    `<div><span>${esc((LABEL[k] || k).slice(0, 10))}</span><i style="width:${(100 * v / tot).toFixed(0)}%"></i><span>${fmt(100 * v / tot)}%</span></div>`).join('') + '</div>';
}

function renderOpinions() {
  const ops = data.sessions.filter(s => s.opinion);
  const t = $('#ops');
  if (!ops.length) { t.innerHTML = '<tbody><tr><td class="empty">Aún no hay opiniones vinculadas a una sesión. Las que llegan sin medición quedan solo en Netlify Forms.</td></tr></tbody>'; return; }
  t.innerHTML = `<thead><tr><th>Experto</th><th>Clar.</th><th>Cred.</th><th>Diseño</th><th>Recom.</th><th>Lo primero que entendió</th><th>Qué cambiaría</th><th>¿Pagaría?</th><th>Su atención</th><th></th></tr></thead><tbody>` +
    ops.map(s => {
      const o = s.opinion;
      return `<tr><td>${esc(o.nombre || 'Anónimo')}<br><span class="muted small">${esc(o.rol || '')}</span><br><span class="mono muted small">${s.session_id.slice(0, 8)} · ${esc(s.device?.type)}</span></td>
        <td class="num">${o.claridad ?? '–'}</td><td class="num">${o.credibilidad ?? '–'}</td><td class="num">${o.diseno ?? '–'}</td><td class="num">${o.recomendacion ?? '–'}</td>
        <td class="txt">${esc(o.primero)}</td><td class="txt">${esc(o.cambiarias)}</td><td class="txt">${esc(o.pagarias)}</td>
        <td>${miniShare(s)}</td><td><button class="btn btn--small" type="button" data-map="${s.session_id}" data-dev="${esc(s.device?.type)}">Ver su mapa</button></td></tr>`;
    }).join('') + '</tbody>';
}

function renderSessions() {
  const t = $('#sess');
  const rows = data.sessions.slice(0, 50);
  if (!rows.length) { t.innerHTML = '<tbody><tr><td class="empty">Sin sesiones.</td></tr></tbody>'; return; }
  t.innerHTML = `<thead><tr><th>Inicio</th><th>Sesión</th><th>Dispositivo</th><th>Tiempo</th><th>Scroll</th><th>Demo</th><th>Precios</th><th>Form.</th><th>Origen</th></tr></thead><tbody>` +
    rows.map(s => {
      const tot = Object.values(s.aoi_ms || {}).reduce((a, b) => a + b, 0);
      return `<tr><td>${dateOf(s.started)}</td><td class="num">${s.session_id.slice(0, 8)}</td><td>${esc(s.device?.type)} · ${s.device?.w || ''} px${s.device?.experto ? ' · experto' : ''}</td>
      <td class="num">${fmt(tot / 1000, 0)} s</td><td class="num">${s.scroll_max || 0} %</td><td>${has(s, 'demo_completada') ? 'Sí' : '–'}</td>
      <td>${has(s, 'clic_precios') ? 'Clic' : (s.aoi_ms?.['aoi-precios'] >= 1000 ? 'Vio' : '–')}</td><td>${has(s, 'form_envio') ? 'Envió' : has(s, 'form_inicio') ? 'Inició' : '–'}</td>
      <td>${esc(s.device?.utm || '–')}</td></tr>`;
    }).join('') + '</tbody>';
}

// ---------- Mapa de calor: canvas sobre la sección real ----------
let frameAoi = '', frameDev = '', sectionH = 0;
function heatmap() {
  const aoi = $('#hm-aoi').value, layer = $('#hm-layer').value, dev = $('#hm-dev').value, sid = $('#hm-sid').value;
  const stage = $('#hm-stage'), frame = $('#hm-frame');
  const dw = DEV_W[dev];
  const avail = stage.parentElement.clientWidth;
  const W = Math.min(avail, dev === 'celular' ? 390 : dev === 'tableta' ? 620 : avail);
  const scale = W / dw;
  stage.style.width = W + 'px';
  stage.classList.toggle('is-narrow', W < avail);

  const pts = [];
  for (const s of data.sessions) {
    if (sid && s.session_id !== sid) continue;
    if (!sid && dev !== 'todos' && s.device?.type !== dev) continue;
    for (const p of s[layer] || []) if (p[0] === aoi) pts.push(p);
  }
  $('#hm-count').textContent = `${fmt(pts.length)} puntos · ${LABEL[aoi]} · ${$('#hm-layer').selectedOptions[0].text}`;

  const paint = () => {
    const H = Math.max(200, Math.round(sectionH * scale));
    stage.style.height = H + 'px';
    frame.style.width = dw + 'px'; frame.style.height = sectionH + 'px';
    frame.style.transform = `scale(${scale})`;
    draw($('#hm-canvas'), W, H, pts, layer === 'clicks' ? 26 : 18);
  };
  if (frameAoi === aoi && frameDev === dw && sectionH) { paint(); return; }
  frameAoi = aoi; frameDev = dw; sectionH = 0;
  frame.style.width = dw + 'px'; frame.style.height = '2400px';
  frame.onload = async () => {
    try {
      const doc = frame.contentDocument;
      if (doc.fonts) await doc.fonts.ready;
      await new Promise(r => setTimeout(r, 150));
      const sec = doc.querySelector('.vista-on');
      sectionH = sec ? Math.ceil(sec.getBoundingClientRect().height) : 800;
    } catch { sectionH = 800; }
    paint();
  };
  frame.src = `/?vista=${encodeURIComponent(aoi)}`;
}

function draw(cv, W, H, pts, radius) {
  const dpr = window.devicePixelRatio || 1;
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, cv.width, cv.height);
  if (!pts.length) return;
  const r = radius * dpr;
  // 1) acumulación en escala de alfa
  const acc = document.createElement('canvas'); acc.width = cv.width; acc.height = cv.height;
  const a = acc.getContext('2d');
  const alpha = Math.max(0.03, Math.min(0.3, 12 / pts.length));
  for (const p of pts) {
    const x = (p[1] / 1000) * cv.width, y = (p[2] / 1000) * cv.height;
    const g = a.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(0,0,0,${alpha})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    a.fillStyle = g; a.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // 2) colorear con la escala de calor de la marca
  const img = a.getImageData(0, 0, acc.width, acc.height);
  const d = img.data;
  let maxA = 0;
  for (let i = 3; i < d.length; i += 4) if (d[i] > maxA) maxA = d[i];
  const pal = palette();
  for (let i = 0; i < d.length; i += 4) {
    const v = d[i + 3];
    if (!v) continue;
    const n = Math.min(255, Math.round((v / maxA) * 255));
    d[i] = pal[n * 4]; d[i + 1] = pal[n * 4 + 1]; d[i + 2] = pal[n * 4 + 2];
    d[i + 3] = Math.round(60 + n * 0.7);
  }
  ctx.putImageData(img, 0, 0);
}

let palCache = null;
function palette() {
  if (palCache) return palCache;
  const c = document.createElement('canvas'); c.width = 256; c.height = 1;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 256, 0);
  HEAT.forEach((col, i) => g.addColorStop(i / (HEAT.length - 1), col));
  x.fillStyle = g; x.fillRect(0, 0, 256, 1);
  return (palCache = x.getImageData(0, 0, 256, 1).data);
}

// ---------- Exportar ----------
function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const stamp = () => new Date().toISOString().slice(0, 10);

function toCSV() {
  const head = ['session_id', 'inicio', 'dispositivo', 'ancho_px', 'utm_source', 'experto', 'tiempo_total_s',
    ...AOIS.map(a => `s_${a.slice(4)}`), 'scroll_max', 'demo_completada', 'clic_precios', 'clic_cta', 'form_inicio', 'form_envio',
    'puntos_cursor', 'puntos_clic', 'puntos_mirada', 'op_claridad', 'op_credibilidad', 'op_diseno', 'op_recomendacion',
    'op_primero', 'op_cambiarias', 'op_pagarias', 'op_nombre', 'op_rol'];
  const q = v => { const s = String(v ?? ''); return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const num = v => String(v).replace('.', ',');
  const rows = data.sessions.map(s => {
    const tot = Object.values(s.aoi_ms || {}).reduce((a, b) => a + b, 0);
    const o = s.opinion || {};
    return [s.session_id, new Date(s.started).toISOString(), s.device?.type, s.device?.w, s.device?.utm || '', s.device?.experto ? 'si' : 'no',
      num((tot / 1000).toFixed(1)), ...AOIS.map(a => num(((s.aoi_ms?.[a] || 0) / 1000).toFixed(1))), s.scroll_max || 0,
      ...['demo_completada', 'clic_precios', 'clic_cta', 'form_inicio', 'form_envio'].map(t => has(s, t) ? 1 : 0),
      (s.moves || []).length, (s.clicks || []).length, (s.gaze || []).length,
      o.claridad ?? '', o.credibilidad ?? '', o.diseno ?? '', o.recomendacion ?? '', o.primero ?? '', o.cambiarias ?? '', o.pagarias ?? '', o.nombre ?? '', o.rol ?? ''].map(q).join(';');
  });
  return '﻿' + [head.join(';'), ...rows].join('\r\n');
}

// ---------- Eventos ----------
$('#login').addEventListener('submit', e => { e.preventDefault(); pw = $('#pw').value; load(); });
$('#reload').addEventListener('click', load);
$('#logout').addEventListener('click', () => { try { sessionStorage.removeItem('prcpta_panel'); } catch { /* */ } location.reload(); });
$('#csv').addEventListener('click', () => data && download(`prcpta-sesiones-${stamp()}.csv`, toCSV(), 'text/csv;charset=utf-8'));
$('#jsonx').addEventListener('click', () => data && download(`prcpta-datos-${stamp()}.json`, JSON.stringify(data, null, 2), 'application/json'));
['#hm-aoi', '#hm-layer', '#hm-dev', '#hm-sid'].forEach(s => $(s).addEventListener('change', () => data && heatmap()));
$('#ops').addEventListener('click', e => {
  const b = e.target.closest('[data-map]');
  if (!b) return;
  $('#hm-sid').value = b.dataset.map;
  if (DEV_W[b.dataset.dev]) $('#hm-dev').value = b.dataset.dev;
  heatmap();
  $('#hm-stage').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
let rt;
addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => data && heatmap(), 200); });
if (pw) load();
