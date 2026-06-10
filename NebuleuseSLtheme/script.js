document.addEventListener("DOMContentLoaded", () => {
  const pageContent = document.getElementById("page-content");
  setTimeout(() => { pageContent.style.opacity = "1"; }, 100);
  setTimeout(() => { window.scrollTo(0, 0); }, 10);
});

const infoButton = document.getElementById('info-button');
const infoPopup = document.getElementById('info-popup');
const infoOverlay = document.getElementById('info-overlay');
const closeButton = document.querySelector('.close-button');

function openPopup() {
  infoPopup.classList.add('visible');
  if (infoOverlay) infoOverlay.classList.add('visible');
}

function closePopup() {
  infoPopup.classList.remove('visible');
  if (infoOverlay) infoOverlay.classList.remove('visible');
}

if (infoButton && infoPopup) {
  infoButton.addEventListener('click', openPopup);
  if (closeButton) closeButton.addEventListener('click', closePopup);
  if (infoOverlay) infoOverlay.addEventListener('click', closePopup);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });
}

function openImage(src) {
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modal-image');
  if (!modal || !modalImage) return;
  modal.style.display = 'flex';
  modalImage.src = src;
}

function closeImage() {
  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'none';
}

(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [], width, height;
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
      tint: Math.random() < 0.12 ? 'rgba(45,255,122,' : 'rgba(255,255,255,'
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
