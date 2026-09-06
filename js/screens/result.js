// ===========================
// RESULT SCREEN — Celebration
// ===========================

import { Storage } from '../storage.js';
import { showConfetti, calcStars, playSound, formatNumber } from '../utils.js';
import { checkBadges } from '../progress.js';
import { navigate, AppState } from '../app.js';

export const ResultScreen = {
  render(root, params) {
    const { score, correct, total, mode, points } = params;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const stars = calcStars(percent);

    // Save progress
    const levelId = AppState.currentLevel;
    const lessonId = AppState.currentLesson;
    const modeId = AppState.currentMode || mode;
    
    const state = Storage.completeLesson(levelId, lessonId, percent, modeId);
    
    // Check badges
    setTimeout(() => checkBadges(state), 500);

    // Determine message
    let emoji, title, subtitle, colorClass;
    if (percent >= 90) {
      emoji = '🏆';
      title = 'Mükemmel!';
      subtitle = 'Kusursuz bir performans sergiledin!';
      colorClass = 'var(--color-warning)';
    } else if (percent >= 70) {
      emoji = '🌟';
      title = 'Harika!';
      subtitle = 'Çok iyi gidiyorsun, böyle devam et.';
      colorClass = 'var(--accent-primary)';
    } else if (percent >= 50) {
      emoji = '👍';
      title = 'İyi İş!';
      subtitle = 'Biraz daha pratikle mükemmel olabilir.';
      colorClass = 'var(--color-info)';
    } else {
      emoji = '💪';
      title = 'Tekrar Dene!';
      subtitle = 'Hatalarından öğrenerek daha iyi olabilirsin.';
      colorClass = 'var(--color-error)';
    }

    root.innerHTML = `
      <div class="result-screen stagger">
        <div class="result-emoji bounce-in" style="filter:drop-shadow(0 12px 32px ${colorClass}44)">${emoji}</div>
        <h1 class="result-title">
          <span style="color:${colorClass}">${title}</span>
        </h1>
        <p class="result-subtitle">${subtitle}</p>

        <!-- Stars -->
        <div class="result-stars">
          ${[1, 2, 3].map(i => `
            <div class="result-star star-reveal" style="opacity:0;${i <= stars ? 'color:var(--color-warning);filter:drop-shadow(0 0 12px rgba(242, 169, 59, 0.4))' : 'color:rgba(255,255,255,0.1)'}">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="${i <= stars ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="${i <= stars ? '0' : '1'}" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
          `).join('')}
        </div>

        <!-- Stats -->
        <div class="result-stats">
          <div class="result-stat hover-lift">
            <div class="result-stat-value" style="color:var(--color-success)">${correct}</div>
            <div class="result-stat-label">Doğru</div>
          </div>
          <div class="result-stat hover-lift">
            <div class="result-stat-value" style="color:var(--color-error)">${total - correct}</div>
            <div class="result-stat-label">Yanlış</div>
          </div>
          ${params.examNet !== undefined ? `
            <div class="result-stat hover-lift">
              <div class="result-stat-value" style="color:var(--accent-primary)">${params.examNet}</div>
              <div class="result-stat-label">Sınav Neti (ÖSYM)</div>
            </div>
          ` : `
            <div class="result-stat hover-lift">
              <div class="result-stat-value" style="color:var(--color-info)">%${percent}</div>
              <div class="result-stat-label">Başarı</div>
            </div>
          `}
          <div class="result-stat hover-lift">
            <div class="result-stat-value" style="color:var(--color-warning)">+${points || Math.round(percent * 0.5)}</div>
            <div class="result-stat-label">XP Kazanıldı</div>
          </div>
        </div>

        <!-- Actions -->
        <div class="result-actions">
          <button class="btn btn-primary btn-lg btn-glow btn-full" id="replayBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.27l-5.42 5.42"/></svg>
            Tekrar Oyna
          </button>
          <button class="btn btn-secondary btn-full" id="modesBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Diğer Modlar
          </button>
          <button class="btn btn-ghost btn-full" id="homeBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Ana Menüye Dön
          </button>
        </div>
      </div>
      <style>
        .hover-lift { transition: transform var(--trans-fast), box-shadow var(--trans-fast); }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: var(--shadow-card); }
      </style>
    `;

    // Show confetti for good results
    if (percent >= 70) {
      setTimeout(() => showConfetti(percent >= 90 ? 120 : 60), 300);
      playSound('levelup');
    } else {
      playSound('click');
    }

    // Animate stars
    setTimeout(() => {
      document.querySelectorAll('.result-star').forEach((star) => {
        star.style.opacity = '1';
      });
    }, 100);

    this.attachEvents();
  },

  attachEvents() {
    document.getElementById('replayBtn')?.addEventListener('click', () => {
      const modeScreenMap = {
        flashcard: 'flashcard',
        quiz: 'quiz',
        match: 'match',
        fillBlank: 'fillBlank',
        sentenceBuilder: 'sentenceBuilder',
        speedRound: 'speedRound',
        typing: 'typing',
        listening: 'listening',
        voicePronunciation: 'voicePronunciation',
        shadowing: 'shadowing'
      };
      const screen = modeScreenMap[AppState.currentMode] || 'flashcard';
      navigate(screen);
    });

    document.getElementById('modesBtn')?.addEventListener('click', () => {
      navigate('modeSelect', { lessonData: AppState.lessonData });
    });

    document.getElementById('homeBtn')?.addEventListener('click', () => {
      navigate('home');
    });
  }
};
