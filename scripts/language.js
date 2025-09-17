// Language system (Sadece Türkçe destekleyecek şekilde basitleştirildi)
const LANGUAGES = [
  { key: "tr-TR", flag: "🇹🇷", name: "Türkiye" },
];

const TRANSLATIONS = {
  "tr-TR": {
    aboutBtn: "Hakkında",
    langBtn: "Dil",
    newsBtn: "Haberler",
    langTitle: "Dil Seç", 
    aboutTitle: "MSP2 MODS Hakkında",
    newsTitle: "Haberler & Güncellemeler",
    subtext: `Artık geliştirilmiş araç ile her şeyi rahatça yapabilirsiniz.<br>
    Eğer bir şey olmuyorsa, önce <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> kurun.`,
    info: "Uyarı: Bu modlar 15.09.2025 itibarıyla güncelleme desteği kesildi, ileride optimizasyon ve performans düşüşü yaşanabilir.",
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
    </p>
    <h4 style="color: #6effb2; margin: 15px 0 10px 0;">Mevcut Özellikler:</h4>
    <ul>
        <li><b>MSP2 MOD</b>: Özel MSP2 özellikleri ve modları yükler.</li>
        <li><b>ARC MSP</b>: MSP2 fotoğraf arşivine erişim sağlar.</li>
    </ul>`
  }
};

// Current language state (Sadece Türkçe olarak ayarlandı)
let currentLang = "tr-TR";

// Utility function to get translated text from JSON or fallback (Basitleştirildi)
function getTranslatedText(jsonOrString, targetLang = null) {
  // Tek dil olduğu için doğrudan string dönebiliriz.
  return jsonOrString || '';
}

// Utility function to break text at specified character limit (Kaldırılan haber yönetimi ile ilgiliydi, ancak genel kullanım için bırakılabilir)
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

// Language functionality (Sadece mevcut Türkçe metinleri yükleyecek ve başka bir dil seçeneği sunmayacak)
function loadLanguage(langKey) {
  currentLang = langKey; // Her zaman 'tr-TR' olacak
  const trans = TRANSLATIONS[langKey];
  if (!trans) return;

  // UI elemanlarını güncelle
  const elements = {
    'aboutBtnTxt': trans.aboutBtn,
    'langBtnTxt': trans.langBtn, 
    'newsBtnTxt': trans.newsBtn,
    'langTitle': trans.langTitle,
    'aboutTitle': trans.aboutTitle,
    'newsTitle': trans.newsTitle,
    'subtextMain': trans.subtext,
    'aboutText': trans.about,
    'trollNotificationText': trans.trollExpired
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

  // Warning text'i özel olarak güncelliyoruz
  const warningTextElement = document.getElementById('warningText');
  if (warningTextElement) {
      warningTextElement.querySelector('.warning-message').textContent = trans.info.replace('Uyarı: ', ''); // "Uyarı:" kısmı HTML'de sabit olduğu için sadece mesajı değiştiriyoruz.
  }

  // Store in localStorage (Yine de kaydedebiliriz, ancak tek dil olduğu için çok anlamı kalmaz)
  localStorage.setItem('msp2mods_lang', langKey);
  
  // Dil modalını kapat
  const langModal = document.getElementById('langModal');
  if (langModal) {
    closeModal('langModal');
  }
}

function renderLanguageList() {
  const container = document.getElementById('langList');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Sadece Türkçe seçeneği ekleniyor
  LANGUAGES.forEach(lang => {
    const item = document.createElement('div');
    item.className = `lang-item ${lang.key === currentLang ? 'selected' : ''}`;
    item.innerHTML = `<span>${lang.flag}</span><span>${lang.name}</span>`;
    item.onclick = () => loadLanguage(lang.key); // Fonksiyonu çağırmak, aslında UI güncellemesini tetikler ama dil değişmez.
    container.appendChild(item);
  });
}

// Make functions global for access from main.js and other scripts
window.TRANSLATIONS = TRANSLATIONS;
window.currentLang = currentLang;
window.loadLanguage = loadLanguage;
window.renderLanguageList = renderLanguageList;
window.getTranslatedText = getTranslatedText;
window.parseJSONSafely = (jsonString) => jsonString; // Basitleştirildi
window.breakTextAtLimit = breakTextAtLimit;
