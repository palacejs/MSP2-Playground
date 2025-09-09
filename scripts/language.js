// Language system
const LANGUAGES = [
  { key: "en-US", flag: "🇺🇸", name: "United States" },
  { key: "en-CA", flag: "🇨🇦", name: "Canada" },
  { key: "en-GB", flag: "🇬🇧", name: "United Kingdom" },
  { key: "nl-NL", flag: "🇳🇱", name: "Netherlands" },
  { key: "en-IE", flag: "🇮🇪", name: "Ireland" },
  { key: "da-DK", flag: "🇩🇰", name: "Denmark" },
  { key: "fr-FR", flag: "🇫🇷", name: "France" },
  { key: "pl-PL", flag: "🇵🇱", name: "Poland" },
  { key: "sv-SE", flag: "🇸🇪", name: "Sweden" },
  { key: "no-NO", flag: "🇳🇴", name: "Norway" },
  { key: "fi-FI", flag: "🇫🇮", name: "Finland" },
  { key: "tr-TR", flag: "🇹🇷", name: "Türkiye" },
  { key: "es-ES", flag: "🇪🇸", name: "Spain" },
  { key: "de-DE", flag: "🇩🇪", name: "Germany" },
  { key: "en-AU", flag: "🇦🇺", name: "Australia" },
  { key: "en-NZ", flag: "🇳🇿", name: "New Zealand" },
];

const TRANSLATIONS = {
  "en-US": {
    aboutBtn: "About",
    langBtn: "Language",
    langTitle: "Select Language",
    aboutTitle: "About MSP2 MODS",
    subtext: `Now you can do everything comfortably with the improved tool.<br>
    If nothing happens, install <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> first.`,
    btnSoftShop: "Install MSP2 Soft Shop",
    btnMood: "Install MSP2 MOOD",
    btnTroll: "Install MSP2 Troll",
    btnArcMSP: "ARC MSP",
    info: "Info: These mods will no longer receive software updates or bug fixes starting from 15.09.2025, but you can continue to use them.",
    trollExpired: "MSP2 Troll license has expired.",
    about: `<p>
        MSP2 MODS is a platform that offers unique utility and customization tools ("mods") for MSP2. 
        The site allows you to install various mods, including Soft Shop, Mood, Troll, and ARC MSP, each providing different features to enhance your MSP2 experience.
      </p>
      <ul>
        <li><b>Soft Shop:</b> Adds extra shopping features for MSP2.</li>
        <li><b>MOOD:</b> Enables daily task completion and automatic dress up gameplay.</li>
        <li><b>Troll:</b> Provides fun, experimental features for MSP2.</li>
        <li><b>ARC MSP:</b> External advanced mod tools for MSP2.</li>
      </ul>
      <p>
        <b>How to use?</b> Click "Install" on any mod. If your browser doesn't respond, install <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> first.
      </p>
      <p>
        <b>Note:</b> MSP2 MODS will not receive updates after 15.09.2025, but all mods will remain available for use.
      </p>`
  },
  "tr-TR": {
    aboutBtn: "Hakkında",
    langBtn: "Dil",
    langTitle: "Dil Seç",
    aboutTitle: "MSP2 MODS Hakkında",
    subtext: `Artık geliştirilmiş araç ile her şeyi rahatça yapabilirsiniz.<br>
    Eğer bir şey olmuyorsa, önce <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> kurun.`,
    btnSoftShop: "MSP2 Soft Shop'u Kur",
    btnMood: "MSP2 MOOD'u Kur",
    btnTroll: "MSP2 Troll'u Kur",
    btnArcMSP: "ARC MSP",
    info: "Bilgi: Bu modlar 15.09.2025 itibarıyla yazılım güncellemesi veya hata düzeltmesi almayacaktır, ancak kullanmaya devam edebilirsiniz.",
    trollExpired: "MSP2 Troll lisans süresi doldu.",
    about: `<p>
      MSP2 MODS; MSP2 için özel modlar ve yardımcı araçlar sunan bir platformdur.<br>
      Sitede Soft Shop, Mood, Troll ve ARC MSP gibi çeşitli modları kurabilirsiniz. Her mod, MSP2 deneyiminizi geliştirmek için farklı özellikler sunar.
    </p>
    <ul>
      <li><b>Soft Shop:</b> MSP2'ye ek alışveriş özellikleri kazandırır.</li>
      <li><b>MOOD:</b> Günlük görev tamamlama ve otomatik dress up oynamanızı sağlar.</li>
      <li><b>Troll:</b> MSP2 için eğlenceli ve deneysel özellikler sağlar.</li>
      <li><b>ARC MSP:</b> MSP2 için harici gelişmiş mod araçlarıdır.</li>
    </ul>
    <p>
      <b>Nasıl kullanılır?</b> Herhangi bir modun "Kur" butonuna tıklayın. Tarayıcınız tepki vermezse önce <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> kurun.
    </p>
    <p>
      <b>Not:</b> MSP2 MODS 15.09.2025 sonrası güncelleme almayacaktır, fakat tüm modlar kullanılabilir kalacaktır.
    </p>`
  }
  // Add other translations here...
};

// Current language state
let currentLang = "en-US";

// Language functionality
function loadLanguage(langKey) {
  currentLang = langKey;
  const trans = TRANSLATIONS[langKey];
  if (!trans) return;

  // Update UI elements
  const elements = {
    'aboutBtnTxt': trans.aboutBtn,
    'langBtnTxt': trans.langBtn,
    'langTitle': trans.langTitle,
    'aboutTitle': trans.aboutTitle,
    'subtextMain': trans.subtext,
    'btnSoftShop': trans.btnSoftShop,
    'btnMood': trans.btnMood,
    'btnTroll': trans.btnTroll,
    'btnArcMSP': trans.btnArcMSP,
    'infoText': trans.info,
    'aboutText': trans.about
  };

  Object.keys(elements).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      if (id === 'subtextMain' || id === 'aboutText') {
        element.innerHTML = elements[id];
      } else {
        element.textContent = elements[id];
      }
    }
  });

  // Store in localStorage
  localStorage.setItem('msp2mods_lang', langKey);
  
  const langModal = document.getElementById('langModal');
  if (langModal) {
    langModal.style.display = 'none';
  }
}

function renderLanguageList() {
  const container = document.getElementById('langList');
  if (!container) return;
  
  container.innerHTML = '';
  
  LANGUAGES.forEach(lang => {
    const item = document.createElement('div');
    item.className = `lang-item ${lang.key === currentLang ? 'selected' : ''}`;
    item.innerHTML = `<span>${lang.flag}</span><span>${lang.name}</span>`;
    item.onclick = () => loadLanguage(lang.key);
    container.appendChild(item);
  });
}

// Make functions global for access from main.js
window.TRANSLATIONS = TRANSLATIONS;
window.currentLang = currentLang;
window.loadLanguage = loadLanguage;
window.renderLanguageList = renderLanguageList;
