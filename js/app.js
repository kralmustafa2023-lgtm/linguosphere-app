// ===========================
// APP.JS — Ana Router ve Başlatıcı
// ===========================

import { DataManager } from './data.js';
import { Storage } from './storage.js';
import { Speech } from './speech.js';

// Apply saved theme immediately on load
const currentTheme = Storage.getTheme();
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Global state
export const AppState = {
  currentLevel: null,
  currentLesson: null,
  currentMode: null,
  levelData: null,
  lessonData: null,
  isReview: false,
};

// Ekran geçişi
export async function navigate(screen, params = {}) {
  // Attach window.navigate for inline handlers
  if (typeof window !== 'undefined') window.navigate = navigate;
  
  // Stop any ongoing speech
  Speech.stop();
  
  // Scroll to top
  window.scrollTo(0, 0);
  
  // Update state
  Object.assign(AppState, params);

  // Screen aliases mapping
  const targetModuleMap = {
    ogren: 'home',
    home: 'home',
    pratik: 'practicePortal',
    practice: 'practicePortal',
    practicePortal: 'practicePortal',
    kelimelerim: 'vocabPortal',
    vocab: 'vocabPortal',
    vocabPortal: 'vocabPortal',
    analiz: 'analytics',
    analytics: 'analytics',
    profil: 'profile',
    profile: 'profile'
  };

  const targetScreen = targetModuleMap[screen] || screen;

  // Define screen types (screens vs games)
  const screenTypes = {
    home: 'screen',
    ogren: 'screen',
    practice: 'screen',
    pratik: 'screen',
    practicePortal: 'screen',
    vocab: 'screen',
    kelimelerim: 'screen',
    vocabPortal: 'screen',
    analytics: 'screen',
    analiz: 'screen',
    profile: 'screen',
    profil: 'screen',
    levelSelect: 'screen',
    lessonSelect: 'screen',
    modeSelect: 'screen',
    grammar: 'screen',
    result: 'screen',
    mistakeBank: 'screen',
    customVocab: 'screen',
    storyReading: 'screen',
    roleplay: 'screen',
    ocrScanner: 'screen',
    flashcard: 'game',
    quiz: 'game',
    match: 'game',
    fillBlank: 'game',
    sentenceBuilder: 'game',
    speedRound: 'game',
    typing: 'game',
    listening: 'game',
    voicePronunciation: 'game',
    shadowing: 'game',
    minimalPairs: 'game',
    examPrep: 'game',
  };

  const type = screenTypes[screen];

  if (!type) {
    console.warn(`Unknown screen or game: ${screen}`);
    return navigate('home');
  }

  const root = document.getElementById('app');
  root.innerHTML = '';

  try {
    const cacheBuster = 'v2-stitch-1';

    if (type === 'screen') {
      const modulePath = `./screens/${targetScreen}.js?v=${cacheBuster}`;
      const module = await import(modulePath);
      
      const screenComponents = {
        home: module.HomeScreen,
        practicePortal: module.PracticePortalScreen,
        vocabPortal: module.VocabPortalScreen,
        profile: module.ProfileScreen,
        analytics: module.AnalyticsScreen,
        levelSelect: module.LevelSelectScreen,
        lessonSelect: module.LessonSelectScreen,
        modeSelect: module.ModeSelectScreen,
        grammar: module.GrammarScreen,
        result: module.ResultScreen,
        mistakeBank: module.MistakeBankScreen,
        customVocab: module.CustomVocabScreen,
        storyReading: module.StoryReadingScreen,
        roleplay: module.RoleplayScreen,
        ocrScanner: module.OcrScannerScreen
      };

      const Component = screenComponents[targetScreen];
      if (Component && Component.render) {
        switch (targetScreen) {
          case 'home':
          case 'practicePortal':
          case 'vocabPortal':
          case 'profile':
          case 'analytics':
          case 'mistakeBank':
          case 'customVocab':
          case 'storyReading':
          case 'roleplay':
          case 'ocrScanner':
            Component.render(root);
            break;
          case 'levelSelect':
            Component.render(root, AppState.levelData);
            break;
          case 'lessonSelect':
            Component.render(root, AppState.levelData, AppState.currentLevel);
            break;
          case 'modeSelect':
            Component.render(root, AppState.lessonData);
            break;
          case 'grammar':
            Component.render(root, AppState.lessonData);
            break;
          case 'result':
            Component.render(root, params);
            break;
          default:
            Component.render(root);
            break;
        }
      } else {
        throw new Error(`Screen component '${screen}' not found or render method missing.`);
      }
    } else if (type === 'game') {
      const modulePath = `./games/${screen}.js?v=${cacheBuster}`;
      const module = await import(modulePath);
      
      const gameComponents = {
        flashcard: module.FlashcardGame,
        quiz: module.QuizGame,
        match: module.MatchGame,
        fillBlank: module.FillBlankGame,
        sentenceBuilder: module.SentenceGame,
        speedRound: module.SpeedGame,
        typing: module.TypingGame,
        listening: module.ListeningGame,
        voicePronunciation: module.VoicePronunciationGame,
        shadowing: module.ShadowingGame,
        minimalPairs: module.MinimalPairsGame,
        examPrep: module.ExamPrepGame
      };

      const GameComponent = gameComponents[screen];
      if (GameComponent && GameComponent.start) {
        GameComponent.start(root, AppState.lessonData);
      } else {
        throw new Error(`Game component '${screen}' not found or start method missing.`);
      }
    }
  } catch (err) {
    console.error(`Failed to load or render ${screen}:`, err);
    // Fallback to home screen or show an error message
    root.innerHTML = `<div class="error-message" style="padding: 20px; text-align: center; color: var(--color-error);">
                        <p>Bir hata oluştu: ${err.message}</p>
                        <button class="btn btn-primary" onclick="navigate('home')">Ana Sayfaya Dön</button>
                      </div>`;
  }
}

