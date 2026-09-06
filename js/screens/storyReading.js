// ===========================
// STORY READING SCREEN — İnteraktif Okuma & Dinleme
// ===========================

import { DataManager } from '../data.js';
import { Speech } from '../speech.js';
import { Storage } from '../storage.js';
import { backArrowSVG, showToast, playSound, showConfetti } from '../utils.js';
import { navigate, AppState } from '../app.js';

export const StoryReadingScreen = {
  stories: [],
  activeStory: null,
  currentSentenceIdx: 0,
  isPlaying: false,
  speedRate: 0.85,
  showTranslation: true,

  async render(root) {
    if (!this.stories.length) {
      try {
        const res = await fetch('data/stories.json');
        if (res.ok) this.stories = await res.json();
      } catch(e) {
        console.warn('Failed to load stories:', e);
      }
    }

    if (!this.activeStory) {
      this.renderStoryList(root);
    } else {
      this.renderStoryPlayer(root);
    }
  },

  renderStoryList(root) {
    root.innerHTML = `
      <div class="screen" style="padding-bottom: 120px;">
        <div class="container container-narrow stagger">
          
          <!-- Sticky Header -->
          <div class="header-bar hover-lift" style="position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,0,0,0.05); margin: 0 -16px 24px -16px; padding: 16px 20px;">
            <div class="back-area hover-lift" id="backBtn" style="margin: 0; padding: 0;">
              ${backArrowSVG()}
              <span style="font-weight: 500;">Ana Menü</span>
            </div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 15px; letter-spacing: -0.01em; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
              <span style="font-size:18px">📚</span> Okuma & Dinleme Hikayeleri
            </div>
          </div>

          <!-- Hero Section -->
          <div style="text-align:center; margin-bottom:32px;">
            <div style="font-size:48px; margin-bottom:12px; filter:drop-shadow(0 8px 16px rgba(124, 93, 250, 0.3));">
              📖
            </div>
            <h1 style="font-family:var(--font-display); font-size:28px; font-weight:800; color:var(--text-primary); letter-spacing:-0.02em; margin-bottom:8px;">İnteraktif Hikayeler</h1>
            <p style="font-size:14px; color:var(--text-secondary); max-width:320px; margin:0 auto; line-height:1.6;">
              Seviyene özel hikayeleri dinle, cümle cümle takip et ve üzerine tıklayarak kelime anlamlarını öğren!
            </p>
          </div>

          <!-- Story Cards List -->
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${this.stories.map(story => `
              <div class="story-card hover-lift" data-id="${story.id}" style="background:linear-gradient(135deg, var(--bg-primary), var(--bg-surface)); border:1px solid var(--bg-card-border); border-radius:24px; padding:20px; display:flex; align-items:center; gap:20px; cursor:pointer;">
                <div style="width:64px; height:64px; border-radius:20px; background:rgba(124, 93, 250, 0.1); border:1px solid rgba(124, 93, 250, 0.2); display:flex; align-items:center; justify-content:center; font-size:32px; flex-shrink:0;">
                  ${story.emoji || '📚'}
                </div>
                <div style="flex:1; min-width:0;">
                  <div style="font-family:var(--font-display); font-weight:800; font-size:18px; color:var(--text-primary); margin-bottom:4px;">${story.title}</div>
                  <div style="font-size:13px; font-weight:600; color:var(--text-tertiary); margin-bottom:8px;">${story.titleTR}</div>
                  <div style="display:flex; gap:8px;">
                    <span style="font-size:11px; font-weight:800; background:rgba(45,212,168,0.15); color:#10b981; padding:3px 10px; border-radius:10px;">Seviye ${story.level}</span>
                    <span style="font-size:11px; font-weight:600; background:rgba(0,0,0,0.04); color:var(--text-tertiary); padding:3px 10px; border-radius:10px;">⏱️ ${story.readingTime}</span>
                  </div>
                </div>
                <div style="color:var(--accent-primary); font-size:24px; font-weight:800;">→</div>
              </div>
            `).join('')}
          </div>

        </div>
      </div>
    `;

    document.getElementById('backBtn')?.addEventListener('click', () => navigate('home'));

    document.querySelectorAll('.story-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id);
        this.activeStory = this.stories.find(s => s.id === id);
        this.currentSentenceIdx = 0;
        this.render(root);
      });
    });
  },

  renderStoryPlayer(root) {
    const story = this.activeStory;
    const currentSentence = story.sentences[this.currentSentenceIdx];
    const progress = ((this.currentSentenceIdx + 1) / story.sentences.length) * 100;

    root.innerHTML = `
      <div class="screen" style="padding-bottom: 120px;">
        <div class="container container-narrow stagger">
          
          <!-- Sticky Header -->
          <div class="header-bar hover-lift" style="position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,0,0,0.05); margin: 0 -16px 24px -16px; padding: 16px 20px;">
            <div class="back-area hover-lift" id="exitStoryBtn" style="margin: 0; padding: 0;">
              ${backArrowSVG()}
              <span style="font-weight: 500;">Hikayeler</span>
            </div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 15px; letter-spacing: -0.01em; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
              ${story.emoji} ${story.title}
            </div>
          </div>

          <!-- Progress Bar -->
          <div style="height:6px; background:rgba(0,0,0,0.05); border-radius:10px; overflow:hidden; margin-bottom:24px;">
            <div style="height:100%; width:${progress}%; background:linear-gradient(90deg, var(--accent-primary), #2dd4a8); border-radius:10px; transition:width 0.4s;"></div>
          </div>

          <!-- Story Text Player Box -->
          <div style="background:var(--bg-card); border:1px solid var(--bg-card-border); border-radius:28px; padding:32px 24px; box-shadow:0 16px 40px rgba(0,0,0,0.05); text-align:center; position:relative; min-height:240px; display:flex; flex-direction:column; justify-content:center;">
            
            <div style="font-size:13px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:16px;">
              Cümle ${this.currentSentenceIdx + 1} / ${story.sentences.length}
            </div>

            <!-- English Sentence with Clickable Words -->
            <div id="sentenceEnBox" style="font-family:var(--font-display); font-size:26px; font-weight:800; color:var(--text-primary); line-height:1.5; margin-bottom:16px; letter-spacing:-0.01em;">
              ${currentSentence.en.split(' ').map(w => `<span class="word-chip hover-lift" style="display:inline-block; margin:2px 4px; padding:2px 6px; border-radius:8px; cursor:pointer;" data-word="${w}">${w}</span>`).join(' ')}
            </div>

            <!-- Turkish Translation -->
            ${this.showTranslation ? `
              <div style="font-size:16px; font-weight:600; color:var(--color-success); transition:all 0.3s;">
                "${currentSentence.tr}"
              </div>
            ` : ''}

            <!-- Word Popup Toast -->
            <div id="wordPopup" style="margin-top:20px; font-size:14px; font-weight:700; color:var(--accent-primary); min-height:24px;"></div>

          </div>

          <!-- Player Controls Bar -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:24px; gap:12px;">
            
            <button id="toggleTrBtn" class="btn btn-ghost" style="font-size:13px; font-weight:600;">
              ${this.showTranslation ? '👁️ Çeviriyi Gizle' : '👁️ Çeviriyi Göster'}
            </button>

            <button id="playSentenceBtn" class="btn hover-lift" style="background:linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:white; font-weight:700; padding:14px 28px; border-radius:20px; border:none; box-shadow:0 8px 24px rgba(124,93,250,0.3); font-size:16px; display:flex; align-items:center; gap:8px;">
              🔊 Cümleyi Dinle
            </button>

            <button id="speedBtn" class="btn btn-ghost" style="font-size:13px; font-weight:700; color:var(--accent-primary);">
              ⚡ ${this.speedRate}x
            </button>

          </div>

          <!-- Navigation Buttons -->
          <div style="display:flex; gap:12px; margin-top:24px;">
            <button id="prevBtn" class="btn btn-secondary" style="flex:1; border-radius:16px; padding:14px; font-weight:700;" ${this.currentSentenceIdx === 0 ? 'disabled style="opacity:0.4"' : ''}>
              ← Önceki Cümle
            </button>
            <button id="nextBtn" class="btn btn-primary" style="flex:1; border-radius:16px; padding:14px; font-weight:700;">
              ${this.currentSentenceIdx === story.sentences.length - 1 ? '🎉 Hikayeyi Bitir' : 'Sonraki Cümle →'}
            </button>
          </div>

        </div>
      </div>
    `;

    this.attachPlayerEvents(root, story, currentSentence);
  },

  attachPlayerEvents(root, story, currentSentence) {
    document.getElementById('exitStoryBtn')?.addEventListener('click', () => {
      Speech.stop();
      this.activeStory = null;
      this.render(root);
    });

    document.getElementById('toggleTrBtn')?.addEventListener('click', () => {
      this.showTranslation = !this.showTranslation;
      this.renderStoryPlayer(root);
    });

    document.getElementById('speedBtn')?.addEventListener('click', () => {
      if (this.speedRate === 0.85) this.speedRate = 0.55;
      else if (this.speedRate === 0.55) this.speedRate = 1.0;
      else this.speedRate = 0.85;
      Speech.setRate(this.speedRate);
      this.renderStoryPlayer(root);
    });

    document.getElementById('playSentenceBtn')?.addEventListener('click', () => {
      Speech.english(currentSentence.en);
    });

    // Event delegation on sentenceEnBox for Click-to-Translate
    const sentenceBox = document.getElementById('sentenceEnBox');
    sentenceBox?.addEventListener('click', async (e) => {
      const chip = e.target.closest('.word-chip');
      if (!chip) return;

      const cleanWord = chip.dataset.word.replace(/[^a-zA-Z]/g, '');
      if (!cleanWord) return;

      Speech.english(cleanWord);

      // Search in story sentence word dictionary or current loaded level
      let foundTr = null;
      if (currentSentence.words) {
        const found = currentSentence.words.find(w => w.w.toLowerCase() === cleanWord.toLowerCase());
        if (found) foundTr = found.tr;
      }

      const popup = document.getElementById('wordPopup');
      if (popup) {
        const meaningText = foundTr ? foundTr : 'Anlamı sözlükte aranıyor...';
        popup.innerHTML = `
          <div style="display:inline-flex; align-items:center; gap:12px; background:var(--bg-surface); padding:8px 16px; border-radius:14px; border:1px solid var(--accent-primary); box-shadow:0 4px 16px rgba(124,93,250,0.15); animation:popIn 0.2s ease;">
            <span>💡 <strong>${cleanWord}</strong>: <span style="color:var(--color-success)">${meaningText}</span></span>
            <button id="addCustomFromStoryBtn" class="hover-lift" style="background:var(--accent-primary); color:white; border:none; border-radius:8px; padding:4px 10px; font-size:12px; font-weight:700; cursor:pointer;">
              + Deftere Ekle
            </button>
          </div>
        `;

        document.getElementById('addCustomFromStoryBtn')?.addEventListener('click', (ev) => {
          ev.stopPropagation();
          Storage.addCustomWord({
            en: cleanWord,
            tr: foundTr || 'Hikayeden Eklendi',
            ex: currentSentence.en,
            exTR: currentSentence.tr
          });
          showToast(`"${cleanWord}" kelime defterine eklendi! ✨`);
          popup.innerHTML = `<span style="color:var(--color-success)">✓ "${cleanWord}" defterine kaydedildi!</span>`;
        });
      }
    });

    document.getElementById('prevBtn')?.addEventListener('click', () => {
      if (this.currentSentenceIdx > 0) {
        this.currentSentenceIdx--;
        this.renderStoryPlayer(root);
      }
    });

    document.getElementById('nextBtn')?.addEventListener('click', () => {
      if (this.currentSentenceIdx < story.sentences.length - 1) {
        this.currentSentenceIdx++;
        this.renderStoryPlayer(root);
        setTimeout(() => Speech.english(story.sentences[this.currentSentenceIdx].en), 300);
      } else {
        // Complete story
        showConfetti(80);
        playSound('levelup');
        showToast('🏆 Hikaye Tamamlandı! +30 XP');
        this.renderStoryCompleted(root, story);
      }
    });
  },

  generateQuizFromStory(story) {
    const wordList = [];
    story.sentences.forEach(s => {
      if (s.words) {
        s.words.forEach(w => {
          if (!wordList.some(item => item.w.toLowerCase() === w.w.toLowerCase())) {
            wordList.push(w);
          }
        });
      }
    });

    if (wordList.length === 0) return [];

    return wordList.slice(0, 6).map((item, idx) => {
      const distractors = ['hızlı', 'güzel', 'öğrenmek', 'başarı', 'çalışmak', 'yolculuk', 'karar']
        .filter(d => d !== item.tr)
        .slice(0, 3);
      return {
        q: item.w,
        a: item.tr,
        o: [item.tr, ...distractors].sort(() => Math.random() - 0.5)
      };
    });
  },

  renderStoryCompleted(root, story) {
    root.innerHTML = `
      <div class="screen" style="padding-bottom: 120px;">
        <div class="container container-narrow stagger" style="text-align:center; padding-top:40px;">
          
          <div style="font-size:64px; margin-bottom:16px; animation:popIn 0.5s ease;">
            🎉
          </div>

          <div style="display:inline-block; background:rgba(45,212,168,0.15); border:1px solid rgba(45,212,168,0.3); color:#10b981; font-weight:800; font-size:13px; padding:6px 16px; border-radius:20px; margin-bottom:16px;">
            +30 XP KAZANILDI
          </div>

          <h1 style="font-family:var(--font-display); font-size:28px; font-weight:800; color:var(--text-primary); margin-bottom:8px;">
            ${story.title}
          </h1>
          <p style="color:var(--text-secondary); font-size:15px; max-width:320px; margin:0 auto 32px auto; line-height:1.6;">
            Harika iş! Hikayeyi başarıyla tamamladın. Şimdi öğrendiğin kelimeleri test ederek bilgilerini pekiştirebilirsin.
          </p>

          <div style="display:flex; flex-direction:column; gap:12px; max-width:320px; margin:0 auto;">
            
            <button id="startStoryQuizBtn" class="btn hover-lift" style="background:linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:white; font-weight:700; padding:16px; border-radius:18px; border:none; box-shadow:0 8px 24px rgba(124,93,250,0.3); font-size:15px; display:flex; align-items:center; justify-content:center; gap:8px;">
              <span>📝</span> Bu Hikayedeki Kelimelerle Test Yap
            </button>

            <button id="backToStoryListBtn" class="btn btn-secondary hover-lift" style="padding:14px; border-radius:18px; font-weight:700;">
              📚 Hikaye Listesine Dön
            </button>

            <button id="backToHomeBtn" class="btn btn-ghost hover-lift" style="font-weight:600; font-size:14px; color:var(--text-tertiary);">
              🏠 Ana Menüye Dön
            </button>

          </div>

        </div>
      </div>
    `;

    document.getElementById('startStoryQuizBtn')?.addEventListener('click', () => {
      const quizQuestions = (story.quiz && story.quiz.length > 0) ? story.quiz : this.generateQuizFromStory(story);
      AppState.lessonData = {
        title: `${story.title} - Kelime Testi`,
        quizQuestions: quizQuestions,
        quiz: quizQuestions,
        grammar: [{ exp: `Bu test "${story.title}" hikayesindeki anahtar kelimeleri pekiştirmek içindir.` }]
      };
      this.activeStory = null;
      navigate('quiz', { lessonData: AppState.lessonData });
    });

    document.getElementById('backToStoryListBtn')?.addEventListener('click', () => {
      this.activeStory = null;
      this.render(root);
    });

    document.getElementById('backToHomeBtn')?.addEventListener('click', () => {
      this.activeStory = null;
      navigate('home');
    });
  }
};
