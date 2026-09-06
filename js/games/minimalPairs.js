// ===========================
// MINIMAL PAIRS GAME — Fonetik Ayrım & Dinleme Oyunu
// ===========================

import { Speech } from '../speech.js';
import { Storage } from '../storage.js';
import { playSound, showConfetti, showScoreFloat, shuffle } from '../utils.js';
import { navigate, AppState } from '../app.js';

export const MinimalPairsGame = {
  async start(root) {
    let pairs = [];
    try {
      const res = await fetch('data/minimalPairs.json');
      pairs = await res.json();
    } catch (e) {
      console.error('Minimal pairs verisi yüklenemedi:', e);
      pairs = [
        { pair: ["ship", "sheep"], phoneticHint: "Kısa [ɪ] vs Uzun [i:]", tr: ["Gemi", "Koyun"] },
        { pair: ["bit", "beat"], phoneticHint: "Kısa [ɪ] vs Uzun [i:]", tr: ["Parça", "Vurmak"] }
      ];
    }

    const questions = shuffle(pairs).slice(0, 10);
    let currentIndex = 0;
    let score = 0;
    let correctCount = 0;
    let streak = 0;
    let answered = false;

    function renderQuestion() {
      if (currentIndex >= questions.length) {
        navigate('result', {
          score,
          correct: correctCount,
          total: questions.length,
          mode: 'minimalPairs',
          points: score
        });
        return;
      }

      answered = false;
      const current = questions[currentIndex];
      // Pick target word randomly from the pair
      const isFirst = Math.random() < 0.5;
      const targetWord = isFirst ? current.pair[0] : current.pair[1];
      const targetTr = isFirst ? current.tr[0] : current.tr[1];

      root.innerHTML = `
        <div class="screen" style="padding-bottom: 120px;">
          <div class="container container-narrow stagger">
            
            <!-- Header Bar -->
            <div class="header-bar hover-lift" style="position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,0,0,0.05); margin: 0 -16px 24px -16px; padding: 16px 20px;">
              <button class="back-area hover-lift" id="exitBtn" style="background:none; border:none; cursor:pointer; font-weight: 500; display:flex; align-items:center; gap:6px; color:var(--text-primary);">
                <span class="material-symbols-outlined">arrow_back</span>
                <span>Çıkış</span>
              </button>
              <div style="font-family: var(--font-display); font-weight: 700; font-size: 15px; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
                <span>🎧 Fonetik Ayrım</span>
              </div>
              <div style="font-weight: 700; font-size: 14px; color:var(--accent-primary);">
                ${currentIndex + 1} / ${questions.length}
              </div>
            </div>

            <!-- Phonetic Card -->
            <div style="background:var(--bg-card); border:1px solid var(--bg-card-border); border-radius:24px; padding:32px 24px; text-align:center; box-shadow:var(--shadow-card); margin-bottom:24px;">
              <div style="display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:999px; background:rgba(124, 93, 250, 0.1); color:var(--accent-primary); font-size:12px; font-weight:700; margin-bottom:16px;">
                <span class="material-symbols-outlined text-[16px]">hearing</span>
                ${current.phoneticHint}
              </div>
              
              <h2 style="font-family:var(--font-display); font-size:22px; font-weight:800; color:var(--text-primary); margin-bottom:20px;">
                Hangi kelimeyi duyuyorsun?
              </h2>

              <!-- Big Audio Play Button -->
              <button id="playAudioBtn" class="hover-lift" style="width:84px; height:84px; border-radius:50%; background:linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:#fff; border:none; cursor:pointer; box-shadow:0 8px 32px rgba(124,93,250,0.4); display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px; transition:transform 0.2s;">
                <span class="material-symbols-outlined text-[36px]">volume_up</span>
              </button>
              <div style="font-size:13px; color:var(--text-tertiary); font-weight:600;">Sesi tekrar dinlemek için dokunun</div>
            </div>

            <!-- Choice Buttons Grid -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:24px;">
              ${current.pair.map((word, idx) => `
                <button class="pair-choice-btn hover-lift" data-word="${word}" style="padding:24px 16px; border-radius:20px; background:var(--bg-elevated); border:2px solid var(--bg-card-border); color:var(--text-primary); cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:8px; box-shadow:var(--shadow-sm); transition:all 0.2s;">
                  <span style="font-family:var(--font-display); font-size:24px; font-weight:800;">${word}</span>
                  <span style="font-size:13px; color:var(--text-tertiary); font-weight:600;">${current.tr[idx]}</span>
                </button>
              `).join('')}
            </div>

            <!-- Dynamic Feedback Box -->
            <div id="feedbackBox" style="display:none; padding:16px 20px; border-radius:18px; text-align:center; font-size:15px; font-weight:700; animation:popIn 0.3s ease;"></div>

          </div>
        </div>
      `;

      // Auto play audio
      setTimeout(() => {
        Speech.speak(targetWord, 'en-US');
      }, 350);

      document.getElementById('playAudioBtn')?.addEventListener('click', () => {
        Speech.speak(targetWord, 'en-US');
      });

      document.getElementById('exitBtn')?.addEventListener('click', () => {
        navigate('practice');
      });

      document.querySelectorAll('.pair-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;

          const chosen = btn.dataset.word;
          const isCorrect = chosen === targetWord;
          const fb = document.getElementById('feedbackBox');

          if (isCorrect) {
            btn.style.borderColor = 'var(--color-success)';
            btn.style.background = 'rgba(16, 185, 129, 0.15)';
            playSound('correct');
            streak++;
            score += 10 + (streak > 2 ? 5 : 0);
            correctCount++;
            showScoreFloat(`+${10 + (streak > 2 ? 5 : 0)}`);

            if (fb) {
              fb.style.display = 'block';
              fb.style.background = 'rgba(16, 185, 129, 0.1)';
              fb.style.color = 'var(--color-success)';
              fb.style.border = '1px solid rgba(16, 185, 129, 0.3)';
              fb.innerHTML = `✓ Harika! Doğru kelime: <strong>${targetWord}</strong> (${targetTr})`;
            }
          } else {
            btn.style.borderColor = 'var(--color-error)';
            btn.style.background = 'rgba(239, 68, 68, 0.15)';
            playSound('wrong');
            streak = 0;
            showScoreFloat('-3', true);

            // Highlight the correct one
            document.querySelectorAll('.pair-choice-btn').forEach(b => {
              if (b.dataset.word === targetWord) {
                b.style.borderColor = 'var(--color-success)';
                b.style.background = 'rgba(16, 185, 129, 0.1)';
              }
            });

            // Record mistake
            Storage.recordMistake({
              en: targetWord,
              tr: targetTr,
              ex: `${current.phoneticHint} ayrımında ${chosen} ile karıştırıldı.`
            }, 'pronunciation');

            if (fb) {
              fb.style.display = 'block';
              fb.style.background = 'rgba(239, 68, 68, 0.1)';
              fb.style.color = 'var(--color-error)';
              fb.style.border = '1px solid rgba(239, 68, 68, 0.3)';
              fb.innerHTML = `✗ Yanlış. Seslendirilen: <strong>${targetWord}</strong> (${current.phoneticHint})`;
            }
          }

          setTimeout(() => {
            currentIndex++;
            renderQuestion();
          }, 1600);
        });
      });
    }

    renderQuestion();
  }
};
