// Music control for all pages
let musicIframe;
let isMusicPlaying = true;

document.addEventListener('DOMContentLoaded', function() {
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  
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
