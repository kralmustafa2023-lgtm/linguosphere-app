// ===========================
// CUSTOM VOCABULARY SCREEN — Kendi Kelime Defterim
// ===========================

import { Storage } from '../storage.js';
import { Speech } from '../speech.js';
import { backArrowSVG, showToast, escapeHTML } from '../utils.js';
import { navigate, AppState } from '../app.js';

export const CustomVocabScreen = {
  render(root) {
    const customWords = Storage.getCustomWords();

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
              <span style="font-size:18px">📖</span> Kendi Kelime Defterim
            </div>
          </div>

          <!-- Hero & Add Form Card -->
          <div style="background:linear-gradient(145deg, var(--bg-primary), var(--bg-surface)); border:1px solid var(--bg-card-border); border-radius:24px; padding:24px; box-shadow:0 12px 32px rgba(0,0,0,0.04); margin-bottom:32px;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
              <div style="width:48px; height:48px; border-radius:16px; background:rgba(124, 93, 250, 0.1); border:1px solid rgba(124, 93, 250, 0.2); display:flex; align-items:center; justify-content:center; color:var(--accent-primary); font-size:24px;">
                ➕
              </div>
              <div>
                <h2 style="font-family:var(--font-display); font-size:20px; font-weight:800; color:var(--text-primary); letter-spacing:-0.01em;">Yeni Kelime Ekle</h2>
                <div style="font-size:13px; color:var(--text-tertiary);">Günlük hayatta öğrendiğin kelimeleri ekle, hemen pratik yap!</div>
              </div>
            </div>

            <form id="addWordForm" style="display:flex; flex-direction:column; gap:12px;">
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                <input type="text" id="inputEn" placeholder="İngilizce (Ör: Courage)" required 
                       style="padding:14px; border-radius:14px; border:1px solid var(--bg-card-border); background:var(--bg-elevated); color:var(--text-primary); font-size:14px; outline:none;">
                <input type="text" id="inputTr" placeholder="Türkçe (Ör: Cesaret)" required 
                       style="padding:14px; border-radius:14px; border:1px solid var(--bg-card-border); background:var(--bg-elevated); color:var(--text-primary); font-size:14px; outline:none;">
              </div>
              
              <input type="text" id="inputEx" placeholder="Örnek Cümle (İsteğe Bağlı)" 
                     style="padding:14px; border-radius:14px; border:1px solid var(--bg-card-border); background:var(--bg-elevated); color:var(--text-primary); font-size:14px; outline:none;">
              
              <button type="submit" class="btn hover-lift" style="background:linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:white; font-weight:700; font-size:15px; padding:14px; border-radius:14px; border:none; box-shadow:0 4px 16px rgba(124,93,250,0.25); cursor:pointer;">
                Deftere Kaydet
              </button>
            </form>
          </div>

          ${customWords.length === 0 ? `
            <div style="text-align:center; padding:48px 24px; background:var(--bg-card); border-radius:24px; border:1px solid var(--bg-card-border);">
              <div style="font-size:48px; margin-bottom:12px">✍️</div>
              <div style="font-family:var(--font-display); font-weight:700; font-size:18px; color:var(--text-primary); margin-bottom:4px;">Defterin Henüz Boş</div>
              <div style="font-size:13px; color:var(--text-tertiary);">Yukarıdaki formu kullanarak ilk özel kelimeni ekleyebilirsin!</div>
            </div>
          ` : `
            <!-- Practice Custom Words Button -->
            <button class="btn hover-lift" id="practiceCustomBtn" style="width:100%; margin-bottom:24px; background:linear-gradient(135deg, #10b981, #059669); color:white; font-weight:700; font-size:16px; padding:16px; border-radius:18px; border:none; box-shadow:0 8px 24px rgba(16,185,129,0.25); display:flex; align-items:center; justify-content:center; gap:8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Özel Kelimelerimle Oyun Oyna (${customWords.length} Kelime)
            </button>

            <!-- List of Custom Words -->
            <div style="display:flex; flex-direction:column; gap:12px;">
              ${customWords.map(item => `
                <div class="custom-word-item hover-lift" style="background:var(--bg-card); border:1px solid var(--bg-card-border); border-radius:20px; padding:16px 20px; display:flex; align-items:center; justify-content:space-between; gap:16px;">
                  <div style="flex:1; min-width:0;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                      <span style="font-size:20px">${escapeHTML(item.emoji || '📝')}</span>
                      <span style="font-family:var(--font-display); font-weight:700; font-size:18px; color:var(--text-primary);">${escapeHTML(item.en)}</span>
                      <button class="speak-item-btn" data-word="${escapeHTML(item.en)}" style="background:transparent; border:none; color:var(--accent-primary); cursor:pointer; padding:4px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                      </button>
                    </div>
                    <div style="font-size:14px; font-weight:600; color:var(--color-success);">${escapeHTML(item.tr)}</div>
                    ${item.ex ? `<div style="font-size:12px; color:var(--text-tertiary); margin-top:4px; font-style:italic">"${escapeHTML(item.ex)}"</div>` : ''}
                  </div>

                  <button class="delete-custom-btn" data-id="${item.id}" title="Sil" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; padding:8px; border-radius:8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              `).join('')}
            </div>
          `}

        </div>
      </div>
    `;

    this.attachEvents(customWords);
  },

  attachEvents(customWords) {
    document.getElementById('backBtn')?.addEventListener('click', () => {
      navigate('home');
    });

    document.getElementById('addWordForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const en = document.getElementById('inputEn').value.trim();
      const tr = document.getElementById('inputTr').value.trim();
      const ex = document.getElementById('inputEx').value.trim();

      if (!en || !tr) return;

      Storage.addCustomWord({ en, tr, ex });
      showToast(`" ${en} " deftere eklendi ✨`);
      this.render(document.getElementById('app'));
    });

    document.querySelectorAll('.speak-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        Speech.english(btn.dataset.word);
      });
    });

    document.querySelectorAll('.delete-custom-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        Storage.removeCustomWord(id);
        showToast('Kelime silindi');
        this.render(document.getElementById('app'));
      });
    });

    document.getElementById('practiceCustomBtn')?.addEventListener('click', () => {
      if (customWords.length === 0) return;
      const customLessonData = {
        id: 'custom_vocab_practice',
        title: 'Kendi Kelime Defterim',
        titleEN: 'My Custom Vocabulary',
        emoji: '📝',
        vocabulary: customWords.map(c => ({
          en: c.en,
          tr: c.tr,
          emoji: c.emoji || '📝',
          ex: c.ex || `${c.en} means ${c.tr}`,
          exTR: c.exTR || `${c.en}, ${c.tr} demektir.`
        }))
      };
      AppState.lessonData = customLessonData;
      navigate('modeSelect');
    });
  }
};
