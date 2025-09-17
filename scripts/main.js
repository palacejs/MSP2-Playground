// Loading screen and main app initialization
let musicIframe;
let isMusicPlaying = true;
let musicVolume = 0.5;

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

  // Load saved settings
  const savedMusicMuted = localStorage.getItem('msp2_music_muted');
  const savedMusicVolume = localStorage.getItem('msp2_music_volume');
  
  if (savedMusicMuted === 'true') {
    isMusicPlaying = false;
    if (musicIcon) {
      musicIcon.textContent = '🔇';
      musicToggle.classList.add('muted');
    }
  }
  
  if (savedMusicVolume) {
    musicVolume = parseFloat(savedMusicVolume);
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
              setMusicVolume(musicVolume);
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
          setTimeout(() => setMusicVolume(musicVolume), 500);
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

  // Sound effects toggle
  const soundEffectsToggle = document.getElementById('soundEffectsToggle');
  const soundEffectsIcon = document.getElementById('soundEffectsIcon');
  
  if (soundEffectsToggle) {
    // Load saved state
    const soundEffectsEnabled = window.soundEffects.isSoundEffectsEnabled();
    if (!soundEffectsEnabled) {
      soundEffectsIcon.textContent = '🔕';
      soundEffectsToggle.classList.add('muted');
    }

    soundEffectsToggle.addEventListener('click', function() {
      const currentState = window.soundEffects.isSoundEffectsEnabled();
      const newState = !currentState;
      
      window.soundEffects.setSoundEffectsEnabled(newState);
      
      if (newState) {
        soundEffectsIcon.textContent = '🔔';
        soundEffectsToggle.classList.remove('muted');
      } else {
        soundEffectsIcon.textContent = '🔕';
        soundEffectsToggle.classList.add('muted');
      }
    });
  }

  // Sound settings modal
  const soundSettingsToggle = document.getElementById('soundSettingsToggle');
  if (soundSettingsToggle) {
    soundSettingsToggle.addEventListener('click', function() {
      openModal('soundSettingsModal');
      initSoundSettings();
    });
  }

  // Initialize existing functionality
  initializeModals();
  initializeMSP2ModsButton();
});

function setMusicVolume(volume) {
  if (musicIframe && isMusicPlaying) {
    try {
      const volumeLevel = Math.round(volume * 100);
      musicIframe.contentWindow.postMessage(`{"event":"command","func":"setVolume","args":"${volumeLevel}"}`, '*');
    } catch (e) {
      console.log('Music volume control not available');
    }
  }
}

function initSoundSettings() {
  const musicVolumeSlider = document.getElementById('musicVolume');
  const effectsVolumeSlider = document.getElementById('effectsVolume');
  const musicVolumeDisplay = document.getElementById('musicVolumeDisplay');
  const effectsVolumeDisplay = document.getElementById('effectsVolumeDisplay');
  const testSoundBtn = document.getElementById('testSoundBtn');

  if (musicVolumeSlider) {
    musicVolumeSlider.value = Math.round(musicVolume * 100);
    musicVolumeDisplay.textContent = Math.round(musicVolume * 100) + '%';
    
    musicVolumeSlider.addEventListener('input', function() {
      const volume = this.value / 100;
      musicVolume = volume;
      musicVolumeDisplay.textContent = this.value + '%';
      localStorage.setItem('msp2_music_volume', volume.toString());
      setMusicVolume(volume);
    });
  }

  if (effectsVolumeSlider) {
    const currentEffectsVolume = window.soundEffects.getEffectsVolume();
    effectsVolumeSlider.value = Math.round(currentEffectsVolume * 100);
    effectsVolumeDisplay.textContent = Math.round(currentEffectsVolume * 100) + '%';
    
    effectsVolumeSlider.addEventListener('input', function() {
      const volume = this.value / 100;
      window.soundEffects.setEffectsVolume(volume);
      effectsVolumeDisplay.textContent = this.value + '%';
    });
  }

  if (testSoundBtn) {
    testSoundBtn.addEventListener('click', function() {
      window.soundEffects.play('success');
    });
  }
}

// Modal functionality with enhanced animation
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    // Trigger animation
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
      modal.style.visibility = 'hidden';
    }, 400);
  }
}

function initializeModals() {
  const aboutBtn = document.getElementById('aboutBtn');
  if (aboutBtn) {
    aboutBtn.onclick = () => openModal('aboutModal');
  }

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

function initializeMSP2ModsButton() {
  const msp2ModsBtn = document.getElementById('msp2ModsBtn');
  if (msp2ModsBtn) {
    msp2ModsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal('msp2ModsModal');
    });
  }
}

// Global functions
window.toggleMusic = function() {
  if (document.getElementById('musicToggle')) {
    document.getElementById('musicToggle').click();
  }
};

window.getMusicState = function() {
  return isMusicPlaying;
};

window.openModal = openModal;
window.closeModal = closeModal;
