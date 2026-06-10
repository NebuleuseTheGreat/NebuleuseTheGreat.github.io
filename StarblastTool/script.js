document.addEventListener('DOMContentLoaded', () => {
    const pageContent = document.getElementById('page-content');
    setTimeout(() => { pageContent.style.opacity = '1'; }, 100);

    const cards = document.querySelectorAll('.carte');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
});

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
            tint: Math.random() < 0.12 ? 'rgba(255,45,138,' : 'rgba(255,255,255,'
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
