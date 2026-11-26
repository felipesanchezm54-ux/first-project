import * as T from './tracker.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const params = new URLSearchParams(location.search);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* sin almacenamiento */ } },
};

// ---------- Vista para el panel (sin rastreo ni aviso) ----------
const vista = params.get('vista');
if (vista) {
  const sec = document.querySelector(`[data-aoi="${CSS.escape(vista)}"]`);
  if (sec) sec.classList.add('vista-on');
  if (vista === 'aoi-opinion') document.body.classList.add('is-experto');
  $$('.reveal').forEach(el => el.classList.add('is-in'));
} else {
  init();
}

function init() {
  setupExpert();
  setupConsent();
  setupLogo();
  setupReveal();
  setupDemo();
  setupCopy();
  setupKeyEvents();
}

// ---------- Modo experto ----------
function setupExpert() {
  if (params.get('experto') === '1') store.set('prcpta_experto', '1');
  if (store.get('prcpta_experto') !== '1') return;
  document.body.classList.add('is-experto');
  $$('[data-scale]').forEach(box => {
    const name = box.dataset.scale;
    box.innerHTML = [1, 2, 3, 4, 5].map(n =>
      `<label class="choice"><input type="radio" name="${name}" value="${n}" required><span>${n}</span></label>`).join('');
  });
  $('#fab').addEventListener('click', () => T.event('clic_opinion'));
  const form = $('#op-form');
  form.addEventListener('focusin', () => T.event('opinion_inicio', null, true));
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const status = $('#op-status');
    const sid = T.isOn() ? T.sessionId() : '';
    $('#op-sid').value = sid || 'sin-medicion';
    const fd = new FormData(form);
    const op = {};
    ['claridad', 'credibilidad', 'diseno', 'recomendacion'].forEach(k => { op[k] = Number(fd.get(k)); });
    ['primero', 'cambiarias', 'pagarias', 'nombre', 'rol'].forEach(k => { op[k] = String(fd.get(k) || '').trim(); });
    status.textContent = 'Enviando…';
    let okForm = false;
    try {
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fd).toString() });
      okForm = r.ok;
    } catch { /* sin red */ }
    if (sid) { T.event('opinion_enviada', op); T.flush(false); }
    if (okForm || sid) {
      form.innerHTML = `<div class="form-ok"><h3>Gracias por tu opinión</h3><p class="muted">Quedó guardada${sid ? ' junto con tu recorrido de atención (anónimo).' : '.'}</p></div>`;
    } else {
      status.textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.';
    }
  });
}

// ---------- Consentimiento ----------
function setupConsent() {
  const box = $('#consent');
  const choice = store.get('prcpta_consent');
  if (choice === 'si') { begin(); return; }
  if (choice === 'no') return;
  box.hidden = false;
  box.addEventListener('click', e => {
    const b = e.target.closest('[data-consent]');
    if (!b) return;
    store.set('prcpta_consent', b.dataset.consent);
    box.hidden = true;
    if (b.dataset.consent === 'si') begin();
  });
}

function begin() {
  T.start();
  const pill = $('#status-pill');
  pill.classList.add('is-on');
  const sid = T.sessionId();
  const note = $('#op-sid-note');
  if (note) note.textContent = `Sesión anónima: ${sid.slice(0, 8)}…`;
  $('#track-stop').addEventListener('click', () => {
    T.stop();
    store.set('prcpta_consent', 'no');
    import('./lab.js').then(m => m.stopLab()).catch(() => {});
    pill.classList.remove('is-on');
  });
  $('#lab-open').addEventListener('click', () => import('./lab.js').then(m => m.openLab()));
}

// ---------- Logotipo: aparecen las vocales ----------
function setupLogo() {
  const logo = $('#logo');
  logo.addEventListener('click', () => {
    const open = logo.classList.toggle('is-open');
    logo.setAttribute('aria-pressed', String(open));
    T.event('logo_vocales', null, true);
  });
}

