// Button Manager for Index Page
class ButtonManager {
  constructor() {
    this.buttons = [];
    this.loadButtons();
    this.renderButtons();
    this.checkExpiredButtons();
    
    // Check for expired buttons every minute
    setInterval(() => {
      this.checkExpiredButtons();
    }, 60000);
  }

  loadButtons() {
    const saved = localStorage.getItem('msp2_custom_buttons');
    if (saved) {
      try {
        this.buttons = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading buttons:', e);
        this.buttons = [];
      }
    }
  }

  saveButtons() {
    localStorage.setItem('msp2_custom_buttons', JSON.stringify(this.buttons));
  }

  checkExpiredButtons() {
    const now = new Date();
    let hasChanges = false;

    this.buttons = this.buttons.filter(button => {
      if (button.status === 'temporary' && button.expiryDate) {
        const expiryDate = new Date(button.expiryDate);
        if (now > expiryDate) {
          hasChanges = true;
          return false; // Remove expired button
        }
      }
      
      // Check if disabled button should be re-enabled
      if (button.status === 'disabled' && button.disabledUntil) {
        const enableDate = new Date(button.disabledUntil);
        if (now > enableDate) {
          button.status = button.originalStatus || 'permanent';
          delete button.disabledUntil;
          delete button.disabledReason;
          delete button.originalStatus;
          hasChanges = true;
        }
      }
      
      return true;
    });

    if (hasChanges) {
      this.saveButtons();
      this.renderButtons();
    }
  }

  renderButtons() {
    const container = document.getElementById('dynamicButtons');
    if (!container) return;

    // Clear existing custom buttons (keep default ones)
    const customButtons = container.querySelectorAll('.custom-button');
    customButtons.forEach(btn => btn.remove());

    // Add custom buttons
    this.buttons.forEach(button => {
      if (button.status !== 'disabled') {
        const buttonElement = document.createElement('a');
        buttonElement.href = button.url;
        buttonElement.className = 'bookmark-btn custom-button';
        buttonElement.textContent = button.name;
        buttonElement.target = '_blank';
        container.appendChild(buttonElement);
      } else {
        // Create disabled button
        const buttonElement = document.createElement('div');
        buttonElement.className = 'bookmark-btn custom-button disabled-button';
        buttonElement.textContent = button.name;
        buttonElement.style.opacity = '0.5';
        buttonElement.style.cursor = 'not-allowed';
        buttonElement.addEventListener('click', (e) => {
          e.preventDefault();
          this.showDisabledNotification(button.disabledReason || 'This button is temporarily disabled.');
        });
        container.appendChild(buttonElement);
      }
    });
  }

  showDisabledNotification(reason) {
    const notification = document.getElementById('buttonDisabledNotification');
    const text = document.getElementById('buttonDisabledText');
    
    if (notification && text) {
      // Get current language translation
      const currentLang = window.currentLang || 'en-US';
      const translations = window.TRANSLATIONS || {};
      const trans = translations[currentLang] || translations['en-US'];
      
      text.textContent = reason || (trans ? trans.buttonDisabled : 'This button is temporarily disabled.');
      notification.style.display = 'flex';
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          notification.style.display = 'none';
        }, 500);
      }, 4000);
    }
  }

  addButton(buttonData) {
    const button = {
      id: Date.now() + Math.random(),
      name: buttonData.name,
      url: buttonData.url,
      status: buttonData.status,
      createdAt: new Date().toISOString()
    };

    if (buttonData.status === 'temporary' && buttonData.expiryDate) {
      button.expiryDate = buttonData.expiryDate;
    }

    if (buttonData.status === 'disabled') {
      button.disabledUntil = buttonData.disabledUntil;
      button.disabledReason = buttonData.disabledReason;
      button.originalStatus = 'permanent'; // Default to permanent when re-enabled
    }

    this.buttons.push(button);
    this.saveButtons();
    this.renderButtons();
  }

  updateButton(id, buttonData) {
    const index = this.buttons.findIndex(btn => btn.id === id);
    if (index !== -1) {
      const button = this.buttons[index];
      button.name = buttonData.name;
      button.url = buttonData.url;
      button.status = buttonData.status;

      // Clear previous status-specific data
      delete button.expiryDate;
      delete button.disabledUntil;
      delete button.disabledReason;
      delete button.originalStatus;

      if (buttonData.status === 'temporary' && buttonData.expiryDate) {
        button.expiryDate = buttonData.expiryDate;
      }

      if (buttonData.status === 'disabled') {
        button.disabledUntil = buttonData.disabledUntil;
        button.disabledReason = buttonData.disabledReason;
        button.originalStatus = button.status === 'disabled' ? 'permanent' : button.status;
      }

      this.saveButtons();
      this.renderButtons();
    }
  }

  deleteButton(id) {
    this.buttons = this.buttons.filter(btn => btn.id !== id);
    this.saveButtons();
    this.renderButtons();
  }

  getButtons() {
    return this.buttons;
  }
}

// Initialize button manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('dynamicButtons')) {
    window.buttonManager = new ButtonManager();
  }
});
