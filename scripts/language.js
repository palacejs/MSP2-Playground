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
  "en-CA": {
    aboutBtn: "About",
    langBtn: "Language", 
    newsBtn: "News",
    langTitle: "Select Language",
    aboutTitle: "About MSP2 MODS",
    newsTitle: "News & Updates",
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
  "en-GB": {
    aboutBtn: "About",
    langBtn: "Language",
    newsBtn: "News", 
    langTitle: "Select Language",
    aboutTitle: "About MSP2 MODS",
    newsTitle: "News & Updates",
    subtext: `Now you can do everything comfortably with the improved tool.<br>
    If nothing happens, install <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> first.`,
    info: "Info: These mods will no longer receive software updates or bug fixes starting from 15.09.2025, but you can continue to use them.",
    trollExpired: "MSP2 Troll license has expired.",
    about: `<p>
        MSP2 MODS is a platform that offers unique utility and customisation tools ("mods") for MSP2. 
        The site allows you to install various mods to enhance your MSP2 experience.
      </p>
      <p>
        <b>How to use?</b> Click "Install" on any mod. If your browser doesn't respond, install <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> first.
      </p>
      <p>
        <b>Note:</b> MSP2 MODS will not receive updates after 15.09.2025, but all mods will remain available for use.
      </p>`
  },
  "nl-NL": {
    aboutBtn: "Over",
    langBtn: "Taal",
    newsBtn: "Nieuws",
    langTitle: "Selecteer Taal", 
    aboutTitle: "Over MSP2 MODS",
    newsTitle: "Nieuws & Updates",
    subtext: `Nu kun je alles comfortabel doen met de verbeterde tool.<br>
    Als er niets gebeurt, installeer dan eerst <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.`,
    info: "Info: Deze mods ontvangen vanaf 15.09.2025 geen software-updates of bugfixes meer, maar je kunt ze blijven gebruiken.",
    trollExpired: "MSP2 Troll licentie is verlopen.",
    about: `<p>
        MSP2 MODS is een platform dat unieke hulpprogramma's en aanpassingstools ("mods") biedt voor MSP2. 
        De site stelt je in staat om verschillende mods te installeren om je MSP2-ervaring te verbeteren.
      </p>
      <p>
        <b>Hoe te gebruiken?</b> Klik op "Installeer" bij elke mod. Als je browser niet reageert, installeer dan eerst <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.
      </p>
      <p>
        <b>Opmerking:</b> MSP2 MODS ontvangt na 15.09.2025 geen updates meer, maar alle mods blijven beschikbaar voor gebruik.
      </p>`
  },
  "en-IE": {
    aboutBtn: "About",
    langBtn: "Language",
    newsBtn: "News",
    langTitle: "Select Language",
    aboutTitle: "About MSP2 MODS", 
    newsTitle: "News & Updates",
    subtext: `Now you can do everything comfortably with the improved tool.<br>
    If nothing happens, install <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> first.`,
    info: "Info: These mods will no longer receive software updates or bug fixes starting from 15.09.2025, but you can continue to use them.",
    trollExpired: "MSP2 Troll license has expired.",
    about: `<p>
        MSP2 MODS is a platform that offers unique utility and customisation tools ("mods") for MSP2. 
        The site allows you to install various mods to enhance your MSP2 experience.
      </p>
      <p>
        <b>How to use?</b> Click "Install" on any mod. If your browser doesn't respond, install <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> first.
      </p>
      <p>
        <b>Note:</b> MSP2 MODS will not receive updates after 15.09.2025, but all mods will remain available for use.
      </p>`
  },
  "da-DK": {
    aboutBtn: "Om",
    langBtn: "Sprog",
    newsBtn: "Nyheder",
    langTitle: "Vælg Sprog",
    aboutTitle: "Om MSP2 MODS",
    newsTitle: "Nyheder & Opdateringer", 
    subtext: `Nu kan du gøre alt komfortabelt med det forbedrede værktøj.<br>
    Hvis intet sker, installer først <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.`,
    info: "Info: Disse mods vil ikke længere modtage softwareopdateringer eller fejlrettelser fra 15.09.2025, men du kan fortsætte med at bruge dem.",
    trollExpired: "MSP2 Troll licens er udløbet.",
    about: `<p>
        MSP2 MODS er en platform, der tilbyder unikke værktøjer og tilpasningstools ("mods") til MSP2. 
        Siden giver dig mulighed for at installere forskellige mods for at forbedre din MSP2-oplevelse.
      </p>
      <p>
        <b>Hvordan bruges det?</b> Klik på "Installer" på enhver mod. Hvis din browser ikke reagerer, installer først <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.
      </p>
      <p>
        <b>Bemærk:</b> MSP2 MODS vil ikke modtage opdateringer efter 15.09.2025, men alle mods forbliver tilgængelige til brug.
      </p>`
  },
  "fr-FR": {
    aboutBtn: "À propos",
    langBtn: "Langue",
    newsBtn: "Actualités", 
    langTitle: "Choisir la langue",
    aboutTitle: "À propos de MSP2 MODS",
    newsTitle: "Actualités & Mises à jour",
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
  "pl-PL": {
    aboutBtn: "O nas",
    langBtn: "Język",
    newsBtn: "Aktualności",
    langTitle: "Wybierz język", 
    aboutTitle: "O MSP2 MODS",
    newsTitle: "Aktualności i Aktualizacje",
    subtext: `Teraz możesz robić wszystko wygodnie dzięki ulepszonemu narzędziu.<br>
    Jeśli nic się nie dzieje, najpierw zainstaluj <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.`,
    info: "Info: Te mody nie będą już otrzymywać aktualizacji oprogramowania ani poprawek błędów od 15.09.2025, ale możesz nadal z nich korzystać.",
    trollExpired: "Licencja MSP2 Troll wygasła.",
    about: `<p>
        MSP2 MODS to platforma oferująca unikalne narzędzia użytkowe i personalizacyjne ("mody") dla MSP2. 
        Strona pozwala na instalację różnych modów w celu poprawy doświadczenia MSP2.
      </p>
      <p>
        <b>Jak używać?</b> Kliknij "Zainstaluj" przy dowolnym modzie. Jeśli przeglądarka nie reaguje, najpierw zainstaluj <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.
      </p>
      <p>
        <b>Uwaga:</b> MSP2 MODS nie będzie otrzymywać aktualizacji po 15.09.2025, ale wszystkie mody pozostaną dostępne do użytku.
      </p>`
  },
  "sv-SE": {
    aboutBtn: "Om",
    langBtn: "Språk",
    newsBtn: "Nyheter",
    langTitle: "Välj språk",
    aboutTitle: "Om MSP2 MODS", 
    newsTitle: "Nyheter & Uppdateringar",
    subtext: `Nu kan du göra allt bekvämt med det förbättrade verktyget.<br>
    Om inget händer, installera först <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.`,
    info: "Info: Dessa mods kommer inte längre att få mjukvaruuppdateringar eller buggfixar från 15.09.2025, men du kan fortsätta använda dem.",
    trollExpired: "MSP2 Troll licens har upphört.",
    about: `<p>
        MSP2 MODS är en plattform som erbjuder unika verktyg och anpassningstools ("mods") för MSP2. 
        Webbplatsen låter dig installera olika mods för att förbättra din MSP2-upplevelse.
      </p>
      <p>
        <b>Hur använder man?</b> Klicka på "Installera" på vilken mod som helst. Om din webbläsare inte svarar, installera först <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.
      </p>
      <p>
        <b>Obs:</b> MSP2 MODS kommer inte att få uppdateringar efter 15.09.2025, men alla mods förblir tillgängliga för användning.
      </p>`
  },
  "no-NO": {
    aboutBtn: "Om",
    langBtn: "Språk",
    newsBtn: "Nyheter",
    langTitle: "Velg språk", 
    aboutTitle: "Om MSP2 MODS",
    newsTitle: "Nyheter & Oppdateringer",
    subtext: `Nå kan du gjøre alt komfortabelt med det forbedrede verktøyet.<br>
    Hvis ingenting skjer, installer først <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.`,
    info: "Info: Disse modene vil ikke lenger motta programvareoppdateringer eller feilrettinger fra 15.09.2025, men du kan fortsette å bruke dem.",
    trollExpired: "MSP2 Troll lisens har utløpt.",
    about: `<p>
        MSP2 MODS er en plattform som tilbyr unike verktøy og tilpasningsverktøy ("mods") for MSP2. 
        Nettstedet lar deg installere forskjellige mods for å forbedre din MSP2-opplevelse.
      </p>
      <p>
        <b>Hvordan bruke?</b> Klikk "Installer" på hvilken som helst mod. Hvis nettleseren din ikke reagerer, installer først <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.
      </p>
      <p>
        <b>Merk:</b> MSP2 MODS vil ikke motta oppdateringer etter 15.09.2025, men alle mods forblir tilgjengelige for bruk.
      </p>`
  },
  "fi-FI": {
    aboutBtn: "Tietoja",
    langBtn: "Kieli",
    newsBtn: "Uutiset", 
    langTitle: "Valitse kieli",
    aboutTitle: "Tietoja MSP2 MODS:sta",
    newsTitle: "Uutiset & Päivitykset",
    subtext: `Nyt voit tehdä kaiken mukavasti parannetulla työkalulla.<br>
    Jos mitään ei tapahdu, asenna ensin <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.`,
    info: "Tiedoksi: Nämä modit eivät enää saa ohjelmistopäivityksiä tai virheiden korjauksia 15.09.2025 alkaen, mutta voit jatkaa niiden käyttöä.",
    trollExpired: "MSP2 Troll lisenssi on vanhentunut.",
    about: `<p>
        MSP2 MODS on alusta, joka tarjoaa ainutlaatuisia apuohjelmia ja mukautustyökaluja ("modeja") MSP2:lle. 
        Sivusto mahdollistaa erilaisten modien asentamisen MSP2-kokemuksesi parantamiseksi.
      </p>
      <p>
        <b>Miten käyttää?</b> Klikkaa "Asenna" minkä tahansa modin kohdalla. Jos selaimesi ei reagoi, asenna ensin <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a>.
      </p>
      <p>
        <b>Huomautus:</b> MSP2 MODS ei saa päivityksiä 15.09.2025 jälkeen, mutta kaikki modit pysyvät käytettävissä.
      </p>`
  },
  "tr-TR": {
    aboutBtn: "Hakkında",
    langBtn: "Dil",
    newsBtn: "Haberler",
    langTitle: "Dil Seç", 
    aboutTitle: "MSP2 MODS Hakkında",
    newsTitle: "Haberler & Güncellemeler",
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
  "es-ES": {
    aboutBtn: "Acerca de",
    langBtn: "Idioma",
    newsBtn: "Noticias", 
    langTitle: "Seleccionar idioma",
    aboutTitle: "Acerca de MSP2 MODS",
    newsTitle: "Noticias & Actualizaciones",
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
  },
  "de-DE": {
    aboutBtn: "Über",
    langBtn: "Sprache",
    newsBtn: "Nachrichten",
    langTitle: "Sprache auswählen", 
    aboutTitle: "Über MSP2 MODS",
    newsTitle: "Nachrichten & Updates",
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
  "en-AU": {
    aboutBtn: "About",
    langBtn: "Language",
    newsBtn: "News", 
    langTitle: "Select Language",
    aboutTitle: "About MSP2 MODS",
    newsTitle: "News & Updates",
    subtext: `Now you can do everything comfortably with the improved tool.<br>
    If nothing happens, install <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> first.`,
    info: "Info: These mods will no longer receive software updates or bug fixes starting from 15.09.2025, but you can continue to use them.",
    trollExpired: "MSP2 Troll licence has expired.",
    about: `<p>
        MSP2 MODS is a platform that offers unique utility and customisation tools ("mods") for MSP2. 
        The site allows you to install various mods to enhance your MSP2 experience.
      </p>
      <p>
        <b>How to use?</b> Click "Install" on any mod. If your browser doesn't respond, install <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> first.
      </p>
      <p>
        <b>Note:</b> MSP2 MODS will not receive updates after 15.09.2025, but all mods will remain available for use.
      </p>`
  },
  "en-NZ": {
    aboutBtn: "About",
    langBtn: "Language",
    newsBtn: "News",
    langTitle: "Select Language", 
    aboutTitle: "About MSP2 MODS",
    newsTitle: "News & Updates",
    subtext: `Now you can do everything comfortably with the improved tool.<br>
    If nothing happens, install <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> first.`,
    info: "Info: These mods will no longer receive software updates or bug fixes starting from 15.09.2025, but you can continue to use them.",
    trollExpired: "MSP2 Troll licence has expired.",
    about: `<p>
        MSP2 MODS is a platform that offers unique utility and customisation tools ("mods") for MSP2. 
        The site allows you to install various mods to enhance your MSP2 experience.
      </p>
      <p>
        <b>How to use?</b> Click "Install" on any mod. If your browser doesn't respond, install <a href="https://violentmonkey.github.io/get-it/" target="_blank" style="color:#6effb2;">Violentmonkey</a> first.
      </p>
      <p>
        <b>Note:</b> MSP2 MODS will not receive updates after 15.09.2025, but all mods will remain available for use.
      </p>`
  }
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

  // Store in localStorage
  localStorage.setItem('msp2mods_lang', langKey);
  
  const langModal = document.getElementById('langModal');
  if (langModal) {
    langModal.classList.remove('show');
    setTimeout(() => {
      langModal.style.display = 'none';
    }, 300);
  }

  // Reload dynamic content with new language
  if (window.loadDynamicButtonDescriptions) {
    window.loadDynamicButtonDescriptions();
  }
  if (window.loadNewsList) {
    window.loadNewsList();
  }
  if (window.loadDynamicButtons) {
    window.loadDynamicButtons();
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
