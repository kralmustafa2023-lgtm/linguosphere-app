// ===========================
// DAILY QUESTS & STREAK FREEZE COMPONENT
// ===========================

import { Storage } from '../storage.js';
import { getTodayStr, showToast, playSound, showConfetti } from '../utils.js';

export function renderDailyQuestsWidget(container) {
  const state = Storage.load();
  const today = getTodayStr();

  // Reset or load daily quests
  if (!state.dailyQuests || state.dailyQuests.date !== today) {
    state.dailyQuests = {
      date: today,
      streakFreezeCount: state.dailyQuests ? (state.dailyQuests.streakFreezeCount || 1) : 1,
      quests: [
        { id: 'q1', icon: '📖', title: '15 Kelime Çalış', target: 15, current: Math.min(15, Object.keys(state.completedLessons || {}).length * 5), xp: 30, claimed: false },
        { id: 'q2', icon: '🎧', title: '1 Hikaye Tamamla', target: 1, current: 0, xp: 40, claimed: false },
        { id: 'q3', icon: '🏆', title: '1 Testi %90+ Skorla Geç', target: 1, current: 0, xp: 50, claimed: false },
      ]
    };
    Storage.save(state);
  }

  const quests = state.dailyQuests.quests;
  const freezeCount = state.dailyQuests.streakFreezeCount || 0;

  container.innerHTML = `
    <div style="background:linear-gradient(145deg, var(--bg-primary), var(--bg-surface)); border:1px solid var(--bg-card-border); border-radius:24px; padding:24px; box-shadow:0 12px 32px rgba(0,0,0,0.04); margin-bottom:32px; position:relative;">
      
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="font-size:24px">🎯</div>
          <div>
            <div style="font-family:var(--font-display); font-weight:800; font-size:18px; color:var(--text-primary); margin-bottom:2px;">Günlük Görevler</div>
            <div style="font-size:12px; color:var(--text-tertiary);">Her gün gece yarısı yenilenir</div>
          </div>
        </div>

        <!-- Streak Freeze Shield Badge -->
        <div id="streakFreezeBtn" class="hover-lift" title="Seri Koruma Kalkanı" style="cursor:pointer; display:flex; align-items:center; gap:6px; background:rgba(59, 130, 246, 0.1); border:1px solid rgba(59, 130, 246, 0.25); padding:6px 12px; border-radius:14px; color:#3b82f6; font-size:12px; font-weight:700;">
          <span style="font-size:16px">🛡️</span> Kalkan: ${freezeCount}
        </div>
      </div>

      <!-- Quests List -->
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${quests.map(q => {
          const percent = Math.min(100, Math.round((q.current / q.target) * 100));
          const isDone = q.current >= q.target;

          return `
            <div style="background:var(--bg-card); border:1px solid var(--bg-card-border); border-radius:16px; padding:14px 18px; display:flex; align-items:center; justify-content:space-between; gap:14px;">
              <div style="font-size:24px;">${q.icon}</div>
              
              <div style="flex:1; min-width:0;">
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
                  <span>${q.title}</span>
                  <span style="color:var(--text-tertiary); font-size:12px;">${q.current}/${q.target}</span>
                </div>
                <div style="height:6px; background:rgba(0,0,0,0.05); border-radius:10px; overflow:hidden;">
                  <div style="height:100%; width:${percent}%; background:linear-gradient(90deg, var(--accent-primary), #2dd4a8); border-radius:10px;"></div>
                </div>
              </div>

              ${q.claimed ? `
                <span style="font-size:12px; font-weight:800; color:var(--color-success); background:rgba(45,212,168,0.15); padding:6px 12px; border-radius:12px;">✓ Alındı</span>
              ` : isDone ? `
                <button class="claim-quest-btn hover-lift" data-id="${q.id}" data-xp="${q.xp}" style="background:linear-gradient(135deg, #10b981, #059669); color:white; border:none; font-weight:800; font-size:12px; padding:8px 14px; border-radius:12px; cursor:pointer; box-shadow:0 4px 12px rgba(16,185,129,0.3);">
                  +${q.xp} XP Al
                </button>
              ` : `
                <span style="font-size:12px; font-weight:700; color:var(--text-muted); padding:6px 10px;">+${q.xp} XP</span>
              `}

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;

  // Attach claim events
  container.querySelectorAll('.claim-quest-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qId = btn.dataset.id;
      const xp = parseInt(btn.dataset.xp);
      const quest = state.dailyQuests.quests.find(q => q.id === qId);

      if (quest && !quest.claimed) {
        quest.claimed = true;
        state.totalPoints += xp;
        state.totalXP = Math.floor(state.totalPoints / 100);
        Storage.save(state);

        playSound('levelup');
        showConfetti(60);
        showToast(`🎉 Görev Tamamlandı! +${xp} XP Kazandın!`);
        renderDailyQuestsWidget(container);
      }
    });
  });

  // Attach streak freeze buy/info event
  container.querySelector('#streakFreezeBtn')?.addEventListener('click', () => {
    if (state.totalPoints >= 100) {
      if (confirm('🛡️ 100 XP karşılığında 1 adet Seri Koruma Kalkanı satın almak ister misiniz?')) {
        state.totalPoints -= 100;
        state.dailyQuests.streakFreezeCount = (state.dailyQuests.streakFreezeCount || 0) + 1;
        Storage.save(state);
        showToast('🛡️ Seri Kalkanı başarıyla alındı!');
        renderDailyQuestsWidget(container);
      }
    } else {
      alert(`🛡️ Seri Kalkanı almak için 100 XP gerekli (Şu anki XP puanınız: ${state.totalPoints})`);
    }
  });
}
