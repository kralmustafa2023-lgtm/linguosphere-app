// ===========================
// SPEECH — Web Speech API
// ===========================

import { Storage } from './storage.js';

let cachedVoices = [];

function updateVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const list = speechSynthesis.getVoices();
    if (list && list.length > 0) {
      cachedVoices = list;
    }
  }
}

// Initial voices load & event listener
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  updateVoices();
  speechSynthesis.addEventListener('voiceschanged', updateVoices);
}

export const Speech = {
  enabled: true,
  rate: 0.85,

  init() {
    const state = Storage.load();
    this.enabled = state.settings?.sound ?? true;
    this.rate = state.settings?.speechRate ?? 0.85;
    updateVoices();
  },

  getBestVoice(lang = 'en-US') {
    if (!cachedVoices.length) updateVoices();
    return cachedVoices.find(v => v.lang === lang) || 
           cachedVoices.find(v => v.lang.startsWith(lang.split('-')[0])) ||
           null;
  },

  speak(text, lang = 'en-US') {
    if (!this.enabled || !('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = this.rate;
    u.pitch = 1;
    u.volume = 1;
    
    const voice = this.getBestVoice(lang);
    if (voice) u.voice = voice;
    
    speechSynthesis.speak(u);
  },

  english(text) { this.speak(text, 'en-US'); },
  
  slow(text) {
    if (!this.enabled || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.55;
    u.pitch = 1;
    u.volume = 1;
    
    const voice = this.getBestVoice('en-US');
    if (voice) u.voice = voice;
    
    speechSynthesis.speak(u);
  },
  
  stop() { 
    if ('speechSynthesis' in window) speechSynthesis.cancel(); 
  },

  toggle() {
    this.enabled = !this.enabled;
    const state = Storage.load();
    state.settings.sound = this.enabled;
    Storage.save(state);
    return this.enabled;
  },
  
  setRate(rate) {
    this.rate = rate;
    const state = Storage.load();
    state.settings.speechRate = rate;
    Storage.save(state);
  },

  // --- STT (Speech To Text / Microphone Recognition) ---
  hasSpeechRecognition() {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  },

  listen(onResult, onError) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError('Browser STT not supported');
      return null;
    }

    if (this.activeRecognition) {
      try { this.activeRecognition.stop(); } catch(e){}
    }

    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      if (onResult) onResult({ transcript, confidence });
    };

    rec.onerror = (event) => {
      if (onError) onError(event.error);
    };

    rec.onend = () => {
      this.activeRecognition = null;
    };

    try {
      rec.start();
      this.activeRecognition = rec;
      return rec;
    } catch (err) {
      if (onError) onError(err.message);
      return null;
    }
  },

  stopListening() {
    if (this.activeRecognition) {
      try { this.activeRecognition.stop(); } catch(e){}
      this.activeRecognition = null;
    }
  }
};
