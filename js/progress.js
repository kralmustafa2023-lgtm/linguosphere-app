// ===========================
// PROGRESS — XP, Rozet, Streak
// ===========================

import { Storage } from './storage.js';
import { showConfetti, showToast, playSound } from './utils.js';

export const USER_LEVELS = [
  { name: '🌱 Tohum',     minXP: 0 },
  { name: '📗 Kitap',     minXP: 5 },
  { name: '📚 Öğrenci',   minXP: 15 },
  { name: '🎓 Mezun',     minXP: 30 },
  { name: '🏆 Şampiyon',  minXP: 50 },
];

export const BADGES = {
  first_step:     { name: '🌟 İlk Adım',          desc: 'İlk dersi tamamla' },
  streak_3:       { name: '🔥 Üçlü Seri',          desc: '3 gün seri yap' },
  streak_7:       { name: '🔥 Haftalık Seri',       desc: '7 gün seri yap' },
  streak_30:      { name: '🔥 Aylık Seri',          desc: '30 gün seri yap' },
  quiz_master:    { name: '❓ Quiz Ustası',          desc: '5 quizde %90+ al' },
  speed_demon:    { name: '⚡ Hız Şeytanı',         desc: '3 hız turunda %90+ al' },
  listener:       { name: '🎧 Kulak',               desc: '5 dinlemede %90+ al' },
  writer:         { name: '✍️ Yazar',               desc: '5 yazmada %90+ al' },
  level1_master:  { name: '🏆 Seviye 1 Ustası',     desc: 'Seviye 1 Mega Tekrar %80+' },
  level2_master:  { name: '🏆 Seviye 2 Ustası',     desc: 'Seviye 2 Mega Tekrar %80+' },
  level3_master:  { name: '🏆 Seviye 3 Ustası',     desc: 'Seviye 3 Mega Tekrar %80+' },
  level4_master:  { name: '🏆 Seviye 4 Ustası',     desc: 'Seviye 4 Mega Tekrar %80+' },
  level5_master:  { name: '🏆 Seviye 5 Ustası',     desc: 'Seviye 5 Mega Tekrar %80+' },
  full_master:    { name: '👑 TAM MÜFREDAT USTASI',  desc: 'Tüm seviyeleri %80+ tamamla' },
};

export function checkBadges(state) {
  const newBadges = [];
  const done = state.completedLessons;
  const modes = state.modeScores;

  const checks = {
    first_step:    Object.keys(done).length >= 1,
    streak_3:      state.dailyStreak >= 3,
    streak_7:      state.dailyStreak >= 7,
    streak_30:     state.dailyStreak >= 30,
    quiz_master:   Object.entries(modes).filter(([k, v]) => k.includes('_quiz') && v >= 90).length >= 5,
    speed_demon:   Object.entries(modes).filter(([k, v]) => k.includes('_speedRound') && v >= 90).length >= 3,
    listener:      Object.entries(modes).filter(([k, v]) => k.includes('_listening') && v >= 90).length >= 5,
    writer:        Object.entries(modes).filter(([k, v]) => k.includes('_typing') && v >= 90).length >= 5,
    level1_master: (modes['1_review_quiz'] || 0) >= 80,
    level2_master: (modes['2_review_quiz'] || 0) >= 80,
    level3_master: (modes['3_review_quiz'] || 0) >= 80,
    level4_master: (modes['4_review_quiz'] || 0) >= 80,
    level5_master: (modes['5_review_quiz'] || 0) >= 80,
    full_master:   [1, 2, 3, 4, 5].every(l => (modes[`${l}_review_quiz`] || 0) >= 80),
  };

  for (const [id, condition] of Object.entries(checks)) {
    if (condition && !state.badges.includes(id)) {
      newBadges.push(id);
      state.badges.push(id);
    }
  }

  if (newBadges.length > 0) {
    Storage.save(state);
    newBadges.forEach((id, index) => {
      setTimeout(() => {
        showToast(`🎖️ Yeni rozet: ${BADGES[id].name}`);
        showConfetti(60);
        playSound('badge');
      }, index * 1500);
    });
  }

  return newBadges;
}

export function getUserLevel(xp) {
  return [...USER_LEVELS].reverse().find(l => xp >= l.minXP) || USER_LEVELS[0];
}

export function getNextLevel(xp) {
  const currentIdx = USER_LEVELS.findIndex(l => l === getUserLevel(xp));
  return USER_LEVELS[currentIdx + 1] || null;
}

export function getXPProgress(xp) {
  const current = getUserLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return { percent: 100, current: xp, needed: xp };
  const progress = xp - current.minXP;
  const total = next.minXP - current.minXP;
  return {
    percent: Math.min(100, Math.round((progress / total) * 100)),
    current: progress,
    needed: total
  };
}

export function getCEFRLevel(level) {
  const map = { 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1' };
  return map[level] || 'A1';
}
