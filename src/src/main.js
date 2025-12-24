const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// --- CONFIG ---
const GRAVITY = 0.5;
const JUMP = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 160;
const PIPE_SPEED = 2;

// --- PLAYER ---
const bird = {
  x: 80,
  y: canvas.height / 2,
  radius: 15,
  velocity: 0,
};

// --- GAME STATE ---
let pipes = [];
let score = 0;
let gameOver = false;

// --- INPUT ---
function jump() {
  if (!gameOver) {
    bird.velocity = JUMP;
  } else {
    resetGame();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});
document.addEventListener("mousedown", jump);

// --- PIPES ---
function addPipe() {
  const topHeight =
    Math.random() * (canvas.height - PIPE_GAP - 100) + 50;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - PIPE_GAP,
    passed: false,
  });
}

// --- RESET ---
function resetGame() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
}

// --- UPDATE ---
function update() {
  if (gameOver) return;

  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  // add pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    addPipe();
  }

  pipes.forEach((pipe) => {
    pipe.x -= PIPE_SPEED;

    // score
    if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
      pipe.passed = true;
      score++;
    }

    // collision
    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + PIPE_WIDTH &&
      (bird.y - bird.radius < pipe.top ||
        bird.y + bird.radius > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }
  });

  // ground / ceiling
  if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
    gameOver = true;
  }
}

// --- DRAW ---
function draw() {
  // background
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // bird
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fill();

  // pipes
  ctx.fillStyle = "green";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
    ctx.fillRect(
      pipe.x,
      canvas.height - pipe.bottom,
      PIPE_WIDTH,
      pipe.bottom
    );
  });

  // score
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(score, 20, 40);

  // game over
  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText("GAME OVER", 70, canvas.height / 2);
    ctx.font = "16px Arial";
    ctx.fillText(
      "Click o Space para reiniciar",
      70,
      canvas.height / 2 + 30
    );
  }
}

// --- LOOP ---
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

