(() => {
  'use strict';

  /* ---------------- LOADER ---------------- */
  const loader = document.getElementById('loader');
  const ldFill = document.querySelector('.ld-fill');
  if (loader) {
    let progress = 0;
    const tick = setInterval(() => {
      progress += Math.random() * 18;
      if (progress >= 100) progress = 100;
      if (ldFill) ldFill.style.width = progress + '%';
      if (progress >= 100) clearInterval(tick);
    }, 140);

    window.addEventListener('load', () => {
      setTimeout(() => {
        if (ldFill) ldFill.style.width = '100%';
        loader.classList.add('done');
      }, 400);
    });
  }

  /* ---------------- NAV SCROLL STATE ---------------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- MOBILE MENU ---------------- */
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mob');
  if (ham && mob) {
    const closeMenu = () => {
      ham.classList.remove('open');
      mob.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
    };
    ham.addEventListener('click', () => {
      const open = mob.classList.toggle('open');
      ham.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', String(open));
    });
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ---------------- SMOOTH ANCHOR SCROLL ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------------- REVEAL ON SCROLL ---------------- */
  const revEls = document.querySelectorAll('.rev');
  if ('IntersectionObserver' in window && revEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revEls.forEach(el => io.observe(el));
  } else {
    revEls.forEach(el => el.classList.add('in'));
  }

  /* ---------------- COUNTERS ---------------- */
  function animateCount(el, target, prefix, suffix, duration = 1400) {
    const start = performance.now();
    const from = 0;
    function step(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(from + (target - from) * eased);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const countEls = document.querySelectorAll('[data-count]');
  const heroCountEls = document.querySelectorAll('[data-hero-count]');

  function bindCounter(el, attr) {
    const target = parseInt(el.getAttribute(attr), 10) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(el, target, prefix, suffix);
            io.unobserve(el);
          }
        });
      }, { threshold: 0.4 });
      io.observe(el);
    } else {
      el.textContent = prefix + target + suffix;
    }
  }
  countEls.forEach(el => bindCounter(el, 'data-count'));
  heroCountEls.forEach(el => bindCounter(el, 'data-hero-count'));

  /* ---------------- TYPEWRITER ---------------- */
  const twText = document.getElementById('twText');
  if (twText) {
    const words = [
      'Pintura Vinil Acrílica',
      'Esmalte Alquidálico',
      'Sellador Acrílico',
      'Sellador Vinílico',
      'Esmalte Base Agua'
    ];
    let wi = 0, ci = 0, deleting = false;
    function typeLoop() {
      const word = words[wi];
      if (!deleting) {
        ci++;
        twText.textContent = word.slice(0, ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        ci--;
        twText.textContent = word.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      setTimeout(typeLoop, deleting ? 35 : 65);
    }
    typeLoop();
  }

  /* ---------------- PARTICLE CANVAS ---------------- */
  function initParticles(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const COUNT = 46;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function makeParticles() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a: Math.random() * 0.5 + 0.15
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,197,103,${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(frame);
    }

    resize();
    makeParticles();
    frame();
    window.addEventListener('resize', () => { resize(); makeParticles(); });
  }

  ['pcanvas', 'pcanvasWhy', 'pcanvasGaleria'].forEach(id => {
    initParticles(document.getElementById(id));
  });

  /* ---------------- CONTACT FORM -> WHATSAPP ---------------- */
  const cForm = document.getElementById('cForm');
  const WHATSAPP_NUMBER = '524772547726';
  if (cForm) {
    cForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = cForm.nombre.value.trim();
      const telefono = cForm.telefono.value.trim();
      const tipo = cForm.tipo.value;
      const mensaje = cForm.mensaje.value.trim();

      if (!nombre || !telefono || !tipo) {
        cForm.reportValidity();
        return;
      }

      let text = `Hola, soy ${nombre}. Me interesa cotizar: ${tipo}.`;
      text += ` Mi teléfono es ${telefono}.`;
      if (mensaje) text += ` Detalles: ${mensaje}`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
})();
