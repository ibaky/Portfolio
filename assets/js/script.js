const text = "Développeur Web Junior";
let index = 0;

function typeWriter() {
    const typedTextElement = document.getElementById("typedText");
    typedTextElement.style.visibility = "visible"; // Affiche le texte au démarrage de l'animation

    if (index === 0) {
        // Efface le contenu au début de l'animation
        typedTextElement.innerHTML = "";
    }

    if (index < text.length) {
        typedTextElement.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeWriter, 100); // délai entre chaque lettre
    }
}

// Masquer le loader après un délai, puis démarrer le typewriter
window.addEventListener("load", function() {
    setTimeout(function() {
        document.querySelector(".loader").style.display = "none"; // Cache le loader
        index = 0; // Réinitialise l'index pour que l'animation démarre du début
        typeWriter(); // Démarre l'animation de typewriter après le loader
    }, 5000); // Délai de 5000ms (5 secondes)
});
