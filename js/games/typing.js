// ===========================
// TYPING GAME
// ===========================

import { shuffle, levenshtein, playSound, showScoreFloat } from '../utils.js';
import { Speech } from '../speech.js';
import { navigate, AppState } from '../app.js';

export const TypingGame = {
  start(root, lessonData) {
    if (!lessonData || !lessonData.vocabulary || lessonData.vocabulary.length === 0) {
      navigate('modeSelect', { lessonData });
      return;
    }

    const words = shuffle(lessonData.vocabulary).slice(0, 15);
    let currentIndex = 0;
    let score = 0;
    let correct = 0;
    let answered = false;

    function renderWord() {
      const word = words[currentIndex];
      const progress = ((currentIndex + 1) / words.length) * 100;
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
              <div style="font-size:13px;color:var(--text-muted);margin-bottom:var(--space-sm)">\u0130ngilizce kar\u015F\u0131l\u0131\u011F\u0131n\u0131 yaz\u0131n</div>
              <div style="font-size:48px;margin-bottom:var(--space-sm)">${word.emoji || '\uD83D\uDCA1'}</div>
              <div class="game-question-text" style="color:var(--mode-typing)">${word.tr}</div>
              ${word.ex ? `
                <div class="typing-word-display">"${word.exTR}"</div>
              ` : ''}
            </div>

            <div class="game-answer-area" style="width:100%;max-width:400px">
              <input type="text" class="input-field" id="typingInput" 
                     placeholder="\u0130ngilizce yaz\u0131n..." 
                     autocomplete="off" autocapitalize="off" spellcheck="false">
              
              <div id="feedback" style="margin-top:var(--space-md);text-align:center;min-height:50px"></div>

              <div style="display:flex;gap:var(--space-md);margin-top:var(--space-md)">
                <button class="btn btn-ghost" id="speakBtn">\uD83D\uDD0A Dinle</button>
                <button class="btn btn-primary btn-full" id="checkBtn">\u2705 Kontrol Et</button>
              </div>
              
              <div class="typing-hint" style="text-align:center;margin-top:var(--space-md)">
                \uD83D\uDCA1 \u0130pucu: ${word.en.length} harf
              </div>
            </div>
          </div>
        </div>
      `;

      const input = document.getElementById('typingInput');
      setTimeout(() => input?.focus(), 100);

      document.getElementById('exitBtn')?.addEventListener('click', () => {
        navigate('modeSelect', { lessonData: AppState.lessonData });
      });

      document.getElementById('speakBtn')?.addEventListener('click', () => {
        Speech.english(word.en);
      });

      input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkAnswer(word);
      });

      document.getElementById('checkBtn')?.addEventListener('click', () => {
        checkAnswer(word);
      });
    }

    function checkAnswer(word) {
      if (answered) return;
      answered = true;

      const input = document.getElementById('typingInput');
      const feedback = document.getElementById('feedback');
      const userInput = (input?.value || '').trim();

      if (!userInput) {
        answered = false;
        return;
      }

      const a = userInput.toLowerCase();
      const b = word.en.toLowerCase();
      const result = getResult(a, b, word.en);

      input.disabled = true;

      if (result.type === 'correct') {
        input.classList.add('input-correct');
        score += 15;
        correct++;
        playSound('correct');
        showScoreFloat('+15');
        Speech.english(word.en);
        feedback.innerHTML = `<span style="color:var(--color-success);font-weight:700;font-size:16px">${result.msg}</span>`;
      } else if (result.type === 'partial') {
        input.classList.add('input-correct');
        score += 7;
        correct++;
        playSound('correct');
        showScoreFloat('+7');
        Speech.english(word.en);
        feedback.innerHTML = `<span style="color:var(--color-warning);font-weight:700;font-size:16px">${result.msg}</span>`;
      } else {
        input.classList.add('input-wrong');
        playSound('wrong');
        feedback.innerHTML = `<span style="color:var(--color-error);font-weight:700;font-size:16px">${result.msg}</span>`;
      }

      setTimeout(() => {
        currentIndex++;
        if (currentIndex >= words.length) {
          navigate('result', {
            score,
            correct,
            total: words.length,
            mode: 'typing',
            points: score
          });
        } else {
          renderWord();
        }
      }, 2000);
    }

    function getResult(input, answer, original) {
      if (input === answer) {
        return { type: 'correct', points: 15, msg: '\u2705 M\u00FCkemmel! +15' };
      }
      const dist = levenshtein(input, answer);
      if (dist === 1) {
        return { type: 'partial', points: 7, msg: `\uD83D\uDCA1 Yak\u0131n! Do\u011Frusu: ${original} +7` };
      }
      return { type: 'wrong', points: 0, msg: `\u274C Do\u011Frusu: ${original}` };
    }

    renderWord();
  }
};
