let isAdminLoggedIn = false;
const PASSWORD_HASH = "f7dc02cde06759a946f4dd803f767ed7a061e60558870c724e833a90a56dacec";

// --------------------------- Supabase Functions ---------------------------
async function savePhoto(photo) {
  try {
    const { data, error } = await window.supabase
      .from('photos')
      .insert([{
        id: photo.id.toString(),
        name: photo.name,
        data: photo.data,
        upload_date: photo.uploadDate
      }]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving photo:', error);
    throw error;
  }
}

async function deletePhoto(id) {
  try {
    const { error } = await window.supabase
      .from('photos')
      .delete()
      .eq('id', id.toString());
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
}

async function getAllPhotos() {
  try {
    const { data, error } = await window.supabase
      .from('photos')
      .select('*')
      .order('upload_date', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
}

// --------------------------- Button Management Functions ---------------------------
async function saveButton(button) {
  try {
    const { data, error } = await window.supabase
      .from('buttons')
      .insert([{
        id: button.id.toString(),
        name: button.name,
        link: button.link,
        description: button.description,
        is_temporary: button.isTemporary,
        expiry_date: button.expiryDate,
        hidden: button.hidden,
        created_date: button.createdDate
      }]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving button:', error);
    throw error;
  }
}

async function deleteButton(id) {
  try {
    const { error } = await window.supabase
      .from('buttons')
      .delete()
      .eq('id', id.toString());
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting button:', error);
    throw error;
  }
}

async function getAllButtons() {
  try {
    const { data, error } = await window.supabase
      .from('buttons')
      .select('*')
      .order('created_date', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching buttons:', error);
    return [];
  }
}

async function toggleButtonVisibility(id) {
  try {
    // First get the current button
    const { data: currentButton, error: fetchError } = await window.supabase
      .from('buttons')
      .select('hidden')
      .eq('id', id.toString())
      .single();
    
    if (fetchError) throw fetchError;
    
    // Toggle the hidden status
    const { error: updateError } = await window.supabase
      .from('buttons')
      .update({ hidden: !currentButton.hidden })
      .eq('id', id.toString());
    
    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error toggling button visibility:', error);
    throw error;
  }
}

// --------------------------- News Management Functions ---------------------------
async function saveNews(news) {
  try {
    const { data, error } = await window.supabase
      .from('news')
      .insert([{
        id: news.id.toString(),
        title: news.title,
        content: news.content,
        created_date: news.createdDate
      }]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving news:', error);
    throw error;
  }
}

async function deleteNews(id) {
  try {
    const { error } = await window.supabase
      .from('news')
      .delete()
      .eq('id', id.toString());
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
}

async function getAllNews() {
  try {
    const { data, error } = await window.supabase
      .from('news')
      .select('*')
      .order('created_date', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

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
  window.location.href = 'index.html?skipLoading=true';
}

// --------------------------- Initialize ---------------------------
document.addEventListener('DOMContentLoaded', function() {
  initializeStarfield();
  loadGallery();
  checkAdminStatus();

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('skipLoading') && window.location.pathname.includes('index.html')) {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');
    if (loadingScreen && mainContent) {
      loadingScreen.style.display = 'none';
      mainContent.style.display = 'block';
      mainContent.classList.add('show');
    }
  }
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
      const reader = new FileReader();
      reader.onload = async function(e){
        const photo = {
          id: Date.now() + Math.random(),
          name: file.name,
          data: e.target.result,
          uploadDate: new Date().toISOString()
        };
        await savePhoto(photo);
        uploadedCount++;
        if(uploadedCount===files.length){
          await loadGallery();
          await loadPhotoManager();
          fileInput.value='';
          alert(`${uploadedCount} fotoğraf başarıyla yüklendi!`);
        }
      };
      reader.readAsDataURL(file);
    }
  }
}

// --------------------------- Gallery ---------------------------
async function loadGallery() {
  const photos = await getAllPhotos();
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
      <img src="${photo.data}" alt="${photo.name}" onclick="openLightbox('${photo.data}','${photo.name}')">
      <p>${photo.name}</p>
    `;
    gallery.appendChild(container);
  });
}

// --------------------------- Photo Manager ---------------------------
async function loadPhotoManager() {
  const photos = await getAllPhotos();
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
      <img src="${photo.data}" alt="${photo.name}">
      <input type="checkbox" id="photo_${photo.id}" value="${photo.id}">
      <label for="photo_${photo.id}">${photo.name}</label>
    `;
    container.appendChild(item);
  });
  document.getElementById('deleteBtn').style.display='inline-block';
}

async function deleteSelected() {
  const checkboxes = document.querySelectorAll('#photoManager input[type="checkbox"]:checked');
  if(checkboxes.length===0){alert('Lütfen silmek istediğiniz fotoğrafları seçin!');return;}
  if(!confirm(`${checkboxes.length} fotoğrafı silmek istediğinizden emin misiniz?`)) return;

  for(const cb of checkboxes){
    await deletePhoto(cb.value);
  }
  await loadGallery();
  await loadPhotoManager();
  alert(`${checkboxes.length} fotoğraf silindi!`);
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
    id: Date.now() + Math.random(),
    name: buttonName,
    link: buttonLink,
    description: buttonDescription,
    isTemporary: isTemporary,
    expiryDate: isTemporary ? expiryDate : null,
    hidden: false,
    createdDate: new Date().toISOString()
  };

  await saveButton(button);
  await loadButtonManager();
  
  // Clear form
  document.getElementById('buttonName').value = '';
  document.getElementById('buttonLink').value = '';
  document.getElementById('buttonDescription').value = '';
  document.getElementById('isTemporary').checked = false;
  document.getElementById('expiryDate').value = '';
  document.getElementById('expiryDateContainer').style.display = 'none';
  
  alert('Buton başarıyla eklendi!');
}

async function loadButtonManager() {
  const buttons = await getAllButtons();
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
        <p>Oluşturma: ${new Date(button.created_date).toLocaleDateString('tr-TR')} ${new Date(button.created_date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
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
}

async function toggleButtonVisibilityBtn(id) {
  await toggleButtonVisibility(id);
  await loadButtonManager();
}

async function deleteButtonBtn(id) {
  if (!confirm('Bu butonu silmek istediğinizden emin misiniz?')) return;
  await deleteButton(id);
  await loadButtonManager();
  alert('Buton silindi!');
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
  let titleJSON, contentJSON;
  
  try {
    titleJSON = JSON.parse(newsTitle);
  } catch (e) {
    alert('Haber başlığı geçerli bir JSON formatında olmalıdır!');
    return;
  }
  
  try {
    contentJSON = JSON.parse(newsContent);
  } catch (e) {
    alert('Haber içeriği geçerli bir JSON formatında olmalıdır!');
    return;
  }

  const news = {
    id: Date.now() + Math.random(),
    title: newsTitle,
    content: newsContent,
    createdDate: new Date().toISOString()
  };

  await saveNews(news);
  await loadNewsManager();
  
  // Clear form
  document.getElementById('newsTitle').value = '';
  document.getElementById('newsContent').value = '';
  
  alert('Haber başarıyla eklendi!');
}

async function loadNewsManager() {
  const newsList = await getAllNews();
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
        <p>Tarih: ${new Date(news.created_date).toLocaleDateString('tr-TR')} ${new Date(news.created_date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <div class="news-actions">
        <button onclick="deleteNewsBtn('${news.id}')" class="delete-btn">Sil</button>
      </div>
    `;
    container.appendChild(item);
  });
}

async function deleteNewsBtn(id) {
  if (!confirm('Bu haberi silmek istediğinizden emin misiniz?')) return;
  await deleteNews(id);
  await loadNewsManager();
  alert('Haber silindi!');
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
