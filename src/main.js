const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "skyblue";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "yellow";
ctx.beginPath();
ctx.arc(180, 320, 20, 0, Math.PI * 2);
ctx.fill();
