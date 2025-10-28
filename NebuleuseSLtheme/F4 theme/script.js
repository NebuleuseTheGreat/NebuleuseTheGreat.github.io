document.addEventListener("DOMContentLoaded", () => {
    const pageContent = document.getElementById("page-content");
    setTimeout(() => {
        pageContent.style.opacity = "1";
    }, 100);

    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);
});

let infoButton = document.getElementById('info-button');
let infoPopup = document.getElementById('info-popup');
let closeButton = document.querySelector('.close-button');

infoButton.addEventListener('click', () => {
    infoPopup.style.display = 'block';
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; 
});

closeButton.addEventListener('click', () => {
    infoPopup.style.display = 'none';
    document.body.style.backgroundColor = ''; 
});

window.addEventListener('click', (e) => {
    if (e.target === infoPopup) {
        infoPopup.style.display = 'none';
        document.body.style.backgroundColor = ''; 
    }
});

function openImage(src) {
    var modal = document.getElementById('modal');
    var modalImage = document.getElementById('modal-image');
    modal.style.display = 'flex';  
    modalImage.src = src; 
}

function closeImage() {
    var modal = document.getElementById('modal');
    modal.style.display = 'none';  
}
