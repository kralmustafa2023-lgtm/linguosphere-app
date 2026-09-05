// ===========================
// FLASHCARD GAME — Minimalist & Clean
// ===========================

import { playSound, showScoreFloat } from '../utils.js';
import { Storage } from '../storage.js';
import { navigate, AppState } from '../app.js';

export const FlashcardGame = {
  words: [],
  currentIndex: 0,
  knownCount: 0,
  unknownCount: 0,
  isFlipped: false,
  totalUnique: 0,

  start(root, lessonData, levelId, lessonId) {
    if (!lessonData || !lessonData.vocabulary || lessonData.vocabulary.length === 0) {
      navigate('modeSelect', { lessonData });
      return;
    }

    this.words = [...lessonData.vocabulary].sort(() => Math.random() - 0.5);
    this.currentIndex = 0;
    this.knownCount = 0;
    this.unknownCount = 0;
    this.totalUnique = this.words.length;
    this.isFlipped = false;
    this.root = root;
    this.lessonData = lessonData;
    
    this.render();
  },

  render() {
    if (this.currentIndex >= this.words.length) {
      this.finish();
      return;
    }

    const word = this.words[this.currentIndex];
    this.isFlipped = false;
    
    const progress = (this.knownCount / this.totalUnique) * 100;
    const srsData = Storage.load().srsData || {};
    const wordSRS = srsData[word.en] || { mastery: 20, box: 1 };
    const masteryLabel = wordSRS.mastery >= 80 ? '👑 %100 Usta' : wordSRS.mastery >= 50 ? '🌳 %60 Kavrandı' : '🌱 %20 Öğreniliyor';

    this.root.innerHTML = `
      <div class="game-container stagger">
        <!-- Header -->
        <div class="game-header" style="background:transparent; border:none; backdrop-filter:none;">
          <div class="back-area" id="quitBtn" style="cursor:pointer; display:flex; align-items:center; gap:8px; color:var(--text-secondary); font-weight:600; font-size:14px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <span>Çıkış</span>
          </div>
          <div style="font-size:12px; font-weight:800; background:rgba(124,93,250,0.15); color:var(--accent-primary); padding:4px 10px; border-radius:12px;">
            ${masteryLabel}
          </div>
          <div class="counter" style="background:var(--bg-glass-strong); padding:6px 16px; border-radius:var(--radius-full); border:1px solid rgba(0,0,0,0.06);">
            <span class="current" style="color:var(--accent-primary)">${Math.min(this.knownCount + 1, this.totalUnique)}</span> / ${this.totalUnique}
          </div>
        </div>

        <!-- Progress -->
        <div class="game-progress" style="margin: 0 var(--space-lg) var(--space-xl); background: rgba(0,0,0,0.04)">
          <div class="game-progress-fill" style="width:${progress}%; box-shadow: 0 0 16px rgba(124, 93, 250, 0.4);"></div>
        </div>

        <!-- Flashcard Body -->
        <div class="game-body" style="padding-top: 0; justify-content: center;">
          
          <div class="flashcard-scene" id="cardScene" style="perspective: 1200px; width:100%; max-width: 320px; height: 380px; flex-shrink: 0; cursor: pointer;">
            <div class="flashcard-inner card-inner" id="cardInner" style="width:100%; height:100%; position:relative; transform-style:preserve-3d; transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);">
              
              <!-- Front (English) -->
              <div class="flashcard-face" style="position:absolute; inset:0; backface-visibility:hidden; background:var(--bg-card-solid); border:1px solid rgba(0,0,0,0.08); border-radius:var(--radius-2xl); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:var(--space-xl); box-shadow:var(--shadow-card);">
                <div style="font-size:48px; margin-bottom:12px;">${word.emoji || '📖'}</div>
                <div style="font-size:42px; font-weight:700; color:var(--text-primary); text-align:center; font-family:var(--font-display); letter-spacing:-0.02em;">${word.en}</div>
                <div style="font-size:12px; color:var(--text-tertiary); margin-top:16px; font-weight:600;">⚡ Çevirmek için dokunun</div>
              </div>

              <!-- Back (Turkish) -->
              <div class="flashcard-face flashcard-back" style="position:absolute; inset:0; backface-visibility:hidden; background:linear-gradient(135deg, var(--bg-card-solid), var(--bg-surface)); border:1px solid rgba(0,0,0,0.08); border-radius:var(--radius-2xl); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:var(--space-xl); transform: rotateY(180deg); box-shadow:var(--shadow-card);">
                <div style="font-size:36px; font-weight:700; color:var(--color-success); text-align:center; font-family:var(--font-display); margin-bottom:8px;">${word.tr}</div>
                ${word.ex ? `<div style="font-size:13px; color:var(--text-secondary); text-align:center; font-style:italic;">"${word.ex}"</div>` : ''}
              </div>
              
            </div>
          </div>

           <!-- Minimalist Buttons -->
          <div id="controlsArea" style="opacity:0; transform:translateY(20px); transition:all 0.4s ease; display:flex; gap:var(--space-md); margin-top:40px; width:100%; max-width:320px; pointer-events:none;">
             <button class="btn hover-lift" id="dunnoBtn" style="flex:1; background:rgba(239, 68, 68, 0.08); color:var(--color-error); border:1px solid rgba(239, 68, 68, 0.2); font-size:16px; font-weight:600; border-radius:var(--radius-xl); min-height:56px;">
               Bilemedim
             </button>
             <button class="btn hover-lift" id="knewBtn" style="flex:1; background:var(--color-success); color:#fff; box-shadow:0 8px 24px rgba(16, 185, 129, 0.25); font-size:16px; border-radius:var(--radius-xl); font-weight:700; min-height:56px;">
               Bildim
             </button>
          </div>

        </div>
      </div>
    `;

    this.attachEvents(word);
  },

  attachEvents(word) {
    const cardScene = document.getElementById('cardScene');
    const cardInner = document.getElementById('cardInner');
    const controlsArea = document.getElementById('controlsArea');
    const knewBtn = document.getElementById('knewBtn');
    const dunnoBtn = document.getElementById('dunnoBtn');
    const quitBtn = document.getElementById('quitBtn');

    // Quit
    quitBtn?.addEventListener('click', () => {
      navigate('modeSelect', { lessonData: AppState.lessonData });
    });

    // Flip Card
    cardScene?.addEventListener('click', () => {
      if (!this.isFlipped) {
        this.isFlipped = true;
        cardInner.classList.add('flipped');
        
        // Show buttons
        controlsArea.style.opacity = '1';
        controlsArea.style.transform = 'translateY(0)';
        controlsArea.style.pointerEvents = 'auto';
        playSound('correct'); // Optional flip sound
      }
    });

    // Known
    knewBtn?.addEventListener('click', () => {
      if (!this.isFlipped) return;
      this.knownCount++;
      Storage.updateSRSWord(word.en, true);
      playSound('correct');
      showScoreFloat('+1');
      this.nextCard();
    });

    // Unknown
    dunnoBtn?.addEventListener('click', () => {
      if (!this.isFlipped) return;
      this.unknownCount++;
      Storage.updateSRSWord(word.en, false);
      Storage.recordMistake(word);
      // Push word to end of queue to practice again
      this.words.push(this.words[this.currentIndex]);
      playSound('wrong');
      this.nextCard();
    });
  },

  nextCard() {
    this.currentIndex++;
    setTimeout(() => this.render(), 300);
  },

  finish() {
    navigate('result', {
      score: this.knownCount * 5, // Simple XP logic
      correct: this.knownCount,
      total: this.knownCount + this.unknownCount,
      mode: 'flashcard',
      points: this.knownCount * 5
    });
  }
};
