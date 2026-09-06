// ===========================
// UTILS — Yardımcı Fonksiyonlar
// ===========================

// HTML Escape — XSS Güvenliği
export function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Fisher-Yates Shuffle
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Levenshtein Distance (Yazma modu kısmi puan için)
export function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1] ? dp[j - 1] : Math.min(dp[j - 1], dp[j], prev) + 1;
      dp[j - 1] = prev;
      prev = val;
    }
    dp[b.length] = prev;
  }
  return dp[b.length];
}

// Puan Uçuşu Animasyonu
export function showScoreFloat(text, isNegative = false, x, y) {
  const el = document.createElement('div');
  el.className = `score-float ${isNegative ? 'negative' : 'positive'}`;
  el.textContent = text;
  el.style.left = (x || window.innerWidth / 2) + 'px';
  el.style.top = (y || window.innerHeight / 2) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

// Konfeti Efekti
export function showConfetti(count = 80) {
  const colors = ['#ff6b6b', '#ffd700', '#06d6a0', '#38bdf8', '#a855f7', '#e879f9', '#fb7185', '#fbbf24'];
  const shapes = ['circle', 'square', 'triangle'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = 6 + Math.random() * 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    let styles = `
      left: ${Math.random() * 100}vw;
      top: -20px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      animation-delay: ${Math.random() * 2}s;
      animation-duration: ${2.5 + Math.random() * 2.5}s;
      opacity: ${0.7 + Math.random() * 0.3};
    `;
    
    if (shape === 'circle') {
      styles += 'border-radius: 50%;';
    } else if (shape === 'triangle') {
      styles += `
        width: 0; height: 0;
        background: transparent;
        border-left: ${size / 2}px solid transparent;
        border-right: ${size / 2}px solid transparent;
        border-bottom: ${size}px solid ${color};
      `;
    } else {
      styles += `border-radius: 2px; transform: rotate(${Math.random() * 360}deg);`;
    }
    
    el.style.cssText = styles;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5500);
  }
}

// Toast Bildirimi
export function showToast(message, duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

// Tarih Formatı (streak için)
export function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

// Yıldız Hesapla
export function calcStars(percent) {
  if (percent >= 90) return 3;
  if (percent >= 70) return 2;
  if (percent >= 50) return 1;
  return 0;
}

// Yıldız HTML'i oluştur
export function renderStars(count, size = 18) {
  let html = '<div class="stars">';
  for (let i = 0; i < 3; i++) {
    html += `<span class="star ${i < count ? 'filled' : ''}" style="font-size:${size}px">⭐</span>`;
  }
  html += '</div>';
  return html;
}

// Percentage
export function calcPercent(correct, total) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

// Ses çalma (Web Audio API ile basit bip sesleri)
const audioCtx = typeof AudioContext !== 'undefined' ? new AudioContext() : null;

export function playSound(type) {
  if (!audioCtx) return;
  
  // Ensure audio context is resumed
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  switch (type) {
    case 'correct':
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.3);
      break;
    case 'wrong':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, audioCtx.currentTime);
      osc.frequency.setValueAtTime(150, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.3);
      break;
    case 'levelup':
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15);
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3);
      osc.frequency.setValueAtTime(1046.5, audioCtx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.7);
      break;
    case 'badge':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.setValueAtTime(1108.73, audioCtx.currentTime + 0.1);
      osc.frequency.setValueAtTime(1318.51, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.6);
      break;
    case 'click':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.08);
      break;
  }
}

// Debounce
export function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// Format number with commas
export function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Back arrow SVG
export function backArrowSVG() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>`;
}

// Speaker SVG
export function speakerSVG() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
}

// Generate Solid or Empty Stars based on score
export function generateStars(earned, max = 3) {
  let starsHtml = '';
  for (let i = 0; i < max; i++) {
    if (i < earned) {
      starsHtml += `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    } else {
      starsHtml += `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }
  }
  return `<div style="display:flex; gap:2px;">${starsHtml}</div>`;
}
