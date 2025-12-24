// src/main.js
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

// Bird (bolita)
let bird = {
  x: 90,
  y: H / 2,
  r: 14,
  vy: 0
};

const gravity = 0.5;
const flap = -8;

// Pipes
let pipes = [];
let frame = 0;
let score = 0;
let best = 0;
let alive = true;

function reset() {
  bird.y = H / 2;
  bird.vy = 0;
  pipes = [];
  frame = 0;
  score = 0;
  alive = true;
}

function addPipe() {
  const gap = 150;
  const pipeW = 60;
  const minTop = 60;
  const maxTop = H - 60 - gap;
  const topH = Math.floor(minTop + Math.random() * (maxTop - minTop));

  pipes.push({
    x: W + 10,
    w: pipeW,
    top: topH,
    gap: gap,
    passed: false
  });
}

function circleRectCollide(cx, cy, r, rx, ry, rw, rh) {
  const closestX = Math.max(rx, Math.min(cx, rx + rw));
  const closestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy <= r * r;
}

function inputFlap() {
  if (!alive) {
    reset();
    return;
  }
  bird.vy = flap;
}

// Controles: click o espacio
window.addEventListener("mousedown", inputFlap);
window.addEventListener("touchstart", (e) => { e.preventDefault(); inputFlap(); }, { passive: false });
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") inputFlap();
});

function update() {
  frame++;

  // physics
  bird.vy += gravity;
  bird.y += bird.vy;

  // add pipes
  if (frame % 90 === 0) addPipe();

  // move pipes
  for (const p of pipes) {
    p.x -= 2.5;

    // scoring
    if (!p.passed && p.x + p.w < bird.x - bird.r) {
      p.passed = true;
      score++;
      best = Math.max(best, score);
    }

    // collision with top pipe
    const topRect = { x: p.x, y: 0, w: p.w, h: p.top };
    // collision with bottom pipe
    const bottomRect = { x: p.x, y: p.top + p.gap, w: p.w, h: H - (p.top + p.gap) };

    if (
      circleRectCollide(bird.x, bird.y, bird.r, topRect.x, topRect.y, topRect.w, topRect.h) ||
      circleRectCollide(bird.x, bird.y, bird.r, bottomRect.x, bottomRect.y, bottomRect.w, bottomRect.h)
    ) {
      alive = false;
    }
  }

  // remove offscreen pipes
  pipes = pipes.filter(p => p.x + p.w > -20);

  // floor/ceiling
  if (bird.y + bird.r >= H) alive = false;
  if (bird.y - bird.r <= 0) alive = false;
}

function draw() {
  // sky
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, W, H);

  // pipes
  ctx.fillStyle = "#2ECC71";
  for (const p of pipes) {
    // top
    ctx.fillRect(p.x, 0, p.w, p.top);
    // bottom
    ctx.fillRect(p.x, p.top + p.gap, p.w, H - (p.top + p.gap));
  }

  // bird
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
  ctx.fill();

  // UI
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Best: ${best}`, 10, 55);

  if (!alive) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.font = "18px Arial";
    ctx.fillText("Perdiste! Click o Espacio para reiniciar", 10, H / 2);
  } else {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.font = "16px Arial";
    ctx.fillText("Click o Espacio para saltar", 10, H - 20);
  }
}

function loop() {
  if (alive) update();
  draw();
  requestAnimationFrame(loop);
}

reset();
loop();
