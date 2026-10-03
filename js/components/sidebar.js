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
    <!-- STITCH LUMINARY SIDEBAR (Hidden on Mobile, Docked on Desktop) -->
    <aside class="hidden md:flex fixed left-0 top-0 h-full w-72 bg-white/95 backdrop-blur-xl z-50 flex-col justify-between p-space-lg shadow-sm border-r border-outline-variant">
      <div class="flex flex-col gap-space-xl">
        <!-- Logo & Branding -->
        <div class="flex items-center justify-between cursor-pointer" onclick="window.navigate('home')">
          <div class="flex items-center gap-space-sm">
            <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
              <span class="material-symbols-outlined text-[24px]">school</span>
            </div>
            <div class="flex flex-col">
              <span class="font-headline-sm text-headline-sm text-on-surface font-extrabold tracking-tight">Linguosphere</span>
              <span class="font-label-sm text-label-sm text-primary font-bold tracking-wider uppercase">Master English</span>
            </div>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm uppercase tracking-wider font-extrabold">PRO</span>
        </div>

        <!-- Navigation Links -->
        <nav class="flex flex-col gap-1.5">
          ${navItems.map(item => {
            const isActive = (currentScreen === item.id || (currentScreen === 'home' && item.id === 'home'));
            const activeClasses = isActive 
              ? 'bg-primary text-white font-bold shadow-md tactile-btn-primary' 
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-semibold';

            return `
              <button type="button" class="group flex items-center justify-between px-space-md py-3 rounded-2xl transition-all duration-200 cursor-pointer text-left w-full ${activeClasses}"
                 onclick="window.navigate('${item.id}')"
                 data-path="${item.path}">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-[22px] transition-transform group-hover:scale-110">${item.icon}</span>
                  <span class="font-label-lg text-label-lg">${item.label}</span>
                </div>
                <span class="px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'} font-label-sm text-[11px] font-bold">${item.badge}</span>
              </button>
            `;
          }).join('')}
        </nav>
      </div>

      <!-- Bottom Mini Stats & Profile Pill -->
      <div class="flex flex-col gap-3 pt-3 bg-surface-container rounded-2xl p-4 border border-outline-variant">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-full border border-amber-200">
            <span class="material-symbols-outlined text-amber-600 text-[18px]" style="font-variation-settings:'FILL' 1;">local_fire_department</span>
            <span class="font-label-md text-label-md text-amber-700 font-extrabold">${streak} Gün</span>
          </div>
          <div class="flex items-center gap-1.5 px-2.5 py-1 bg-primary-fixed rounded-full border border-primary-fixed-dim">
            <span class="material-symbols-outlined text-primary text-[18px]" style="font-variation-settings:'FILL' 1;">toll</span>
            <span class="font-label-md text-label-md text-primary font-extrabold">${totalXP.toLocaleString()} XP</span>
          </div>
        </div>
        <div class="flex items-center justify-between gap-space-sm pt-2 border-t border-outline-variant/60">
          <div class="flex items-center gap-space-sm min-w-0 cursor-pointer" onclick="window.navigate('profile')">
            <div class="relative flex-shrink-0">
              <div class="w-9 h-9 rounded-full bg-primary-fixed border border-primary-fixed-dim text-primary flex items-center justify-center font-bold">
                <span class="material-symbols-outlined text-[20px]">person</span>
              </div>
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="font-label-md text-label-md text-on-surface truncate font-extrabold">Mustafa</span>
              <span class="font-label-sm text-label-sm text-on-surface-variant truncate font-medium">${userLevel.name}</span>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button type="button" class="theme-toggle-btn text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-xl hover:bg-surface-container-high flex items-center justify-center cursor-pointer" 
                    onclick="window.toggleTheme()" 
                    title="Temayı Değiştir">
              <span class="material-symbols-outlined text-[20px]" id="themeIcon">${Storage.getTheme() === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button type="button" class="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-xl hover:bg-surface-container-high flex items-center justify-center cursor-pointer" onclick="window.navigate('profile')">
              <span class="material-symbols-outlined text-[20px]">settings</span>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- MOBILE BOTTOM NAVIGATION (< 768px) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-2xl z-50 flex items-center justify-around px-2 border-t border-outline-variant shadow-lg">
      ${navItems.map(item => {
        const isActive = (currentScreen === item.id || (currentScreen === 'home' && item.id === 'home'));
        const activeColor = isActive ? 'text-primary font-extrabold scale-105' : 'text-on-surface-variant opacity-70 hover:opacity-100';

        return `
          <button type="button" class="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all cursor-pointer ${activeColor}"
                  onclick="window.navigate('${item.id}')">
            <span class="material-symbols-outlined text-[22px] ${isActive ? 'fill-icon' : ''}" ${isActive ? 'style="font-variation-settings: \'FILL\' 1;"' : ''}>${item.icon}</span>
            <span class="font-label-sm text-[10px] font-bold">${item.label}</span>
          </button>
        `;
      }).join('')}
    </nav>
  `;
}

export function renderHeaderBar() {
  const state = Storage.load();

  return `
    <header class="fixed top-0 left-0 md:left-72 right-0 h-16 bg-white/90 backdrop-blur-xl z-40 flex items-center justify-between px-4 md:px-space-xl border-b border-outline-variant shadow-xs">
      <div class="flex items-center gap-space-sm md:gap-space-md">
        <!-- Mobile Logo -->
        <div class="flex md:hidden items-center gap-2 cursor-pointer" onclick="window.navigate('home')">
          <div class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
            <span class="material-symbols-outlined text-[20px]">school</span>
          </div>
          <span class="font-extrabold text-on-surface text-base">Linguosphere</span>
        </div>

        <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/60">
          <span class="material-symbols-outlined text-primary text-[18px]">translate</span>
          <span class="font-label-sm text-label-sm text-on-surface font-bold">İngilizce B1</span>
        </div>
        <div class="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <span class="material-symbols-outlined text-emerald-600 text-[18px]">headset_mic</span>
          <span class="font-label-sm text-label-sm text-emerald-800 font-bold">AI Telaffuz Motoru Hazır</span>
        </div>
      </div>
      <div class="flex items-center gap-2 md:gap-space-md">
        <div class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
          <span class="material-symbols-outlined text-amber-600 text-[18px]" style="font-variation-settings: 'FILL' 1;">military_tech</span>
          <span class="font-label-sm text-label-sm text-amber-800 font-bold">Lig: Safir</span>
        </div>
        <button type="button" class="theme-toggle-btn flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer" 
                onclick="window.toggleTheme()" 
                title="Temayı Değiştir">
          <span class="material-symbols-outlined text-[20px]" id="themeIcon">${Storage.getTheme() === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>
        <button type="button" class="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer" onclick="window.navigate('profile')">
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
