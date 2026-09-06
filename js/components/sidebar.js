// ===========================
// SIDEBAR & NAVIGATION COMPONENT — Stitch Exact Layout
// ===========================

import { Storage } from '../storage.js';
import { getUserLevel } from '../progress.js';
import { navigate } from '../app.js';

export function renderSidebar(currentScreen = 'home') {
  const state = Storage.load();
  const userLevel = getUserLevel(state.totalXP);
  const streak = state.dailyStreak || 0;
  const totalXP = state.totalXP || 0;

  const navItems = [
    { id: 'home', path: 'ogren', label: 'Öğren', icon: 'explore', badge: 'Görev', color: 'text-secondary' },
    { id: 'practice', path: 'pratik', label: 'Pratik', icon: 'auto_stories', badge: 'AI Ses', color: 'text-primary' },
    { id: 'vocab', path: 'kelimelerim', label: 'Kelimelerim', icon: 'style', badge: 'Sözlük', color: 'text-tertiary' },
    { id: 'analytics', path: 'analiz', label: 'Analiz', icon: 'insights', badge: 'Radar', color: 'text-secondary' },
    { id: 'profile', path: 'profil', label: 'Profil', icon: 'manage_accounts', badge: 'Rozetler', color: 'text-on-surface-variant' },
  ];

  return `
    <!-- STITCH ULTRA SIDEBAR (Hidden on Mobile, Docked on Desktop) -->
    <aside class="hidden md:flex fixed left-0 top-0 h-full w-72 bg-surface-glass backdrop-blur-2xl z-50 flex-col justify-between p-space-lg shadow-[0_12px_32px_-4px_rgba(0,0,0,0.35)] border-r border-border-glass">
      <div class="flex flex-col gap-space-xl">
        <!-- Logo & Branding -->
        <div class="flex items-center justify-between cursor-pointer" onclick="window.navigate('home')">
          <div class="flex items-center gap-space-sm">
            <div class="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-sm border border-primary/30">
              <span class="material-symbols-outlined text-[22px]">school</span>
            </div>
            <div class="flex flex-col">
              <span class="font-headline-sm text-headline-sm text-on-surface font-extrabold tracking-tight">Linguosphere</span>
              <span class="font-label-sm text-label-sm text-secondary font-bold tracking-wider uppercase">Elite Linguistic AI</span>
            </div>
          </div>
          <span class="px-space-xs py-space-3xs rounded-full bg-primary/15 text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold">v2.5 PRO</span>
        </div>

        <!-- Navigation Links -->
        <nav class="flex flex-col gap-space-xs">
          ${navItems.map(item => {
            const isActive = (currentScreen === item.id || (currentScreen === 'home' && item.id === 'home'));
            const activeClasses = isActive 
              ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_20px_rgba(124,93,250,0.35)]' 
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface';

            return `
              <button type="button" class="group flex items-center justify-between px-space-md py-space-sm rounded-xl transition-all duration-200 cursor-pointer text-left w-full ${activeClasses}"
                 onclick="window.navigate('${item.id}')"
                 data-path="${item.path}">
                <div class="flex items-center gap-space-md">
                  <span class="material-symbols-outlined text-[22px] transition-transform group-hover:scale-110">${item.icon}</span>
                  <span class="font-label-lg text-label-lg">${item.label}</span>
                </div>
                <span class="px-space-xs py-space-3xs rounded-full bg-surface-container ${item.color} font-label-sm text-label-sm font-semibold">${item.badge}</span>
              </button>
            `;
          }).join('')}
        </nav>
      </div>

      <!-- Bottom Mini Stats & Profile Pill -->
      <div class="flex flex-col gap-space-md pt-space-md bg-surface-container-low/60 rounded-xl p-space-md border border-border-glass">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-tertiary text-[20px]" style="font-variation-settings:'FILL' 1;">local_fire_department</span>
            <span class="font-label-md text-label-md text-tertiary font-extrabold">${streak} Gün Seri</span>
          </div>
          <div class="flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-secondary text-[20px]" style="font-variation-settings:'FILL' 1;">bolt</span>
            <span class="font-label-md text-label-md text-secondary font-extrabold">${totalXP.toLocaleString()} XP</span>
          </div>
        </div>
        <div class="flex items-center justify-between gap-space-sm">
          <div class="flex items-center gap-space-sm min-w-0 cursor-pointer" onclick="window.navigate('profile')">
            <div class="relative flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 text-primary flex items-center justify-center font-bold">
                <span class="material-symbols-outlined text-[18px]">person</span>
              </div>
              <span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="font-label-md text-label-md text-on-surface truncate font-bold">İngilizce Öğrenicisi</span>
              <span class="font-label-sm text-label-sm text-on-surface-variant truncate">${userLevel.name}</span>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button type="button" class="theme-toggle-btn text-on-surface-variant hover:text-on-surface transition-colors p-space-2xs rounded-lg hover:bg-surface-container-high flex items-center justify-center cursor-pointer" 
                    onclick="window.toggleTheme()" 
                    title="Temayı Değiştir">
              <span class="material-symbols-outlined text-[18px]" id="themeIcon">${Storage.getTheme() === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button type="button" class="text-on-surface-variant hover:text-on-surface transition-colors p-space-2xs rounded-lg hover:bg-surface-container-high flex items-center justify-center cursor-pointer" onclick="window.navigate('profile')">
              <span class="material-symbols-outlined text-[18px]">settings</span>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- MOBILE BOTTOM NAVIGATION (< 768px) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-high/95 backdrop-blur-2xl z-50 flex items-center justify-around px-2 border-t border-border-glass shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
      ${navItems.map(item => {
        const isActive = (currentScreen === item.id || (currentScreen === 'home' && item.id === 'home'));
        const activeColor = isActive ? 'text-primary font-bold scale-105' : 'text-on-surface-variant opacity-70';

        return `
          <button type="button" class="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all cursor-pointer ${activeColor}"
                  onclick="window.navigate('${item.id}')">
            <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
            <span class="font-label-sm text-[10px]">${item.label}</span>
          </button>
        `;
      }).join('')}
    </nav>
  `;
}

