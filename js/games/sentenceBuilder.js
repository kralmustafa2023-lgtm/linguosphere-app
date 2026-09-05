// ===========================
// SENTENCE BUILDER GAME
// ===========================

import { shuffle, playSound, showScoreFloat } from '../utils.js';
import { navigate, AppState } from '../app.js';

export const SentenceGame = {
  start(root, lessonData) {
    let rawSentences = (lessonData && lessonData.sentences && lessonData.sentences.length > 0) ? lessonData.sentences : [];
    if (!rawSentences.length && lessonData && lessonData.vocabulary && lessonData.vocabulary.length > 0) {
      rawSentences = lessonData.vocabulary.slice(0, 8).map(v => ({
        en: `This is ${v.word || v.en}`,
        tr: `Bu ${v.meaning || v.tr}`
      }));
    }
    if (!rawSentences.length) {
      navigate('modeSelect', { lessonData });
      return;
    }
    const sentences = shuffle(rawSentences);
    let currentIndex = 0;
    let score = 0;
    let correct = 0;
    let selectedWords = [];

    function renderSentence() {
      const s = sentences[currentIndex];
      const progress = ((currentIndex + 1) / sentences.length) * 100;
      selectedWords = [];

      // Shuffle the words from the correct answer
      const correctWords = s.en.split(' ');
      const shuffledWords = shuffle([...correctWords]);

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
              <div style="font-size:13px;color:var(--text-muted);margin-bottom:var(--space-sm)">C\u00FCmleyi kurun</div>
              <div class="game-question-text" style="color:var(--mode-sentence)">${s.tr}</div>
            </div>

            <div class="game-answer-area" style="width:100%;max-width:500px">
              <!-- Sentence Area -->
              <div class="sentence-area" id="sentenceArea" style="min-height:60px;margin-bottom:var(--space-lg)">
                <span style="color:var(--text-muted);font-size:14px" id="placeholder">Kelimelere t\u0131klayarak c\u00FCmle kurun...</span>
              </div>

              <!-- Word Chips -->
              <div class="sentence-chips" id="wordChips">
                ${shuffledWords.map((word, i) => `
                  <div class="chip" data-word="${word}" data-index="${i}">${word}</div>
                `).join('')}
              </div>

              <div style="display:flex;gap:var(--space-md);margin-top:var(--space-xl);justify-content:center">
                <button class="btn btn-ghost" id="clearBtn">\uD83D\uDD04 Temizle</button>
                <button class="btn btn-primary" id="checkBtn">\u2705 Kontrol Et</button>
              </div>

              <div id="feedback" style="margin-top:var(--space-md);text-align:center;min-height:50px"></div>
            </div>
          </div>
        </div>
      `;

      // Events
      document.getElementById('exitBtn')?.addEventListener('click', () => {
        navigate('modeSelect', { lessonData: AppState.lessonData });
      });

      // Word click
      document.querySelectorAll('#wordChips .chip').forEach(chip => {
        chip.addEventListener('click', () => {
          if (chip.classList.contains('used')) return;

          chip.classList.add('used');
          selectedWords.push(chip.dataset.word);
          updateSentenceArea();
        });
      });

      // Sentence area click to remove last word
      document.getElementById('sentenceArea')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('chip')) {
          const word = e.target.dataset.word;
          const idx = selectedWords.lastIndexOf(word);
          if (idx !== -1) {
            selectedWords.splice(idx, 1);
            // Un-use the chip
            const chips = document.querySelectorAll('#wordChips .chip.used');
            for (const c of chips) {
              if (c.dataset.word === word) {
                c.classList.remove('used');
                break;
              }
            }
            updateSentenceArea();
          }
        }
      });

      // Clear
      document.getElementById('clearBtn')?.addEventListener('click', () => {
        selectedWords = [];
        document.querySelectorAll('#wordChips .chip').forEach(c => c.classList.remove('used'));
        updateSentenceArea();
      });

      // Check
      document.getElementById('checkBtn')?.addEventListener('click', () => {
        checkAnswer(s, correctWords);
      });
    }

    function updateSentenceArea() {
      const area = document.getElementById('sentenceArea');
      const placeholder = document.getElementById('placeholder');

      if (selectedWords.length === 0) {
        area.innerHTML = `<span style="color:var(--text-muted);font-size:14px" id="placeholder">Kelimelere t\u0131klayarak c\u00FCmle kurun...</span>`;
      } else {
        area.innerHTML = selectedWords.map(w =>
          `<div class="chip selected" data-word="${w}">${w}</div>`
        ).join('');
      }
    }

    function checkAnswer(s, correctWords) {
      const feedback = document.getElementById('feedback');
      const area = document.getElementById('sentenceArea');
      const userSentence = selectedWords.join(' ');
      const isCorrect = userSentence.toLowerCase() === s.en.toLowerCase();

      if (isCorrect) {
        area.classList.add('correct');
        score += 15;
        correct++;
        playSound('correct');
        showScoreFloat('+15');
        feedback.innerHTML = `<span style="color:var(--color-success);font-weight:700;font-size:16px">\u2705 M\u00FCkemmel!</span>`;
      } else {
        area.classList.add('wrong');
        playSound('wrong');
        feedback.innerHTML = `<span style="color:var(--color-error);font-weight:700;font-size:16px">\u274C Do\u011Frusu: ${s.en}</span>`;
      }

      setTimeout(() => {
        currentIndex++;
        if (currentIndex >= sentences.length) {
          navigate('result', {
            score,
            correct,
            total: sentences.length,
            mode: 'sentenceBuilder',
            points: score
          });
        } else {
          renderSentence();
        }
      }, 1500);
    }

    renderSentence();
  }
};
