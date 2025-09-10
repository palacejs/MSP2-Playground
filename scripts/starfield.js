// Fully working Starfield animation with connecting lines
function createStarfield(canvasId = 'starfield') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    // Hem CSS hem JS ile canvas boyutu eşleşmeli
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const STAR_COUNT = 120;
  const MAX_DISTANCE = 170;
  const stars = [];
  const connections = {};

  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.radius = Math.random() * 1.1 + 0.7;
      this.alpha = Math.random() * 0.5 + 0.5;
      this.alphaChange = 0.003 + Math.random() * 0.001;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      this.alpha += this.alphaChange;
      if (this.alpha > 1 || this.alpha < 0.2) this.alphaChange *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 170, 255, ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(0, 180, 255, ${this.alpha})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Yıldızları başlat
  function createStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(new Star());
    }
  }
  createStars();

  // Canvas boyutu değişirse yıldızları yeniden oluştur
  window.addEventListener('resize', () => {
    resizeCanvas();
    createStars();
  });

  function drawLines() {
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const key = `${i}-${j}`;
        if (!connections[key]) connections[key] = { alpha: 0 };
        const conn = connections[key];
        const targetAlpha = dist < MAX_DISTANCE ? 0.5 - (dist / MAX_DISTANCE * 0.5) : 0;
        conn.alpha += conn.alpha < targetAlpha ? 0.025 : -0.025;
        conn.alpha = Math.max(0, Math.min(conn.alpha, targetAlpha));
        if (conn.alpha > 0.05) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = `rgba(0, 170, 255, ${conn.alpha})`;
          ctx.lineWidth = 1;
          ctx.shadowBlur = 7;
          ctx.shadowColor = 'rgba(0,180,255,0.45)';
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
