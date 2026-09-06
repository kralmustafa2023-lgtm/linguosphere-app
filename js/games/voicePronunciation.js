// ===========================
// VOICE PRONUNCIATION GAME — Mikrofonlu Telaffuz Analizi (Fixed)
// ===========================

import { shuffle, levenshtein, playSound, showScoreFloat } from '../utils.js';
import { Speech } from '../speech.js';
import { Storage } from '../storage.js';
import { navigate, AppState } from '../app.js';

export const VoicePronunciationGame = {
  words: [],
  currentIndex: 0,
  score: 0,
  correct: 0,
  root: null,

  start(root, lessonData) {
    if (!lessonData || !lessonData.vocabulary || lessonData.vocabulary.length === 0) {
      navigate('modeSelect', { lessonData });
      return;
    }

    this.words = shuffle(lessonData.vocabulary).slice(0, 10);
    this.currentIndex = 0;
    this.score = 0;
    this.correct = 0;
    this.root = root;

    this.renderWord();
  },

  renderWord() {
    if (this.currentIndex >= this.words.length) {
      this.finish();
      return;
    }

    const word = this.words[this.currentIndex];
    const progress = ((this.currentIndex + 1) / this.words.length) * 100;
    const srsData = Storage.load().srsData || {};
    const wordSRS = srsData[word.en] || { mastery: 0, box: 1 };

    const masteryColor = wordSRS.mastery >= 80 ? '#10b981' : wordSRS.mastery >= 40 ? '#f2a93b' : '#7c5dfa';
    const masteryLabel = wordSRS.mastery >= 80 ? '👑 Usta' : wordSRS.mastery >= 40 ? '🌳 Öğrenildi' : '🌱 Yeni';

    this.root.innerHTML = `
      <div class="game-container stagger">
        <div class="game-header">
          <div class="back-area" id="exitBtn" style="cursor:pointer;display:flex;align-items:center;gap:8px;color:var(--text-secondary);font-weight:600;font-size:14px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            <span>Çıkış</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="font-size:11px; font-weight:800; background:rgba(124,93,250,0.1); color:${masteryColor}; padding:4px 10px; border-radius:12px;">${masteryLabel}</div>
            <div class="score-display" style="background:var(--bg-glass-strong);padding:6px 16px;border-radius:var(--radius-full);border:1px solid rgba(0,0,0,0.06)">
              <span style="color:var(--color-success);font-weight:800">${this.score}</span>
              <span style="opacity:0.7"> XP</span>
            </div>
          </div>
          <div class="counter" style="background:var(--bg-card);padding:4px 12px;border-radius:var(--radius-full);border:1px solid rgba(0,0,0,0.05)">
            <span style="color:var(--accent-primary);font-weight:800">${this.currentIndex + 1}</span> / ${this.words.length}
          </div>
        </div>

        <div class="game-progress">
          <div class="game-progress-fill" style="width:${progress}%; box-shadow:0 0 12px rgba(124,93,250,0.4);"></div>
        </div>

        <div class="game-body" style="justify-content:center; text-align:center; padding-top: 8px;">

          <div style="font-size:13px; font-weight:700; color:var(--accent-primary); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:12px;">
            🎙️ Mikrofona Söyleyin
          </div>

          <div style="font-size:56px; margin-bottom:12px; filter:drop-shadow(0 8px 16px rgba(124, 93, 250, 0.3)); animation: float 3s ease-in-out infinite;">
            ${word.emoji || '🗣️'}
          </div>

          <div style="font-family:var(--font-display); font-size:38px; font-weight:800; color:var(--text-primary); margin-bottom:6px; letter-spacing:-0.02em;">
            ${word.en}
          </div>

          <div style="font-size:18px; font-weight:600; color:var(--text-secondary); margin-bottom:8px;">
            "${word.tr}"
          </div>

          ${word.ex ? `<div style="font-size:13px; color:var(--text-tertiary); font-style:italic; margin-bottom:24px; max-width:280px; margin-left:auto; margin-right:auto;">"${word.ex}"</div>` : '<div style="margin-bottom:24px;"></div>'}

          <!-- Listening Mic Button -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:16px;">

            <button id="micBtn" class="hover-lift" style="width:96px; height:96px; border-radius:50%; background:linear-gradient(135deg, var(--accent-primary), #ec4899); border:none; color:white; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 12px 32px rgba(124, 93, 250, 0.3); position:relative; transition: all 0.2s ease;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </button>

            <div id="micStatus" style="font-size:14px; font-weight:600; color:var(--text-tertiary); min-height:20px;">
              Mikrofona basıp kelimeyi seslendirin
            </div>

            <!-- Extra audio listen buttons -->
            <div style="display:flex; gap:12px; margin-top:4px;">
              <button id="playAudioBtn" class="btn btn-ghost" style="padding:8px 16px; border-radius:12px; font-size:13px; display:flex; align-items:center; gap:6px;">
                🔊 Telaffuzu Dinle
              </button>
              <button id="slowAudioBtn" class="btn btn-ghost" style="padding:8px 16px; border-radius:12px; font-size:13px; display:flex; align-items:center; gap:6px;">
                🐢 Yavaş Dinle
              </button>
            </div>

          </div>

          <div id="feedbackArea" style="margin-top:24px; min-height:80px; display:flex; align-items:center; justify-content:center;"></div>

          <!-- Skip button -->
          <button id="skipBtn" class="btn btn-ghost" style="margin-top:12px; font-size:13px; color:var(--text-muted); padding:8px 20px; border-radius:12px;">
            Atla →
          </button>

        </div>
      </div>
    `;

    this.attachEvents(word);
  },

  attachEvents(word) {
    const exitBtn = document.getElementById('exitBtn');
    const micBtn = document.getElementById('micBtn');
    const micStatus = document.getElementById('micStatus');
    const feedbackArea = document.getElementById('feedbackArea');
    const playAudioBtn = document.getElementById('playAudioBtn');
    const slowAudioBtn = document.getElementById('slowAudioBtn');
    const skipBtn = document.getElementById('skipBtn');

    exitBtn?.addEventListener('click', () => {
      Speech.stopListening();
      navigate('modeSelect', { lessonData: AppState.lessonData });
    });

    playAudioBtn?.addEventListener('click', () => {
      Speech.english(word.en);
    });

    slowAudioBtn?.addEventListener('click', () => {
      Speech.slow(word.en);
    });

    // Auto-play word pronunciation on load
    setTimeout(() => Speech.english(word.en), 300);

    skipBtn?.addEventListener('click', () => {
      Speech.stopListening();
      Storage.recordMistake(word);
      Storage.updateSRSWord(word.en, false);
      this.currentIndex++;
      this.renderWord();
    });

    micBtn?.addEventListener('click', () => {
      if (!Speech.hasSpeechRecognition()) {
        if (feedbackArea) {
          feedbackArea.innerHTML = `<div style="color:var(--color-warning); font-weight:700; padding:16px; background:rgba(251,191,36,0.1); border-radius:16px;">⚠️ Tarayıcınız ses tanıma özelliğini desteklemiyor. Lütfen Chrome veya Edge kullanın.</div>`;
        }
        return;
      }

      if (micStatus) micStatus.innerHTML = `<span style="color:#ec4899; font-weight:700;">🔴 Sizi dinliyorum, konuşun...</span>`;
      if (micBtn) {
        micBtn.style.transform = 'scale(1.1)';
        micBtn.style.boxShadow = '0 0 30px rgba(236, 72, 153, 0.6)';
        micBtn.style.background = 'linear-gradient(135deg, #ec4899, #7c5dfa)';
      }

      Speech.listen(
        (result) => {
          if (micBtn) {
            micBtn.style.transform = 'scale(1)';
            micBtn.style.boxShadow = '0 12px 32px rgba(124, 93, 250, 0.3)';
            micBtn.style.background = 'linear-gradient(135deg, var(--accent-primary), #ec4899)';
          }
          if (micStatus) micStatus.textContent = `Algılanan: "${result.transcript}"`;

          const accuracy = this.calculateAccuracy(result.transcript, word.en);
          this.handleResult(accuracy, result.transcript, word);
        },
        (error) => {
          if (micBtn) {
            micBtn.style.transform = 'scale(1)';
            micBtn.style.boxShadow = '0 12px 32px rgba(124, 93, 250, 0.3)';
            micBtn.style.background = 'linear-gradient(135deg, var(--accent-primary), #ec4899)';
          }
          if (micStatus) micStatus.textContent = 'Ses anlaşılamadı, tekrar deneyin';
          if (feedbackArea) feedbackArea.innerHTML = `<div style="color:var(--color-error); font-weight:600; padding:16px; background:rgba(239,68,68,0.08); border-radius:16px; border:1px solid rgba(239,68,68,0.2);">Konuşma algılanamadı. Tekrar mikrofona basıp söyleyin.</div>`;
        }
      );
    });
  },

  calculateAccuracy(userInput, target) {
    const a = userInput.toLowerCase().trim().replace(/[^a-z\s]/g, '');
    const b = target.toLowerCase().trim().replace(/[^a-z\s]/g, '');

    if (a === b) return 100;

    // Word-level check first
    const userWords = a.split(/\s+/);
    const targetWords = b.split(/\s+/);
    let wordMatches = 0;
    targetWords.forEach(tw => {
      if (userWords.some(uw => uw === tw || levenshtein(uw, tw) <= 1)) wordMatches++;
    });
    const wordAccuracy = Math.round((wordMatches / targetWords.length) * 100);

    // Levenshtein distance check
    const dist = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    const charAccuracy = Math.max(0, Math.round(((maxLen - dist) / maxLen) * 100));

    // Take the better of the two
    return Math.max(wordAccuracy, charAccuracy);
  },

  handleResult(accuracy, transcript, word) {
    const feedbackArea = document.getElementById('feedbackArea');

    if (accuracy >= 70) {
      playSound('correct');
      const pts = Math.round(accuracy / 5);
      this.score += pts;
      this.correct++;
      showScoreFloat(`+${pts} 🌟`);
      Storage.updateSRSWord(word.en, true);

      if (feedbackArea) {
        feedbackArea.innerHTML = `
          <div style="background:rgba(45,212,168,0.15); border:1px solid rgba(45,212,168,0.3); color:#10b981; padding:20px 24px; border-radius:20px; font-weight:700; width:100%;">
            <div style="font-size:24px; margin-bottom:4px;">🎉 Harika Telaffuz!</div>
            <div style="font-size:14px;">Benzerlik: %${accuracy}</div>
            <div style="font-size:12px; margin-top:4px; opacity:0.8;">Algılanan: "${transcript}"</div>
          </div>
        `;
      }

      setTimeout(() => {
        this.currentIndex++;
        this.renderWord();
      }, 1800);

    } else {
      playSound('wrong');
      const phonemeTip = this.detectPhonemeMismatch(transcript, word.en);
      
      Storage.recordMistake({
        ...word,
        ex: phonemeTip ? `Telaffuz Hatası: ${phonemeTip}` : `Algılanan: "${transcript}"`
      }, 'pronunciation');
      Storage.updateSRSWord(word.en, false);

      if (feedbackArea) {
        feedbackArea.innerHTML = `
          <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); color:var(--color-error); padding:20px 24px; border-radius:20px; font-weight:700; width:100%;">
            <div style="font-size:18px; margin-bottom:6px;">💡 Telaffuz İpucu (%${accuracy})</div>
            <div style="font-size:13px; opacity:0.9; margin-bottom:8px;">Algılanan Ses: "<strong>${transcript}</strong>"</div>
            ${phonemeTip ? `
              <div style="font-size:14px; background:rgba(239,68,68,0.12); padding:10px 14px; border-radius:12px; color:var(--color-error); margin-bottom:10px; border:1px solid rgba(239,68,68,0.2);">
                🎯 <strong>Fonetik Teşhis:</strong> ${phonemeTip}
              </div>
            ` : ''}
            <div style="font-size:13px; color:var(--text-secondary);">Önce 🔊 butonuyla dinleyin, dudak ve dil pozisyonuna dikkat ederek tekrar söyleyin.</div>
          </div>
        `;
      }
    }
  },

  // Fonetik Kural Eşleme Motoru (Türkçe Konuşanlar İçin)
  detectPhonemeMismatch(userInput, target) {
    const u = userInput.toLowerCase().trim();
    const t = target.toLowerCase().trim();

    // 1. [θ] peltek th sesi -> [s] veya [t] (think -> sink / tink)
    if (t.includes('th') && (u.includes('s') || u.includes('t') || u.includes('f')) && !u.includes('th')) {
      return "'th' sesini peltek çıkarmalısın. Dilini ön dişlerinin arasına hafifçe sıkıştırarak nefes ver (s veya t gibi söyleme).";
    }

    // 2. [w] çift dudak sesi -> [v] diş-dudak sesi (wine -> vine / west -> vest)
    if (t.startsWith('w') && u.startsWith('v')) {
      return "'w' sesini çıkarırken üst dişlerini alt dudağına DEĞDİRME, dudaklarını ıslık çalar gibi yuvarla.";
    }

    // 3. [v] sesi -> [w] (very -> wery)
    if (t.startsWith('v') && u.startsWith('w')) {
      return "'v' sesinde üst ön dişlerin alt dudağına hafifçe dokunmalıdır.";
    }

    // 4. Kısa [ɪ] vs Uzun [i:] (ship -> sheep / live -> leave)
    if ((t.includes('i') && u.includes('ee')) || (t.includes('ee') && u.includes('i'))) {
      return "Kısa ve uzun ünlü ayrımına dikkat et: Kısa [ɪ] gevşek söylenir, uzun [i:] gülümser gibi uzatılır.";
    }

    // 5. [r] ve [l] ayrımı (right -> light)
    if (t.includes('r') && u.includes('l')) {
      return "İngilizce 'r' sesinde dil damağa asla değmez, geriye doğru kıvrılır.";
    }

    // 6. [ŋ] geniz sesi (sing -> sin)
    if (t.endsWith('ing') && !u.endsWith('ing')) {
      return "Kelime sonundaki '-ing' takısında 'g' harfi yutulur ve genizden [ŋ] sesi verilir.";
    }

    return null;
  },

  finish() {
    const total = this.words.length;
    navigate('result', {
      score: this.score,
      correct: this.correct,
      total,
      mode: 'voicePronunciation',
      points: this.score
    });
  }
};
