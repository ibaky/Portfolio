import { playlist } from "./playlist.js";

const audioPlayer = document.getElementById("audioPlayer");
const background = document.getElementById("background");
const playBtn = document.getElementById("play");
const forw = document.getElementById("forw");
const back = document.getElementById("back");
const titre = document.getElementById("titre");
const artiste = document.getElementById("artiste");
const annee = document.getElementById("annee");
const cover = document.getElementById("cover");
let currentTrack = 0;
let isPlaying = false;

// Mise à jour de la piste initiale
titre.innerText = playlist[currentTrack].titre;
artiste.innerText = playlist[currentTrack].artiste;
annee.innerText = playlist[currentTrack].annee;
cover.src = playlist[currentTrack].cover;
audioPlayer.src = playlist[currentTrack].audio;

// Fonction pour générer une couleur aléatoire
function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// Fonction pour mettre à jour les couleurs du fond
function updateBackgroundColor() {
    if (isPlaying) {
        background.style.background = `linear-gradient(135deg, ${randomColor()}, ${randomColor()})`;
    }
}

// Changer la couleur de fond toutes les 3 secondes pendant la lecture
setInterval(updateBackgroundColor, 3000);

// Fonction de lecture/pause
function togglePlay() {
    if (isPlaying) {
        audioPlayer.pause();
        playBtn.classList.remove("fa-pause");
        playBtn.classList.add("fa-play");
    } else {
        audioPlayer.play().catch(error => console.error('Erreur de lecture:', error));
        playBtn.classList.remove("fa-play");
        playBtn.classList.add("fa-pause");
    }
    isPlaying = !isPlaying;
}

playBtn.addEventListener("click", togglePlay);

// Navigation des pistes
forw.addEventListener("click", () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    updateTrack();
});

back.addEventListener("click", () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    updateTrack();
});

function updateTrack() {
    titre.innerText = playlist[currentTrack].titre;
    artiste.innerText = playlist[currentTrack].artiste;
    annee.innerText = playlist[currentTrack].annee;
    cover.src = playlist[currentTrack].cover;
    audioPlayer.src = playlist[currentTrack].audio;
    audioPlayer.play();
    isPlaying = true;
    playBtn.classList.remove("fa-play");
    playBtn.classList.add("fa-pause");
}

// Visualisation de l'ondulation sonore avec Canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = 200; // Ajuste la hauteur si nécessaire
background.appendChild(canvas);

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

const source = audioContext.createMediaElementSource(audioPlayer);
source.connect(analyser);
analyser.connect(audioContext.destination);

function animate() {
    requestAnimationFrame(animate);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2; // Ajustement de la largeur des barres
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2; // Ajuste pour obtenir des barres proportionnelles
        ctx.fillStyle = `rgb(${barHeight + 100}, 100, 255)`; // Couleur des barres
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight); // Dessine la barre
        x += barWidth + 1; // Ajoute un espacement entre les barres
    }
}

// Commence l'animation quand la musique est jouée
audioPlayer.addEventListener("play", () => {
    audioContext.resume().then(() => animate());
});
