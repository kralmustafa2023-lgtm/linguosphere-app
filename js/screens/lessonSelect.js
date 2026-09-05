// ===========================
// LESSON SELECT SCREEN — Magic UI Theme
// ===========================

import { Storage } from '../storage.js';
import { getCEFRLevel } from '../progress.js';
import { formatNumber, backArrowSVG, generateStars } from '../utils.js';
import { navigate, AppState } from '../app.js';

export const LessonSelectScreen = {
  render(root, levelData, level) {
    if (!levelData) { navigate('home'); return; }

    const state = Storage.load();
    const lessons = levelData.lessons || [];
    const completedCount = Storage.getCompletedCount(level);
    const progressPercent = Math.round((completedCount / lessons.length) * 100) || 0;
    
    // Total stars calculation
    let totalStars = 0;
    if (state.completedLessons) {
      Object.keys(state.completedLessons).forEach(key => {
        if (key.startsWith(`${level}_`)) totalStars += state.completedLessons[key].stars;
      });
    }

    root.innerHTML = `
      <div class="screen" style="padding-bottom: 120px;">
        <div class="container container-narrow">

          <!-- Sticky Elegant Header -->
          <div class="header-bar hover-lift" style="position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,0,0,0.05); margin: 0 -16px 24px -16px; padding: 16px 20px;">
             <div class="back-area hover-lift" id="backBtn" style="margin: 0; padding: 0;">
              ${backArrowSVG()}
              <span style="font-weight: 500;">Menü</span>
            </div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 15px; letter-spacing: -0.01em; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
              ${levelData.meta.title}
            </div>
          </div>

          <!-- Master Hero Card for the Level -->
          <div class="stagger">
            <div style="position:relative; overflow:hidden; border-radius: 24px; padding: 24px; background:linear-gradient(145deg, var(--bg-primary), var(--bg-surface)); border: 1px solid var(--bg-card-border); box-shadow: 0 16px 40px rgba(124, 93, 250, 0.08); margin-bottom:32px;">
              <div style="position:absolute; top:-20px; left:-20px; width:150px; height:150px; background:linear-gradient(135deg, var(--accent-primary), transparent); filter:blur(40px); opacity:0.15; border-radius:50%; pointer-events:none;"></div>
              
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 24px; position:relative; z-index:1;">
                <div>
                  <div style="color:var(--text-secondary); font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:6px;">Öğrenim Müfredatı</div>
                  <div style="font-family:var(--font-display); font-size:28px; font-weight:800; letter-spacing:-0.03em; color:var(--text-primary);">${levelData.meta.title}</div>
                </div>
                <div style="padding:4px 12px; background:rgba(124, 93, 250, 0.15); border:1px solid rgba(124, 93, 250, 0.3); border-radius:12px; font-weight:700; font-family:var(--font-display); color:var(--accent-primary); box-shadow:0 0 16px rgba(124,93,250,0.2);">
                  ${getCEFRLevel(level)}
                </div>
              </div>
              
              <div style="position:relative; z-index:1;">
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:500; font-family:var(--font-display); color:var(--text-secondary); margin-bottom:8px;">
                  <span>${completedCount} Ders Tamamlandı</span>
                  <span>%${progressPercent}</span>
                </div>
                <div style="height:8px; background:rgba(0,0,0,0.05); border-radius:12px; overflow:hidden; position:relative;">
                  <div style="position:absolute; inset:0; background:linear-gradient(90deg, var(--accent-primary), #2dd4a8); width:${progressPercent}%; border-radius:12px; transition:width 1s cubic-bezier(0.25,1,0.5,1); box-shadow:0 0 16px rgba(124, 93, 250, 0.4);">
                    <div style="position:absolute; top:0; right:0; bottom:0; width:40px; background:linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent); animation: sweep 2s linear infinite;"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bento List of Lessons -->
            <div class="lesson-grid" style="display:flex; flex-direction:column; gap:16px;">
              ${this.renderLessons(lessons, level, state)}
            </div>
            
          </div>
        </div>
      </div>
    `;

    this.attachEvents(levelData);
  },

  renderLessons(lessons, level, state) {
    let html = '';
    let isPreviousCompleted = true; // Always true for lesson 1

    lessons.forEach((lesson, index) => {
      const isLocked = !isPreviousCompleted && index !== 0;
      const progress = state.completedLessons ? state.completedLessons[`${level}_${lesson.id}`] : null;
      if (progress) isPreviousCompleted = true; // Unlock next
      else isPreviousCompleted = false;

      // Extract colors from lesson emoji mapping logic optionally or use random bright tone
      const gradient = isLocked 
        ? 'linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))'
        : 'linear-gradient(145deg, var(--bg-primary), var(--bg-surface))';

      html += `
        <div class="lesson-card-pro hover-lift ${isLocked ? 'locked' : ''}" 
             data-id="${lesson.id}"
             style="position:relative; overflow:hidden; border-radius:24px; padding:20px; background:${gradient}; border:1px solid ${isLocked ? 'rgba(0,0,0,0.02)' : 'var(--bg-card-border)'}; box-shadow: 0 12px 30px rgba(0,0,0,0.03); display:flex; align-items:center; gap:20px; ${isLocked ? 'opacity:0.6; cursor:not-allowed;' : ''}">
          
          <!-- Background Glow if Complete -->
          ${progress ? `<div style="position:absolute; left:-20px; top:-20px; width:100px; height:100px; background:var(--color-success); filter:blur(50px); opacity:0.1; pointer-events:none;"></div>` : ''}

          <!-- Icon / Emoji Container -->
          <div style="width:64px; height:64px; flex-shrink:0; border-radius:20px; background:${isLocked ? 'rgba(0,0,0,0.03)' : 'var(--bg-elevated)'}; border:1px solid ${isLocked ? 'transparent' : 'rgba(0,0,0,0.05)'}; display:flex; align-items:center; justify-content:center; font-size:32px; filter:drop-shadow(0 8px 16px rgba(0,0,0,0.1)); transition:all 0.4s ease;">
            ${isLocked ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="var(--text-muted)"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' : lesson.emoji}
          </div>

          <!-- Content -->
          <div style="flex:1; min-width:0; z-index:1;">
            <div style="font-family:var(--font-display); font-weight:700; font-size:18px; margin-bottom:4px; color:var(--text-primary); letter-spacing:-0.01em;">${lesson.title}</div>
            <div style="font-size:13px; font-weight:500; color:var(--text-tertiary); margin-bottom:8px; line-height:1.4;">${lesson.description}</div>
            
            ${progress ? `
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="display:flex; color:#f2a93b; font-size:14px; letter-spacing:2px; filter:drop-shadow(0 0 8px rgba(242,169,59,0.3))">${generateStars(progress.stars, 3)}</div>
                <div style="font-size:12px; font-weight:600; color:var(--color-success); background:rgba(45,212,168,0.1); padding:2px 8px; border-radius:8px;">%${progress.score}</div>
              </div>
            ` : isLocked ? `
              <div style="font-size:12px; font-weight:500; color:var(--text-muted);">Önceki dersi tamamlayın</div>
            ` : `
              <div style="font-size:12px; font-weight:600; color:var(--accent-primary);">Başla →</div>
            `}
          </div>
        </div>
      `;
    });

    return html;
  },

  attachEvents(levelData) {
    document.getElementById('backBtn')?.addEventListener('click', () => {
      navigate('home');
    });

    document.querySelectorAll('.lesson-card-pro:not(.locked)').forEach(card => {
      card.addEventListener('click', () => {
        const lessonId = parseInt(card.dataset.id);
        const lessonData = levelData.lessons.find(l => l.id === lessonId);
        if (lessonData) {
          AppState.lessonData = lessonData; // Set current lesson explicitly
          navigate('modeSelect');
        }
      });
    });
  }
};
