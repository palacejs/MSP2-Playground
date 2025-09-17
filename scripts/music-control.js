// Music control for all pages
let musicIframe;
let isMusicPlaying = true;
let musicVolume = 0.5;

document.addEventListener('DOMContentLoaded', function() {
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const soundEffectsToggle = document.getElementById('soundEffectsToggle');
  const soundEffectsIcon = document.getElementById('soundEffectsIcon');
  const soundSettingsToggle = document.getElementById('soundSettingsToggle');
  
  musicIframe = document.getElementById('backgroundMusic');

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
  if (soundEffectsToggle && window.soundEffects) {
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
  if (soundSettingsToggle) {
    soundSettingsToggle.addEventListener('click', function() {
      openModal('soundSettingsModal');
      initSoundSettings();
    });
  }
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

  if (effectsVolumeSlider && window.soundEffects) {
    const currentEffectsVolume = window.soundEffects.getEffectsVolume();
    effectsVolumeSlider.value = Math.round(currentEffectsVolume * 100);
    effectsVolumeDisplay.textContent = Math.round(currentEffectsVolume * 100) + '%';
    
    effectsVolumeSlider.addEventListener('input', function() {
      const volume = this.value / 100;
      window.soundEffects.setEffectsVolume(volume);
      effectsVolumeDisplay.textContent = this.value + '%';
    });
  }

  if (testSoundBtn && window.soundEffects) {
    testSoundBtn.addEventListener('click', function() {
      window.soundEffects.play('success');
    });
  }
}

// Modal functionality
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
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

// Make functions global
window.openModal = openModal;
window.closeModal = closeModal;
