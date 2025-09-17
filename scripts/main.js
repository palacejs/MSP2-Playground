// Loading screen and main app initialization
let musicIframe;
let isMusicPlaying = true;

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

// GitHub news URL - you will upload your JSON file here
const GITHUB_NEWS_URL = 'https://raw.githubusercontent.com/lombard001/soft/refs/heads/main/news.json';

document.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainContent = document.getElementById('mainContent');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const loadingInfo = document.getElementById('loadingInfo');

  musicIframe = document.getElementById('backgroundMusic');

  // Check saved music state first
  const musicMuted = localStorage.getItem('msp2_music_muted');
  if (musicMuted === 'true') {
    isMusicPlaying = false;
    if (musicIcon) {
      musicIcon.textContent = '🔇';
      musicToggle.classList.add('muted');
    }
  }

  // Initialize background music
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

// Fetch news from GitHub
async function fetchNewsFromGitHub() {
  try {
    const response = await fetch(GITHUB_NEWS_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newsData = await response.json();
    return newsData;
  } catch (error) {
    console.error('Error fetching news from GitHub:', error);
    return null;
  }
}

async function loadNewsList() {
  try {
    const container = document.getElementById('newsList');
    if (!container) return;

    // Show loading state
    container.innerHTML = '<div class="loading-news">Loading news...</div>';

    const newsData = await fetchNewsFromGitHub();
    
    if (!newsData) {
      container.innerHTML = '<div class="news-error">Failed to load news. Please try again later.</div>';
      return;
    }

    container.innerHTML = '';
    
    // Create news item from the GitHub JSON
    const newsElement = document.createElement('div');
    newsElement.className = 'news-item';
    
    // Get translated title and content
    const translatedTitle = window.getTranslatedText(newsData.title, window.currentLang);
    const translatedContent = window.getTranslatedText(newsData.content, window.currentLang);
    
    // Break text at 40 characters for mobile readability
    const formattedTitle = window.breakTextAtLimit(translatedTitle, 40);
    const formattedContent = window.breakTextAtLimit(translatedContent, 40);
    
    newsElement.innerHTML = `
      <h4>${formattedTitle}</h4>
      <p>${formattedContent}</p>
      <div class="news-date">Latest Update</div>
    `;
    container.appendChild(newsElement);

  } catch (error) {
    console.log('Could not load news:', error);
    const container = document.getElementById('newsList');
    if (container) {
      container.innerHTML = '<div class="news-error">Failed to load news. Please try again later.</div>';
    }
  }
}

// Modal functionality with animation
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('show');
    
    if (id === 'newsModal') {
      loadNewsList();
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
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        const modalId = this.id;
        closeModal(modalId);
      }
    });
  });
}

function initializeLanguageSystem() {
  // Load saved language
  const savedLang = localStorage.getItem('msp2mods_lang');
  if (savedLang && window.TRANSLATIONS && window.TRANSLATIONS[savedLang]) {
    window.currentLang = savedLang;
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
  if (document.getElementById('musicToggle')) {
    document.getElementById('musicToggle').click();
  }
};

window.getMusicState = function() {
  return isMusicPlaying;
};

// Make functions global
window.openModal = openModal;
window.closeModal = closeModal;
window.loadNewsList = loadNewsList;
