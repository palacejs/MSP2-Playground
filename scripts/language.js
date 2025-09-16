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
    newsBtn: "News",
    langTitle: "Select Language",
    aboutTitle: "About MSP2 MODS",
    newsTitle: "News & Updates",
    loadingWelcome: "Welcome to MSP2 Playground - Your ultimate modding destination",
    subtext: `Now you can do everything comfortably with the improved tool.<br>
    If nothing happens, install <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> first.`,
    info: "Info: These mods will no longer receive software updates or bug fixes starting from 15.09.2025, but you can continue to use them.",
    trollExpired: "MSP2 Troll license has expired.",
    about: `<p>
        MSP2 MODS is a platform that offers unique utility and customization tools ("mods") for MSP2. 
        The site allows you to install various mods to enhance your MSP2 experience.
      </p>
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
    newsBtn: "Haberler",
    langTitle: "Dil Seç", 
    aboutTitle: "MSP2 MODS Hakkında",
    newsTitle: "Haberler & Güncellemeler",
    loadingWelcome: "MSP2 Playground'a hoş geldiniz - En iyi modlama destinasyonunuz",
    subtext: `Artık geliştirilmiş araç ile her şeyi rahatça yapabilirsiniz.<br>
    Eğer bir şey olmuyorsa, önce <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> kurun.`,
    info: "Bilgi: Bu modlar 15.09.2025 itibarıyla yazılım güncellemesi veya hata düzeltmesi almayacaktır, ancak kullanmaya devam edebilirsiniz.",
    trollExpired: "MSP2 Troll lisans süresi doldu.",
    about: `<p>
      MSP2 MODS; MSP2 için özel modlar ve yardımcı araçlar sunan bir platformdur.
      Sitede çeşitli modları kurarak MSP2 deneyiminizi geliştirebilirsiniz.
    </p>
    <p>
      <b>Nasıl kullanılır?</b> Herhangi bir modun "Kur" butonuna tıklayın. Tarayıcınız tepki vermezse önce <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> kurun.
    </p>
    <p>
      <b>Not:</b> MSP2 MODS 15.09.2025 sonrası güncelleme almayacaktır, fakat tüm modlar kullanılabilir kalacaktır.
    </p>`
  },
  "de-DE": {
    aboutBtn: "Über",
    langBtn: "Sprache",
    newsBtn: "Nachrichten",
    langTitle: "Sprache auswählen", 
    aboutTitle: "Über MSP2 MODS",
    newsTitle: "Nachrichten & Updates",
    loadingWelcome: "Willkommen im MSP2 Playground - Ihr ultimatives Modding-Ziel",
    subtext: `Jetzt können Sie alles bequem mit dem verbesserten Tool machen.<br>
    Falls nichts passiert, installieren Sie zuerst <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.`,
    info: "Info: Diese Mods erhalten ab dem 15.09.2025 keine Software-Updates oder Fehlerbehebungen mehr, aber Sie können sie weiterhin verwenden.",
    trollExpired: "MSP2 Troll Lizenz ist abgelaufen.",
    about: `<p>
        MSP2 MODS ist eine Plattform, die einzigartige Hilfsprogramme und Anpassungstools ("Mods") für MSP2 bietet. 
        Die Seite ermöglicht es Ihnen, verschiedene Mods zu installieren, um Ihr MSP2-Erlebnis zu verbessern.
      </p>
      <p>
        <b>Wie verwenden?</b> Klicken Sie bei jedem Mod auf "Installieren". Falls Ihr Browser nicht reagiert, installieren Sie zuerst <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.
      </p>
      <p>
        <b>Hinweis:</b> MSP2 MODS erhält nach dem 15.09.2025 keine Updates mehr, aber alle Mods bleiben weiterhin verfügbar.
      </p>`
  },
  "fr-FR": {
    aboutBtn: "À propos",
    langBtn: "Langue",
    newsBtn: "Actualités", 
    langTitle: "Choisir la langue",
    aboutTitle: "À propos de MSP2 MODS",
    newsTitle: "Actualités & Mises à jour",
    loadingWelcome: "Bienvenue sur MSP2 Playground - Votre destination de modding ultime",
    subtext: `Vous pouvez désormais tout faire facilement avec l'outil amélioré.<br>
    Si rien ne se passe, installez d'abord <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.`,
    info: "Info : À partir du 15.09.2025, ces mods ne recevront plus de mises à jour ou de corrections, mais vous pouvez continuer à les utiliser.",
    trollExpired: "La licence MSP2 Troll a expiré.",
    about: `<p>
        MSP2 MODS est une plateforme proposant des outils uniques et de personnalisation ("mods") pour MSP2.
        Vous pouvez installer plusieurs mods pour améliorer votre expérience MSP2.
      </p>
      <p>
        <b>Comment utiliser ?</b> Cliquez sur "Installer" pour un mod. Si le navigateur ne réagit pas, installez d'abord <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.
      </p>
      <p>
        <b>Note :</b> MSP2 MODS ne recevra plus de mises à jour après le 15.09.2025 mais les mods resteront disponibles.
      </p>`
  },
  "es-ES": {
    aboutBtn: "Acerca de",
    langBtn: "Idioma",
    newsBtn: "Noticias", 
    langTitle: "Seleccionar idioma",
    aboutTitle: "Acerca de MSP2 MODS",
    newsTitle: "Noticias & Actualizaciones",
    loadingWelcome: "Bienvenido a MSP2 Playground - Tu destino definitivo de modding",
    subtext: `Ahora puedes hacer todo cómodamente con la herramienta mejorada.<br>
    Si no pasa nada, instala primero <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.`,
    info: "Info: Estos mods ya no recibirán actualizaciones de software o correcciones de errores a partir del 15.09.2025, pero puedes seguir usándolos.",
    trollExpired: "La licencia de MSP2 Troll ha expirado.",
    about: `<p>
        MSP2 MODS es una plataforma que ofrece herramientas únicas de utilidad y personalización ("mods") para MSP2. 
        El sitio te permite instalar varios mods para mejorar tu experiencia MSP2.
      </p>
      <p>
        <b>¿Cómo usar?</b> Haz clic en "Instalar" en cualquier mod. Si tu navegador no responde, instala primero <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.
      </p>
      <p>
        <b>Nota:</b> MSP2 MODS no recibirá actualizaciones después del 15.09.2025, pero todos los mods permanecerán disponibles para usar.
      </p>`
  }
};

