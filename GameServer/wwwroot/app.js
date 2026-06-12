// Get the canvas element
const canvas = document.getElementById('gameCanvas');

// Get the drawing context (2D)
const ctx = canvas.getContext('2d');

// Function to resize canvas to full window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawBackground();
    drawCore();
}

// Function to draw dark blue background
function drawBackground() {
    ctx.fillStyle = '#0a0a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCore() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 50;
    
    //ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
}

// Set initial size
resizeCanvas();

// Redraw when window size changes
window.addEventListener('resize', function() {
    resizeCanvas();
});

console.log("Page loaded! Canvas size: " + canvas.width + " x " + canvas.height);