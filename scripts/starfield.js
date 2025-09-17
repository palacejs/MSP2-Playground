// Starfield with synchronized slow color change
function createStarfield(canvasId = 'starfield') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const stars = [];
  const STAR_COUNT = 80;
  const MAX_DISTANCE = 120;

  // Global hue for all stars and lines
  let globalHue = 0;
  const HUE_SPEED = 360 / (60 * 60); // 1 dakika = 60s * 60fps ≈ 360 / 3600 per frame

  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.radius = Math.random() * 1 + 1;
      this.alpha = Math.random() * 0.5 + 0.5;
      this.alphaChange = 0.003 + Math.random() * 0.00002;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
      if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;

      this.alpha += this.alphaChange;
      if (this.alpha >= 0.5 || this.alpha <= 0.1) this.alphaChange *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${globalHue}, 100%, 50%, ${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${globalHue}, 100%, 50%, ${this.alpha})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
  }

  function drawLines() {
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = `hsla(${globalHue}, 100%, 50%, ${0.4 - (dist / MAX_DISTANCE) * 0.4})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update global hue
    globalHue += HUE_SPEED;
    if (globalHue > 360) globalHue -= 360;

    stars.forEach(star => {
      star.update();
      star.draw();
    });

    drawLines();
    requestAnimationFrame(animate);
  }

  animate();
}

document.addEventListener('DOMContentLoaded', function() {
  createStarfield();
});
