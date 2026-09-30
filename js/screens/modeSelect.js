// ===========================
// MODE SELECT SCREEN — 21st.dev Premium Theme
// ===========================

import { Storage } from '../storage.js';
import { backArrowSVG } from '../utils.js';
import { navigate, AppState } from '../app.js';

const MODES = [
  { 
    id: 'flashcard', 
    icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M7 8h10"></path><path d="M7 12h10"></path></svg>', 
    name: 'Hızlı Ezber', 
    desc: 'Flashcard & Çift Taraflı Ezber',
    color: '#8b5cf6', 
    bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.22) 0%, rgba(109, 40, 217, 0.08) 100%)',
    border: 'rgba(139, 92, 246, 0.45)',
    glow: 'rgba(139, 92, 246, 0.35)',
    screen: 'flashcard', 
    span: 2 
  },
  { 
    id: 'quiz', 
    icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>', 
    name: '4 Şıklı Test', 
    desc: 'Hızlı Seçenekli Kavrama',
    color: '#ec4899', 
    bg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.22) 0%, rgba(219, 39, 119, 0.08) 100%)',
    border: 'rgba(236, 72, 153, 0.45)',
    glow: 'rgba(236, 72, 153, 0.35)',
    screen: 'quiz', 
    span: 2 
  },
  { 
    id: 'match', 
    icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>', 
    name: 'Eşleştir', 
    desc: 'Kelime Çiftleri',
    color: '#f59e0b', 
    bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.08) 100%)',
    border: 'rgba(245, 158, 11, 0.45)',
    glow: 'rgba(245, 158, 11, 0.35)',
    screen: 'match', 
    span: 1 
  },
  { 
    id: 'fillBlank', 
    icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>', 
    name: 'Boşluk Doldur', 
    desc: 'Cümle İçi Bağlam',
    color: '#10b981', 
    bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.08) 100%)',
    border: 'rgba(16, 185, 129, 0.45)',
    glow: 'rgba(16, 185, 129, 0.35)',
    screen: 'fillBlank', 
    span: 1 
  },
  { 
    id: 'sentenceBuilder', 
    icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>', 
    name: 'Cümle Kur', 
    desc: 'Sözcük Dizilimi & Gramer',
    color: '#3b82f6', 
    bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.22) 0%, rgba(37, 99, 235, 0.08) 100%)',
    border: 'rgba(59, 130, 246, 0.45)',
    glow: 'rgba(59, 130, 246, 0.35)',
    screen: 'sentenceBuilder', 
    span: 2 
  },
  { 
    id: 'speedRound', 
    icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>', 
    name: 'Hız Turu', 
    desc: 'Süreli Refleks',
    color: '#ef4444', 
    bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.22) 0%, rgba(220, 38, 38, 0.08) 100%)',
    border: 'rgba(239, 68, 68, 0.45)',
    glow: 'rgba(239, 68, 68, 0.35)',
    screen: 'speedRound', 
    span: 1 
  },
  { 
    id: 'typing', 
    icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M9 16h6"/></svg>', 
    name: 'Yazma', 
    desc: 'Klavyeyle Yazılış',
    color: '#a855f7', 
    bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, rgba(147, 51, 234, 0.08) 100%)',
    border: 'rgba(168, 85, 247, 0.45)',
    glow: 'rgba(168, 85, 247, 0.35)',
    screen: 'typing', 
    span: 1 
  },
  { 
    id: 'listening', 
    icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>', 
    name: 'Dinleme', 
    desc: 'Kulak Alıştırması',
    color: '#f472b6', 
    bg: 'linear-gradient(135deg, rgba(244, 114, 182, 0.22) 0%, rgba(219, 39, 119, 0.08) 100%)',
    border: 'rgba(244, 114, 182, 0.45)',
    glow: 'rgba(244, 114, 182, 0.35)',
    screen: 'listening', 
    span: 1 
  },
  { 
    id: 'voicePronunciation', 
    icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>', 
    name: 'Telaffuz Analizi', 
    desc: 'AI Mikrofon Pratiği',
    color: '#06b6d4', 
    bg: 'linear-gradient(135deg, rgba(6, 182, 212, 0.22) 0%, rgba(8, 145, 178, 0.08) 100%)',
    border: 'rgba(6, 182, 212, 0.45)',
    glow: 'rgba(6, 182, 212, 0.35)',
    screen: 'voicePronunciation', 
    span: 1 
  },
  { 
    id: 'shadowing', 
    icon: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>', 
    name: 'Gölgeleme', 
    desc: 'Dinle ve Anında Tekrar Et',
    color: '#14b8a6', 
    bg: 'linear-gradient(135deg, rgba(20, 184, 166, 0.22) 0%, rgba(13, 148, 136, 0.08) 100%)',
    border: 'rgba(20, 184, 166, 0.45)',
    glow: 'rgba(20, 184, 166, 0.35)',
    screen: 'shadowing', 
    span: 1 
  }
];

