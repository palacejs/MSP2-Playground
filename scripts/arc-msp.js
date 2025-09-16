let isAdminLoggedIn = false;
const PASSWORD_HASH = "f7dc02cde06759a946f4dd803f767ed7a061e60558870c724e833a90a56dacec";

// --------------------------- Password Functions ---------------------------
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
  loadButtonManager();
  loadNewsManager();
}

function logout() {
  isAdminLoggedIn = false;
  sessionStorage.removeItem('msp2_admin');
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'none';
}

// --------------------------- Navigation ---------------------------
function goBackHome() {
  window.location.href = 'index.html';
}

// --------------------------- Initialize ---------------------------
document.addEventListener('DOMContentLoaded', function() {
  initializeStarfield();
  loadGallery();
  checkAdminStatus();
});

function initializeStarfield() {
  const canvas = document.getElementById('starfield');
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
      ctx.fillStyle = `rgba(0,0,139,${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(0,0,139,${this.alpha})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for(let i=0;i<STAR_COUNT;i++) stars.push(new Star());

  function drawLines() {
    for(let i=0;i<stars.length;i++){
      for(let j=i+1;j<stars.length;j++){
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        const key = `${i}-${j}`;
        if(!connections[key]) connections[key]={alpha:0};
        const conn = connections[key];
        const targetAlpha = dist<MAX_DISTANCE?0.4-(dist/MAX_DISTANCE*0.4):0;
        conn.alpha += conn.alpha<targetAlpha?0.01:-0.01;
        conn.alpha = Math.max(0,Math.min(conn.alpha,targetAlpha));
        if(conn.alpha>0){
          ctx.beginPath();
          ctx.moveTo(stars[i].x,stars[i].y);
          ctx.lineTo(stars[j].x,stars[j].y);
          ctx.strokeStyle = `rgba(0,0,139,${conn.alpha})`;
          ctx.lineWidth=0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s=>{s.update();s.draw();});
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
}

// --------------------------- Photo Management ---------------------------
async function uploadPhotos() {
  const fileInput = document.getElementById('photoInput');
  const files = fileInput.files;
  if(files.length===0){alert('Lütfen fotoğraf seçin!');return;}

  let uploadedCount = 0;
  for(const file of files){
    if(file.type.startsWith('image/')){
      try {
        // Create unique filename
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`;
        
        // Upload to Supabase Storage
        const imageUrl = await window.supabaseArcOperations.uploadImage(file, fileName);
        
        // Save photo record to database
        const photo = {
          name: file.name,
          image_url: imageUrl
        };
        
        await window.supabaseArcOperations.savePhoto(photo);
        uploadedCount++;
        
        if(uploadedCount === files.length){
          await loadGallery();
          await loadPhotoManager();
          fileInput.value='';
          alert(`${uploadedCount} fotoğraf başarıyla yüklendi!`);
        }
      } catch (error) {
        console.log('Error uploading photo:', error);
        alert(`Fotoğraf yükleme hatası: ${file.name}`);
      }
    }
  }
}

// --------------------------- Gallery ---------------------------
async function loadGallery() {
  try {
    const photos = await window.supabaseArcOperations.getAllPhotos();
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    if(photos.length===0){
      gallery.innerHTML = '<div style="text-align:center;color:#ccc;grid-column:1/-1;"><h3>Henüz fotoğraf yüklenmemiş</h3><p>Admin panelinden fotoğraf yükleyebilirsiniz.</p></div>';
      return;
    }
    
    photos.forEach(photo=>{
      const container = document.createElement('div');
      container.className='photo-container';
      container.innerHTML=`
        <img src="${photo.image_url}" alt="${photo.name}" onclick="openLightbox('${photo.image_url}','${photo.name}')">
        <p>${photo.name}</p>
      `;
      gallery.appendChild(container);
    });
  } catch (error) {
    console.log('Error loading gallery:', error);
  }
}

// --------------------------- Photo Manager ---------------------------
async function loadPhotoManager() {
  try {
    const photos = await window.supabaseArcOperations.getAllPhotos();
    const container = document.getElementById('photoManager');
    container.innerHTML='';
    
    if(photos.length===0){
      container.innerHTML='<p style="color:#ccc;text-align:center;">Henüz fotoğraf yüklenmemiş.</p>';
      document.getElementById('deleteBtn').style.display='none';
      return;
    }
    
    photos.forEach(photo=>{
      const item=document.createElement('div');
      item.className='photo-item';
      item.innerHTML=`
        <img src="${photo.image_url}" alt="${photo.name}">
        <input type="checkbox" id="photo_${photo.id}" value="${photo.id}">
        <label for="photo_${photo.id}">${photo.name}</label>
      `;
      container.appendChild(item);
    });
    document.getElementById('deleteBtn').style.display='inline-block';
  } catch (error) {
    console.log('Error loading photo manager:', error);
  }
}

