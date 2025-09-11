// Admin Button Management System
class AdminButtonManager {
  constructor() {
    this.currentEditingId = null;
    this.initializeEventListeners();
    this.loadButtonManager();
  }

  initializeEventListeners() {
    // Tab switching
    window.switchTab = (tabName) => {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
      document.getElementById(`${tabName}Tab`).classList.add('active');
    };

    // Button modal functions
    window.openAddButtonModal = () => {
      this.currentEditingId = null;
      document.getElementById('buttonModalTitle').textContent = 'Add New Button';
      document.getElementById('buttonForm').reset();
      document.getElementById('buttonModal').style.display = 'flex';
      this.updateFormVisibility();
    };

    window.closeButtonModal = () => {
      document.getElementById('buttonModal').style.display = 'none';
      this.currentEditingId = null;
    };

    // Form submission
    document.getElementById('buttonForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveButton();
    });

    // Radio button change handler
    document.querySelectorAll('input[name="buttonStatus"]').forEach(radio => {
      radio.addEventListener('change', () => {
        this.updateFormVisibility();
      });
    });
  }

  updateFormVisibility() {
    const status = document.querySelector('input[name="buttonStatus"]:checked').value;
    const expiryGroup = document.getElementById('expiryGroup');
    const disabledGroup = document.getElementById('disabledGroup');

    expiryGroup.style.display = status === 'temporary' ? 'block' : 'none';
    disabledGroup.style.display = status === 'disabled' ? 'block' : 'none';

    if (status === 'temporary') {
      document.getElementById('expiryDate').required = true;
    } else {
      document.getElementById('expiryDate').required = false;
    }

    if (status === 'disabled') {
      document.getElementById('disabledUntil').required = true;
      document.getElementById('disabledReason').required = true;
    } else {
      document.getElementById('disabledUntil').required = false;
      document.getElementById('disabledReason').required = false;
    }
  }

  loadButtonManager() {
    this.renderButtonManager();
  }

  renderButtonManager() {
    const container = document.getElementById('buttonManager');
    if (!container) return;

    const buttons = this.getCustomButtons();
    container.innerHTML = '';

    if (buttons.length === 0) {
      container.innerHTML = '<p style="color:#ccc;text-align:center;">No custom buttons created yet.</p>';
      return;
    }

    buttons.forEach(button => {
      const buttonItem = document.createElement('div');
      buttonItem.className = 'button-item';
      
      const statusText = this.getStatusText(button);
      const statusClass = button.status;
      
      buttonItem.innerHTML = `
        <h5>${this.escapeHtml(button.name)}</h5>
        <p><strong>URL:</strong> ${this.escapeHtml(button.url)}</p>
        <span class="status ${statusClass}">${statusText}</span>
        ${button.expiryDate ? `<p><strong>Expires:</strong> ${new Date(button.expiryDate).toLocaleString()}</p>` : ''}
        ${button.disabledUntil ? `<p><strong>Disabled Until:</strong> ${new Date(button.disabledUntil).toLocaleString()}</p>` : ''}
        ${button.disabledReason ? `<p><strong>Reason:</strong> ${this.escapeHtml(button.disabledReason)}</p>` : ''}
        <div class="button-actions">
          <button class="edit-btn" onclick="adminButtonManager.editButton(${button.id})">Edit</button>
          <button class="delete-btn" onclick="adminButtonManager.deleteButton(${button.id})">Delete</button>
        </div>
      `;
      
      container.appendChild(buttonItem);
    });
  }

  getStatusText(button) {
    switch (button.status) {
      case 'permanent':
        return 'Always Active';
      case 'temporary':
        return 'Temporary';
      case 'disabled':
        return 'Disabled';
      default:
        return 'Unknown';
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  saveButton() {
    const formData = new FormData(document.getElementById('buttonForm'));
    const buttonData = {
      name: formData.get('buttonName') || document.getElementById('buttonName').value,
      url: formData.get('buttonUrl') || document.getElementById('buttonUrl').value,
      status: document.querySelector('input[name="buttonStatus"]:checked').value
    };

    if (buttonData.status === 'temporary') {
      const expiryDate = document.getElementById('expiryDate').value;
      if (!expiryDate) {
        alert('Please select an expiry date for temporary buttons.');
        return;
      }
      buttonData.expiryDate = expiryDate;
    }

    if (buttonData.status === 'disabled') {
      const disabledUntil = document.getElementById('disabledUntil').value;
      const disabledReason = document.getElementById('disabledReason').value;
      
      if (!disabledUntil || !disabledReason) {
        alert('Please fill in both the disabled until date and reason.');
        return;
      }
      
      buttonData.disabledUntil = disabledUntil;
      buttonData.disabledReason = disabledReason;
    }

    if (this.currentEditingId) {
      this.updateCustomButton(this.currentEditingId, buttonData);
    } else {
      this.addCustomButton(buttonData);
    }

    this.closeButtonModal();
    this.renderButtonManager();
    
    // Update the main page if it's open
    if (window.buttonManager) {
      window.buttonManager.loadButtons();
      window.buttonManager.renderButtons();
    }
  }

  editButton(id) {
    const buttons = this.getCustomButtons();
    const button = buttons.find(btn => btn.id === id);
    
    if (!button) return;

    this.currentEditingId = id;
    document.getElementById('buttonModalTitle').textContent = 'Edit Button';
    document.getElementById('buttonName').value = button.name;
    document.getElementById('buttonUrl').value = button.url;
    
    // Set status radio button
    document.querySelector(`input[name="buttonStatus"][value="${button.status}"]`).checked = true;
    
    if (button.expiryDate) {
      document.getElementById('expiryDate').value = button.expiryDate;
    }
    
    if (button.disabledUntil) {
      document.getElementById('disabledUntil').value = button.disabledUntil;
    }
    
    if (button.disabledReason) {
      document.getElementById('disabledReason').value = button.disabledReason;
    }

    this.updateFormVisibility();
    document.getElementById('buttonModal').style.display = 'flex';
  }

  deleteButton(id) {
    if (confirm('Are you sure you want to delete this button?')) {
      this.removeCustomButton(id);
      this.renderButtonManager();
      
      // Update the main page if it's open
      if (window.buttonManager) {
        window.buttonManager.loadButtons();
        window.buttonManager.renderButtons();
      }
    }
  }

  getCustomButtons() {
    const saved = localStorage.getItem('msp2_custom_buttons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading buttons:', e);
        return [];
      }
    }
    return [];
  }

  saveCustomButtons(buttons) {
    localStorage.setItem('msp2_custom_buttons', JSON.stringify(buttons));
  }

  addCustomButton(buttonData) {
    const buttons = this.getCustomButtons();
    const button = {
      id: Date.now() + Math.random(),
      name: buttonData.name,
      url: buttonData.url,
      status: buttonData.status,
      createdAt: new Date().toISOString()
    };

    if (buttonData.expiryDate) {
      button.expiryDate = buttonData.expiryDate;
    }

    if (buttonData.disabledUntil) {
      button.disabledUntil = buttonData.disabledUntil;
    }

    if (buttonData.disabledReason) {
      button.disabledReason = buttonData.disabledReason;
    }

    buttons.push(button);
    this.saveCustomButtons(buttons);
  }

  updateCustomButton(id, buttonData) {
    const buttons = this.getCustomButtons();
    const index = buttons.findIndex(btn => btn.id === id);
    
    if (index !== -1) {
      const button = buttons[index];
      button.name = buttonData.name;
      button.url = buttonData.url;
      button.status = buttonData.status;

      // Clear previous status-specific data
      delete button.expiryDate;
      delete button.disabledUntil;
      delete button.disabledReason;

      if (buttonData.expiryDate) {
        button.expiryDate = buttonData.expiryDate;
      }

      if (buttonData.disabledUntil) {
        button.disabledUntil = buttonData.disabledUntil;
      }

      if (buttonData.disabledReason) {
        button.disabledReason = buttonData.disabledReason;
      }

      this.saveCustomButtons(buttons);
    }
  }

  removeCustomButton(id) {
    const buttons = this.getCustomButtons();
    const filteredButtons = buttons.filter(btn => btn.id !== id);
    this.saveCustomButtons(filteredButtons);
  }
}

// Initialize admin button manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('buttonManager')) {
    window.adminButtonManager = new AdminButtonManager();
  }
});
