// Modo laboratorio (beta): seguimiento ocular con WebGazer.js, cargado solo al aceptar.
// El video se procesa en el navegador. Solo se envían coordenadas por área de interés.
import * as T from './tracker.js';

const WEBGAZER_URL = 'https://cdn.jsdelivr.net/npm/webgazer@3.5.3/dist/webgazer.js';
const $ = s => document.querySelector(s);
let active = false;
let lastSent = 0;
let wired = false;

function loadScript(src) {
  return new Promise((res, rej) => {
    if (window.webgazer) return res();
    const s = document.createElement('script');
    s.src = src; s.async = true; s.crossOrigin = 'anonymous';
    s.onload = res; s.onerror = () => rej(new Error('No se pudo cargar WebGazer'));
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
  $('#lab-msg').textContent = '';
  dlg.showModal();
}

async function accept() {
  const msg = $('#lab-msg');
  T.event('lab_consentimiento');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return fallback('Este navegador no permite usar la cámara.');
  msg.textContent = 'Cargando el modo laboratorio…';
  try {
    await loadScript(WEBGAZER_URL);
    const wg = window.webgazer;
    wg.saveDataAcrossSessions(false);
    wg.setRegression('ridge');
    wg.setGazeListener((data) => {
      if (!data || !active) return;
      const t = performance.now();
      if (t - lastSent < 100) return; // 10 Hz
      lastSent = t;
      T.gaze(data.x, data.y);
    });
    await wg.begin();
    wg.showVideoPreview(true).showPredictionPoints(false).showFaceOverlay(false).showFaceFeedbackBox(true);
    active = true;
    $('#lab-dialog').close();
    calibrate();
  } catch (err) {
    stopLab();
    fallback('No hay cámara disponible o el permiso fue rechazado.');
  }
}

function fallback(text) {
  T.event('lab_respaldo_cursor', { motivo: text.slice(0, 80) });
  const msg = $('#lab-msg');
  msg.textContent = text + ' Seguimos midiendo con el cursor como respaldo.';
  const dlg = $('#lab-dialog');
  if (!dlg.open) dlg.showModal();
}

function calibrate() {
  const box = $('#calib');
  box.querySelectorAll('.pt').forEach(p => p.remove());
  const pos = [10, 50, 90];
  let done = 0;
  pos.forEach(y => pos.forEach(x => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pt';
    b.style.left = x + '%'; b.style.top = y + '%';
    b.setAttribute('aria-label', `Punto de calibración ${x} ${y}`);
    let n = 0;
    b.addEventListener('click', () => {
      n++;
      b.style.opacity = String(1 - n * 0.2);
      if (n >= 3 && !b.dataset.done) {
        b.dataset.done = '1'; b.style.opacity = '1'; done++;
        if (done === 9) finishCalibration();
      }
    });
    box.appendChild(b);
  }));
  box.hidden = false;
  box.querySelector('.pt').focus();
}

function endCalibration() { $('#calib').hidden = true; }

function finishCalibration() {
  endCalibration();
  try { window.webgazer.showVideoPreview(false).showFaceFeedbackBox(false); } catch { /* */ }
  T.event('lab_calibrado');
  const pill = $('#status-pill');
  pill.classList.add('is-lab');
  $('#status-text').textContent = 'Laboratorio · mirada';
  $('#lab-open').textContent = 'Apagar cámara';
}

export function stopLab() {
  const wasActive = active;
  active = false;
  try { if (window.webgazer) window.webgazer.end(); } catch { /* */ }
  const pill = $('#status-pill');
  if (pill) pill.classList.remove('is-lab');
  const st = $('#status-text'); if (st) st.textContent = 'Midiendo · anónimo';
  const lb = $('#lab-open'); if (lb) lb.textContent = 'Modo laboratorio (beta)';
  if (wasActive) T.event('lab_apagado');
}
