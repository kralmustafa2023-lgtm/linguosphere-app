// ===========================
// MATCH GAME
// ===========================

import { shuffle, playSound, showScoreFloat } from '../utils.js';
import { navigate, AppState } from '../app.js';

export const MatchGame = {
  start(root, lessonData) {
    if (!lessonData || !lessonData.vocabulary || lessonData.vocabulary.length < 4) {
      navigate('modeSelect', { lessonData });
      return;
    }

    const allWords = shuffle(lessonData.vocabulary).slice(0, 8);
    const enWords = shuffle(allWords.map(w => ({ text: w.en, id: w.en })));
    const trWords = shuffle(allWords.map(w => ({ text: w.tr, id: w.en })));

    let selectedEn = null;
    let selectedTr = null;
    let matched = new Set();
    let score = 0;
    let correct = 0;
    let wrong = 0;

    function render() {
      const progress = (matched.size / allWords.length) * 100;

      root.innerHTML = `
        <div class="game-container stagger">
          <div class="game-header">
          <div class="back-area" id="exitBtn" style="cursor:pointer;display:flex;align-items:center;gap:8px;color:var(--text-secondary);font-weight:600;font-size:14px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            <span>\u00C7\u0131k\u0131\u015F</span>
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-md)">
            <div class="score-display" style="background:var(--bg-glass-strong);padding:6px 16px;border-radius:var(--radius-full);border:1px solid rgba(0,0,0,0.06);box-shadow:var(--shadow-sm)">
              <span style="color:var(--color-success)">${score || 0}</span>
              <span class="score-label" style="opacity:0.7"> XP</span>
            </div>
          </div>
        </div>
        <div class="game-progress">
            <div class="game-progress-fill" style="width:${progress}%"></div>
          </div>

          <div class="game-body" style="align-items:stretch;padding-top:var(--space-lg)">
            <div style="text-align:center;margin-bottom:var(--space-lg)">
              <div class="game-question-text" style="font-size:18px">\u0130ngilizce ve T\u00FCrk\u00E7e e\u015Fle\u015Ftir</div>
            </div>

            <div class="match-layout">
              <div class="match-column">
                <div class="match-column-title">\uD83C\uDDEC\uD83C\uDDE7 English</div>
                ${enWords.map(w => `
                  <div class="match-item ${matched.has(w.id) ? 'matched' : ''} ${selectedEn === w.id ? 'selected' : ''}"
                       data-type="en" data-id="${w.id}">
                    ${w.text}
                  </div>
                `).join('')}
              </div>
              <div class="match-column">
                <div class="match-column-title">\uD83C\uDDF9\uD83C\uDDF7 T\u00FCrk\u00E7e</div>
                ${trWords.map(w => `
                  <div class="match-item ${matched.has(w.id) ? 'matched' : ''} ${selectedTr === w.id ? 'selected' : ''}"
                       data-type="tr" data-id="${w.id}">
                    ${w.text}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('exitBtn')?.addEventListener('click', () => {
        navigate('modeSelect', { lessonData: AppState.lessonData });
      });

      document.querySelectorAll('.match-item:not(.matched)').forEach(item => {
        item.addEventListener('click', () => {
          const type = item.dataset.type;
          const id = item.dataset.id;

          if (type === 'en') {
            selectedEn = id;
          } else {
            selectedTr = id;
          }

          if (selectedEn && selectedTr) {
            if (selectedEn === selectedTr) {
              matched.add(selectedEn);
              score += 15;
              correct++;
              playSound('correct');
              showScoreFloat('+15');
            } else {
              score = Math.max(0, score - 3);
              wrong++;
              playSound('wrong');
              showScoreFloat('-3', true);

              document.querySelectorAll('.match-item.selected').forEach(el => {
                el.classList.add('wrong');
              });
              setTimeout(() => {
                document.querySelectorAll('.match-item.wrong').forEach(el => {
                  el.classList.remove('wrong');
                });
              }, 500);
            }

            selectedEn = null;
            selectedTr = null;

            if (matched.size >= allWords.length) {
              setTimeout(() => {
                navigate('result', {
                  score,
                  correct,
                  total: correct + wrong,
                  mode: 'match',
                  points: score
                });
              }, 600);
            } else {
              setTimeout(render, 300);
            }
          } else {
            render();
          }
        });
      });
    }

    render();
  }
};
