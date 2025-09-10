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
    shopBtn: "Shop",
    langTitle: "Select Language",
    aboutTitle: "About MSP2 MODS",
    shopTitle: "SHOP",
    licenseTitle: "License for MSP2 Troll",
    buyBtn: "Buy",
    purchaseTitle: "Purchase Form",
    emailLabel: "Email:",
    usernameLabel: "Username:",
    paymentLabel: "Payment Method:",
    cardNumberLabel: "Card Number:",
    expiryLabel: "Expiry Date:",
    cvvLabel: "CVV:",
    invoiceTitle: "Invoice",
    productName: "MSP2 Troll License",
    totalLabel: "Total:",
    backBtn: "Back",
    purchaseBtn: "Purchase",
    securityTitle: "3D Security Verification",
    securityText: "Please enter the verification code sent to your device:",
    verifyBtn: "Verify",
    subtext: `Now you can do everything comfortably with the improved tool.<br>
    If nothing happens, install <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> first.`,
    btnSoftShop: "Install MSP2 Soft Shop",
    btnMood: "Install MSP2 MOD",
    btnTroll: "Install MSP2 Troll",
    btnArcMSP: "ARC MSP",
    info: "Info: These mods will no longer receive software updates or bug fixes starting from 15.09.2025, but you can continue to use them.",
    trollExpired: "MSP2 Troll license has expired.",
    about: `<p>
        MSP2 MODS is a platform that offers unique utility and customization tools ("mods") for MSP2. 
        The site allows you to install various mods, including Soft Shop, Mod, Troll, and ARC MSP, each providing different features to enhance your MSP2 experience.
      </p>
      <ul>
        <li><b>Soft Shop:</b> Adds extra shopping features for MSP2.</li>
        <li><b>MOD:</b> Enables daily task completion and automatic dress up gameplay.</li>
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
    shopBtn: "Mağaza",
    langTitle: "Dil Seç",
    aboutTitle: "MSP2 MODS Hakkında",
    shopTitle: "MAĞAZA",
    licenseTitle: "MSP2 Troll Lisansı",
    buyBtn: "Satın Al",
    purchaseTitle: "Satın Alma Formu",
    emailLabel: "E-posta:",
    usernameLabel: "Kullanıcı Adı:",
    paymentLabel: "Ödeme Yöntemi:",
    cardNumberLabel: "Kart Numarası:",
    expiryLabel: "Son Kullanma Tarihi:",
    cvvLabel: "CVV:",
    invoiceTitle: "Fatura",
    productName: "MSP2 Troll Lisansı",
    totalLabel: "Toplam:",
    backBtn: "Geri",
    purchaseBtn: "Satın Al",
    securityTitle: "3D Güvenlik Doğrulaması",
    securityText: "Lütfen cihazınıza gönderilen doğrulama kodunu girin:",
    verifyBtn: "Doğrula",
    subtext: `Artık geliştirilmiş araç ile her şeyi rahatça yapabilirsiniz.<br>
    Eğer bir şey olmuyorsa, önce <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> kurun.`,
    btnSoftShop: "MSP2 Soft Shop'u Kur",
    btnMood: "MSP2 MOD'u Kur",
    btnTroll: "MSP2 Troll'u Kur",
    btnArcMSP: "ARC MSP",
    info: "Bilgi: Bu modlar 15.09.2025 itibarıyla yazılım güncellemesi veya hata düzeltmesi almayacaktır, ancak kullanmaya devam edebilirsiniz.",
    trollExpired: "MSP2 Troll lisans süresi doldu.",
    about: `<p>
      MSP2 MODS; MSP2 için özel modlar ve yardımcı araçlar sunan bir platformdur.<br>
      Sitede Soft Shop, Mod, Troll ve ARC MSP gibi çeşitli modları kurabilirsiniz. Her mod, MSP2 deneyiminizi geliştirmek için farklı özellikler sunar.
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
  },
  // Add other languages with shop translations...
  "de-DE": {
    aboutBtn: "Über",
    langBtn: "Sprache",
    shopBtn: "Shop",
    langTitle: "Sprache auswählen",
    aboutTitle: "Über MSP2 MODS",
    shopTitle: "SHOP",
    licenseTitle: "Lizenz für MSP2 Troll",
    buyBtn: "Kaufen",
    purchaseTitle: "Kaufformular",
    emailLabel: "E-Mail:",
    usernameLabel: "Benutzername:",
    paymentLabel: "Zahlungsmethode:",
    cardNumberLabel: "Kartennummer:",
    expiryLabel: "Ablaufdatum:",
    cvvLabel: "CVV:",
    invoiceTitle: "Rechnung",
    productName: "MSP2 Troll Lizenz",
    totalLabel: "Gesamt:",
    backBtn: "Zurück",
    purchaseBtn: "Kaufen",
    securityTitle: "3D Sicherheitsverifizierung",
    securityText: "Bitte geben Sie den an Ihr Gerät gesendeten Verifizierungscode ein:",
    verifyBtn: "Verifizieren",
    subtext: `Jetzt können Sie alles bequem mit dem verbesserten Tool machen.<br>
    Falls nichts passiert, installieren Sie zuerst <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.`,
    btnSoftShop: "MSP2 Soft Shop installieren",
    btnMood: "MSP2 MOD installieren",
    btnTroll: "MSP2 Troll installieren",
    btnArcMSP: "ARC MSP",
    info: "Info: Diese Mods erhalten ab dem 15.09.2025 keine Software-Updates oder Fehlerbehebungen mehr, aber Sie können sie weiterhin verwenden.",
    trollExpired: "MSP2 Troll Lizenz ist abgelaufen.",
    about: `<p>
        MSP2 MODS ist eine Plattform, die einzigartige Hilfsprogramme und Anpassungstools ("Mods") für MSP2 bietet. 
        Die Seite ermöglicht es Ihnen, verschiedene Mods zu installieren, darunter Soft Shop, Mod, Troll und ARC MSP, die jeweils unterschiedliche Funktionen bieten, um Ihr MSP2-Erlebnis zu verbessern.
      </p>
      <ul>
        <li><b>Soft Shop:</b> Fügt zusätzliche Einkaufsfunktionen zu MSP2 hinzu.</li>
        <li><b>MOD:</b> Ermöglicht das Abschließen täglicher Aufgaben und automatisches Dress-Up-Gameplay.</li>
        <li><b>Troll:</b> Bietet lustige, experimentelle Funktionen für MSP2.</li>
        <li><b>ARC MSP:</b> Externe erweiterte Mod-Tools für MSP2.</li>
      </ul>
      <p>
        <b>Wie verwenden?</b> Klicken Sie bei jedem Mod auf "Installieren". Falls Ihr Browser nicht reagiert, installieren Sie zuerst <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.
      </p>
      <p>
        <b>Hinweis:</b> MSP2 MODS erhält nach dem 15.09.2025 keine Updates mehr, aber alle Mods bleiben weiterhin verfügbar.
      </p>`
  }
  // Add more languages with complete translations...
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
    'shopBtnTxt': trans.shopBtn,
    'langTitle': trans.langTitle,
    'aboutTitle': trans.aboutTitle,
    'shopTitle': trans.shopTitle,
    'licenseTitle': trans.licenseTitle,
    'buyBtn': trans.buyBtn,
    'purchaseTitle': trans.purchaseTitle,
    'emailLabel': trans.emailLabel,
    'usernameLabel': trans.usernameLabel,
    'paymentLabel': trans.paymentLabel,
    'cardNumberLabel': trans.cardNumberLabel,
    'expiryLabel': trans.expiryLabel,
    'cvvLabel': trans.cvvLabel,
    'invoiceTitle': trans.invoiceTitle,
    'productName': trans.productName,
    'totalLabel': trans.totalLabel,
    'backBtn': trans.backBtn,
    'purchaseBtn': trans.purchaseBtn,
    'securityTitle': trans.securityTitle,
    'securityText': trans.securityText,
    'verifyBtn': trans.verifyBtn,
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