async function deleteSelected() {
  const checkboxes = document.querySelectorAll('#photoManager input[type="checkbox"]:checked');
  if(checkboxes.length===0){alert('Lütfen silmek istediğiniz fotoğrafları seçin!');return;}
  if(!confirm(`${checkboxes.length} fotoğrafı silmek istediğinizden emin misiniz?`)) return;

  try {
    for(const cb of checkboxes){
      await window.supabaseArcOperations.deletePhoto(cb.value);
    }
    await loadGallery();
    await loadPhotoManager();
    alert(`${checkboxes.length} fotoğraf silindi!`);
  } catch (error) {
    console.log('Error deleting photos:', error);
    alert('Fotoğraf silme hatası!');
  }
}

// --------------------------- Button Management ---------------------------
async function addNewButton() {
  const buttonName = document.getElementById('buttonName').value.trim();
  const buttonLink = document.getElementById('buttonLink').value.trim();
  const buttonDescription = document.getElementById('buttonDescription').value.trim();
  const isTemporary = document.getElementById('isTemporary').checked;
  const expiryDate = document.getElementById('expiryDate').value;

  if (!buttonName) {
    alert('Lütfen buton adını girin!');
    return;
  }
  if (!buttonLink) {
    alert('Lütfen buton bağlantısını girin!');
    return;
  }
  if (buttonDescription) {
    try {
      JSON.parse(buttonDescription);
    } catch (e) {
      alert('Açıklama geçerli bir JSON formatında olmalıdır!');
      return;
    }
  }
  if (isTemporary && !expiryDate) {
    alert('Lütfen geçici buton için son tarihi belirleyin!');
    return;
  }

  const button = {
    name: buttonName,
    link: buttonLink,
    description: buttonDescription,
    is_temporary: isTemporary,
    expiry_date: isTemporary ? expiryDate : null,
    hidden: false
  };

  try {
    await window.supabaseArcOperations.saveButton(button);
    await loadButtonManager();
    
    // Clear form
    document.getElementById('buttonName').value = '';
    document.getElementById('buttonLink').value = '';
    document.getElementById('buttonDescription').value = '';
    document.getElementById('isTemporary').checked = false;
    document.getElementById('expiryDate').value = '';
    document.getElementById('expiryDateContainer').style.display = 'none';
    
    alert('Buton başarıyla eklendi!');
  } catch (error) {
    console.log('Error adding button:', error);
    alert('Buton ekleme hatası!');
  }
}

