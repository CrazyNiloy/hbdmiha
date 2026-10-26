
const startButton = document.getElementById("play");
const loader = document.getElementById("loader");
const main = document.getElementById("main");
const song = document.getElementById("song");
const message = document.getElementById("message");
const wishButton = document.getElementById("wishButton");

const messages = [
    "Today is all about you, Miha! 💗",
    "You make the world a little brighter. 🌸",
    "May all your beautiful dreams come true. ✨",
    "Keep smiling and stay amazing! 💖",
    "Happy Birthday once again, Miha! 🎂"
];

let messageIndex = 0;
let messageTimer;
let confettiPieces = [];
let animationFrame;
let confettiActive = false;

startButton.addEventListener("click", async () => {
    loader.classList.add("hide");
    main.classList.add("show");

    startConfetti();
    startMessages();

    try {
        await song.play();
    } catch (error) {
        console.log("Music could not autoplay. Check assets/music.mp3.");
    }
});

function startMessages() {
    clearInterval(messageTimer);

    messageTimer = setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        message.textContent = messages[messageIndex];
    }, 3500);
}

wishButton.addEventListener("click", () => {
    messageIndex = (messageIndex + 1) % messages.length;
    message.textContent = messages[messageIndex];
    burstConfetti();
});

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createPiece(burst = false) {
    return {
        x: Math.random() * window.innerWidth,
        y: burst ? window.innerHeight * 0.55 : -10,
        size: Math.random() * 7 + 3,
        speed: Math.random() * 3 + 1.5,
        drift: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 8 - 4,
        color: ["#e75480", "#ffcf70", "#bda0ff", "#ffffff", "#ff8eae"][
            Math.floor(Math.random() * 5)
        ]
    };
}

function startConfetti() {
    if (confettiActive) return;

    confettiActive = true;
    confettiPieces = Array.from({ length: 120 }, () => createPiece());
    animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    confettiPieces.forEach((piece) => {
        piece.y += piece.speed;
        piece.x += piece.drift;
        piece.rotation += piece.rotationSpeed;

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation * Math.PI / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();

        if (piece.y > window.innerHeight + 20) {
            piece.y = -20;
            piece.x = Math.random() * window.innerWidth;
        }
    });

    animationFrame = requestAnimationFrame(animateConfetti);
}

function burstConfetti() {
    const extraPieces = Array.from({ length: 70 }, () => createPiece(true));
    confettiPieces.push(...extraPieces);

    if (confettiPieces.length > 300) {
        confettiPieces = confettiPieces.slice(-300);
    }
}
