document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.querySelector('.close');
    const body = document.body;
    const cards = document.querySelectorAll('.carte');

    // Gestion de la modale
    function openModal() {
        modal.style.display = 'block';
        modal.classList.remove('hide');
        body.classList.add('modal-open');
    }

    function closeModal() {
        modal.classList.add('hide');
        body.classList.remove('modal-open');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // attend l'animation éventuelle
    }

    openModalBtn?.addEventListener('click', openModal);
    closeModalBtn?.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Animation d'apparition des cartes au scroll
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
