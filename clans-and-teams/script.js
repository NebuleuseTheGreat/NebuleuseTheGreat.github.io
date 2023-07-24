// Récupérer les éléments bouton et carte par leur ID
var accueilBtn = document.getElementById("accueil");
var bouton1 = document.getElementById("bouton1");
var bouton2 = document.getElementById("bouton2");
var bouton3 = document.getElementById("bouton3");
var bouton4 = document.getElementById("bouton4");
var cartes = document.querySelectorAll(".card");

// Ajouter l'écouteur d'événement au bouton "Accueil"
accueilBtn.addEventListener("click", function() {
    masquerCartes();
});

// Ajouter les écouteurs d'événement aux autres boutons
bouton1.addEventListener("click", function() {
    afficherCarte(carte1);
});

bouton2.addEventListener("click", function() {
    afficherCarte(carte2);
});

bouton3.addEventListener("click", function() {
    afficherCarte(carte3);
});

bouton4.addEventListener("click", function() {
    afficherCarte(carte4);
});

// Fonction pour masquer toutes les cartes
function masquerCartes() {
    cartes.forEach(function(carte) {
        carte.classList.add("hidden");
    });
}

// Fonction pour afficher la carte spécifiée et masquer les autres cartes
function afficherCarte(carte) {
    cartes.forEach(function(carte) {
        carte.classList.add("hidden");
    });
    carte.classList.remove("hidden");
}
