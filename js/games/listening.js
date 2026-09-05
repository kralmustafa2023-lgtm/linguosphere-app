// ===========================
// LISTENING GAME
// ===========================

import { shuffle, playSound, showScoreFloat } from '../utils.js';
import { Speech } from '../speech.js';
import { navigate, AppState } from '../app.js';

export const ListeningGame = {
  start(root, lessonData) {
    const vocab = lessonData ? (lessonData.vocabulary || []) : [];
    const listWords = (lessonData && lessonData.listeningWords) ? lessonData.listeningWords : vocab.map(v => v.en);

    if (!lessonData || listWords.length === 0) {
      navigate('modeSelect', { lessonData });
      return;
    }

    const listeningWords = shuffle(listWords);
    
    const questions = listeningWords.map(word => {
      const vItem = vocab.find(v => v.en === word);
      if (!vItem) return null;

      const wrongs = shuffle(vocab.filter(v => v.en !== word))
        .slice(0, 3)
        .map(v => v.en);

      return {
        en: word,
        tr: vItem.tr,
        emoji: vItem.emoji,
        options: shuffle([word, ...wrongs])
      };
    }).filter(Boolean);

    if (questions.length === 0) {
      navigate('modeSelect', { lessonData });
      return;
    }

    let currentIndex = 0;
    let score = 0;
    let correct = 0;
    let answered = false;

    function renderQuestion() {
      const q = questions[currentIndex];
      const progress = ((currentIndex + 1) / questions.length) * 100;
      answered = false;

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
              <div style="font-size:13px;color:var(--text-muted);margin-bottom:var(--space-md)">Dinleyin ve do\u011Fru kelimeyi se\u00E7in</div>
            </div>

            <!-- Play buttons -->
            <div class="listening-play-area">
              <button class="listening-play-btn" id="playBtn">
                \uD83D\uDD0A
              </button>
              <button class="listening-slow-btn" id="slowBtn">
                \uD83D\uDC22 Yava\u015F Dinle
              </button>
            </div>

            <!-- Options -->
            <div class="game-answer-area">
              <div class="quiz-options">
                ${q.options.map(opt => `
                  <button class="quiz-option" data-answer="${opt}">
                    ${opt}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      // Auto play the word
      setTimeout(() => Speech.english(q.en), 500);

      document.getElementById('exitBtn')?.addEventListener('click', () => {
        Speech.stop();
        navigate('modeSelect', { lessonData: AppState.lessonData });
      });

      document.getElementById('playBtn')?.addEventListener('click', () => {
        Speech.english(q.en);
      });

      document.getElementById('slowBtn')?.addEventListener('click', () => {
        Speech.slow(q.en);
      });

      document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const selected = btn.dataset.answer;
          const isCorrect = selected === q.en;

          document.querySelectorAll('.quiz-option').forEach(b => {
            b.disabled = true;
            if (b.dataset.answer === q.en) b.classList.add('correct');
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
            score = Math.max(0, score - 3);
            playSound('wrong');
            showScoreFloat('-3', true);
          }
          
          setTimeout(() => Speech.english(q.en), 300);

          setTimeout(() => {
            currentIndex++;
            if (currentIndex >= questions.length) {
              navigate('result', {
                score,
                correct,
                total: questions.length,
                mode: 'listening',
                points: score
              });
            } else {
              renderQuestion();
            }
          }, 1500);
        });
      });
    }

    renderQuestion();
  }
};