async function loadButtonManager() {
  try {
    const buttons = await window.supabaseArcOperations.getAllButtons();
    const container = document.getElementById('buttonManager');
    container.innerHTML = '';
    
    if (buttons.length === 0) {
      container.innerHTML = '<p style="color:#ccc;text-align:center;">Henüz buton eklenmemiş.</p>';
      return;
    }

    buttons.forEach(button => {
      const now = new Date();
      const isExpired = button.is_temporary && new Date(button.expiry_date) < now;
      const statusText = button.hidden ? 'Gizli' : (isExpired ? 'Süresi Dolmuş' : 'Aktif');
      const statusColor = button.hidden ? '#ff6b6b' : (isExpired ? '#ffa500' : '#6effb2');

      const item = document.createElement('div');
      item.className = 'button-item';
      item.innerHTML = `
        <div class="button-info">
          <strong>${button.name}</strong>
          <p>Bağlantı: <a href="${button.link}" target="_blank" style="color:#6effb2;">${button.link}</a></p>
          <p>Durum: <span style="color:${statusColor};">${statusText}</span></p>
          ${button.description ? `<p>Açıklama: Evet</p>` : `<p>Açıklama: Hayır</p>`}
          ${button.is_temporary ? `<p>Son Tarih: ${new Date(button.expiry_date).toLocaleDateString('tr-TR')} ${new Date(button.expiry_date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>` : ''}
          <p>Oluşturma: ${new Date(button.created_at).toLocaleDateString('tr-TR')} ${new Date(button.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div class="button-actions">
          <button onclick="toggleButtonVisibilityBtn('${button.id}')" ${isExpired ? 'disabled' : ''}>
            ${button.hidden ? 'Göster' : 'Gizle'}
          </button>
          <button onclick="deleteButtonBtn('${button.id}')" class="delete-btn">Sil</button>
        </div>
      `;
      container.appendChild(item);
    });
  } catch (error) {
    console.log('Error loading button manager:', error);
  }
}

async function toggleButtonVisibilityBtn(id) {
  try {
    await window.supabaseArcOperations.toggleButtonVisibility(id);
    await loadButtonManager();
  } catch (error) {
    console.log('Error toggling button visibility:', error);
    alert('Buton görünürlük değiştirme hatası!');
  }
}

async function deleteButtonBtn(id) {
  if (!confirm('Bu butonu silmek istediğinizden emin misiniz?')) return;
  
  try {
    await window.supabaseArcOperations.deleteButton(id);
    await loadButtonManager();
    alert('Buton silindi!');
  } catch (error) {
    console.log('Error deleting button:', error);
    alert('Buton silme hatası!');
  }
}

function toggleDatePicker() {
  const isTemporary = document.getElementById('isTemporary').checked;
  const dateContainer = document.getElementById('expiryDateContainer');
  dateContainer.style.display = isTemporary ? 'block' : 'none';
  
  if (!isTemporary) {
    document.getElementById('expiryDate').value = '';
  }
}

// --------------------------- News Management ---------------------------
async function addNews() {
  const newsTitle = document.getElementById('newsTitle').value.trim();
  const newsContent = document.getElementById('newsContent').value.trim();

  if (!newsTitle) {
    alert('Lütfen haber başlığını girin!');
    return;
  }
  if (!newsContent) {
    alert('Lütfen haber içeriğini girin!');
    return;
  }

  // Validate JSON format for title and content
  try {
    JSON.parse(newsTitle);
    JSON.parse(newsContent);
  } catch (e) {
    alert('Başlık ve içerik geçerli JSON formatında olmalıdır!');
    return;
  }

  const news = {
    title: newsTitle,
    content: newsContent
  };

  try {
    await window.supabaseArcOperations.saveNews(news);
    await loadNewsManager();
    
    // Clear form
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsContent').value = '';
    
    alert('Haber başarıyla eklendi!');
  } catch (error) {
    console.log('Error adding news:', error);
    alert('Haber ekleme hatası!');
  }
}

async function loadNewsManager() {
  try {
    const newsList = await window.supabaseArcOperations.getAllNews();
    const container = document.getElementById('newsManager');
    container.innerHTML = '';
    
    if (newsList.length === 0) {
      container.innerHTML = '<p style="color:#ccc;text-align:center;">Henüz haber eklenmemiş.</p>';
      return;
    }

    newsList.forEach(news => {
      const item = document.createElement('div');
      item.className = 'news-item';
      
      // Parse JSON and show first available language or raw text
      let displayTitle = news.title;
      let displayContent = news.content;
      
      try {
        const titleJSON = JSON.parse(news.title);
        displayTitle = titleJSON['en-US'] || titleJSON['tr-TR'] || Object.values(titleJSON)[0] || news.title;
      } catch (e) {
        // Use raw title if not JSON
      }
      
      try {
        const contentJSON = JSON.parse(news.content);
        displayContent = contentJSON['en-US'] || contentJSON['tr-TR'] || Object.values(contentJSON)[0] || news.content;
      } catch (e) {
        // Use raw content if not JSON
      }
      
      item.innerHTML = `
        <div class="news-info">
          <strong>${displayTitle}</strong>
          <p>${displayContent}</p>
          <p>Tarih: ${new Date(news.created_at).toLocaleDateString('tr-TR')} ${new Date(news.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div class="news-actions">
          <button onclick="deleteNewsBtn('${news.id}')" class="delete-btn">Sil</button>
        </div>
      `;
      container.appendChild(item);
    });
  } catch (error) {
    console.log('Error loading news manager:', error);
  }
}

async function deleteNewsBtn(id) {
  if (!confirm('Bu haberi silmek istediğinizden emin misiniz?')) return;
  
  try {
    await window.supabaseArcOperations.deleteNews(id);
    await loadNewsManager();
    alert('Haber silindi!');
  } catch (error) {
    console.log('Error deleting news:', error);
    alert('Haber silme hatası!');
  }
}

// --------------------------- Lightbox ---------------------------
function openLightbox(imageSrc,imageName){
  const lightbox=document.getElementById('lightbox');
  const img=document.getElementById('lightboxImg');
  const caption=document.getElementById('lightboxCaption');
  img.src=imageSrc;
  caption.textContent=imageName;
  lightbox.classList.add('show');
}

function closeLightbox(){
  document.getElementById('lightbox').classList.remove('show');
}

document.getElementById('lightbox').addEventListener('click',function(e){
  if(e.target===this) closeLightbox();
});

// --------------------------- Enter key login ---------------------------
document.getElementById('adminPassword').addEventListener('keypress',function(e){
  if(e.key==='Enter') adminLogin();
});

// Make functions global
window.goBackHome = goBackHome;
window.adminLogin = adminLogin;
window.logout = logout;
window.uploadPhotos = uploadPhotos;
window.deleteSelected = deleteSelected;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.addNewButton = addNewButton;
window.toggleButtonVisibilityBtn = toggleButtonVisibilityBtn;
window.deleteButtonBtn = deleteButtonBtn;
window.toggleDatePicker = toggleDatePicker;
window.addNews = addNews;
window.deleteNewsBtn = deleteNewsBtn;
