// Music control for all pages
let musicIframe;
let isMusicPlaying = true;

document.addEventListener('DOMContentLoaded', function() {
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  
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

  // Check saved music state
  const musicMuted = localStorage.getItem('msp2_music_muted');
  if (musicMuted === 'true') {
    musicIcon.textContent = '🔇';
    musicToggle.classList.add('muted');
    isMusicPlaying = false;
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
});
