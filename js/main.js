import * as T from './tracker.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const params = new URLSearchParams(location.search);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* sin almacenamiento */ } },
};

// ---------- Vista de una sección para el panel (sin rastreo ni aviso) ----------
const vista = params.get('vista');
if (vista) {
  const sec = document.querySelector(`[data-aoi="${CSS.escape(vista)}"]`);
  if (sec) sec.classList.add('vista-on');
  if (vista === 'aoi-opinion') document.body.classList.add('is-experto');
  $$('.reveal').forEach(el => el.classList.add('is-in'));
  setupBrain(true);
  setupForm();
} else {
  setupExpert();
  setupConsent();
  setupLogo();
  setupReveal();
  setupHero();
  setupDemo();
  setupCompare();
  setupBrain(false);
  setupPlans();
  setupCases();
  setupLens();
  setupForm();
  setupCopy();
  setupKeyEvents();
}

// ---------- Consentimiento ----------
function setupConsent() {
  const box = $('#consent');
  const choice = store.get('prcpta_consent');
  if (choice === 'si') { begin(); return; }
  if (choice === 'no') return;
  box.hidden = false;
  $$('[data-consent]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.consent;
    store.set('prcpta_consent', v);
    box.hidden = true;
    if (v === 'si') begin();
  }));
}

function begin() {
  T.start();
  const pill = $('#status-pill');
  pill.classList.add('is-on');
  $('#op-sid').value = T.sessionId();
  $('#op-sid-note').textContent = `Código anónimo de esta visita: ${T.sessionId().slice(0, 8)}`;
  $('#track-stop').addEventListener('click', () => {
    T.stop();
    store.set('prcpta_consent', 'no');
    import('./lab.js').then(m => m.stopLab()).catch(() => {});
    pill.classList.remove('is-on');
    $('#op-sid').value = '';
    $('#op-sid-note').textContent = 'La medición está detenida: tu opinión llegará sin recorrido.';
  });
  $('#lab-open').addEventListener('click', () => import('./lab.js').then(m => m.openLab()));
}

// ---------- Modo experto ----------
function setupExpert() {
  if (params.get('experto') === '1') store.set('prcpta_experto', '1');
  if (store.get('prcpta_experto') !== '1') return;
  document.body.classList.add('is-experto');
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
      form.innerHTML = `<div><h3 style="font-size:28px">Gracias por tu opinión</h3><p class="muted" style="margin-top:8px">Quedó guardada${sid ? ' junto con tu recorrido de atención (anónimo).' : '.'}</p></div>`;
    } else {
      status.textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.';
    }
  });
}

// ---------- Logotipo: vocales ----------
function setupLogo() {
  const logo = $('#logo');
  logo.addEventListener('click', () => {
    logo.setAttribute('aria-pressed', String(logo.getAttribute('aria-pressed') !== 'true'));
    T.event('logo_vocales', null, true);
  });
}

// ---------- Revelado al hacer scroll ----------
function setupReveal() {
  const els = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  els.forEach(e => io.observe(e));
}