// Başlat
async function init() {
  const root = document.getElementById('app');
  
  // Initialize speech
  Speech.init();
  
  // Show loading screen
  root.innerHTML = `
    <div class="loading-screen" style="background: var(--bg-void);">
      <div class="logo-float" style="margin-bottom:20px; color: var(--accent-primary); filter: drop-shadow(0 0 24px rgba(124, 93, 250, 0.4));">
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m4 6 8-4 8 4"/>
          <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/>
          <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/>
          <path d="M18 5v17"/>
          <path d="M6 5v17"/>
          <circle cx="12" cy="9" r="2"/>
        </svg>
      </div>
      <div class="loading-title text-gradient">Linguosphere</div>
      <div class="loading-bar" style="margin-top:24px;width:240px;height:4px;background:rgba(255,255,255,0.05);">
        <div class="loading-bar-fill" style="background:linear-gradient(90deg, #7c5dfa, #2dd4a8)"></div>
      </div>
      <div class="loading-text" style="margin-top:16px;color:var(--text-tertiary);letter-spacing:0.04em;text-transform:uppercase;">DENEYİM YÜKLENİYOR...</div>
    </div>
  `;

  try {
    // Initial delay for smooth loading animation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Navigate to home (levels will be lazy loaded on demand)
    navigate('home');
  } catch (err) {
    console.error('Uygulama başlatma hatası:', err);
    root.innerHTML = `
      <div class="loading-screen" style="background:var(--bg-void)">
        <div style="color:var(--color-error); margin-bottom:var(--space-lg)">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
        <div class="loading-title" style="color:var(--text-primary); font-size:22px">Bağlantı Hatası</div>
        <div class="loading-text" style="max-width:320px;text-align:center;line-height:1.6;margin-top:12px;color:var(--text-secondary)">
          Sistem başlatılırken kritik bir sorunla karşılaşıldı. Lütfen bağlantınızı kontrol edip tekrar deneyin.<br>
          <small style="color:var(--text-tertiary);display:block;margin-top:8px">${err.message || 'Bilinmeyen hata'}</small>
        </div>
        <button class="btn btn-primary" onclick="location.reload()" style="margin-top:32px;padding:12px 32px">
          Sistemi Yeniden Başlat
        </button>
      </div>
    `;
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);

// Enable audio context on first user interaction (for mobile)
document.addEventListener('click', () => {
  if (typeof AudioContext !== 'undefined') {
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    ctx.close();
  }
}, { once: true });
