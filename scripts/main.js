// Loading screen and main app initialization
let musicIframe;
let isMusicPlaying = true;

// Loading info messages in different languages
const LOADING_INFO = {
  "en-US": [
    "Welcome to MSP2 Playground - Your ultimate modding destination",
    "Discover powerful tools to enhance your MSP2 experience",
    "Install custom mods with just one click using Violentmonkey",
    "Access exclusive features like Soft Shop, MOD, and Troll"
  ],
  "tr-TR": [
    "MSP2 Playground'a hoş geldiniz - En iyi modlama destinasyonunuz",
    "MSP2 deneyiminizi geliştiren güçlü araçları keşfedin",
    "Violentmonkey kullanarak tek tıkla özel modlar kurun",
    "Soft Shop, MOD ve Troll gibi özel özelliklere erişin"
  ],
  "de-DE": [
    "Willkommen im MSP2 Playground - Ihr ultimatives Modding-Ziel",
    "Entdecken Sie leistungsstarke Tools zur Verbesserung Ihres MSP2-Erlebnisses",
    "Installieren Sie benutzerdefinierte Mods mit nur einem Klick mit Violentmonkey",
    "Zugriff auf exklusive Funktionen wie Soft Shop, MOD und Troll"
  ],
  "fr-FR": [
    "Bienvenue sur MSP2 Playground - Votre destination de modding ultime",
    "Découvrez des outils puissants pour améliorer votre expérience MSP2",
    "Installez des mods personnalisés en un seul clic avec Violentmonkey",
    "Accédez à des fonctionnalités exclusives comme Soft Shop, MOD et Troll"
  ],
  "es-ES": [
    "Bienvenido a MSP2 Playground - Tu destino definitivo de modding",
    "Descubre herramientas poderosas para mejorar tu experiencia MSP2",
    "Instala mods personalizados con solo un clic usando Violentmonkey",
    "Accede a características exclusivas como Soft Shop, MOD y Troll"
  ]
};

document.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainContent = document.getElementById('mainContent');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const loadingInfo = document.getElementById('loadingInfo');

  musicIframe = document.getElementById('backgroundMusic');

  // Initialize background music
  if (musicIframe) {
    musicIframe.addEventListener('load', function() {
      setTimeout(() => {
        try {
          musicIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          setTimeout(() => {
            musicIframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
          }, 2000);
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

  // Show main content after 20 seconds
  setTimeout(() => {
    clearInterval(infoInterval);
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      mainContent.style.display = 'block';
      setTimeout(() => {
        mainContent.classList.add('show');
        // Load dynamic buttons after main content is shown
        loadDynamicButtons();
      }, 100);
    }, 1000);
  }, 10000);

  // Music control functionality
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

  // Check saved music state
  const musicMuted = localStorage.getItem('msp2_music_muted');
  if (musicMuted === 'true') {
    musicIcon.textContent = '🔇';
    musicToggle.classList.add('muted');
    isMusicPlaying = false;
  }

  // Initialize existing functionality
  initializeModals();
  initializeLanguageSystem();
});

// Dynamic Button Loading
async function openButtonDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("msp2ArcDB", 2);
    request.onupgradeneeded = function(e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("buttons")) {
        db.createObjectStore("buttons", { keyPath: "id" });
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

async function loadDynamicButtons() {
  try {
    const buttons = await getActiveButtons();
    const overlay = document.getElementById('mainOverlay');
    
    if (buttons.length > 0) {
      buttons.forEach(button => {
        const buttonElement = document.createElement('a');
        buttonElement.href = button.link;
        buttonElement.className = 'bookmark-btn dynamic-btn';
        buttonElement.textContent = button.name;
        buttonElement.target = '_blank';
        overlay.appendChild(buttonElement);
      });
    }
  } catch (error) {
    console.log('Could not load dynamic buttons:', error);
  }
}

// Modal functionality
function openModal(id) {
  document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function initializeModals() {
  document.getElementById('aboutBtn').onclick = () => openModal('aboutModal');
  document.getElementById('langBtn').onclick = () => openModal('langModal');
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

// Make modal functions global
window.openModal = openModal;
window.closeModal = closeModal;
