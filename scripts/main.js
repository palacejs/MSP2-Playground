// Loading screen and main app initialization
let musicIframe;
let isMusicPlaying = true;
let countdownIntervals = [];

// Loading info messages in different languages
const LOADING_INFO = {
  "en-US": [
    "Welcome to MSP2 Playground - Your ultimate modding destination",
    "Discover powerful tools to enhance your MSP2 experience",
    "Install custom mods with just one click using Violentmonkey",
    "Access exclusive features and enhancements"
  ],
  "tr-TR": [
    "MSP2 Playground'a hoş geldiniz - En iyi modlama destinasyonunuz",
    "MSP2 deneyiminizi geliştiren güçlü araçları keşfedin",
    "Violentmonkey kullanarak tek tıkla özel modlar kurun",
    "Özel özelliklere ve geliştirmelere erişin"
  ],
  "de-DE": [
    "Willkommen im MSP2 Playground - Ihr ultimatives Modding-Ziel",
    "Entdecken Sie leistungsstarke Tools zur Verbesserung Ihres MSP2-Erlebnisses",
    "Installieren Sie benutzerdefinierte Mods mit nur einem Klick mit Violentmonkey",
    "Zugriff auf exklusive Funktionen und Verbesserungen"
  ],
  "fr-FR": [
    "Bienvenue sur MSP2 Playground - Votre destination de modding ultime",
    "Découvrez des outils puissants pour améliorer votre expérience MSP2",
    "Installez des mods personnalisés en un seul clic avec Violentmonkey",
    "Accédez à des fonctionnalités et améliorations exclusives"
  ],
  "es-ES": [
    "Bienvenido a MSP2 Playground - Tu destino definitivo de modding",
    "Descubre herramientas poderosas para mejorar tu experiencia MSP2",
    "Instala mods personalizados con solo un clic usando Violentmonkey",
    "Accede a características y mejoras exclusivas"
  ]
};

document.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainContent = document.getElementById('mainContent');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const loadingInfo = document.getElementById('loadingInfo');

  musicIframe = document.getElementById('backgroundMusic');

  // Check saved music state FIRST before initializing music
  const musicMuted = localStorage.getItem('msp2_music_muted');
  if (musicMuted === 'true') {
    isMusicPlaying = false;
    if (musicIcon) {
      musicIcon.textContent = '🔇';
    }
    if (musicToggle) {
      musicToggle.classList.add('muted');
    }
  }

  // Initialize background music only if not muted
  if (musicIframe) {
    musicIframe.addEventListener('load', function() {
      setTimeout(() => {
        try {
          if (isMusicPlaying) {
            musicIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            setTimeout(() => {
              musicIframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
            }, 2000);
          } else {
            musicIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          }
        } catch (e) {
          console.log('Music control not available');
        }
      }, 1000);
    });
  }

  // Loading info rotation
  let infoIndex = 0;
  let currentLangMessages = LOADING_INFO["en-US"];

  // Select random language for loading info
  const languages = Object.keys(LOADING_INFO);
  const randomLang = languages[Math.floor(Math.random() * languages.length)];
  currentLangMessages = LOADING_INFO[randomLang];

  function updateLoadingInfo() {
    if (loadingInfo && currentLangMessages) {
      loadingInfo.style.opacity = '0';
      setTimeout(() => {
        loadingInfo.textContent = currentLangMessages[infoIndex];
        loadingInfo.style.opacity = '1';
        infoIndex = (infoIndex + 1) % currentLangMessages.length;
      }, 250);
    }
  }

  // Start loading info rotation
  updateLoadingInfo();
  const infoInterval = setInterval(updateLoadingInfo, 3000);

  // Show main content after 10 seconds
  setTimeout(() => {
    clearInterval(infoInterval);
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      mainContent.style.display = 'block';
      setTimeout(() => {
        mainContent.classList.add('show');
        // Load dynamic buttons and news after main content is shown
        loadDynamicButtons();
      }, 100);
    }, 1000);
  }, 10000);

  // Music control functionality
  if (musicToggle) {
    musicToggle.addEventListener('click', function() {
      if (isMusicPlaying) {
        try {
          musicIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } catch (e) {
          console.log('Music control not available');
        }
        musicIcon.textContent = '🔇';
        musicToggle.classList.add('muted');
        isMusicPlaying = false;
        localStorage.setItem('msp2_music_muted', 'true');
      } else {
        try {
          musicIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } catch (e) {
          console.log('Music control not available');
        }
        musicIcon.textContent = '🔊';
        musicToggle.classList.remove('muted');
        isMusicPlaying = true;
        localStorage.setItem('msp2_music_muted', 'false');
      }
    });
  }

  // Initialize existing functionality
  initializeModals();
  initializeLanguageSystem();
});

