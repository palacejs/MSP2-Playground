// Data manager for JSON-based storage
class DataManager {
  constructor() {
    this.buttonsCache = null;
    this.newsCache = null;
    this.cacheExpiry = 2 * 60 * 1000; // 2 minutes cache
    this.lastButtonsFetch = 0;
    this.lastNewsFetch = 0;
  }

  async fetchButtons() {
    const now = Date.now();
    if (this.buttonsCache && (now - this.lastButtonsFetch) < this.cacheExpiry) {
      return this.buttonsCache;
    }

    try {
      const response = await fetch('data/buttons.json?v=' + now);
      if (!response.ok) throw new Error('Failed to fetch buttons');
      const data = await response.json();
      this.buttonsCache = data.buttons || [];
      this.lastButtonsFetch = now;
      return this.buttonsCache;
    } catch (error) {
      console.error('Error fetching buttons:', error);
      return this.buttonsCache || [];
    }
  }

  async fetchNews() {
    const now = Date.now();
    if (this.newsCache && (now - this.lastNewsFetch) < this.cacheExpiry) {
      return this.newsCache;
    }

    try {
      const response = await fetch('data/news.json?v=' + now);
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      this.newsCache = data.news || [];
      this.lastNewsFetch = now;
      return this.newsCache;
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.newsCache || [];
    }
  }

  async getActiveButtons() {
    const buttons = await this.fetchButtons();
    const now = new Date();
    
    return buttons.filter(button => {
      if (button.hidden) return false;
      if (button.isTemporary) {
        const expiryDate = new Date(button.expiryDate);
        return expiryDate >= now;
      }
      return true;
    });
  }

  async getAllNews() {
    const news = await this.fetchNews();
    return news.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  }

  // Fallback to IndexedDB for admin functions
  async openDB() {
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
        if (!db.objectStoreNames.contains("photos")) {
          db.createObjectStore("photos", { keyPath: "id" });
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

  async saveButtonToLocal(button) {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("buttons", "readwrite");
        const store = tx.objectStore("buttons");
        store.put(button);
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('Error saving button locally:', error);
    }
  }

  async saveNewsToLocal(news) {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("news", "readwrite");
        const store = tx.objectStore("news");
        store.put(news);
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('Error saving news locally:', error);
    }
  }

  async getAllButtonsFromLocal() {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("buttons", "readonly");
        const store = tx.objectStore("buttons");
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('Error getting buttons from local:', error);
      return [];
    }
  }

  async getAllNewsFromLocal() {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("news", "readonly");
        const store = tx.objectStore("news");
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('Error getting news from local:', error);
      return [];
    }
  }

  async deleteButtonFromLocal(id) {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("buttons", "readwrite");
        const store = tx.objectStore("buttons");
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('Error deleting button from local:', error);
    }
  }

  async deleteNewsFromLocal(id) {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("news", "readwrite");
        const store = tx.objectStore("news");
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('Error deleting news from local:', error);
    }
  }

  async toggleButtonVisibilityLocal(id) {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("buttons", "readwrite");
        const store = tx.objectStore("buttons");
        const getRequest = store.get(id);
        getRequest.onsuccess = () => {
          const button = getRequest.result;
          if (button) {
            button.hidden = !button.hidden;
            store.put(button);
            tx.oncomplete = () => resolve();
          } else {
            reject(new Error('Button not found'));
          }
        };
        getRequest.onerror = (e) => reject(e.target.error);
      });
    } catch (error) {
      console.error('Error toggling button visibility:', error);
    }
  }
}

// Create global instance
window.dataManager = new DataManager();
