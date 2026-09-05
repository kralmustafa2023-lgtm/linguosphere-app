// ===========================
// LEVEL SELECT SCREEN
// ===========================

import { navigate } from '../app.js';

export const LevelSelectScreen = {
  render(root, levelData) {
    // This screen is merged into home.js
    // Redirect to home if accessed directly
    navigate('home');
  }
};
