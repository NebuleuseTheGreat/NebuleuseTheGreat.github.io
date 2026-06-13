(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const count = Math.round((width * height) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.3 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
      tint: Math.random() < 0.12 ? 'rgba(255,80,100,' : 'rgba(255,255,255,'
    }));
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      const flicker = Math.sin(t * s.speed + s.phase) * 0.35 + 0.65;
      ctx.beginPath();
      ctx.fillStyle = s.tint + (s.baseAlpha * flicker).toFixed(3) + ')';
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    t += 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

(function () {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const img = document.getElementById('lightbox-img');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');

  let sources = [];
  let index = 0;

  function show(i) {
    index = (i + sources.length) % sources.length;
    img.src = sources[index].src;
    img.alt = sources[index].alt;
  }

  function open(group, i) {
    sources = group;
    show(i);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.hidden = true;
    img.src = '';
    document.body.style.overflow = '';
  }

  const galleryTriggers = Array.from(document.querySelectorAll('.gallery-grid .gallery-trigger'));
  const gallerySources = galleryTriggers.map(t => ({ src: t.dataset.full, alt: t.querySelector('img').alt }));
  galleryTriggers.forEach((t, i) => t.addEventListener('click', () => open(gallerySources, i)));

  const stepImgs = Array.from(document.querySelectorAll('.step-image img')).filter(el => el.src && !el.dataset.placeholder);
  const stepSources = stepImgs.map(el => ({ src: el.src, alt: el.alt }));
  stepImgs.forEach((el, i) => el.addEventListener('click', () => open(stepSources, i)));

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(index - 1));
  btnNext.addEventListener('click', () => show(index + 1));

  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();

(function () {
  const SCRIPT_URL = 'https://raw.githubusercontent.com/NebuleuseTheGreat/LCN8888/refs/heads/main/Modding_ShipEditor_theme_system_by_Nebuleuse.txt';
  const FILENAME = 'Modding_ShipEditor_theme_system_by_Nebuleuse.txt';

  document.querySelectorAll(`a[href="${SCRIPT_URL}"]`).forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      fetch(SCRIPT_URL)
        .then(r => r.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = FILENAME;
          a.click();
          URL.revokeObjectURL(url);
        })
        .catch(() => window.open(SCRIPT_URL, '_blank'));
    });
  });
})();

(function () {
  const targets = document.querySelectorAll('.section, .hero-content');
  if (!('IntersectionObserver' in window) || !targets.length) return;

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .7s ease, transform .7s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();
