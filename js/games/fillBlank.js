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

      const sentenceHTML = q.s.replace('___', '<span style="color:var(--color-info);font-weight:800;border-bottom:3px dashed var(--color-info);padding:0 8px">___</span>');

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

          <div class="game-body">
            <div class="game-question-area">
              <div style="font-size:13px;color:var(--text-muted);margin-bottom:var(--space-sm)">Bo\u015Flu\u011Fu doldurun</div>
              <div class="game-question-text" style="font-size:20px;line-height:1.6">${sentenceHTML}</div>
              <div style="font-size:14px;color:var(--text-muted);margin-top:var(--space-sm);font-style:italic">${q.tr}</div>
            </div>

            <div class="game-answer-area">
              <div class="quiz-options">
                ${options.map(opt => `
                  <button class="quiz-option" data-answer="${opt}">
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
