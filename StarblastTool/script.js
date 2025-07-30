document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const cards = document.querySelectorAll('.carte');

    function startAnimation() {
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (cardTop < windowHeight - 50) {
                card.classList.add('animate__animated', 'animate__fadeInUp', 'animated');
            }
        });
    }

    window.addEventListener('scroll', startAnimation);
    startAnimation();
});
