document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.carte');

    window.addEventListener('scroll', startAnimation);

    function startAnimation() {
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (cardTop < windowHeight) {
                card.classList.add('animate__animated', 'animate__fadeIn', 'animate__delay-0.5s');
            }
        });
    }
    startAnimation();
});