/* ============================================================
   BL4DE portfolio — main script
   ============================================================ */
const root = document.documentElement;
const body = document.body;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────────
   LOADER — full cinematic init sequence
───────────────────────────────────────────── */
;(function () {
  const loader = document.getElementById('siteLoader');
  if (!loader) return;

  if (reduceMotion) {
    setTimeout(() => loader.remove(), 120);
    return;
  }

  /* ── particle canvas ── */
  const canvas = document.getElementById('lCanvas');
  const ctx    = canvas.getContext('2d');
  let cw = 0, ch = 0, running = true;
  let particles = [];

  function resizeLC() {
    cw = canvas.width  = window.innerWidth;
    ch = canvas.height = window.innerHeight;
  }

  function mkP() {
    return {
      x: Math.random() * cw,
      y: ch + 6,
      vx: (Math.random() - 0.5) * 0.65,
      vy: -(0.9 + Math.random() * 2.1),
      r: 0.6 + Math.random() * 1.9,
      life: 1,
      dec: 0.0038 + Math.random() * 0.005,
      red: Math.random() > 0.38
    };
  }

  (function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, cw, ch);
    if (Math.random() < 0.42) particles.push(mkP());
    particles = particles.filter(p => p.life > 0.02);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life -= p.dec;
      const a  = p.life;
      const c  = p.red ? `rgba(229,9,20,${a})` : `rgba(255,255,255,${a * 0.65})`;
      const cg = p.red ? `rgba(229,9,20,${a * 0.22})` : `rgba(255,255,255,${a * 0.08})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = c; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = cg; ctx.fill();
    });
    requestAnimationFrame(loop);
  })();

  resizeLC();
  window.addEventListener('resize', resizeLC);

  /* ── letter scramble ── */
  const CHARS  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$!%&*?';
  const TARGET = 'BL4DE';
  const ltEls  = document.querySelectorAll('.ltc');

  ltEls.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '1';
      let n = 0, MAX = 15;
      const iv = setInterval(() => {
        if (n >= MAX) {
          clearInterval(iv);
          el.textContent = TARGET[i];
          // lock-in pop
          el.style.transition = 'transform .14s cubic-bezier(.34,1.56,.64,1)';
          el.style.transform  = 'scale(1.18) skewX(-4deg)';
          setTimeout(() => { el.style.transform = 'scale(1) skewX(0)'; }, 90);
        } else {
          el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        n++;
      }, 36);
    }, 840 + i * 72);
  });

  /* ── typing subtitle ── */
  const subEl  = document.getElementById('lSubTxt');
  const subStr = 'DEVELOPER · AI BUILDER · MOTION EDITOR';
  setTimeout(() => {
    let i = 0;
    const iv = setInterval(() => {
      subEl.textContent = subStr.slice(0, i);
      if (i++ > subStr.length) clearInterval(iv);
    }, 25);
  }, 1130);

  /* ── animated progress ── */
  const fillEl = document.getElementById('lFill');
  const tipEl  = document.getElementById('lTip');
  const pctEl  = document.getElementById('lPct');

  setTimeout(() => {
    const DUR = 1750, st = performance.now();
    (function tick(now) {
      const t = Math.min((now - st) / DUR, 1);
      const e = t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
      fillEl.style.transform = `scaleX(${e})`;
      tipEl.style.left       = `calc(${e * 100}% - 12px)`;
      tipEl.style.opacity    = e > 0.01 ? '1' : '0';
      pctEl.textContent      = Math.round(e * 100) + '%';
      if (t < 1) requestAnimationFrame(tick);
    })(performance.now());
  }, 1050);

  /* ── build exit strips ── */
  const stripsEl = document.getElementById('lStrips');
  const NUM = 16;
  for (let i = 0; i < NUM; i++) {
    const s = document.createElement('div');
    s.className = `l-strip ${i % 2 === 0 ? '' : 'ld'}`;
    s.style.left  = `${(i / NUM) * 100}%`;
    s.style.width = `${100 / NUM + 0.25}%`;
    s.style.setProperty('--sd', `${i * 20}ms`);
    stripsEl.appendChild(s);
  }

  /* ── exit at 3.3 s ── */
  setTimeout(() => {
    running = false;
    // fade center/decor first
    ['.l-center','.l-grid','.hud-corner','.l-side','.l-scan','.l-slash']
      .forEach(sel => document.querySelectorAll(sel)
        .forEach(el => { el.style.transition='opacity .18s ease'; el.style.opacity='0'; }));
    // then wipe strips
    setTimeout(() => {
      loader.classList.add('exiting');
      setTimeout(() => loader.remove(), 700);
    }, 200);
  }, 3300);
})();


/* ─────────────────────────────────────────────
   MOBILE NAV
───────────────────────────────────────────── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelectorAll('.site-nav a');

navToggle?.addEventListener('click', () => {
  const open = body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.forEach(l => l.addEventListener('click', () => {
  body.classList.remove('nav-open');
  navToggle?.setAttribute('aria-expanded', 'false');
}));


/* ─────────────────────────────────────────────
   ROLE SWITCHER
───────────────────────────────────────────── */
const roleEl = document.querySelector('#roleText');
const roles  = [
  'ai tools that pull weight',
  'clean websites from scratch',
  'bots that actually help',
  'edits that hit different',
  'backend that just works'
];
let ri = 0;
if (roleEl && !reduceMotion) {
  setInterval(() => {
    roleEl.classList.add('switching');
    setTimeout(() => {
      ri = (ri + 1) % roles.length;
      roleEl.textContent = roles[ri];
      roleEl.classList.remove('switching');
    }, 220);
  }, 2400);
}


/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
const reveals = [...document.querySelectorAll('.reveal')];
reveals.forEach((el, i) => el.style.setProperty('--delay', `${Math.min(i % 7, 6) * 70}ms`));

if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in-view'));
}


/* ─────────────────────────────────────────────
   MAGNETIC BUTTONS
───────────────────────────────────────────── */
document.querySelectorAll('[data-magnet]').forEach(el => {
  el.addEventListener('pointermove', ev => {
    if (reduceMotion) return;
    const r = el.getBoundingClientRect();
    const x = ev.clientX - r.left - r.width / 2;
    const y = ev.clientY - r.top  - r.height / 2;
    el.style.transform = `translate3d(${x * 0.12}px,${y * 0.16}px,0)`;
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
});


/* ─────────────────────────────────────────────
   3D TILT CARDS
───────────────────────────────────────────── */
document.querySelectorAll('[data-tilt]').forEach(el => {
  el.addEventListener('pointermove', ev => {
    if (reduceMotion) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--ry', `${((ev.clientX - r.left) / r.width  - .5) * 7}deg`);
    el.style.setProperty('--rx', `${((ev.clientY - r.top)  / r.height - .5) * -7}deg`);
  });
  el.addEventListener('pointerleave', () => {
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  });
});


/* ─────────────────────────────────────────────
   POINTER SHEEN + LIQUID CANVAS
───────────────────────────────────────────── */
window.addEventListener('pointermove', ev => {
  root.style.setProperty('--mx', `${ev.clientX}px`);
  root.style.setProperty('--my', `${ev.clientY}px`);
}, { passive: true });

const bgCanvas = document.querySelector('#liquidCanvas');
const bgCtx    = bgCanvas?.getContext('2d');
let bw=0, bh=0, bFrame=0;
let ptr = { x:.5, y:.35 };

function resizeBg() {
  if (!bgCanvas) return;
  const dpr = Math.min(devicePixelRatio||1, 1.6);
  bw = window.innerWidth; bh = window.innerHeight;
  bgCanvas.width  = Math.floor(bw * dpr);
  bgCanvas.height = Math.floor(bh * dpr);
  bgCanvas.style.width  = bw + 'px';
  bgCanvas.style.height = bh + 'px';
  bgCtx?.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawRibbon(y, amp, phase, cA, cB, w) {
  if (!bgCtx) return;
  const g = bgCtx.createLinearGradient(0, y - amp, bw, y + amp);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(.24, cA); g.addColorStop(.54, cB);
  g.addColorStop(1, 'rgba(255,255,255,0)');
  bgCtx.beginPath();
  for (let x = -80; x <= bw + 80; x += 34) {
    const yy = y + Math.sin(x*.008 + phase)*amp + Math.sin((x/Math.max(bw,1))*Math.PI)*(ptr.y-.5)*42;
    x === -80 ? bgCtx.moveTo(x, yy) : bgCtx.lineTo(x, yy);
  }
  bgCtx.lineWidth=w; bgCtx.lineCap='round'; bgCtx.strokeStyle=g;
  bgCtx.shadowColor='rgba(229,9,20,.12)'; bgCtx.shadowBlur=24;
  bgCtx.stroke(); bgCtx.shadowBlur=0;
}

(function bgLoop() {
  if (!bgCanvas || !bgCtx || reduceMotion) return;
  bFrame += .012;
  bgCtx.clearRect(0, 0, bw, bh);
  drawRibbon(bh*.18, 26, bFrame+ptr.x*1.6, 'rgba(229,9,20,.16)', 'rgba(255,255,255,.68)', 38);
  drawRibbon(bh*.46, 34, bFrame*.82+2.2,   'rgba(9,9,11,.08)',   'rgba(229,9,20,.12)',    46);
  drawRibbon(bh*.74, 30, bFrame*1.1+4.1,   'rgba(255,255,255,.72)','rgba(229,9,20,.12)',  42);
  requestAnimationFrame(bgLoop);
})();

window.addEventListener('pointermove', ev => {
  ptr = { x: ev.clientX/Math.max(innerWidth,1), y: ev.clientY/Math.max(innerHeight,1) };
}, { passive: true });

window.addEventListener('resize', resizeBg);
resizeBg();
if (!reduceMotion) {} // bgLoop self-starts above
