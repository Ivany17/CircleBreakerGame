// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

// Game variables
let rotationAngle = 0;
let ballY = 1000;
let ballSpeed = 0;
let score = 0;
let gameOver = false;

// Ring properties
const RING_RADIUS = 95;
const RING_WIDTH = 50;
const INNER_RADIUS = RING_RADIUS - RING_WIDTH / 2;
const OUTER_RADIUS = RING_RADIUS + RING_WIDTH / 2;

// Gap properties (radians)
const GAP_START = 4.2;
const GAP_END = 5.2;

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ballY = canvas.height + 50;
}

// Draw background
function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0a0a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw the ring with gap
function drawRing() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    const start = GAP_START + rotationAngle;
    const end = GAP_END + rotationAngle;
    
    // Red part (everything except the gap)
    ctx.beginPath();
    ctx.arc(cx, cy, RING_RADIUS, end, Math.PI * 2 + start);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = RING_WIDTH;
    ctx.stroke();
    
    // Green part (the gap)
    ctx.beginPath();
    ctx.arc(cx, cy, RING_RADIUS, start, end);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = RING_WIDTH;
    ctx.stroke();
}

// Draw the ball
function drawBall() {
    const cx = canvas.width / 2;
    const radius = 15;
    
    ctx.beginPath();
    ctx.arc(cx, ballY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
}

// Check collision by checking pixel color
function checkCollision() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    const ballX = cx;
    const ballYPos = ballY;
    
    const dx = 0;
    const dy = cy - ballYPos;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Якщо кулька далеко за межами кільця — ігноруємо
    if (distance > OUTER_RADIUS + 20) {
        return 'outside';
    }
    
    // Якщо кулька всередині або поруч з кільцем — перевіряємо колір
    // Читаємо колір пікселя в позиції кульки
    const imageData = ctx.getImageData(ballX, ballYPos, 1, 1);
    const data = imageData.data;
    const red = data[0];
    const green = data[1];
    const blue = data[2];
    
    const isGreen = green > 200 && red < 100 && blue < 100;
    const isRed = red > 200 && green < 100 && blue < 100;
    const isBlue = red < 50 && green < 50 && blue > 100;
    
    // Якщо піксель синій (фон) — кулька в дірці або поза кільцем
    if (isBlue) {
        return 'outside';
    }
    
    if (isGreen) {
        return 'gap';
    } else if (isRed) {
        return 'ring';
    } else {
        return 'outside';
    }
}

// Main game loop
function gameLoop() {
    rotationAngle += 0.02;
    ballY -= ballSpeed;
    
    if (ballSpeed > 0 && !gameOver) {
        // Малюємо фон і кільце без кульки для перевірки
        drawBackground();
        drawRing();
        
        const result = checkCollision();
        if (result === 'gap') {
            console.log('Through the gap! +1 point');
            score++;
            ballY = canvas.height + 50;
            ballSpeed = 0;
        } else if (result === 'ring') {
            console.log('Game Over! Hit the red ring.');
            gameOver = true;
            ballSpeed = 0;
        } else if (result === 'outside') {
            // Якщо кулька в дірці і піднялася вище центру — скидаємо
            const cy = canvas.height / 2;
            if (ballY < cy) {
                ballY = canvas.height + 50;
                ballSpeed = 0;
            }
        }
    }
    
    if (ballY < -50) {
        ballY = canvas.height + 50;
        ballSpeed = 0;
    }
    
    drawBackground();
    drawRing();
    drawBall();
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 50);
    
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.fillText('GAME OVER', canvas.width/2 - 120, canvas.height/2);
    }
    
    requestAnimationFrame(gameLoop);
}

// Keyboard controls
window.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();
        
        if (gameOver) {
            gameOver = false;
            score = 0;
            ballY = canvas.height + 50;
            ballSpeed = 0;
            return;
        }
        
        if (ballSpeed === 0) {
            ballY = canvas.height - 30;
            ballSpeed = 7;
        }
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    resizeCanvas();
});

// Initialize
resizeCanvas();
gameLoop();

console.log('Game started!');