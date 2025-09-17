// Loading screen and main app initialization
let musicIframe;
let isMusicPlaying = true;

// Turkish loading info messages
const LOADING_INFO = [
  "MSP2 Playground'a hoş geldiniz - En iyi modlama destinasyonunuz",
  "MSP2 deneyiminizi geliştiren güçlü araçları keşfedin",
  "Violentmonkey kullanarak tek tıkla özel modlar kurun",
  "Özel özelliklere ve geliştirmelere erişin"
];

document.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainContent = document.getElementById('mainContent');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const loadingInfo = document.getElementById('loadingInfo');

  musicIframe = document.getElementById('backgroundMusic');

  // Check if loading animation should be shown
  const hasSeenLoading = sessionStorage.getItem('msp2_seen_loading');
  
  if (hasSeenLoading) {
    // Skip loading animation
    loadingScreen.style.display = 'none';
    mainContent.style.display = 'block';
    mainContent.classList.add('show');
  } else {
    // Show loading animation and mark as seen
    sessionStorage.setItem('msp2_seen_loading', 'true');
    
    // Loading info rotation
    let infoIndex = 0;
    
    function updateLoadingInfo() {
      if (loadingInfo) {
        loadingInfo.style.opacity = '0';
        setTimeout(() => {
          loadingInfo.textContent = LOADING_INFO[infoIndex];
          loadingInfo.style.opacity = '1';
          infoIndex = (infoIndex + 1) % LOADING_INFO.length;
        }, 250);
      }
    }

    // Start loading info rotation
    updateLoadingInfo();
    const infoInterval = setInterval(updateLoadingInfo, 3000);

    // Show main content after 8 seconds
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
    }, 8000);
  }

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
});

// Modal functionality with animation
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('show');
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
