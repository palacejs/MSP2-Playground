// Loading screen and main app initialization
let musicIframe;
let isMusicPlaying = true;
let countdownIntervals = [];

document.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainContent = document.getElementById('mainContent');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const loadingInfo = document.getElementById('loadingInfo');

  musicIframe = document.getElementById('backgroundMusic');

  // Apply current language to loading screen
  if (window.applyCurrentLanguage) {
    window.applyCurrentLanguage();
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

  // Show main content after 6 seconds
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      mainContent.style.display = 'block';
      setTimeout(() => {
        mainContent.classList.add('show');
        // Load dynamic buttons and news after main content is shown
        loadDynamicButtons();
      }, 100);
    }, 1000);
  }, 6000);

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

// Enhanced Dynamic Button Loading with better mobile support
async function openButtonDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("msp2ArcDB", 3);
    request.onupgradeneeded = function(e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("buttons")) {
        db.createObjectStore("buttons", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("news")) {
        db.createObjectStore("news", { keyPath: "id" });
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
    console.log('Button DB not available yet, waiting and retrying...');
    // Wait a bit and retry for mobile compatibility
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const buttons = await getActiveButtons();
          resolve(buttons);
        } catch (e) {
          console.log('Final retry failed, returning empty array');
          resolve([]);
        }
      }, 1000);
    });
  }
}

async function getAllNews() {
  try {
    const db = await openButtonDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("news", "readonly");
      const store = tx.objectStore("news");
      const request = store.getAll();
      request.onsuccess = () => {
        resolve(request.result.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)));
      };
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (error) {
    console.log('News DB not available yet, waiting and retrying...');
    // Wait a bit and retry for mobile compatibility
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const news = await getAllNews();
          resolve(news);
        } catch (e) {
          console.log('Final retry failed, returning empty array');
          resolve([]);
        }
      }, 1000);
    });
  }
}

function startCountdown(button, element) {
  const countdownTimer = element.querySelector('.countdown-timer');
  if (!countdownTimer || !button.expiryDate) return;
  
  const interval = setInterval(() => {
    const now = new Date().getTime();
    const expiryTime = new Date(button.expiryDate).getTime();
    const timeLeft = expiryTime - now;
    
    if (timeLeft <= 0) {
      clearInterval(interval);
      countdownTimer.textContent = 'Expired';
      element.style.opacity = '0.5';
      element.style.pointerEvents = 'none';
      // Reload buttons to remove expired ones
      setTimeout(loadDynamicButtons, 2000);
      return;
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    let timeString = '';
    if (days > 0) {
      timeString = `${days}d ${hours}h`;
    } else if (hours > 0) {
      timeString = `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      timeString = `${minutes}m ${seconds}s`;
    } else {
      timeString = `${seconds}s`;
    }
    
    countdownTimer.textContent = `⏱️ ${timeString}`;
  }, 1000);
  
  countdownIntervals.push(interval);
}

async function loadDynamicButtons() {
  try {
    // Clear existing countdowns
    countdownIntervals.forEach(interval => clearInterval(interval));
    countdownIntervals = [];

    console.log('Loading dynamic buttons...');
    const buttons = await getActiveButtons();
    console.log('Retrieved buttons:', buttons);
    
    const container = document.getElementById('dynamicButtons');
    
    if (buttons.length > 0 && container) {
      container.innerHTML = '';
      buttons.forEach(button => {
        console.log('Creating button:', button.name);
        const buttonElement = document.createElement('a');
        buttonElement.href = button.link;
        buttonElement.className = 'dynamic-btn';
        buttonElement.target = '_blank';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'dynamic-btn-text';
        textDiv.textContent = button.name;
        buttonElement.appendChild(textDiv);
        
        if (button.isTemporary) {
          const countdownDiv = document.createElement('div');
          countdownDiv.className = 'countdown-timer';
          countdownDiv.textContent = 'Loading...';
          buttonElement.appendChild(countdownDiv);
          
          setTimeout(() => startCountdown(button, buttonElement), 100);
        }
        
        container.appendChild(buttonElement);
      });
      
      // Ensure container is visible
      container.style.display = 'grid';
      console.log('Dynamic buttons loaded successfully');
    } else if (container) {
      container.innerHTML = '';
      container.style.display = 'grid'; // Keep grid layout even when empty
      console.log('No buttons found or container not available');
    }

    // Load button descriptions for about modal
    loadDynamicButtonDescriptions();
  } catch (error) {
    console.log('Could not load dynamic buttons:', error);
    // Retry after a delay for mobile
    setTimeout(loadDynamicButtons, 2000);
  }
}

async function loadDynamicButtonDescriptions() {
  try {
    const buttons = await getActiveButtons();
    const container = document.getElementById('dynamicButtonDescriptions');
    
    if (buttons.length > 0 && container) {
      let descriptionsHTML = '<h4 style="color: #6effb2; margin: 15px 0 10px 0;">Available Features:</h4><ul>';
      
      buttons.forEach(button => {
        if (button.description) {
          const translatedDescription = window.getTranslatedText(button.description, window.currentLang);
          if (translatedDescription && translatedDescription !== button.description) {
            descriptionsHTML += `<li><b>${translatedDescription}</b></li>`;
          } else {
            descriptionsHTML += `<li><b>${button.name}</b>: Custom feature</li>`;
          }
        } else {
          descriptionsHTML += `<li><b>${button.name}</b>: Custom feature</li>`;
        }
      });
      
      descriptionsHTML += '</ul>';
      container.innerHTML = descriptionsHTML;
    } else if (container) {
      container.innerHTML = '';
    }
  } catch (error) {
    console.log('Could not load button descriptions:', error);
  }
}

async function loadNewsList() {
  try {
    console.log('Loading news list...');
    const newsList = await getAllNews();
    console.log('Retrieved news:', newsList);
    
    const container = document.getElementById('newsList');
    
    if (newsList.length > 0 && container) {
      container.innerHTML = '';
      newsList.forEach(news => {
        console.log('Creating news item:', news);
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        
        // Get translated title and content
        const translatedTitle = window.getTranslatedText(news.title, window.currentLang);
        const translatedContent = window.getTranslatedText(news.content, window.currentLang);
        
        // Break text at 40 characters for mobile readability
        const formattedTitle = window.breakTextAtLimit(translatedTitle, 40);
        const formattedContent = window.breakTextAtLimit(translatedContent, 40);
        
        newsElement.innerHTML = `
          <h4>${formattedTitle}</h4>
          <p>${formattedContent}</p>
          <div class="news-date">${new Date(news.createdDate).toLocaleDateString('tr-TR')} ${new Date(news.createdDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        container.appendChild(newsElement);
      });
      console.log('News loaded successfully');
    } else if (container) {
      const trans = window.TRANSLATIONS && window.TRANSLATIONS[window.currentLang] ? window.TRANSLATIONS[window.currentLang] : window.TRANSLATIONS['en-US'];
      container.innerHTML = '<p style="color:#ccc;text-align:center;">No news available yet.</p>';
      console.log('No news found or container not available');
    }
  } catch (error) {
    console.log('Could not load news:', error);
    // Retry after a delay for mobile
    setTimeout(loadNewsList, 2000);
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
    } else if (id === 'aboutModal') {
      loadDynamicButtonDescriptions();
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
    if (window.applyCurrentLanguage) {
      window.applyCurrentLanguage();
    }
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
window.loadDynamicButtonDescriptions = loadDynamicButtonDescriptions;
window.loadNewsList = loadNewsList;
window.loadDynamicButtons = loadDynamicButtons;
