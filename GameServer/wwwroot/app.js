// Get the canvas element
const canvas = document.getElementById('gameCanvas');

// Get the drawing context (2D)
const ctx = canvas.getContext('2d');

let rotationAngle = 0;

let ballY = 1000;        // Початкова позиція кульки по вертикалі (0 = самий верх, 1000 - внизу поза екраном)
let ballSpeed = 0;    // Швидкість руху кульки (поки що 0, вона не рухається)

const GAP_START = 4.0;  // Ширший отвір
const GAP_END = 5.4;    // Ширший отвір

// Function to resize canvas to full window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ballY = canvas.height + 50; // Ховаємо кульку знизу
    // drawBackground();
    // drawRing();
}

// Function to draw dark blue background
function drawBackground() {
    // Очищуємо canvas повністю (робимо його прозорим)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Потім заливаємо темно-синім
    ctx.fillStyle = '#0a0a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Це ядро гри. Кулька має долетіти до нього, не зачепивши кільця.
function drawCore() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 50;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
}

function drawRing() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 95;
    const ringWidth = 50;
    
    // Малюємо червону частину (обходимо отвір)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, GAP_END + rotationAngle, Math.PI * 2 + GAP_START + rotationAngle);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = ringWidth;
    ctx.stroke();
    
    // Малюємо зелену частину (отвір)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, GAP_START + rotationAngle, GAP_END + rotationAngle);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = ringWidth;
    ctx.stroke();
}

function gameLoop() {
    rotationAngle = rotationAngle - 0.02; // або +0.02, як у тебе
    // Оновлюємо позицію кульки
    ballY = ballY - ballSpeed;
    
    // Перевіряємо зіткнення (тільки якщо кулька летить)
    if (ballSpeed > 0) {
        const collision = checkCollision();
        if (collision === 'gap') {
            // Кулька потрапила в отвір! (дозволено)
            console.log("Through the gap! +1 point");
            // Скидаємо кульку вниз
            ballY = canvas.height + 50;
            ballSpeed = 0;
        } else if (collision === 'ring') {
            // Кулька влучила в червоне кільце (заборонено)
            console.log("Game Over! Hit the red ring.");
            // Скидаємо кульку вниз
            ballY = canvas.height + 50;
            ballSpeed = 0;
            // Тут можна додати перезапуск гри
        }
    }
    
    // Якщо кулька вилетіла за верхній край
    if (ballY < -50) {
        ballY = canvas.height + 50;
        ballSpeed = 0;
    }
    
    // Малюємо все
    drawBackground();
    drawRing();
    drawBall();
    
    requestAnimationFrame(gameLoop);
}

function drawBall() {
    const centerX = canvas.width / 2; // Кулька летить по центру (по X)
    const radius = 15; // Розмір кульки

    ctx.beginPath();
    ctx.arc(centerX, ballY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
}

function checkCollision() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 95;
    const ringWidth = 50;
    const innerRadius = radius - ringWidth / 2;
    const outerRadius = radius + ringWidth / 2;
    
    const dx = 0;
    const dy = centerY - ballY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > outerRadius || distance < innerRadius) {
        return 'outside';
    }
    
    // Кут кульки
    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += Math.PI * 2;
    
    // Кути отвору (з урахуванням обертання)
    let gapStart = GAP_START + rotationAngle;
    let gapEnd = GAP_END + rotationAngle;
    
    // Нормалізуємо кути в [0, 2*PI)
    gapStart = ((gapStart % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    gapEnd = ((gapEnd % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    
    // Перевіряємо, чи кут кульки в межах отвору
    let isInGap = false;
    if (gapStart < gapEnd) {
        isInGap = angle >= gapStart && angle <= gapEnd;
    } else {
        isInGap = angle >= gapStart || angle <= gapEnd;
    }
    
    console.log(`Angle: ${angle.toFixed(3)}, Gap: ${gapStart.toFixed(3)} - ${gapEnd.toFixed(3)}, In gap: ${isInGap}`);
    
    return isInGap ? 'gap' : 'ring';
}

// Запускаємо цикл гри
gameLoop();

// Set initial size
resizeCanvas();

// Redraw when window size changes
window.addEventListener('resize', function() {
    resizeCanvas();
});

window.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault(); // Це блокує прокрутку сторінки
        // Якщо кулька внизу (або нерухома) – запускаємо
        if (ballSpeed === 0) {
            ballY = canvas.height - 30; // Ставимо кульку внизу
            ballSpeed = 7; // Задаємо швидкість (7 пікселів за кадр)
        }
    }
});

console.log("Page loaded! Canvas size: " + canvas.width + " x " + canvas.height);