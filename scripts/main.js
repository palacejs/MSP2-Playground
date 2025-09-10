// Loading screen and main app initialization
let musicIframe;
let isMusicPlaying = true;

document.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainContent = document.getElementById('mainContent');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  
  musicIframe = document.getElementById('backgroundMusic');

  // --- OYNATMAK İÇİN: autoplay & mute ekle ---
  if (musicIframe) {
    // iframe src'sine mute parametresi ekle
    if (!musicIframe.src.includes("mute=1")) {
      musicIframe.src += "&mute=1";
    }

    musicIframe.addEventListener('load', function() {
      // iframe yüklenince play komutu gönder
      musicIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');

      // 2 saniye sonra sesi aç
      setTimeout(() => {
        musicIframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
      }, 2000);
    });
  }

  // Show main content after 20 seconds
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      mainContent.style.display = 'block';
      setTimeout(() => {
        mainContent.classList.add('show');
      }, 100);
    }, 1000);
  }, 20000);

  // Music control functionality
  musicToggle.addEventListener('click', function() {
    if (isMusicPlaying) {
      musicIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      musicIcon.textContent = '🔇';
      musicToggle.classList.add('muted');
      isMusicPlaying = false;
    } else {
      musicIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      musicIcon.textContent = '🔊';
      musicToggle.classList.remove('muted');
      isMusicPlaying = true;
    }
  });

  // Initialize existing functionality
  initializeModals();
  initializeLanguageSystem();
});

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
