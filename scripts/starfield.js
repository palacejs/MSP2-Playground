// Starfield with faster pulsating stars and very slow color change
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
  let globalHue = 180; // Başlangıç açık mavi
  const HUE_SPEED = 360 / (5 * 60 * 60); // 5 dakika = 5*60s*60fps ≈ 360/18000 per frame

  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.baseRadius = Math.random() * 1 + 1; // Ortalama boyut
      this.minRadius = this.baseRadius * 0.6;   // Minimum boyut
      this.maxRadius = this.baseRadius * 1.4;   // Maksimum boyut
      this.radius = this.baseRadius;

      // Daha hızlı pulsasyon
      this.radiusChange = 0.008 + Math.random() * 0.004; 
      this.radiusDirection = 1;

      // Parlaklık sabit
      this.alpha = 0.25; 
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
      if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;

      // Yıldız boyutu hızlıca değiştir
      this.radius += this.radiusChange * this.radiusDirection;
      if (this.radius >= this.maxRadius || this.radius <= this.minRadius) this.radiusDirection *= -1;
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

    // Renk değişimi çok yavaş (5 dakika)
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