// Current language state
let currentLang = localStorage.getItem('msp2mods_lang') || "en-US";

// Utility function to parse JSON safely
function parseJSONSafely(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
}

// Utility function to get translated text from JSON or fallback
function getTranslatedText(jsonOrString, targetLang = null) {
  const lang = targetLang || currentLang;
  
  if (typeof jsonOrString === 'string') {
    const parsed = parseJSONSafely(jsonOrString);
    if (parsed && typeof parsed === 'object') {
      return parsed[lang] || parsed['en-US'] || jsonOrString;
    }
    return jsonOrString;
  }
  
  if (typeof jsonOrString === 'object' && jsonOrString !== null) {
    return jsonOrString[lang] || jsonOrString['en-US'] || '';
  }
  
  return jsonOrString || '';
}

// Utility function to break text at specified character limit
function breakTextAtLimit(text, limit = 40) {
  if (!text || text.length <= limit) return text;
  
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + word).length > limit) {
      if (currentLine) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        lines.push(word);
        currentLine = '';
      }
    } else {
      currentLine += word + ' ';
    }
  }
  
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }
  
  return lines.join('<br>');
}

// Language functionality - NOW WITH PAGE RELOAD
function loadLanguage(langKey) {
  currentLang = langKey;
  
  // Store in localStorage
  localStorage.setItem('msp2mods_lang', langKey);
  
  // Close modal first
  const langModal = document.getElementById('langModal');
  if (langModal && window.closeModal) {
    window.closeModal('langModal');
  }
  
  // RELOAD THE PAGE to apply language changes everywhere
  setTimeout(() => {
    window.location.reload();
  }, 300);
}

function applyCurrentLanguage() {
  const trans = TRANSLATIONS[currentLang] || TRANSLATIONS['en-US'];

  // Update UI elements
  const elements = {
    'aboutBtnTxt': trans.aboutBtn,
    'langBtnTxt': trans.langBtn, 
    'newsBtnTxt': trans.newsBtn,
    'langTitle': trans.langTitle,
    'aboutTitle': trans.aboutTitle,
    'newsTitle': trans.newsTitle,
    'subtextMain': trans.subtext,
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

  // Update loading screen text if visible
  const loadingInfo = document.getElementById('loadingInfo');
  if (loadingInfo) {
    loadingInfo.textContent = trans.loadingWelcome;
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

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
  // Apply current language immediately
  applyCurrentLanguage();
  
  // Render language list
  renderLanguageList();
});

// Make functions global for access from other scripts
window.TRANSLATIONS = TRANSLATIONS;
window.currentLang = currentLang;
window.loadLanguage = loadLanguage;
window.renderLanguageList = renderLanguageList;
window.getTranslatedText = getTranslatedText;
window.parseJSONSafely = parseJSONSafely;
window.breakTextAtLimit = breakTextAtLimit;
window.applyCurrentLanguage = applyCurrentLanguage;
