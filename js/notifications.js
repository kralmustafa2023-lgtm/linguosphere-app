// ===========================
// NOTIFICATIONS — PWA & SRS Hatırlatıcı
// ===========================

import { Storage } from './storage.js';

export const NotificationManager = {
  async init() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('./service-worker.js');
      } catch (err) {
        console.warn('SW registration skipped:', err);
      }
    }
  },

  async requestPermission() {
    if (!('Notification' in window)) {
      alert('Tarayıcınız bildirim özelliğini desteklemiyor.');
      return false;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      this.checkAndSendSRSReminder(true);
      return true;
    }
    return false;
  },

  getDueSRSCount() {
    const state = Storage.load();
    const today = new Date().toISOString().split('T')[0];
    const srsList = Object.values(state.srsData || {});
    return srsList.filter(item => item.nextReview && item.nextReview <= today).length;
  },

  checkAndSendSRSReminder(force = false) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const dueCount = this.getDueSRSCount();
    if (dueCount > 0 || force) {
      const msg = dueCount > 0 
        ? `Bugün hafızanda pekiştirilmeyi bekleyen ${dueCount} kelime var!`
        : 'Harika! Bugünün tüm kelimelerini tekrar ettin. Yeni bir ders keşfetmeye ne dersin?';

      new Notification('Linguosphere — Günlük Tekrar Vakti', {
        body: msg,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%237c5dfa"><circle cx="12" cy="12" r="10"/></svg>',
        tag: 'srs-daily-reminder'
      });
    }
  }
};