export const ModeSelectScreen = {
  render(root, lessonData) {
    if (!lessonData) { navigate('home'); return; }

    const state = Storage.load();
    const records = {};
    if (state.modeScores) {
      const prefix = `${AppState.currentLevel}_${lessonData.id}_`;
      Object.keys(state.modeScores).forEach(key => {
        if (key.startsWith(prefix)) {
          const modeId = key.substring(prefix.length);
          records[modeId] = state.modeScores[key];
        }
      });
    }

    const vocabCount = lessonData.vocabulary ? lessonData.vocabulary.length : 0;
    const grammarCount = lessonData.grammar ? lessonData.grammar.length : 0;
    const quizCount = (lessonData.quizQuestions || lessonData.quiz || []).length;

    root.innerHTML = `
      <div class="screen" style="padding-bottom: 120px;">
        <div class="container container-narrow stagger">
          
          <!-- Sticky Header -->
          <div class="header-bar hover-lift" style="position: sticky; top: 0; z-index: 100; background: var(--bg-glass-strong); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid var(--bg-card-border); margin: 0 -16px 24px -16px; padding: 16px 20px;">
            <div class="back-area hover-lift" id="backBtn" style="margin: 0; padding: 0; cursor: pointer;">
              ${backArrowSVG()}
              <span style="font-weight: 600; color: var(--text-primary);">Dersler</span>
            </div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 15px; letter-spacing: -0.01em; color:var(--text-primary); display:flex; align-items:center;">
              <span style="display:inline-block; margin-right:6px; font-size:18px;">${lessonData.emoji || '📖'}</span> Oyun Modları
            </div>
          </div>

          <!-- Hero Section -->
          <div style="text-align:center; margin-bottom: 36px;">
            <div style="font-size:48px; margin-bottom:14px; filter:drop-shadow(0 8px 20px rgba(124, 93, 250, 0.35)); display:inline-block;">
              ${lessonData.emoji || '🎯'}
            </div>
            <h1 style="font-family:var(--font-display); font-size:32px; font-weight:800; color:var(--text-primary); letter-spacing:-0.03em; margin-bottom:8px;">${lessonData.title || lessonData.titleEN}</h1>
            <p style="font-size:15px; color:var(--text-secondary); margin-bottom:20px; max-width:320px; margin-left:auto; margin-right:auto; line-height:1.6;">${lessonData.description || 'Bu ders için uygun olan renkli oyun modlarından birini seçerek pratik yapmaya başla.'}</p>
            
            <!-- Quick Stats Pills -->
            <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
              ${vocabCount > 0 ? `<div style="font-size:12px; font-weight:700; background:rgba(124, 93, 250, 0.12); border:1px solid rgba(124, 93, 250, 0.25); padding:6px 14px; border-radius:24px; color:var(--accent-primary); display:flex; align-items:center; gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> ${vocabCount} Kelime</div>` : ''}
              ${grammarCount > 0 ? `<button id="grammarBtn" class="hover-lift" style="cursor:pointer; font-size:12px; font-weight:700; background:rgba(16, 185, 129, 0.15); border:1px solid rgba(16, 185, 129, 0.3); padding:6px 14px; border-radius:24px; color:#10b981; display:flex; align-items:center; gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${grammarCount} Kural (Oku)</button>` : ''}
              ${quizCount > 0 ? `<div style="font-size:12px; font-weight:700; background:rgba(236, 72, 153, 0.12); border:1px solid rgba(236, 72, 153, 0.25); padding:6px 14px; border-radius:24px; color:#ec4899; display:flex; align-items:center; gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg> ${quizCount} Soru</div>` : ''}
            </div>
          </div>

          <!-- COLORFUL BENTO GRID -->
          <div class="modes-grid" style="display:grid; grid-template-columns: repeat(2, 1fr); gap:16px;">
            ${MODES.map(mode => {
              let hasData = false;
              if (mode.id === 'flashcard' || mode.id === 'match' || mode.id === 'speedRound' || mode.id === 'typing' || mode.id === 'listening' || mode.id === 'voicePronunciation' || mode.id === 'shadowing') hasData = !!vocabCount || (lessonData.sentences && lessonData.sentences.length > 0);
              else if (mode.id === 'quiz') hasData = !!quizCount;
              else if (mode.id === 'sentenceBuilder') hasData = (lessonData.sentences && lessonData.sentences.length > 0) || !!vocabCount;
              else if (mode.id === 'fillBlank') hasData = (lessonData.fillBlanks && lessonData.fillBlanks.length > 0) || !!vocabCount;

              const best = records[mode.id] || 0;
              const isLocked = !hasData;

              return `
                <div class="mode-card-21st hover-lift ${isLocked ? 'locked' : ''}" 
                     data-mode="${mode.screen}" 
                     data-mode-id="${mode.id}"
                     style="grid-column: span ${mode.span}; position:relative; overflow:hidden; border-radius:24px; padding:22px; background:${mode.bg}; border:1.5px solid ${isLocked ? 'rgba(0,0,0,0.04)' : mode.border}; box-shadow:0 8px 24px ${mode.glow}; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; min-height:140px; cursor:${isLocked ? 'not-allowed' : 'pointer'}; ${isLocked ? 'opacity:0.35;' : ''} transition:all 0.25s;">
                  
                  ${best > 0 ? `
                    <div style="position:absolute; top:12px; right:12px; background:rgba(16, 185, 129, 0.2); color:#10b981; border:1px solid rgba(16, 185, 129, 0.4); font-size:11px; font-weight:800; padding:4px 10px; border-radius:12px; letter-spacing:0.04em;">
                      ✓ %${best}
                    </div>
                  ` : ''}

                  <div style="width:50px; height:50px; border-radius:16px; background:rgba(255,255,255,0.08); border:1px solid ${mode.border}; display:flex; align-items:center; justify-content:center; color:${mode.color}; margin-bottom:10px; filter:drop-shadow(0 4px 10px ${mode.glow}); transition:transform 0.3s ease;" class="mode-icon-wrapper">
                    ${mode.icon}
                  </div>
                  <div style="font-family:var(--font-display); font-weight:800; font-size:17px; color:var(--text-primary); letter-spacing:-0.01em; margin-bottom:4px;">${mode.name}</div>
                  <div style="font-size:12px; font-weight:500; color:var(--text-secondary); opacity:0.85;">${mode.desc}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
      
      <style>
        .mode-card-21st:not(.locked):hover { transform: translateY(-4px) scale(1.02); }
        .mode-card-21st:not(.locked):hover .mode-icon-wrapper { transform: scale(1.12); }
      </style>
    `;

    this.attachEvents(lessonData);
  },

  attachEvents(lessonData) {
    document.getElementById('backBtn')?.addEventListener('click', () => {
      navigate('lessonSelect', { 
        currentLevel: AppState.currentLevel,
        levelData: AppState.levelData
      });
    });

    document.getElementById('grammarBtn')?.addEventListener('click', () => {
      navigate('grammar', { lessonData });
    });

    document.querySelectorAll('.mode-card-21st:not(.locked)').forEach(card => {
      card.addEventListener('click', () => {
        const screenStr = card.dataset.mode;
        // Game screens refer back to the selected game module
        navigate(screenStr, { lessonData });
      });
    });
  }
};
