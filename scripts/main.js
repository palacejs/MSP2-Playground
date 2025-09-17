// Loading screen and main app initialization
let musicIframe;
let isMusicPlaying = true;

// Yükleme bilgi mesajları (Sadece Türkçe)
const LOADING_INFO = {
  "tr-TR": [
    "MSP2 Playground'a hoş geldiniz - En iyi modlama destinasyonunuz",
    "MSP2 deneyiminizi geliştiren güçlü araçları keşfedin",
    "Violentmonkey kullanarak tek tıkla özel modlar kurun",
    "Özel özelliklere ve geliştirmelere erişin"
  ]
};

document.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainContent = document.getElementById('mainContent');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const loadingInfo = document.getElementById('loadingInfo');

  musicIframe = document.getElementById('backgroundMusic');

  // Yükleme animasyonunu sadece bir kere göster
  const hasIntroPlayed = sessionStorage.getItem('msp2_intro_played');

  if (hasIntroPlayed === 'true') {
    loadingScreen.style.display = 'none';
    mainContent.style.display = 'block';
    mainContent.classList.add('show');
    // Müzik durumunu manuel olarak senkronize et
    const musicMuted = localStorage.getItem('msp2_music_muted');
    if (musicMuted === 'true') {
      isMusicPlaying = false;
      if (musicIcon) {
        musicIcon.textContent = '🔇';
        musicToggle.classList.add('muted');
      }
    } else {
       // Müzik çalınıyorsa ve iframe yüklüyse oynatmayı dene
       if (musicIframe) {
           musicIframe.addEventListener('load', function() {
              try {
                  musicIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                  setTimeout(() => {
                      musicIframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                  }, 2000);
              } catch (e) {
                  console.log('Müzik kontrolü mevcut değil (intro atlandı).');
              }
           });
       }
    }
  } else {
    // Açılış animasyonunu oynat ve durumu kaydet
    sessionStorage.setItem('msp2_intro_played', 'true');

    // Müzik durumunu kontrol et
    const musicMuted = localStorage.getItem('msp2_music_muted');
    if (musicMuted === 'true') {
      isMusicPlaying = false;
      if (musicIcon) {
        musicIcon.textContent = '🔇';
        musicToggle.classList.add('muted');
      }
    }

    // Müzik arka planını başlat
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
            console.log('Müzik kontrolü mevcut değil.');
          }
        }, 1000);
      });
    }

    // Yükleme bilgisi döndürme
    let infoIndex = 0;
    let currentLangMessages = LOADING_INFO["tr-TR"];

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

    // Yükleme bilgisi döndürmeyi başlat
    updateLoadingInfo();
    const infoInterval = setInterval(updateLoadingInfo, 3000);

    // Ana içeriği 10 saniye sonra göster
    setTimeout(() => {
      clearInterval(infoInterval);
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainContent.style.display = 'block';
        setTimeout(() => {
          mainContent.classList.add('show');
          // Statik butonlar index.html içinde olduğu için ayrıca yüklemeye gerek yok
        }, 100);
      }, 1000);
    }, 10000); // Açılış animasyonu süresi
  }


  // Müzik kontrol fonksiyonelliği
  if (musicToggle) {
    musicToggle.addEventListener('click', function() {
      if (isMusicPlaying) {
        try {
          musicIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } catch (e) {
          console.log('Müzik kontrolü mevcut değil.');
        }
        musicIcon.textContent = '🔇';
        musicToggle.classList.add('muted');
        isMusicPlaying = false;
        localStorage.setItem('msp2_music_muted', 'true');
      } else {
        try {
          musicIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } catch (e) {
          console.log('Müzik kontrolü mevcut değil.');
        }
        musicIcon.textContent = '🔊';
        musicToggle.classList.remove('muted');
        isMusicPlaying = true;
        localStorage.setItem('msp2_music_muted', 'false');
      }
    });
  }

  // Mevcut işlevleri başlat
  initializeModals();
  initializeLanguageSystem();
});

// Artık dinamik butonları veya haberleri IndexedDB'den yüklememize gerek yok.
// İlgili fonksiyonlar kaldırıldı.

// Modal işlevselliği (animasyonlu)
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('show');
    
    // Haber ve Hakkında modallarının içeriği artık statik.
    // Haber modalı için statik bir mesaj gösterebiliriz.
    if (id === 'newsModal') {
      const newsListContainer = document.getElementById('newsList');
      if (newsListContainer) {
          newsListContainer.innerHTML = '<p style="color:#ccc;text-align:center;">Henüz haber mevcut değil.</p>';
      }
    }
    // Hakkında modalı için içeriği zaten HTML içinde güncelledik.
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

  // Modalları dışarı tıklayınca kapat
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
  // Kayıtlı dil yükleniyor (Her zaman Türkçe olacak şekilde basitleştirildi)
  window.currentLang = "tr-TR";
  if (window.loadLanguage) {
    window.loadLanguage("tr-TR");
  }

  if (window.renderLanguageList) {
    window.renderLanguageList(); // Sadece Türkçe seçeneğini listeler
  }

  // Dil butonu handler
  document.getElementById('langBtn').onclick = () => {
    if (window.renderLanguageList) {
      window.renderLanguageList();
    }
    openModal('langModal');
  };
}

// Global müzik kontrol fonksiyonları
window.toggleMusic = function() {
  if (document.getElementById('musicToggle')) {
    document.getElementById('musicToggle').click();
  }
};

window.getMusicState = function() {
  return isMusicPlaying;
};

// Fonksiyonları global yap
window.openModal = openModal;
window.closeModal = closeModal;
// Kaldırılan loadDynamicButtonDescriptions ve loadNewsList kaldırıldı