// ---------- 1 · Hero: ojo 3D y rastro de calor (solo visual, en tu pantalla) ----------
function setupHero() {
  const hero = $('#inicio'), eyeStage = $('#eye-stage'), eyeball = $('#eyeball'), iris = $('#iris'), pupil = $('#pupil');
  const canvas = $('#heat'), ctx = canvas.getContext('2d');
  let trail = [], samples = 0, heroVisible = true, raf = null;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const size = () => { const r = hero.getBoundingClientRect(); canvas.width = r.width * dpr; canvas.height = r.height * dpr; };
  size(); addEventListener('resize', size);

  function lookAt(dx, dy) {
    dx = Math.max(-1, Math.min(1, dx)); dy = Math.max(-1, Math.min(1, dy));
    const dist = Math.hypot(dx, dy);
    eyeball.style.transform = `rotateY(${(dx * 22).toFixed(1)}deg) rotateX(${(-dy * 18).toFixed(1)}deg)`;
    const w = iris.offsetWidth;
    iris.style.transform = `translate(${(dx * w * 0.41).toFixed(1)}px,${(dy * w * 0.36).toFixed(1)}px) scale(${(1 - dist * 0.08).toFixed(3)})`;
    pupil.style.width = pupil.style.height = (dist < 0.25 ? 20 : 30) + '%';
  }
  function zoneFor(el) {
    if (!el || !el.closest) return '—';
    if (el.closest('.btn')) return 'Botón de acción';
    if (el.closest('h1')) return 'Titular';
    if (el.closest('.eye-stage')) return 'Ojo';
    if (el.closest('.topbar')) return 'Navegación';
    if (el.closest('.lead, .whisper')) return 'Texto';
    return 'Fondo';
  }
  const hx = $('#hud-x'), hy = $('#hud-y'), hn = $('#hud-n'), hz = $('#hud-z');
  const HEAT = [[76, 125, 255], [46, 230, 166], [255, 225, 77], [255, 61, 61]];
  function draw() {
    raf = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const n = trail.length;
    trail.forEach((p, i) => {
      const t = n > 1 ? i / (n - 1) : 1;
      const c = HEAT[Math.min(3, Math.floor(t * 4))];
      const rad = (40 + t * 70) * dpr;
      const x = p.x * canvas.width, y = p.y * canvas.height;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, `rgba(${c},${0.55 * p.life})`); g.addColorStop(1, `rgba(${c},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
      p.life -= 0.006;
    });
    trail = trail.filter(p => p.life > 0);
    if (trail.length && heroVisible) raf = requestAnimationFrame(draw);
  }
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    const er = eyeStage.getBoundingClientRect();
    lookAt((e.clientX - (er.left + er.width / 2)) / (innerWidth / 2.2), (e.clientY - (er.top + er.height / 2)) / (innerHeight / 2.2));
    samples++;
    hx.textContent = x.toFixed(2); hy.textContent = y.toFixed(2); hn.textContent = samples; hz.textContent = zoneFor(e.target);
    if (!reduce) {
      const last = trail[trail.length - 1];
      if (!last || Math.abs(last.x - x) + Math.abs(last.y - y) > 0.02) { trail.push({ x, y, life: 1 }); if (trail.length > 40) trail.shift(); }
      if (!raf) raf = requestAnimationFrame(draw);
    }
  });
  hero.addEventListener('pointerleave', () => lookAt(0, 0));
  new IntersectionObserver(es => {
    heroVisible = es[0].isIntersecting;
    if (heroVisible && trail.length && !raf) raf = requestAnimationFrame(draw);
  }).observe(hero);
  addEventListener('deviceorientation', e => {
    if (e.gamma == null || innerWidth > 960) return;
    lookAt(e.gamma / 30, (e.beta - 45) / 30);
  });
}

// ---------- 2 · Demo: empaque 3D ----------
function setupDemo() {
  const stage = $('#stage'), bag = $('#bag'), gloss = $('#bag-gloss'), heatBox = $('#bag-heat'), marksBox = $('#bag-marks');
  const LABELS = { marca: 'Marca', ilustracion: 'Ilustración de montañas', origen: 'Texto de origen', tueste: 'Sello de tueste', precio: 'Precio' };
  const DOT = ['#FF3D8B', '#4C7DFF', '#22D3EE'], HEATC = ['#FF3D3D', '#FFE14D', '#2EE6A6'], SIZE = [62, 48, 38];
  let taps = [];
  let t0 = 0;
  const tilt = (rx, ry) => { bag.style.transform = `rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`; gloss.style.setProperty('--gloss', (100 + ry * 3).toFixed(0) + 'deg'); };
  stage.addEventListener('pointermove', e => {
    if (reduce || e.pointerType === 'touch') return;
    const r = stage.getBoundingClientRect();
    tilt(-((e.clientY - r.top) / r.height - 0.5) * 22, ((e.clientX - r.left) / r.width - 0.5) * 36);
  });
  stage.addEventListener('pointerleave', () => tilt(0, 0));
  // Tiempo hasta el primer toque: desde que el empaque entra en pantalla
  new IntersectionObserver(es => { if (es[0].isIntersecting && !t0) { t0 = performance.now(); T.event('demo_inicio', null, true); } }, { threshold: 0.5 }).observe(stage);

  function render() {
    $('#tap-count').textContent = taps.length;
    $$('.slot', $('#slots')).forEach((s, i) => {
      const t = taps[i];
      s.querySelector('span').textContent = t ? LABELS[t.zone] : '—';
      s.style.borderColor = t ? DOT[i] : '';
      s.querySelector('small').style.color = t ? DOT[i] : '';
    });
    marksBox.innerHTML = ''; heatBox.innerHTML = '';
    taps.forEach((t, i) => {
      const b = bag.querySelector(`[data-zone="${t.zone}"]`);
      const cx = parseFloat(b.style.left) + parseFloat(b.style.width) / 2, cy = parseFloat(b.style.top) + parseFloat(b.style.height) / 2;
      const m = document.createElement('span'); m.className = 'mark'; m.textContent = i + 1;
      m.style.left = cx + '%'; m.style.top = cy + '%'; m.style.background = DOT[i]; marksBox.appendChild(m);
      if (taps.length >= 3) {
        const h = document.createElement('i');
        h.style.left = cx + '%'; h.style.top = cy + '%'; h.style.width = h.style.height = SIZE[i] + '%';
        h.style.background = `radial-gradient(circle,${HEATC[i]} 0%,${HEATC[i]} 35%,transparent 70%)`;
        heatBox.appendChild(h);
      }
    });
    const done = taps.length >= 3;
    $('#demo-result').hidden = !done;
    if (done) {
      $('#demo-first').textContent = LABELS[taps[0].zone].toLowerCase();
      $('#demo-time').textContent = (taps[0].ms / 1000).toFixed(1).replace('.', ',');
      T.event('demo_completada', { orden: taps.map(t => t.zone) }, true);
    }
  }
  $$('.hot', bag).forEach(b => b.addEventListener('click', () => {
    const zone = b.dataset.zone;
    if (taps.length >= 3 || taps.some(t => t.zone === zone)) return;
    if (!t0) t0 = performance.now();
    taps.push({ zone, ms: Math.round(performance.now() - t0) });
    render();
  }));
  $('#demo-reset').addEventListener('click', () => { taps = []; t0 = performance.now(); render(); });
}

// ---------- 3 · Comparador ----------
function setupCompare() {
  const compare = $('#compare'), range = $('#compare-range');
  range.addEventListener('input', () => { compare.style.setProperty('--pos', range.value + '%'); T.event('comparador_usado', null, true); });
}

// ---------- 4 · Cerebro de malla ----------
function setupBrain(staticAll) {
  const brain = $('#brain'), NS = 'http://www.w3.org/2000/svg';
  const CLUSTERS = [
    { c: '#22D3EE', pts: [[300, 110], [322, 135], [290, 150], [312, 170], [275, 125], [330, 105]] },
    { c: '#22D3EE', pts: [[85, 160], [100, 185], [75, 195], [110, 150], [95, 215], [120, 200]] },
    { c: '#4C7DFF', pts: [[180, 80], [215, 70], [240, 95], [200, 110], [160, 100], [230, 120]] },
    { c: '#FF3D8B', pts: [[200, 190], [230, 205], [180, 215], [245, 180], [210, 230], [170, 190]] },
    { c: '#2EE6A6', pts: [[140, 140], [170, 155], [150, 170], [260, 155], [280, 200], [130, 230]] },
  ];
  CLUSTERS.forEach((cl, k) => {
    const g = document.createElementNS(NS, 'g'); g.setAttribute('data-c', k); g.style.setProperty('--lit', cl.c);
    cl.pts.forEach((a, i) => cl.pts.forEach((b, j) => {
      if (j <= i || Math.hypot(a[0] - b[0], a[1] - b[1]) > 55) return;
      const l = document.createElementNS(NS, 'line'); l.setAttribute('class', 'edge');
      l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1]); g.appendChild(l);
    }));
    cl.pts.forEach(a => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('class', 'node'); c.setAttribute('cx', a[0]); c.setAttribute('cy', a[1]); c.setAttribute('r', 4); g.appendChild(c); });
    brain.appendChild(g);
  });
  const steps = $$('.step'), label = $('#brain-step');
  function activate(k) {
    steps.forEach((s, i) => s.classList.toggle('is-active', i === k));
    $$('g[data-c]', brain).forEach(g => g.classList.toggle('is-lit', +g.dataset.c <= k));
    label.textContent = steps[k].querySelector('.n').textContent + ' · ' + steps[k].querySelector('h3').firstChild.textContent.trim();
  }
  if (staticAll) { steps.forEach(s => s.classList.add('is-active')); return; }
  activate(0);
  const so = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      const k = +e.target.dataset.step;
      activate(k);
      if (k === 3) T.event('paso_activacion_visto', null, true);
    }
  }), { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(s => so.observe(s));
}

// ---------- 5 · Precios: inclinación 3D ----------
function setupPlans() {
  if (reduce) return;
  $$('.plan').forEach(p => {
    p.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      const r = p.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      p.style.transform = `rotateY(${(x * 8).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg) translateZ(0)`;
    });
    p.addEventListener('pointerleave', () => { p.style.transform = ''; });
  });
}

// ---------- 6 · Casos: mirada simulada ----------
function setupCases() {
  $$('.case').forEach((c, i) => {
    const b = c.querySelector('.case__toggle');
    b.addEventListener('click', () => {
      const on = c.classList.toggle('is-gaze');
      b.setAttribute('aria-pressed', String(on));
      b.textContent = on ? 'Ocultar mirada' : 'Ver mirada simulada';
      if (on) T.event('caso_mirada', { caso: i === 0 ? 'cafe' : 'vitrina' });
    });
  });
}

// ---------- 7 · Ética: lente ----------
function setupLens() {
  $$('[data-lens]').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.lens;
    $$('[data-lens]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    $$('[data-view]').forEach(x => { x.hidden = x.dataset.view !== v; });
    T.event('etica_lente', { vista: v });
  }));
}

// ---------- 9 · Formulario por pasos ----------
function setupForm() {
  const form = $('#lead-form'), fsteps = $$('.form-step', form);
  const prev = $('#step-prev'), next = $('#step-next'), submit = $('#step-submit');
  let cur = 0;
  function show(i) {
    cur = i;
    fsteps.forEach((s, k) => s.classList.toggle('is-current', k === i));
    prev.hidden = i === 0; next.hidden = i === fsteps.length - 1; submit.hidden = i !== fsteps.length - 1;
    $('#progress-bar').style.width = ((i + 1) / fsteps.length * 100) + '%';
    $('#progress-txt').textContent = `Paso ${i + 1} de ${fsteps.length}`;
  }
  const valid = i => {
    for (const f of $$('input, select, textarea', fsteps[i])) { if (!f.checkValidity()) { f.reportValidity(); return false; } }
    return true;
  };
  show(0);
  next.addEventListener('click', () => {
    if (!valid(cur)) return;
    show(cur + 1);
    T.event('form_paso', { paso: cur + 1 });
    const f = fsteps[cur].querySelector('input, select, textarea'); if (f) f.focus();
  });
  prev.addEventListener('click', () => show(cur - 1));
  form.addEventListener('focusin', () => T.event('form_inicio', null, true));
  form.addEventListener('submit', e => {
    for (let i = 0; i < fsteps.length; i++) {
      const bad = $$('input, select, textarea', fsteps[i]).find(f => !f.checkValidity());
      if (bad) { e.preventDefault(); show(i); bad.reportValidity(); return; }
    }
    // El correo nunca viaja con los eventos: solo se registra que hubo un envío.
    T.event('form_envio', { encaja: new FormData(form).get('encaja') || null }, true);
    T.flush(true);
  });
}

// ---------- Copiar correo ----------
function setupCopy() {
  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const msg = btn.parentElement.querySelector('.copy-ok');
    let ok = false;
    try { await navigator.clipboard.writeText(btn.dataset.copy); ok = true; } catch {
      const span = btn.parentElement.querySelector('.email');
      const range = document.createRange(); range.selectNodeContents(span);
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
      try { ok = document.execCommand('copy'); } catch { ok = false; }
    }
    msg.textContent = ok ? 'Copiado' : 'Selecciónalo y cópialo';
    T.event('copiar_correo');
    setTimeout(() => { msg.textContent = ''; }, 2500);
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
  $$('.nav a').forEach(a => a.addEventListener('click', () => T.event('clic_nav', { destino: a.getAttribute('href').slice(1) })));
}