// ---------- Revelado sobrio ----------
function setupReveal() {
  const els = $$('.reveal');
  if (reduced || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach(e => io.observe(e));
}

// ---------- Demo de 10 segundos ----------
const ZONES = {
  marca: 'la marca',
  ilustracion: 'la ilustración',
  origen: 'el texto de origen',
  tueste: 'el sello de tueste',
  precio: 'el precio',
  otra: 'otra zona del empaque',
};

function setupDemo() {
  const wrap = $('#pack');
  const startBtn = $('#demo-start');
  const bar = $('#countdown-bar');
  const count = $('#tap-count');
  const svg = $('#pack-path');
  const out = $('#demo-out');
  let taps = [];
  let t0 = 0;
  let running = false;

  startBtn.addEventListener('click', () => {
    if (running) return;
    running = true;
    taps = [];
    svg.innerHTML = '';
    count.textContent = 'Toque 0/3';
    out.innerHTML = '<p class="muted">Mira el empaque…</p>';
    wrap.classList.remove('is-blurred');
    wrap.classList.add('is-locked');
    startBtn.disabled = true;
    T.event('demo_inicio');
    const dur = 5000;
    const s = performance.now();
    (function step(n) {
      const p = Math.min(1, (n - s) / dur);
      bar.style.width = (p * 100) + '%';
      if (p < 1) requestAnimationFrame(step); else ready();
    })(s);
  });

  function ready() {
    wrap.classList.remove('is-locked');
    out.innerHTML = '<p><strong>Ahora toca lo primero que viste.</strong> Después, lo segundo y lo tercero.</p>';
    t0 = performance.now();
    const first = $('.hot', wrap);
    if (document.activeElement === startBtn) first.focus({ preventScroll: true });
  }

  wrap.addEventListener('click', e => {
    if (!running || wrap.classList.contains('is-locked') || taps.length >= 3) return;
    const r = wrap.getBoundingClientRect();
    let x, y, zone;
    const hot = e.target.closest('.hot');
    if (e.detail === 0 && hot) { // teclado: centro del área
      const h = hot.getBoundingClientRect();
      x = (h.left + h.width / 2 - r.left) / r.width; y = (h.top + h.height / 2 - r.top) / r.height;
    } else {
      x = (e.clientX - r.left) / r.width; y = (e.clientY - r.top) / r.height;
    }
    zone = hot ? hot.dataset.zone : zoneAt(x, y);
    taps.push({ x, y, zone, ms: Math.round(performance.now() - t0) });
    draw();
    count.textContent = `Toque ${taps.length}/3`;
    if (taps.length === 3) finish();
  });

  function zoneAt(x, y) {
    const hit = $$('.hot', wrap).find(h => {
      const l = parseFloat(h.style.left) / 100, t = parseFloat(h.style.top) / 100;
      const w = parseFloat(h.style.width) / 100, hh = parseFloat(h.style.height) / 100;
      return x >= l && x <= l + w && y >= t && y <= t + hh;
    });
    return hit ? hit.dataset.zone : 'otra';
  }

  function draw() {
    const colors = ['#FF5A3C', '#FFB23E', '#2FB6A3'];
    const pts = taps.map(t => [t.x * 300, t.y * 400]);
    let html = '';
    if (pts.length > 1) html += `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="#EAF0F7" stroke-width="2" stroke-dasharray="5 6"/>`;
    pts.forEach((p, i) => {
      html += `<circle cx="${p[0]}" cy="${p[1]}" r="20" fill="${colors[i]}" opacity=".35"/>`;
      html += `<circle cx="${p[0]}" cy="${p[1]}" r="13" fill="${colors[i]}" stroke="#0B1220" stroke-width="2"/>`;
      html += `<text class="ff-label" x="${p[0]}" y="${p[1] + 5}" text-anchor="middle">${i + 1}</text>`;
    });
    svg.innerHTML = html;
  }

  function finish() {
    running = false;
    startBtn.disabled = false;
    startBtn.textContent = 'Repetir';
    bar.style.width = '0';
    wrap.classList.add('is-locked');
    T.event('demo_completada', { orden: taps.map(t => t.zone) }, true);
    const first = (taps[0].ms / 1000).toFixed(1).replace('.', ',');
    out.innerHTML = `
      <ol class="steps-out">${taps.map((t, i) => `<li><b style="background:${['#FF5A3C', '#FFB23E', '#2FB6A3'][i]}">${i + 1}</b>${cap(ZONES[t.zone])}</li>`).join('')}</ol>
      <p>Tu primer toque llegó a los <strong>${first} s</strong>. Un estudio real mediría lo mismo, pero sin depender de tu memoria:</p>
      <ul class="measure">
        <li><strong>Fijaciones</strong>Los puntos donde la mirada se detiene y por cuánto tiempo.</li>
        <li><strong>Áreas de interés</strong>Zonas definidas (marca, precio, origen) para comparar cuánta atención recibe cada una.</li>
        <li><strong>Tiempo hasta la primera fijación</strong>Cuánto tarda en verse cada elemento. Si el precio llega de último, lo sabemos.</li>
      </ul>`;
  }
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- Copiar correo ----------
function setupCopy() {
  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const txt = btn.dataset.copy;
    const msg = btn.parentElement.querySelector('.copy-ok');
    let ok = false;
    try { await navigator.clipboard.writeText(txt); ok = true; } catch {
      const span = btn.parentElement.querySelector('.email');
      const range = document.createRange(); range.selectNodeContents(span);
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
      try { ok = document.execCommand('copy'); } catch { ok = false; }
    }
    if (msg) msg.textContent = ok ? 'Copiado' : 'Selecciónalo y cópialo';
    T.event('copiar_correo');
    setTimeout(() => { if (msg) msg.textContent = ''; }, 2500);
  }));
}

// ---------- Eventos clave ----------
function setupKeyEvents() {
  $$('[data-cta]').forEach(a => a.addEventListener('click', () => T.event('clic_cta', { origen: a.dataset.cta })));
  $$('[data-plan]').forEach(a => a.addEventListener('click', () => {
    T.event('clic_precios', { plan: a.dataset.plan });
    $('#plan_interes').value = a.dataset.plan;
  }));
  $('#precios').addEventListener('click', e => {
    if (!e.target.closest('[data-plan]') && e.target.closest('.plan')) T.event('clic_precios', { plan: 'tarjeta' });
  });
  const lead = $('#lead-form');
  lead.addEventListener('focusin', () => T.event('form_inicio', null, true));
  // El correo nunca viaja con los eventos: solo se registra que hubo un envío.
  lead.addEventListener('submit', () => { T.event('form_envio', { encaja: (new FormData(lead).get('encaja')) || null }, true); T.flush(true); });
}
