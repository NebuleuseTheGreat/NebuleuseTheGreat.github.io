const backgroundImages = [
    './home-wallpapers/2.jpg',
    './home-wallpapers/3.jpg',
    './home-wallpapers/4.jpg',
    './home-wallpapers/5.jpg',
    './home-wallpapers/7.jpg',
    './home-wallpapers/8.jpg',
    './home-wallpapers/10.jpg',
    './home-wallpapers/11.jpg',
];

let currentImageIndex = 0;
const body = document.body;

function changeBackgroundImage() {
    body.style.transition = 'background-image 1s ease-in-out';
    currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    const imageUrl = `url('${backgroundImages[currentImageIndex]}')`;
    body.style.backgroundImage = imageUrl;
}

// Change l'image de fond initiale
changeBackgroundImage();

// Démarre le changement d'image toutes les 5 secondes
setInterval(changeBackgroundImage, 4000);

document.addEventListener('DOMContentLoaded', function () {
    // Afficher les boutons après l'animation d'apparition du titre et du texte
    const buttonContainer = document.querySelector('.button-container');
    buttonContainer.style.display = 'flex';
});
