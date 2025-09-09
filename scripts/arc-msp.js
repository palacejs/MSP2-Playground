// ARC MSP functionality
let isAdminLoggedIn = false;
// "sehan123" için SHA-256 hash
const PASSWORD_HASH = "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f";
const STORAGE_KEY = 'msp2_arc_photos';

document.addEventListener('DOMContentLoaded', function() {
  initializeStarfield();
  loadGallery();
  checkAdminStatus();
});

function initializeStarfield() {
  const canvas = document.getElementById('starfield');
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
      ctx.fillStyle = `rgba(0, 0, 139, ${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(0, 0, 139, ${this.alpha})`;
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
          ctx.moveTo(stars[i].x, stars[j].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = `rgba(0, 0, 139, ${conn.alpha})`;
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

// Şifreyi hash'leyen fonksiyon
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function adminLogin() {
  const password = document.getElementById('adminPassword').value;
  const hash = await hashPassword(password);

  if (hash === PASSWORD_HASH) {
    isAdminLoggedIn = true;
    sessionStorage.setItem('msp2_admin', 'true');
    showAdminPanel();
    document.getElementById('adminPassword').value = '';
  } else {
    alert('Yanlış şifre!');
  }
}

function checkAdminStatus() {
  if (sessionStorage.getItem('msp2_admin') === 'true') {
    isAdminLoggedIn = true;
    showAdminPanel();
  }
}

function showAdminPanel() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  loadPhotoManager();
}

function logout() {
  isAdminLoggedIn = false;
  sessionStorage.removeItem('msp2_admin');
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'none';
}

function uploadPhotos() {
  const fileInput = document.getElementById('photoInput');
  const files = fileInput.files;
  
  if (files.length === 0) {
    alert('Lütfen fotoğraf seçin!');
    return;
  }

  const photos = getStoredPhotos();
  let uploadedCount = 0;

  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const photo = {
          id: Date.now() + Math.random(),
          name: file.name,
          data: e.target.result,
          uploadDate: new Date().toISOString()
        };
        photos.push(photo);
        uploadedCount++;
        
        if (uploadedCount === files.length) {
          savePhotos(photos);
          loadGallery();
          loadPhotoManager();
          fileInput.value = '';
          alert(`${uploadedCount} fotoğraf başarıyla yüklendi!`);
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

function loadPhotoManager() {
  const photos = getStoredPhotos();
  const container = document.getElementById('photoManager');
  container.innerHTML = '';

  if (photos.length === 0) {
    container.innerHTML = '<p style="color: #ccc; text-align: center;">Henüz fotoğraf yüklenmemiş.</p>';
    document.getElementById('deleteBtn').style.display = 'none';
    return;
  }

  photos.forEach(photo => {
    const item = document.createElement('div');
    item.className = 'photo-item';
    item.innerHTML = `
      <img src="${photo.data}" alt="${photo.name}">
      <input type="checkbox" id="photo_${photo.id}" value="${photo.id}">
      <label for="photo_${photo.id}">${photo.name}</label>
    `;
    container.appendChild(item);
  });

  document.getElementById('deleteBtn').style.display = 'inline-block';
}

function deleteSelected() {
  const checkboxes = document.querySelectorAll('#photoManager input[type="checkbox"]:checked');
  
  if (checkboxes.length === 0) {
    alert('Lütfen silmek istediğiniz fotoğrafları seçin!');
    return;
  }

  if (!confirm(`${checkboxes.length} fotoğrafı silmek istediğinizden emin misiniz?`)) {
    return;
  }

  const photos = getStoredPhotos();
  const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
  const remainingPhotos = photos.filter(photo => !selectedIds.includes(photo.id));

  savePhotos(remainingPhotos);
  loadGallery();
  loadPhotoManager();
  alert(`${checkboxes.length} fotoğraf silindi!`);
}

function loadGallery() {
  const photos = getStoredPhotos();
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  if (photos.length === 0) {
    gallery.innerHTML = '<div style="text-align: center; color: #ccc; grid-column: 1/-1;"><h3>Henüz fotoğraf yüklenmemiş</h3><p>Admin panelinden fotoğraf yükleyebilirsiniz.</p></div>';
    return;
  }

  photos.forEach(photo => {
    const container = document.createElement('div');
    container.className = 'photo-container';
    container.innerHTML = `
      <img src="${photo.data}" alt="${photo.name}" onclick="openLightbox('${photo.data}', '${photo.name}')">
      <p>${photo.name}</p>
    `;
    gallery.appendChild(container);
  });
}

function openLightbox(imageSrc, imageName) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  
  img.src = imageSrc;
  caption.textContent = imageName;
  lightbox.classList.add('show');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('show');
}

// Click outside to close lightbox
document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) {
    closeLightbox();
  }
});

// Storage functions
function getStoredPhotos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function savePhotos(photos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

// Allow Enter key for login
document.getElementById('adminPassword').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    adminLogin();
  }
});