// Dynamic Button Loading
async function openButtonDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("msp2ArcDB", 3);
    request.onupgradeneeded = function(e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("buttons")) {
        db.createObjectStore("buttons", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("news")) {
        db.createObjectStore("news", { keyPath: "id" });
      }
    };
    request.onsuccess = function(e) {
      resolve(e.target.result);
    };
    request.onerror = function(e) {
      reject(e.target.error);
    };
  });
}

async function getActiveButtons() {
  try {
    const db = await openButtonDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("buttons", "readonly");
      const store = tx.objectStore("buttons");
      const request = store.getAll();
      request.onsuccess = () => {
        const buttons = request.result.filter(button => {
          if (button.hidden) return false;
          if (button.isTemporary) {
            const now = new Date();
            const expiryDate = new Date(button.expiryDate);
            return expiryDate >= now;
          }
          return true;
        });
        resolve(buttons);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (error) {
    console.log('Button DB not available yet');
    return [];
  }
}

async function getAllNews() {
  try {
    const db = await openButtonDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("news", "readonly");
      const store = tx.objectStore("news");
      const request = store.getAll();
      request.onsuccess = () => {
        resolve(request.result.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)));
      };
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (error) {
    console.log('News DB not available yet');
    return [];
  }
}

function startCountdown(button, element) {
  const countdownTimer = element.querySelector('.countdown-timer');
  if (!countdownTimer || !button.expiryDate) return;
  
  const interval = setInterval(() => {
    const now = new Date().getTime();
    const expiryTime = new Date(button.expiryDate).getTime();
    const timeLeft = expiryTime - now;
    
    if (timeLeft <= 0) {
      clearInterval(interval);
      countdownTimer.textContent = 'Expired';
      element.style.opacity = '0.5';
      element.style.pointerEvents = 'none';
      // Reload buttons to remove expired ones
      setTimeout(loadDynamicButtons, 2000);
      return;
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    let timeString = '';
    if (days > 0) {
      timeString = `${days}d ${hours}h`;
    } else if (hours > 0) {
      timeString = `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      timeString = `${minutes}m ${seconds}s`;
    } else {
      timeString = `${seconds}s`;
    }
    
    countdownTimer.textContent = `⏱️ ${timeString}`;
  }, 1000);
  
  countdownIntervals.push(interval);
}

// Break text into lines if it's too long (40 characters per line)
function breakLongText(text, maxLength = 40) {
  if (typeof text !== 'string') return text;
  
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  return lines.join('\n');
}

// Get translated text based on current language
function getTranslatedText(textObj, fallback = '') {
  if (typeof textObj === 'string') {
    try {
      textObj = JSON.parse(textObj);
    } catch (e) {
      return textObj;
    }
  }
  
  if (typeof textObj === 'object' && textObj !== null) {
    const currentLang = window.currentLang || 'en-US';
    return textObj[currentLang] || textObj['en-US'] || fallback;
  }
  
  return fallback;
}

async function loadDynamicButtons() {
  try {
    // Clear existing countdowns
    countdownIntervals.forEach(interval => clearInterval(interval));
    countdownIntervals = [];

    const buttons = await getActiveButtons();
    const container = document.getElementById('dynamicButtons');
    
    if (buttons.length > 0) {
      container.innerHTML = '';
      buttons.forEach(button => {
        const buttonElement = document.createElement('a');
        buttonElement.href = button.link;
        buttonElement.className = 'dynamic-btn';
        buttonElement.target = '_blank';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'dynamic-btn-text';
        // Break long button names into multiple lines for mobile
        textDiv.textContent = breakLongText(button.name, 25);
        buttonElement.appendChild(textDiv);
        
        if (button.isTemporary) {
          const countdownDiv = document.createElement('div');
          countdownDiv.className = 'countdown-timer';
          countdownDiv.textContent = 'Loading...';
          buttonElement.appendChild(countdownDiv);
          
          setTimeout(() => startCountdown(button, buttonElement), 100);
        }
        
        container.appendChild(buttonElement);
      });
    } else {
      container.innerHTML = '';
    }

    // Load button descriptions for about modal
    loadDynamicButtonDescriptions();
  } catch (error) {
    console.log('Could not load dynamic buttons:', error);
  }
}

async function loadDynamicButtonDescriptions() {
  try {
    const buttons = await getActiveButtons();
    const container = document.getElementById('dynamicButtonDescriptions');
    
    if (buttons.length > 0 && container) {
      let descriptionsHTML = '<h4 style="color: #6effb2; margin: 15px 0 10px 0;">Available Features:</h4><ul>';
      
      buttons.forEach(button => {
        if (button.description) {
          const description = getTranslatedText(button.description, button.name);
          descriptionsHTML += `<li><b>${button.name}</b>: ${description}</li>`;
        } else {
          descriptionsHTML += `<li><b>${button.name}</b>: Custom feature</li>`;
        }
      });
      
      descriptionsHTML += '</ul>';
      container.innerHTML = descriptionsHTML;
    } else if (container) {
      container.innerHTML = '';
    }
  } catch (error) {
    console.log('Could not load button descriptions:', error);
  }
}

async function loadNewsList() {
  try {
    const newsList = await getAllNews();
    const container = document.getElementById('newsList');
    
    if (newsList.length > 0 && container) {
      container.innerHTML = '';
      newsList.forEach(news => {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        
        // Get translated title and content
        const translatedTitle = getTranslatedText(news.title, news.title);
        const translatedContent = getTranslatedText(news.content, news.content);
        
        // Break long content into lines
        const formattedContent = breakLongText(translatedContent, 40);
        
        newsElement.innerHTML = `
          <h4>${translatedTitle}</h4>
          <p>${formattedContent}</p>
          <div class="news-date">${new Date(news.createdDate).toLocaleDateString('tr-TR')} ${new Date(news.createdDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        container.appendChild(newsElement);
      });
    } else if (container) {
      const currentLang = window.currentLang || 'en-US';
      const noNewsText = currentLang === 'tr-TR' ? 'Henüz haber bulunmamaktadır.' : 
                        currentLang === 'de-DE' ? 'Noch keine Nachrichten verfügbar.' :
                        currentLang === 'fr-FR' ? 'Aucune actualité disponible pour le moment.' :
                        currentLang === 'es-ES' ? 'No hay noticias disponibles aún.' :
                        'No news available yet.';
      container.innerHTML = `<p style="color:#ccc;text-align:center;">${noNewsText}</p>`;
    }
  } catch (error) {
    console.log('Could not load news:', error);
  }
}

// Modal functionality with animations
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'block';
    // Force reflow
    modal.offsetHeight;
    modal.classList.add('show');
    
    if (id === 'newsModal') {
      loadNewsList();
    } else if (id === 'aboutModal') {
      loadDynamicButtonDescriptions();
    }
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
}

function initializeModals() {
  document.getElementById('aboutBtn').onclick = () => openModal('aboutModal');
  document.getElementById('newsBtn').onclick = () => openModal('newsModal');
  document.getElementById('langBtn').onclick = () => openModal('langModal');
  
  // Close modals when clicking outside
  document.querySelectorAll('.modal-bg').forEach(modalBg => {
    modalBg.addEventListener('click', function(e) {
      if (e.target === this) {
        const modalId = this.parentElement.id;
        closeModal(modalId);
      }
    });
  });
}

function initializeLanguageSystem() {
  // Load saved language
  const savedLang = localStorage.getItem('msp2mods_lang');
  if (savedLang && window.TRANSLATIONS && window.TRANSLATIONS[savedLang]) {
    window.loadLanguage(savedLang);
  }

  if (window.renderLanguageList) {
    window.renderLanguageList();
  }

  // Language button handler
  document.getElementById('langBtn').onclick = () => {
    if (window.renderLanguageList) {
      window.renderLanguageList();
    }
    openModal('langModal');
  };
}

// Global music control functions
window.toggleMusic = function() {
  document.getElementById('musicToggle').click();
};

window.getMusicState = function() {
  return isMusicPlaying;
};

// Make functions global
window.openModal = openModal;
window.closeModal = closeModal;
window.loadDynamicButtonDescriptions = loadDynamicButtonDescriptions;
window.loadDynamicButtons = loadDynamicButtons;
window.loadNewsList = loadNewsList;
