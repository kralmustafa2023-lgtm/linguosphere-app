// ===========================
// MISTAKE BANK SCREEN — Yanlışlarım & Zorlandıklarım
// ===========================

import { Storage } from '../storage.js';
import { Speech } from '../speech.js';
import { backArrowSVG, showToast } from '../utils.js';
import { navigate, AppState } from '../app.js';

export const MistakeBankScreen = {
  render(root) {
    const mistakes = Storage.getMistakes();

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
              <span style="font-size:18px">🔥</span> Yanlışlarım & Zorlandıklarım
            </div>
          </div>

          <!-- Hero Section -->
          <div style="text-align:center; margin-bottom: 32px;">
            <div style="width:64px; height:64px; border-radius:20px; background:rgba(239, 68, 68, 0.1); border:1px solid rgba(239, 68, 68, 0.2); display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto; color:var(--color-error);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h1 style="font-family:var(--font-display); font-size:28px; font-weight:800; color:var(--text-primary); letter-spacing:-0.02em; margin-bottom:8px;">Hata Kumbarası</h1>
            <p style="font-size:14px; color:var(--text-secondary); max-width:320px; margin:0 auto; line-height:1.6;">
              Testlerde yanlış yaptığın kelimeler burada birikir. Tekrar pratik yaparak bunları %100 hafızana kazıyabilirsin!
            </p>
          </div>

          ${mistakes.length === 0 ? `
            <div style="text-align:center; padding:48px 24px; background:var(--bg-card); border-radius:24px; border:1px solid var(--bg-card-border);">
              <div style="font-size:48px; margin-bottom:12px">🎉</div>
              <div style="font-family:var(--font-display); font-weight:700; font-size:18px; color:var(--text-primary); margin-bottom:4px;">Harikasın! Hiç Yanlışın Yok</div>
              <div style="font-size:13px; color:var(--text-tertiary)">Testleri oynadıkça zorlandığın kelimeler otomatik buraya eklenecektir.</div>
            </div>
          ` : `
            <!-- Action Button -->
            <button class="btn hover-lift" id="practiceMistakesBtn" style="width:100%; margin-bottom:24px; background:linear-gradient(135deg, var(--color-error), #f97316); color:white; font-weight:700; font-size:16px; padding:16px; border-radius:18px; border:none; box-shadow:0 8px 24px rgba(239,68,68,0.25); display:flex; align-items:center; justify-content:center; gap:8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Yanlışlarımla Pratik Yap (${mistakes.length} Kelime)
            </button>

            <!-- List of Mistakes -->
            <div style="display:flex; flex-direction:column; gap:12px;">
              ${mistakes.map(item => {
                const categoryLabels = {
                  tense: { label: 'Zaman (Tense)', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
                  article: { label: 'Artikel (a/an/the)', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
                  preposition: { label: 'Edat (in/on/at)', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
                  wordOrder: { label: 'Kelime Sırası', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
                  vocabulary: { label: 'Kelime Bilgisi', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
                  spelling: { label: 'Yazım (Spelling)', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' }
                };
                const catInfo = categoryLabels[item.category] || categoryLabels.vocabulary;

                return `
                <div class="mistake-item hover-lift" style="background:var(--bg-card); border:1px solid var(--bg-card-border); border-radius:20px; padding:16px 20px; display:flex; align-items:center; justify-content:space-between; gap:16px;">
                  <div style="flex:1; min-width:0;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap: wrap;">
                      <span style="font-family:var(--font-display); font-weight:700; font-size:18px; color:var(--text-primary);">${item.en}</span>
                      <button class="speak-item-btn" data-word="${item.en}" style="background:transparent; border:none; color:var(--accent-primary); cursor:pointer; padding:4px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                      </button>
                      <span style="font-size:10px; font-weight:700; padding:2px 8px; border-radius:8px; background:${catInfo.bg}; color:${catInfo.color}; border:1px solid ${catInfo.color}33;">
                        ${catInfo.label}
                      </span>
                    </div>
                    <div style="font-size:14px; font-weight:600; color:var(--color-success);">${item.tr}</div>
                    ${item.ex ? `<div style="font-size:12px; color:var(--text-tertiary); margin-top:4px; font-style:italic">"${item.ex}"</div>` : ''}
                  </div>

                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:11px; font-weight:800; background:rgba(239,68,68,0.1); color:var(--color-error); padding:4px 8px; border-radius:10px;">${item.wrongCount}x Hata</span>
                    <button class="delete-mistake-btn" data-key="${item.en}" title="Sil" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; padding:8px; border-radius:8px;">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              `;}).join('')}
            </div>
          `}

        </div>
      </div>
    `;

    this.attachEvents(mistakes);
  },

  attachEvents(mistakes) {
    document.getElementById('backBtn')?.addEventListener('click', () => {
      navigate('home');
    });

    document.querySelectorAll('.speak-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        Speech.english(btn.dataset.word);
      });
    });

    document.querySelectorAll('.delete-mistake-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        Storage.removeMistake(btn.dataset.key);
        showToast('Kelime listeden çıkarıldı');
        this.render(document.getElementById('app'));
      });
    });

    document.getElementById('practiceMistakesBtn')?.addEventListener('click', () => {
      if (mistakes.length === 0) return;
      const customLessonData = {
        id: 'mistakes_practice',
        title: 'Yanlışlarım & Zorlandıklarım',
        titleEN: 'Mistake Practice',
        emoji: '🔥',
        vocabulary: mistakes.map(m => ({
          en: m.en,
          tr: m.tr,
          emoji: '🔥',
          ex: m.ex || `${m.en} means ${m.tr}`,
          exTR: m.exTR || `${m.en}, ${m.tr} demektir.`
        }))
      };
      AppState.lessonData = customLessonData;
      navigate('modeSelect');
    });
  }
};
