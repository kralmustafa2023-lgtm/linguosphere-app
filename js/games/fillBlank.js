// ===========================
// FILL BLANK GAME
// ===========================

import { shuffle, playSound, showScoreFloat } from '../utils.js';
import { navigate, AppState } from '../app.js';

export const FillBlankGame = {
  start(root, lessonData) {
    let questions = (lessonData && lessonData.fillBlanks && lessonData.fillBlanks.length > 0) ? shuffle(lessonData.fillBlanks) : [];
    if (!questions.length && lessonData && lessonData.vocabulary && lessonData.vocabulary.length > 0) {
      questions = lessonData.vocabulary.slice(0, 10).map(v => {
        const word = v.word || v.en;
        const meaning = v.meaning || v.tr;
        const options = [word];
        const dummyWords = (lessonData.vocabulary || []).map(x => x.word || x.en).filter(w => w !== word);
        shuffle(dummyWords);
        options.push(...dummyWords.slice(0, 3));
        return {
          s: `Anlamı "${meaning}" olan kelime hangisidir? ___`,
          a: word,
          o: options
        };
      });
    }
    if (!questions.length) {
      navigate('modeSelect', { lessonData });
      return;
    }
    let currentIndex = 0;
    let score = 0;
    let correct = 0;
    let answered = false;

    function renderQuestion() {
      const q = questions[currentIndex];
      const options = shuffle(q.o);
      const progress = ((currentIndex + 1) / questions.length) * 100;
      answered = false;

      const sentenceHTML = q.s.replace('___', '<mark style="display:inline-block; margin:0 8px; padding:2px 16px; border-radius:12px; background:rgba(124, 58, 237, 0.25); color:var(--accent-primary); border-bottom:3px solid var(--accent-primary); font-weight:900; font-size:26px;">___</mark>');

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

          <div class="game-body" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; max-width:620px; margin:0 auto; padding-top:var(--space-md);">
            <!-- High-Contrast Ultra-Readable Question Card -->
            <div class="game-question-area" style="background:var(--bg-card-solid); border:2px solid var(--bg-card-border); border-radius:28px; padding:36px 28px; box-shadow:var(--shadow-card); text-align:center; width:100%; margin-bottom:28px;">
              <div style="display:inline-block; margin-bottom:16px;">
                <span style="font-size:12px; font-weight:800; background:rgba(16, 185, 129, 0.15); color:var(--color-success); padding:6px 16px; border-radius:20px; text-transform:uppercase; letter-spacing:0.06em; border:1px solid rgba(16, 185, 129, 0.3);">Boşluğu Doldurun</span>
              </div>
              <div class="game-question-text" style="font-size:28px !important; font-weight:800 !important; color:var(--text-primary) !important; line-height:1.6; margin-bottom:16px;">
                ${sentenceHTML}
              </div>
              ${(q.hint || q.tr) ? `<div style="font-size:16px; font-weight:600; color:var(--text-secondary); background:var(--bg-surface); padding:10px 18px; border-radius:14px; display:inline-block; border:1px solid var(--bg-card-border); max-width:100%;">
                💡 ${q.hint || q.tr}
              </div>` : ''}
            </div>

            <!-- Answer Options Grid -->
            <div class="game-answer-area" style="width:100%;">
              <div class="quiz-options" style="display:grid; grid-template-columns:1fr 1fr; gap:14px; width:100%;">
                ${options.map(opt => `
                  <button class="quiz-option hover-lift" data-answer="${opt}" style="padding:18px 20px; font-size:17px; font-weight:700; text-align:center; background:var(--bg-card-solid); border:2px solid var(--bg-card-border); border-radius:18px; color:var(--text-primary); cursor:pointer; transition:all 0.2s;">
                    ${opt}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('exitBtn')?.addEventListener('click', () => {
        navigate('modeSelect', { lessonData: AppState.lessonData });
      });

      document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const selected = btn.dataset.answer;
          const isCorrect = selected === q.a;

          document.querySelectorAll('.quiz-option').forEach(b => {
            b.disabled = true;
            if (b.dataset.answer === q.a) b.classList.add('correct');
          });

          if (isCorrect) {
            btn.classList.add('correct');
            btn.classList.add('answer-correct');
            score += 10;
            correct++;
            playSound('correct');
            showScoreFloat('+10');
          } else {
            btn.classList.add('wrong');
            btn.classList.add('answer-wrong');
            score = Math.max(0, score - 5);
            playSound('wrong');
            showScoreFloat('-5', true);
          }

          setTimeout(() => {
            currentIndex++;
            if (currentIndex >= questions.length) {
              navigate('result', {
                score,
                correct,
                total: questions.length,
                mode: 'fillBlank',
                points: score
              });
            } else {
              renderQuestion();
            }
          }, 1200);
        });
      });
    }

    renderQuestion();
  }
};
