// Loading screen and main app initialization
let musicIframe;
let isMusicPlaying = true;

document.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainContent = document.getElementById('mainContent');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  
  musicIframe = document.getElementById('backgroundMusic');

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
      // Mute music (hide iframe)
      musicIframe.style.display = 'none';
      musicIcon.textContent = '🔇';
      musicToggle.classList.add('muted');
      isMusicPlaying = false;
    } else {
      // Unmute music (show iframe)
      musicIframe.style.display = 'none'; // Keep hidden but reload
      musicIframe.src = musicIframe.src; // Reload to restart
      musicIcon.textContent = '🔊';
      musicToggle.classList.remove('muted');
      isMusicPlaying = true;
    }
  });

  // Initialize existing functionality
  initializeModals();
  initializeTrollButton();
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

// Troll button notification
function initializeTrollButton() {
  document.getElementById('btnTroll').addEventListener('click', function(e) {
    e.preventDefault();
    showTrollNotification();
  });
}

function showTrollNotification() {
  const notification = document.getElementById('trollNotification');
  const notificationText = document.getElementById('trollNotificationText');
  
  // Get current language translation
  const translations = window.TRANSLATIONS ? window.TRANSLATIONS[window.currentLang || 'en-US'] : null;
  if (translations) {
    notificationText.textContent = translations.trollExpired;
  }
  
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 5000);
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
