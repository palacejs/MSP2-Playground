// Sound Effects System
class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.effectsVolume = 0.5;
    this.soundEffectsEnabled = true;
    this.init();
  }

  init() {
    // Load saved settings
    const savedEffectsVolume = localStorage.getItem('msp2_effects_volume');
    const savedSoundEffectsEnabled = localStorage.getItem('msp2_sound_effects_enabled');
    
    if (savedEffectsVolume) {
      this.effectsVolume = parseFloat(savedEffectsVolume);
    }
    
    if (savedSoundEffectsEnabled) {
      this.soundEffectsEnabled = savedSoundEffectsEnabled === 'true';
    }

    // Initialize audio context on first user interaction
    document.addEventListener('click', this.initAudioContext.bind(this), { once: true });
    document.addEventListener('keydown', this.initAudioContext.bind(this), { once: true });
    
    this.createSounds();
  }

  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  createTone(frequency, duration, type = 'sine') {
    if (!this.audioContext || !this.soundEffectsEnabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.effectsVolume * 0.1, this.audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  createSounds() {
    this.sounds = {
      hover: () => this.createTone(800, 0.1, 'sine'),
      click: () => {
        if (!this.audioContext || !this.soundEffectsEnabled) return;
        
        // Create a more complex click sound
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator1.frequency.value = 1000;
        oscillator2.frequency.value = 1500;
        oscillator1.type = 'square';
        oscillator2.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.effectsVolume * 0.15, this.audioContext.currentTime + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        oscillator1.start(this.audioContext.currentTime);
        oscillator2.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 0.1);
        oscillator2.stop(this.audioContext.currentTime + 0.1);
      },
      close: () => {
        if (!this.audioContext || !this.soundEffectsEnabled) return;
        
        // Create a whoosh sound for closing
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.effectsVolume * 0.1, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
      },
      success: () => {
        if (!this.audioContext || !this.soundEffectsEnabled) return;
        
        // Create a pleasant success sound
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
        
        frequencies.forEach((freq, index) => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'sine';
          
          const startTime = this.audioContext.currentTime + (index * 0.1);
          
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(this.effectsVolume * 0.08, startTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + 0.3);
        });
      }
    };
  }

  play(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName]();
    }
  }

  setEffectsVolume(volume) {
    this.effectsVolume = volume;
    localStorage.setItem('msp2_effects_volume', volume.toString());
  }

  setSoundEffectsEnabled(enabled) {
    this.soundEffectsEnabled = enabled;
    localStorage.setItem('msp2_sound_effects_enabled', enabled.toString());
  }

  getEffectsVolume() {
    return this.effectsVolume;
  }

  isSoundEffectsEnabled() {
    return this.soundEffectsEnabled;
  }
}

// Create global sound effects instance
const soundEffects = new SoundEffects();

// Auto-attach sound effects to common elements
document.addEventListener('DOMContentLoaded', function() {
  // Attach hover sounds to buttons and interactive elements
  const interactiveElements = 'button, .static-btn, .control-btn, .about-btn, .back-btn, .install-btn, .test-btn';
  
  document.addEventListener('mouseenter', function(e) {
    if (e.target.matches(interactiveElements)) {
      soundEffects.play('hover');
    }
  }, true);

  // Attach click sounds
  document.addEventListener('click', function(e) {
    if (e.target.matches(interactiveElements + ', .modal-close')) {
      if (e.target.classList.contains('modal-close')) {
        soundEffects.play('close');
      } else {
        soundEffects.play('click');
      }
    }
  }, true);
});

// Make soundEffects globally available
window.soundEffects = soundEffects;
