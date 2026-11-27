// Modo laboratorio (beta): seguimiento ocular con WebGazer.js, cargado solo al aceptar.
// El video se procesa en el navegador. Solo se envían coordenadas por área de interés.
// WebGazer (GPL-3.0) y su modelo de rostro se sirven desde /vendor/webgazer, sin depender de un CDN.
import * as T from './tracker.js';

const BASE = '/vendor/webgazer';
const $ = s => document.querySelector(s);
let active = false;
let wired = false;
let lastSent = 0;
let points = 0;
let predictions = 0;
let ticker = null;

function msg(text) { const m = $('#lab-msg'); if (m) m.textContent = text; }

function loadScript(src) {
  return new Promise((res, rej) => {
    if (window.webgazer) return res();
    const s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = res; s.onerror = () => rej(new Error('script'));
    document.head.appendChild(s);
  });
}

export function openLab() {
  const dlg = $('#lab-dialog');
  if (!wired) {
    wired = true;
    $('#lab-cancel').addEventListener('click', () => dlg.close());
    $('#lab-accept').addEventListener('click', accept);
    $('#calib-close').addEventListener('click', () => { endCalibration(); stopLab(); fallback('Calibración cancelada.'); });
  }
  if (active) { stopLab(); return; }
  msg('');
  $('#lab-accept').disabled = false;
  dlg.showModal();
}

// Mensaje claro según el motivo por el que la cámara no arrancó
function cameraError(err) {
  const n = err && err.name;
  if (n === 'NotAllowedError' || n === 'SecurityError') return 'El navegador bloqueó la cámara. Actívala en el candado de la barra de direcciones y vuelve a intentarlo.';
  if (n === 'NotFoundError' || n === 'OverconstrainedError') return 'No encontramos una cámara en este equipo.';
  if (n === 'NotReadableError' || n === 'AbortError') return 'La cámara está en uso por otra aplicación (Zoom, Teams, Meet…). Ciérrala y vuelve a intentarlo.';
  return 'No pudimos encender la cámara.';
}

async function accept() {
  const btn = $('#lab-accept');
  btn.disabled = true;
  T.event('lab_consentimiento');
  if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return fallback('Este navegador no permite usar la cámara en esta página.');
  }
  // 1) Pedimos el permiso nosotros, para dar un mensaje preciso si falla
  msg('Pidiendo permiso para usar la cámara…');
  try {
    const probe = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    probe.getTracks().forEach(t => t.stop());
  } catch (err) {
    return fallback(cameraError(err));
  }
  // 2) Cargamos WebGazer y su modelo de rostro desde nuestro propio sitio
  msg('Cargando el modelo de seguimiento (unos 10 MB, solo la primera vez)…');
  try {
    await loadScript(`${BASE}/webgazer.js`);
  } catch {
    return fallback('No se pudo descargar el modo laboratorio. Revisa tu conexión.');
  }
  const wg = window.webgazer;
  try {
    wg.params.faceMeshSolutionPath = `${BASE}/mediapipe/face_mesh`;
    wg.saveDataAcrossSessions(false);
    wg.setRegression('ridge');
    wg.setGazeListener(onGaze);
    await withTimeout(wg.begin(), 45000);
    try { wg.setVideoViewerSize(200, 150); } catch { /* versión sin este método */ }
    wg.showVideoPreview(true).showPredictionPoints(true).showFaceOverlay(true).showFaceFeedbackBox(true);
  } catch (err) {
    stopLab();
    return fallback(err && err.message === 'timeout'
      ? 'El modelo tardó demasiado en cargar. Prueba con otra red o recarga la página.'
      : cameraError(err));
  }
  active = true;
  $('#lab-dialog').close();
  calibrate();
}

function withTimeout(p, ms) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
}

function onGaze(data) {
  if (!active || !data) return;
  predictions++;
  const t = performance.now();
  if (t - lastSent < 100) return; // 10 Hz
  lastSent = t;
  if ($('#calib') && !$('#calib').hidden) return; // durante la calibración no se mide
  points++;
  T.gaze(data.x, data.y);
}

function fallback(text) {
  T.event('lab_respaldo_cursor', { motivo: text.slice(0, 80) });
  msg(text + ' Mientras tanto, seguimos midiendo con el cursor.');
  const btn = $('#lab-accept'); if (btn) btn.disabled = false;
  const dlg = $('#lab-dialog');
  if (!dlg.open) dlg.showModal();
}

function calibrate() {
  const box = $('#calib');
  box.querySelectorAll('.pt').forEach(p => p.remove());
  const pos = [10, 50, 90];
  let done = 0;
  const status = $('#calib-msg');
  const base = 'Mira cada punto y haz clic en él 3 veces hasta que se ponga verde. Tu cara debe verse en el recuadro de la cámara.';
  status.textContent = base;
  pos.forEach(y => pos.forEach(x => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pt';
    b.style.left = x + '%'; b.style.top = y + '%';
    b.setAttribute('aria-label', `Punto de calibración ${done + 1}`);
    let n = 0;
    b.addEventListener('click', () => {
      n++;
      b.style.opacity = String(1 - n * 0.2);
      if (n >= 3 && !b.dataset.done) {
        b.dataset.done = '1'; b.style.opacity = '1'; done++;
        status.textContent = `${base} (${done}/9)`;
        if (done === 9) finishCalibration();
      }
    });
    box.appendChild(b);
  }));
  box.hidden = false;
  document.body.classList.add('is-calibrating');
  box.querySelector('.pt').focus();
  // Aviso si no se detecta un rostro durante la calibración
  const before = predictions;
  setTimeout(() => {
    if (active && !box.hidden && predictions === before) status.textContent = 'No detectamos tu rostro. Acércate, mira de frente y busca buena luz.';
  }, 6000);
}

function endCalibration() {
  $('#calib').hidden = true;
  document.body.classList.remove('is-calibrating');
}

function finishCalibration() {
  endCalibration();
  try { window.webgazer.showVideoPreview(false).showPredictionPoints(false).showFaceFeedbackBox(false); } catch { /* */ }
  T.event('lab_calibrado');
  $('#status-pill').classList.add('is-lab');
  $('#lab-open').textContent = 'Apagar cámara';
  points = 0;
  const st = $('#status-text');
  const paint = () => { st.textContent = `Laboratorio · ${points} señales de mirada`; };
  paint();
  clearInterval(ticker);
  ticker = setInterval(paint, 1000);
}

export function stopLab() {
  const wasActive = active;
  active = false;
  clearInterval(ticker);
  try {
    if (window.webgazer) {
      window.webgazer.end();
      const v = document.getElementById('webgazerVideoContainer'); if (v) v.remove();
    }
  } catch { /* */ }
  const pill = $('#status-pill'); if (pill) pill.classList.remove('is-lab');
  const st = $('#status-text'); if (st) st.textContent = 'Midiendo · anónimo';
  const lb = $('#lab-open'); if (lb) lb.textContent = 'Modo laboratorio (beta)';
  if (wasActive) T.event('lab_apagado', { senales: points });
}
