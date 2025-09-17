// Starfield with slow color change and twinkling stars
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
  const STAR_COUNT = 30;
  const MAX_DISTANCE = 120;

  // Global hue for all stars and lines
  let globalHue = 0;
  const HUE_SPEED = 360 / (2 * 60 * 60); // 2 dakika = 2*60s*60fps ≈ 360/7200 per frame

  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.baseRadius = Math.random() * 1 + 1; // Temel boyut
      this.radius = this.baseRadius;
      this.alpha = Math.random() * 0.3 + 0.2; // Daha az parlak
      this.alphaChange = 0.002 + Math.random() * 0.001; // Yanıp sönme hızı
      this.radiusChange = 0.002 + Math.random() * 0.002; // Hafif büyüyüp küçülme
      this.radiusDirection = 1; // Büyüme yönü
      this.alphaDirection = 1; // Parlaklık yönü
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
      if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;

      // Hafif yanıp sönme
      this.alpha += this.alphaChange * this.alphaDirection;
      if (this.alpha >= 0.4 || this.alpha <= 0.2) this.alphaDirection *= -1;

      // Hafif büyüyüp küçülme
      this.radius += this.radiusChange * this.radiusDirection;
      if (this.radius >= this.baseRadius + 0.5 || this.radius <= this.baseRadius - 0.3) this.radiusDirection *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${globalHue}, 100%, 50%, ${this.alpha})`;
      ctx.shadowBlur = 5;
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
          ctx.strokeStyle = `hsla(${globalHue}, 100%, 50%, ${0.3 - (dist / MAX_DISTANCE) * 0.3})`;
          ctx.lineWidth = 0.5;
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
