// ===========================
// STORAGE — localStorage Yönetimi
// ===========================

import { getTodayStr, calcStars } from './utils.js';

const STORAGE_KEY = 'eng_app_v1';

const DEFAULT_STATE = {
  version: '1.1',
  totalPoints: 0,
  totalXP: 0,
  dailyStreak: 0,
  longestStreak: 0,
  lastPlayDate: null,
  unlockedLevels: [1],
  completedLessons: {},   // "levelId_lessonId" → { score, stars, plays, bestScore }
  modeScores: {},          // "levelId_lessonId_mode" → bestScore
  badges: [],
  srsData: {},             // wordEn → { box, nextReview, mastery, correctCount, wrongCount, lastReviewed }
  mistakes: {},            // wordEn → { en, tr, ex, exTR, wrongCount, lastFailed }
  customVocabulary: [],    // [ { id, en, tr, emoji, ex, exTR, dateAdded } ]
  dailyQuests: { date: null, quests: [], streakFreezeCount: 1 },
  settings: { sound: true, speechRate: 0.85 }
};

export const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_STATE, ...parsed, settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) } };
      }
      return { ...DEFAULT_STATE };
    } catch {
      return { ...DEFAULT_STATE };
    }
  },

  save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }
  },

  completeLesson(levelId, lessonId, score, mode) {
    const state = this.load();
    const key = `${levelId}_${lessonId}`;
    const modeKey = `${key}_${mode}`;

    // Ders kaydı
    const existing = state.completedLessons[key] || { plays: 0, bestScore: 0, stars: 0 };
    const stars = calcStars(score);
    state.completedLessons[key] = {
      score,
      stars: Math.max(stars, existing.stars),
      plays: existing.plays + 1,
      bestScore: Math.max(score, existing.bestScore),
      lastPlayed: new Date().toISOString()
    };

    // Mod skoru
    state.modeScores[modeKey] = Math.max(score, state.modeScores[modeKey] || 0);

    // Puan ve XP
    state.totalPoints += Math.round(score * 0.5);
    state.totalXP = Math.floor(state.totalPoints / 100);

    // Seviye kilitleme
    state.unlockedLevels = this.calcUnlocks(state);

    // Streak güncelle
    this.updateStreak(state);

    this.save(state);
    return state;
  },

  calcUnlocks(state) {
    const unlocked = new Set([1]);
    const lessonCounts = { 1: 10, 2: 10, 3: 10, 4: 10, 5: 5 };
    for (let lvl = 1; lvl <= 4; lvl++) {
      const done = Object.keys(state.completedLessons)
        .filter(k => k.startsWith(`${lvl}_`)).length;
      if (done >= Math.ceil(lessonCounts[lvl] * 0.6)) {
        unlocked.add(lvl + 1);
      }
    }
    return [...unlocked];
  },

  updateStreak(state) {
    const today = getTodayStr();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (state.lastPlayDate === today) return;
    state.dailyStreak = state.lastPlayDate === yesterday ? state.dailyStreak + 1 : 1;
    state.longestStreak = Math.max(state.dailyStreak, state.longestStreak);
    state.lastPlayDate = today;
  },

  getCompletedCount(levelId) {
    const state = this.load();
    return Object.keys(state.completedLessons)
      .filter(k => k.startsWith(`${levelId}_`)).length;
  },

  getLessonBest(levelId, lessonId) {
    const state = this.load();
    const key = `${levelId}_${lessonId}`;
    return state.completedLessons[key] || null;
  },

  getModeBest(levelId, lessonId, mode) {
    const state = this.load();
    const key = `${levelId}_${lessonId}_${mode}`;
    return state.modeScores[key] || 0;
  },

  isLevelUnlocked(levelId) {
    const state = this.load();
    return state.unlockedLevels.includes(levelId);
  },

  // --- SRS (Spaced Repetition System) ---
  updateSRSWord(wordEn, isCorrect) {
    const state = this.load();
    if (!state.srsData) state.srsData = {};

    const existing = state.srsData[wordEn] || {
      box: 1,
      nextReview: getTodayStr(),
      mastery: 0,
      correctCount: 0,
      wrongCount: 0,
      lastReviewed: null
    };

    if (isCorrect) {
      existing.correctCount++;
      existing.box = Math.min(5, existing.box + 1);
    } else {
      existing.wrongCount++;
      existing.box = Math.max(1, existing.box - 1);
    }

    // Interval days according to Leitner box (1d, 3d, 7d, 14d, 30d)
    const boxIntervals = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };
    const daysToAdd = boxIntervals[existing.box] || 1;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    existing.nextReview = nextDate.toISOString().split('T')[0];
    existing.mastery = Math.min(100, Math.round((existing.box / 5) * 100));
    existing.lastReviewed = new Date().toISOString();

    state.srsData[wordEn] = existing;
    this.save(state);
    return existing;
  },

  // --- Mistake Bank ---
  recordMistake(item) {
    if (!item || (!item.en && !item.q && !item.s)) return;
    const state = this.load();
    if (!state.mistakes) state.mistakes = {};

    const key = item.en || item.q || item.s;
    const existing = state.mistakes[key] || {
      en: item.en || item.q || item.s,
      tr: item.tr || item.a || '',
      ex: item.ex || '',
      exTR: item.exTR || '',
      wrongCount: 0,
      lastFailed: new Date().toISOString()
    };

    existing.wrongCount++;
    existing.lastFailed = new Date().toISOString();
    state.mistakes[key] = existing;
    this.save(state);
  },

  removeMistake(key) {
    const state = this.load();
    if (state.mistakes && state.mistakes[key]) {
      delete state.mistakes[key];
      this.save(state);
    }
  },

  getMistakes() {
    const state = this.load();
    return Object.values(state.mistakes || {});
  },

  // --- Custom Vocabulary ---
  addCustomWord(wordObj) {
    const state = this.load();
    if (!state.customVocabulary) state.customVocabulary = [];

    const newWord = {
      id: Date.now(),
      en: wordObj.en.trim(),
      tr: wordObj.tr.trim(),
      emoji: wordObj.emoji || '📝',
      ex: wordObj.ex || '',
      exTR: wordObj.exTR || '',
      dateAdded: new Date().toISOString()
    };

    state.customVocabulary.unshift(newWord);
    this.save(state);
    return newWord;
  },

  removeCustomWord(id) {
    const state = this.load();
    if (!state.customVocabulary) return;
    state.customVocabulary = state.customVocabulary.filter(w => w.id !== id);
    this.save(state);
  },

  getCustomWords() {
    const state = this.load();
    return state.customVocabulary || [];
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
