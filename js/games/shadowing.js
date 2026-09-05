// ===========================
// SHADOWING GAME — Gölgeleme Tekniği Modu
// ===========================

import { shuffle, playSound, showScoreFloat, levenshtein } from '../utils.js';
import { Speech } from '../speech.js';
import { Storage } from '../storage.js';
import { navigate, AppState } from '../app.js';

export const ShadowingGame = {
  start(root, lessonData) {
    let rawSentences = (lessonData && lessonData.sentences && lessonData.sentences.length > 0) ? lessonData.sentences : [];
    if (!rawSentences.length && lessonData && lessonData.vocabulary) {
      rawSentences = lessonData.vocabulary.map(v => ({
        en: v.word || v.en,
        tr: v.meaning || v.tr
      }));
    }
    const sentences = shuffle(rawSentences).slice(0, 8);
    if (!sentences.length) {
      navigate('modeSelect', { lessonData });
      return;
    }

    let currentIndex = 0;
    let score = 0;

    function renderStep() {
      const s = sentences[currentIndex];
      const progress = ((currentIndex + 1) / sentences.length) * 100;

      root.innerHTML = `
        <div class="game-container stagger">
          <div class="game-header">
            <div class="back-area" id="exitBtn" style="cursor:pointer;display:flex;align-items:center;gap:8px;color:var(--text-secondary);font-weight:600;font-size:14px">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              <span>Çıkış</span>
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

          <div class="game-body" style="justify-content:center; text-align:center;">
            
            <div style="font-size:13px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:12px;">
              🎧 Gölgeleme (Shadowing) Modu
            </div>

            <div style="font-size:14px; color:var(--text-secondary); margin-bottom:24px; max-width:320px; margin-left:auto; margin-right:auto;">
              Önce cümleyi dinleyin, hemen ardından aynı ritim ve vurguyla mikrofona tekrar edin!
            </div>

            <div style="background:var(--bg-card); border:1px solid var(--bg-card-border); border-radius:24px; padding:24px; margin-bottom:32px; box-shadow:0 12px 32px rgba(0,0,0,0.04);">
              <div style="font-family:var(--font-display); font-size:24px; font-weight:800; color:var(--text-primary); margin-bottom:8px;">
                "${s.en}"
              </div>
              <div style="font-size:15px; font-weight:600; color:var(--color-success); font-style:italic;">
                "${s.tr}"
              </div>
            </div>

            <!-- Controls -->
            <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
              
              <div style="display:flex; gap:12px;">
                <button id="playAudioBtn" class="btn btn-primary" style="border-radius:16px; padding:12px 24px; font-weight:700;">
                  🔊 Orijinal Ses (Dinle)
                </button>
                <button id="slowAudioBtn" class="btn btn-ghost" style="border-radius:16px; padding:12px 20px; font-weight:700;">
                  🐢 0.75x Yavaş
                </button>
              </div>

              <button id="micBtn" class="hover-lift" style="width:84px; height:84px; border-radius:50%; background:linear-gradient(135deg, #10b981, #059669); border:none; color:white; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 12px 32px rgba(16,185,129,0.3);">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              </button>

              <div id="statusText" style="font-size:14px; font-weight:600; color:var(--text-tertiary);">
                Seslendirmek için mikrofona tıklayın
              </div>

            </div>

            <div id="shadowingFeedback" style="margin-top:28px; min-height:50px;"></div>

          </div>
        </div>
      `;

      // Auto play sentence on load
      setTimeout(() => Speech.english(s.en), 400);

      attachEvents(s);
    }

    function attachEvents(s) {
      document.getElementById('exitBtn')?.addEventListener('click', () => {
        Speech.stopListening();
        navigate('modeSelect', { lessonData: AppState.lessonData });
      });

      document.getElementById('playAudioBtn')?.addEventListener('click', () => {
        Speech.english(s.en);
      });

      document.getElementById('slowAudioBtn')?.addEventListener('click', () => {
        Speech.slow(s.en);
      });

      document.getElementById('micBtn')?.addEventListener('click', () => {
        if (!Speech.hasSpeechRecognition()) {
          alert('Tarayıcınız ses tanıma özelliğini desteklemiyor.');
          return;
        }

        const statusText = document.getElementById('statusText');
        const feedback = document.getElementById('shadowingFeedback');

        if (statusText) statusText.innerHTML = `<span style="color:var(--color-success)">🔴 Gölgeleme yapın, dinliyorum...</span>`;

        Speech.listen(
          (result) => {
            const userText = result.transcript.toLowerCase().trim();
            const targetText = s.en.toLowerCase().trim();
            
            const dist = levenshtein(userText, targetText);
            const maxLen = Math.max(userText.length, targetText.length);
            const accuracy = Math.max(0, Math.round(((maxLen - dist) / maxLen) * 100));

            if (accuracy >= 65) {
              playSound('correct');
              score += 20;
              showScoreFloat('+20 🌟');

              if (feedback) {
                feedback.innerHTML = `<div style="color:#10b981; font-weight:800; font-size:16px;">🎉 Harika Gölgeleme! %${accuracy} Ritim Uyumu</div>`;
              }

              setTimeout(() => {
                currentIndex++;
                if (currentIndex >= sentences.length) {
                  navigate('result', { score, correct: sentences.length, total: sentences.length, mode: 'shadowing', points: score });
                } else {
                  renderStep();
                }
              }, 1600);

            } else {
              playSound('wrong');
              if (feedback) {
                feedback.innerHTML = `<div style="color:var(--color-error); font-weight:700; font-size:14px;">💡 Algılanan: "${result.transcript}". Tekrar dinleyip mikrofona söyleyin.</div>`;
              }
            }
          },
          (err) => {
            if (statusText) statusText.textContent = 'Tekrar mikrofona tıklayıp konuşun';
          }
        );
      });
    }

    renderStep();
  }
};