export function renderHeaderBar() {
  const state = Storage.load();

  return `
    <header class="fixed top-0 left-0 md:left-72 right-0 h-16 bg-surface-glass backdrop-blur-xl z-40 flex items-center justify-between px-4 md:px-space-xl border-b border-border-glass shadow-[0_1px_8px_rgba(0,0,0,0.15)]">
      <div class="flex items-center gap-space-sm md:gap-space-md">
        <!-- Mobile Logo -->
        <div class="flex md:hidden items-center gap-2 cursor-pointer" onclick="window.navigate('home')">
          <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
            <span class="material-symbols-outlined text-[18px]">school</span>
          </div>
          <span class="font-bold text-on-surface text-sm">Linguosphere</span>
        </div>

        <div class="hidden sm:flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface-container-high/80">
          <span class="material-symbols-outlined text-on-surface-variant text-[18px]">translate</span>
          <span class="font-label-sm text-label-sm text-on-surface font-semibold">İngilizce • EN</span>
        </div>
        <div class="hidden lg:flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface-container-high/60">
          <span class="material-symbols-outlined text-secondary text-[18px]">headset_mic</span>
          <span class="font-label-sm text-label-sm text-secondary font-semibold">AI Telaffuz Motoru Aktif</span>
        </div>
      </div>
      <div class="flex items-center gap-2 md:gap-space-md">
        <div class="hidden sm:flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container/80">
          <span class="material-symbols-outlined text-tertiary text-[18px]">military_tech</span>
          <span class="font-label-sm text-label-sm text-on-surface">Lig: <strong class="text-tertiary">Safir</strong></span>
        </div>
        <button type="button" class="theme-toggle-btn flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer" 
                onclick="window.toggleTheme()" 
                title="Temayı Değiştir">
          <span class="material-symbols-outlined text-[20px]" id="themeIcon">${Storage.getTheme() === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>
        <button type="button" class="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer" onclick="window.navigate('profile')">
          <span class="material-symbols-outlined text-[20px]">notifications</span>
        </button>
      </div>
    </header>
  `;
}

// Global window.toggleTheme function — Instant smooth toggle without full reload
if (typeof window !== 'undefined') {
  window.toggleTheme = function() {
    const current = Storage.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    Storage.setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Update theme toggle icons across the DOM without re-navigating
    document.querySelectorAll('#themeIcon, .theme-toggle-btn span').forEach(el => {
      el.textContent = next === 'dark' ? 'light_mode' : 'dark_mode';
    });
  };
}
