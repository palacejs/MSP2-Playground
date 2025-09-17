// Starfield animation with dynamic colors
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
  const connections = {};
  const STAR_COUNT = 80;
  const MAX_DISTANCE = 120;

  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.radius = Math.random() * 1 + 1;
      this.alpha = Math.random() * 0.5 + 0.5;
      this.alphaChange = 0.003 + Math.random() * 0.00002;
      this.hue = Math.random() * 360; // Başlangıç rengi
      this.hueSpeed = 0.1 + Math.random() * 0.1; // Renk değişim hızı
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
      if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
      this.alpha += this.alphaChange;
      if (this.alpha >= 0.5 || this.alpha <= 0.1) this.alphaChange *= -1;
      
      this.hue += this.hueSpeed; // Renk sürekli değişiyor
      if(this.hue > 360) this.hue -= 360;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
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
        const key = `${i}-${j}`;
        if (!connections[key]) connections[key] = { alpha: 0 };
        const conn = connections[key];
        const targetAlpha = dist < MAX_DISTANCE ? 0.4 - (dist / MAX_DISTANCE * 0.4) : 0;
        conn.alpha += conn.alpha < targetAlpha ? 0.01 : -0.01;
        conn.alpha = Math.max(0, Math.min(conn.alpha, targetAlpha));
        if (conn.alpha > 0) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          // Çizgi rengi yıldızlardan ortalama hue alınarak ayarlanıyor
          const avgHue = (stars[i].hue + stars[j].hue) / 2;
          ctx.strokeStyle = `hsla(${avgHue}, 100%, 50%, ${conn.alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
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

// Initialize starfield
document.addEventListener('DOMContentLoaded', function() {
  createStarfield();
});
