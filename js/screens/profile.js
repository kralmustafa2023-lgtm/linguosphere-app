// ===========================
// PROFILE SCREEN — Stitch Luminous Identity & Settings Edition
// ===========================

import { renderSidebar, renderHeaderBar } from '../components/sidebar.js';
import { Storage } from '../storage.js';
import { Speech } from '../speech.js';
import { getUserLevel, getXPProgress } from '../progress.js';
import { navigate } from '../app.js';

export const ProfileScreen = {
  render(root) {
    const state = Storage.load();
    const userLevel = getUserLevel(state.totalXP);
    const xpProgress = getXPProgress(state.totalXP);
    const totalXP = state.totalXP || 0;
    const streak = state.dailyStreak || 0;

    root.innerHTML = `
      ${renderSidebar('profile')}
      
      <div class="pl-72 relative z-10 min-h-screen">
        ${renderHeaderBar()}

        <main class="w-full pt-16 px-space-xl bg-transparent relative min-h-screen">
          <div class="flex flex-col w-full pb-space-4xl gap-space-2xl">
            
            <!-- Section 1: Profil Hero Header Bento -->
            <div class="relative w-full rounded-2xl bg-surface-glass backdrop-blur-2xl p-space-xl shadow-xl overflow-hidden border border-border-glass">
              <div class="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-border-glass-highlight to-transparent"></div>
              
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                <!-- Avatar & Core Identity -->
                <div class="lg:col-span-8 flex flex-col sm:flex-row items-center sm:items-start gap-space-xl">
                  
                  <!-- Avatar Frame -->
                  <div class="relative group shrink-0">
                    <div class="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary-container via-secondary to-tertiary blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-surface-container-high p-1 border border-border-glass">
                      <div class="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        <span class="material-symbols-outlined text-[64px]">person</span>
                      </div>
                    </div>
                    <!-- Online Status Dot -->
                    <span class="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-surface-container-lowest">
                      <span class="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-secondary opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                    </span>
                  </div>

                  <!-- Identity Details -->
                  <div class="flex flex-col items-center sm:items-start text-center sm:text-left gap-space-xs">
                    <div class="flex flex-wrap items-center justify-center sm:justify-start gap-space-xs">
                      <span class="px-space-sm py-space-3xs rounded-full bg-primary/15 text-primary font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-1 font-bold">
                        <span class="material-symbols-outlined text-[14px]">verified</span> Linguosphere Pro Üyesi
                      </span>
                      <span class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                        <span class="material-symbols-outlined text-[14px] text-tertiary">calendar_month</span> Katılım: Eylül 2026
                      </span>
                    </div>

                    <h1 class="font-headline-md text-headline-md text-on-surface font-extrabold tracking-tight mt-1">
                      İngilizce Öğrenicisi
                    </h1>
                    
                    <div class="flex flex-wrap items-center justify-center sm:justify-start gap-space-sm">
                      <span class="font-body-md text-body-md text-secondary font-semibold">@linguo_learner</span>
                      <span class="text-outline-variant">•</span>
                      <span class="px-space-sm py-space-3xs rounded-full bg-secondary/15 text-secondary font-label-md text-label-md font-bold">
                        ${userLevel.name}
                      </span>
                      <span class="text-outline-variant">•</span>
                      <span class="font-label-sm text-label-sm text-tertiary flex items-center gap-0.5 font-bold">
                        <span class="material-symbols-outlined text-[16px]">military_tech</span> Safir Lig Lideri
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Circular XP Gauge Bento Cell -->
                <div class="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
                  <div class="w-full max-w-[260px] p-space-md rounded-xl bg-surface-container/60 backdrop-blur-md flex flex-col items-center gap-space-sm shadow-md border border-border-glass">
                    <div class="relative w-36 h-36 flex items-center justify-center">
                      <svg class="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle class="text-surface-container-highest" cx="60" cy="60" fill="none" r="50" stroke="currentColor" stroke-width="9"/>
                        <circle class="text-primary-container transition-all duration-1000 ease-out" cx="60" cy="60" fill="none" r="50" stroke="currentColor" stroke-dasharray="314.16" stroke-dashoffset="${314.16 - (314.16 * xpProgress.percent / 100)}" stroke-linecap="round" stroke-width="9"/>
                      </svg>
                      <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">İlerleme</span>
                        <span class="font-headline-md text-headline-md text-on-surface font-extrabold tracking-tight">%${xpProgress.percent}</span>
                        <span class="font-label-sm text-label-sm text-secondary font-bold">XP Hedefi</span>
                      </div>
                    </div>
                    <div class="flex flex-col items-center text-center w-full">
                      <div class="flex items-center justify-between w-full font-label-sm text-label-sm text-on-surface-variant px-space-xs font-semibold">
                        <span>Mevcut: <strong class="text-on-surface">${xpProgress.current} XP</strong></span>
                        <span>Hedef: <strong class="text-tertiary">${xpProgress.needed} XP</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 2: Uygulama Ayarları ve Tercihler Kartı -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              
              <!-- Left Column: Audio & Speech Engine -->
              <div class="lg:col-span-7 flex flex-col gap-space-lg">
                <div class="rounded-2xl bg-surface-glass backdrop-blur-xl p-space-xl shadow-lg flex flex-col gap-space-xl border border-border-glass">
                  <div class="flex items-center justify-between pb-space-sm border-b border-border-glass">
                    <div class="flex items-center gap-space-sm">
                      <span class="material-symbols-outlined text-primary text-[28px]">graphic_eq</span>
                      <div>
                        <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Ses & Konuşma Motoru</h2>
                        <p class="font-body-sm text-body-sm text-on-surface-variant">Yapay zeka ses analiz parametrelerini özelleştirin.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Control: Sound Effects Toggle -->
                  <div class="flex items-center justify-between p-space-md rounded-xl bg-surface-container-low/70 border border-border-glass">
                    <div class="flex items-start gap-space-sm">
                      <div class="p-space-xs rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <span class="material-symbols-outlined text-[20px]">volume_up</span>
                      </div>
                      <div>
                        <span class="font-label-lg text-label-lg text-on-surface block font-bold">Ses Efektleri & Telaffuz (TTS)</span>
                        <span class="font-body-sm text-body-sm text-on-surface-variant">Oyun içi sesler ve metin okuma motoru</span>
                      </div>
                    </div>
                    
                    <button class="px-space-md py-space-xs rounded-full bg-secondary text-on-secondary font-label-md text-label-md font-bold cursor-pointer transition-all" id="profileSoundToggleBtn">
                      ${Speech.enabled ? 'Açık' : 'Kapalı'}
                    </button>
                  </div>

                  <!-- Control: Speech Rate Segmented Pills -->
                  <div class="flex flex-col gap-space-xs p-space-md rounded-xl bg-surface-container-low/70 border border-border-glass">
                    <div class="flex items-center justify-between mb-space-xs">
                      <span class="font-label-lg text-label-lg text-on-surface font-bold">Konuşma Okuma Hızı</span>
                      <span class="font-label-sm text-label-sm text-secondary font-bold" id="speed-indicator">${Speech.rate === 0.55 ? '0.55x Yavaş' : Speech.rate === 0.85 ? '0.85x Normal' : '1.0x Hızlı'}</span>
                    </div>

                    <div class="grid grid-cols-3 gap-space-xs p-1 rounded-xl bg-surface-container-lowest/80 border border-border-glass">
                      ${[0.55, 0.85, 1.0].map(rate => `
                        <button class="py-space-xs rounded-lg font-label-md text-label-md transition-all cursor-pointer ${Speech.rate === rate ? 'bg-primary-container text-on-primary-container font-bold shadow-md' : 'text-on-surface-variant hover:text-on-surface'}"
                                onclick="window.setProfileSpeechRate(${rate})">
                          ${rate === 0.55 ? '0.55x Yavaş' : rate === 0.85 ? '0.85x Normal' : '1.0x Hızlı'}
                        </button>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: System & Preferences -->
              <div class="lg:col-span-5 flex flex-col gap-space-lg">
                <div class="rounded-2xl bg-surface-glass backdrop-blur-xl p-space-xl shadow-lg flex flex-col gap-space-xl border border-border-glass">
                  <div class="flex items-center gap-space-sm pb-space-sm border-b border-border-glass">
                    <span class="material-symbols-outlined text-tertiary text-[28px]">tune</span>
                    <div>
                      <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Genel Tercihler</h2>
                      <p class="font-body-sm text-body-sm text-on-surface-variant">Arayüz ve sistem dili.</p>
                    </div>
                  </div>

                  <!-- Interface Language -->
                  <div class="flex flex-col gap-space-xs p-space-md rounded-xl bg-surface-container-low/70 border border-border-glass">
                    <span class="font-label-lg text-label-lg text-on-surface font-bold">Arayüz Dili (UI Language)</span>
                    <select class="w-full px-space-md py-space-sm rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md border border-border-glass">
                      <option selected>🇹🇷 Türkçe (Ana Dil Desteği)</option>
                      <option>🇬🇧 English (Full Immersion)</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <!-- Danger Zone -->
            <div class="relative w-full rounded-2xl bg-surface-container-lowest/90 p-space-xl shadow-xl overflow-hidden border border-soft-coral/30">
              <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg relative z-10">
                <div class="flex items-start gap-space-md max-w-2xl">
                  <div class="p-space-sm rounded-xl bg-error/15 text-error flex items-center justify-center shrink-0 mt-1">
                    <span class="material-symbols-outlined text-[26px]">warning</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <h3 class="font-headline-sm text-headline-sm text-error font-bold">Tehlike Bölgesi (Danger Zone)</h3>
                    <p class="font-body-md text-body-md text-on-surface-variant">
                      Tüm tamamlanan dersler, telaffuz kayıtları ve kazanılan <span class="text-tertiary font-semibold">${totalXP} XP</span> kalıcı olarak sıfırlanacaktır.
                    </p>
                  </div>
                </div>
                <button class="px-space-lg py-space-md rounded-xl bg-error text-white font-label-lg text-label-lg font-bold flex items-center gap-space-xs shadow-lg hover:brightness-110 transition-all cursor-pointer" id="reset-all-btn">
                  <span class="material-symbols-outlined text-[20px]">delete_forever</span>
                  <span>Tüm İlerlemeyi Sıfırla</span>
                </button>
              </div>
            </div>

            <!-- Footer Build Info -->
            <div class="w-full rounded-2xl bg-surface-glass backdrop-blur-xl p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md border border-border-glass">
              <div class="flex items-center gap-space-md">
                <span class="material-symbols-outlined text-primary text-[22px]">verified_user</span>
                <span class="font-label-md text-label-md text-on-surface font-bold">Linguosphere v2.5 Ultra Pro Edition</span>
              </div>
            </div>

          </div>
        </main>
      </div>
    `;

    this.attachEvents();
  },

  attachEvents() {
    document.getElementById('profileSoundToggleBtn')?.addEventListener('click', () => {
      Speech.toggle();
      const btn = document.getElementById('profileSoundToggleBtn');
      if (btn) btn.textContent = Speech.enabled ? 'Açık' : 'Kapalı';
    });

    window.setProfileSpeechRate = (rate) => {
      Speech.setRate(rate);
      ProfileScreen.render(document.getElementById('app'));
    };

    document.getElementById('reset-all-btn')?.addEventListener('click', () => {
      if (confirm('⚠️ TÜM ilerlemeniz ve XP puanlarınız silinecektir. Emin misiniz?')) {
        Storage.reset();
        alert('Tüm veriler başarıyla sıfırlandı.');
        navigate('home');
      }
    });
  }
};
