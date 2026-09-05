// ===========================
// DATA — JSON Yükleme ve Cache
// ===========================

export const DataManager = {
  cache: {},

  async loadLevel(levelNum) {
    if (this.cache[levelNum]) return this.cache[levelNum];

    const file = `data/seviye${levelNum}_full.json`;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`${file} yüklenemedi (${res.status})`);
      const data = await res.json();
      this.cache[levelNum] = data;
      return data;
    } catch (err) {
      console.error(`Level ${levelNum} yükleme hatası:`, err);
      return null;
    }
  },

  async loadAllLevels() {
    const promises = [1, 2, 3, 4, 5].map(n => this.loadLevel(n));
    const results = await Promise.allSettled(promises);
    return results.map((r, i) => ({
      level: i + 1,
      data: r.status === 'fulfilled' ? r.value : null,
      error: r.status === 'rejected' ? r.reason : null
    }));
  },

  getLessonById(levelData, lessonId) {
    if (!levelData || !levelData.lessons) return null;
    return levelData.lessons.find(l => l.id === lessonId) || null;
  },

  getLevelReview(levelData) {
    if (!levelData) return null;
    return levelData.levelReview || null;
  },

  getLevelMeta(levelNum) {
    const data = this.cache[levelNum];
    return data ? data.meta : null;
  },

  getAllLoadedLevels() {
    return Object.keys(this.cache).map(k => ({
      level: parseInt(k),
      data: this.cache[k]
    }));
  }
};
