/* ─────────────────────────────────────────────
   TRIM TIME SALON — Coming Soon
   script.js
───────────────────────────────────────────── */

'use strict';

/* ═══════════════════════════════════════
   1. PARTICLE CANVAS
═══════════════════════════════════════ */
(function initParticles() {
  const canvas  = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');

  let W, H, particles = [], raf;

  const GOLD = 'rgba(201, 168, 76,';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      r:   Math.random() * 1.6 + 0.3,
      vx:  (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.4 + 0.1),
      a:   Math.random(),
      da:  (Math.random() * 0.003 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 100 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${GOLD} ${Math.max(0, Math.min(1, p.a))})`;
      ctx.fill();

      p.x  += p.vx;
      p.y  += p.vy;
      p.a  += p.da;

      if (p.a <= 0 || p.a >= 1) p.da *= -1;
      if (p.y < -10)  p.y = H + 10;
      if (p.x < -10)  p.x = W + 10;
      if (p.x > W+10) p.x = -10;
    });
    raf = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { resize(); });
})();


/* ═══════════════════════════════════════
   2. COUNTDOWN TIMER
═══════════════════════════════════════ */
(function initCountdown() {
  // Target: 30 days from now
  const TARGET = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const elDays  = document.getElementById('days');
  const elHours = document.getElementById('hours');
  const elMins  = document.getElementById('minutes');
  const elSecs  = document.getElementById('seconds');

  function pad(n) { return String(n).padStart(2, '0'); }

  function flipAnim(el) {
    el.classList.add('flip');
    setTimeout(() => el.classList.remove('flip'), 200);
  }

  let prevValues = {};

  function tick() {
    const now  = Date.now();
    const diff = Math.max(0, TARGET - now);

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);

    if (elDays  && prevValues.d !== d)  { elDays.textContent  = pad(d); flipAnim(elDays);  prevValues.d = d; }
    if (elHours && prevValues.h !== h)  { elHours.textContent = pad(h); flipAnim(elHours); prevValues.h = h; }
    if (elMins  && prevValues.m !== m)  { elMins.textContent  = pad(m); flipAnim(elMins);  prevValues.m = m; }
    if (elSecs  && prevValues.s !== s)  { elSecs.textContent  = pad(s); flipAnim(elSecs);  prevValues.s = s; }

    if (diff > 0) setTimeout(tick, 1000);
  }

  tick();
})();


/* ═══════════════════════════════════════
   3. SCROLL-BASED REVEAL (AOS substitute)
═══════════════════════════════════════ */
(function initAOS() {
  const items = document.querySelectorAll('[data-aos]');
  if (!items.length) return;

  // Apply delay from data-aos-delay attribute
  items.forEach(el => {
    const delay = el.getAttribute('data-aos-delay') || 0;
    el.style.transitionDelay = `${delay}ms`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('aos-animate');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
})();


/* ═══════════════════════════════════════
   4. SCROLL HINT HIDE
═══════════════════════════════════════ */
(function initScrollHint() {
  const hint = document.getElementById('scroll-hint');
  if (!hint) return;

  function onScroll() {
    if (window.scrollY > 80) {
      hint.style.opacity = '0';
      hint.style.pointerEvents = 'none';
    } else {
      hint.style.opacity = '1';
    }
  }

  hint.style.transition = 'opacity 0.4s ease';
  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ═══════════════════════════════════════
   5. OPEN/CLOSED STATUS (time-aware)
═══════════════════════════════════════ */
(function initOpenStatus() {
  // Salon hours: Mon–Sat 9am–8pm, Sun 10am–6pm
  const HOURS = {
    0: [10, 18],  // Sun
    1: [ 9, 20],  // Mon
    2: [ 9, 20],  // Tue
    3: [ 9, 20],  // Wed
    4: [ 9, 20],  // Thu
    5: [ 9, 20],  // Fri
    6: [ 9, 20],  // Sat
  };

  const now  = new Date();
  const day  = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const [open, close] = HOURS[day];

  const isOpen = hour >= open && hour < close;

  const banner   = document.getElementById('open-banner');
  const bannerTx = document.getElementById('open-banner-text');
  const badge    = document.querySelector('.tagline-badge');
  const dot      = document.querySelector('.open-dot');

  if (!isOpen) {
    if (bannerTx) bannerTx.innerHTML = `Our salon opens at <strong>${open}:00 AM</strong>. See you soon! ✨`;
    if (banner)   banner.style.background = 'linear-gradient(90deg, #1a1a1a, #2a2a2a, #1a1a1a)';
    if (banner)   banner.querySelectorAll('p, strong').forEach(el => el.style.color = '#8A8070');
    if (dot)      { dot.style.background = '#ef4444'; dot.style.boxShadow = '0 0 8px #ef4444'; }
    if (badge)    badge.querySelector('.open-dot') && (badge.querySelector('.open-dot').style.background = '#ef4444');
    if (badge)    { badge.innerHTML = badge.innerHTML.replace('Open Today', 'Currently Closed'); }
  }
})();


/* ═══════════════════════════════════════
   6. CURSOR GLOW EFFECT (desktop only)
═══════════════════════════════════════ */
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
    left: -9999px; top: -9999px;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();


/* ═══════════════════════════════════════
   7. SERVICE CARD TILT (subtle 3D)
═══════════════════════════════════════ */
(function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
