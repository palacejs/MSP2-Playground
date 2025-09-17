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

  // Save to local IndexedDB for admin management
  if (window.dataManager) {
    await window.dataManager.saveButtonToLocal(button);
  } else {
    await saveButton(button);
  }
  await loadButtonManager();
  
  // Clear form
  document.getElementById('buttonName').value = '';
  document.getElementById('buttonLink').value = '';
  document.getElementById('buttonDescription').value = '';
  document.getElementById('isTemporary').checked = false;
  document.getElementById('expiryDate').value = '';
  document.getElementById('expiryDateContainer').style.display = 'none';
  
  alert('Buton yerel olarak eklendi! JSON dosyasını manuel olarak güncellemeniz gerekiyor.');
}

async function loadButtonManager() {
  // Load from local IndexedDB for admin panel
  const buttons = window.dataManager ? 
    await window.dataManager.getAllButtonsFromLocal() : 
    await getAllButtons();
  const container = document.getElementById('buttonManager');
  container.innerHTML = '';
  
  if (buttons.length === 0) {
    container.innerHTML = '<p style="color:#ccc;text-align:center;">Henüz buton eklenmemiş.</p>';
    return;
  }

  buttons.forEach(button => {
    const now = new Date();
    const isExpired = button.isTemporary && new Date(button.expiryDate) < now;
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
        ${button.isTemporary ? `<p>Son Tarih: ${new Date(button.expiryDate).toLocaleDateString('tr-TR')} ${new Date(button.expiryDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>` : ''}
        <p>Oluşturma: ${new Date(button.createdDate).toLocaleDateString('tr-TR')} ${new Date(button.createdDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
        <p style="color: #ffa500; font-size: 12px;">⚠️ JSON dosyasını manuel güncellemeniz gerekiyor</p>
      </div>
      <div class="button-actions">
        <button onclick="toggleButtonVisibilityBtn(${button.id})" ${isExpired ? 'disabled' : ''}>
          ${button.hidden ? 'Göster' : 'Gizle'}
        </button>
        <button onclick="deleteButtonBtn(${button.id})" class="delete-btn">Sil</button>
      </div>
    `;
    container.appendChild(item);
  });
}

async function toggleButtonVisibilityBtn(id) {
  if (window.dataManager) {
    await window.dataManager.toggleButtonVisibilityLocal(id);
  } else {
    await toggleButtonVisibility(id);
  }
  await loadButtonManager();
}

async function deleteButtonBtn(id) {
  if (!confirm('Bu butonu silmek istediğinizden emin misiniz?')) return;
  if (window.dataManager) {
    await window.dataManager.deleteButtonFromLocal(id);
  } else {
    await deleteButton(id);
  }
  await loadButtonManager();
  alert('Buton silindi!');
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

  // Save to local IndexedDB for admin management
  if (window.dataManager) {
    await window.dataManager.saveNewsToLocal(news);
  } else {
    await saveNews(news);
  }
  await loadNewsManager();
  
  // Clear form
  document.getElementById('newsTitle').value = '';
  document.getElementById('newsContent').value = '';
  
  alert('Haber yerel olarak eklendi! JSON dosyasını manuel olarak güncellemeniz gerekiyor.');
}

async function loadNewsManager() {
  // Load from local IndexedDB for admin panel
  const newsList = window.dataManager ? 
    await window.dataManager.getAllNewsFromLocal() : 
    await getAllNews();
  const container = document.getElementById('newsManager');
  container.innerHTML = '';
  
  if (newsList.length === 0) {
    container.innerHTML = '<p style="color:#ccc;text-align:center;">Henüz haber eklenmemiş.</p>';
    return;
  }

  newsList.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).forEach(news => {
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
        <p>Tarih: ${new Date(news.createdDate).toLocaleDateString('tr-TR')} ${new Date(news.createdDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
        <p style="color: #ffa500; font-size: 12px;">⚠️ JSON dosyasını manuel güncellemeniz gerekiyor</p>
      </div>
      <div class="news-actions">
        <button onclick="deleteNewsBtn(${news.id})" class="delete-btn">Sil</button>
      </div>
    `;
    container.appendChild(item);
  });
}

async function deleteNewsBtn(id) {
  if (!confirm('Bu haberi silmek istediğinizden emin misiniz?')) return;
  if (window.dataManager) {
    await window.dataManager.deleteNewsFromLocal(id);
  } else {
    await deleteNews(id);
  }
  await loadNewsManager();
  alert('Haber silindi!');
}
