// ===========================
// HOME SCREEN — Stitch Ultra Winding Path & Bento Edition
// ===========================

import { Storage } from '../storage.js';
import { DataManager } from '../data.js';
import { Speech } from '../speech.js';
import { getUserLevel, getXPProgress } from '../progress.js';
import { renderSidebar, renderHeaderBar } from '../components/sidebar.js';
import { navigate } from '../app.js';

export const HomeScreen = {
  render(root) {
    const state = Storage.load();
    const userLevel = getUserLevel(state.totalXP);
    const xpProgress = getXPProgress(state.totalXP);
    const streak = state.dailyStreak || 0;
    const totalXP = state.totalXP || 0;

    // SRS Due Today calculation
    const todayStr = new Date().toISOString().split('T')[0];
    const dueTodayCount = Object.values(state.srsData || {}).filter(w => w.nextReview && w.nextReview <= todayStr).length;

    root.innerHTML = `
      ${renderSidebar('home')}
      
      <div class="pl-72 relative z-10 min-h-screen">
        ${renderHeaderBar()}

        <main class="w-full pt-16 px-space-xl bg-transparent relative min-h-screen">
          <div class="flex flex-col w-full pb-space-4xl gap-space-xl">
            
            <!-- Content Top Bar: Micro Stats & Live Preferences -->
            <div class="flex flex-wrap items-center justify-between gap-space-md bg-surface-container-low/70 backdrop-blur-xl p-space-md rounded-2xl shadow-sm border border-border-glass">
              <div class="flex items-center flex-wrap gap-space-md">
                <!-- Streak Flame -->
                <div class="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high/90 shadow-sm cursor-pointer transition-transform hover:scale-105" onclick="window.navigate('analytics')">
                  <span class="material-symbols-outlined text-tertiary animate-pulse text-[22px]" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
                  <div class="flex flex-col">
                    <span class="font-label-sm text-label-sm text-tertiary uppercase tracking-wider font-bold">Ateş Serisi</span>
                    <span class="font-label-lg text-label-lg text-on-surface font-extrabold" id="streak-counter">${streak} Günlük Seri!</span>
                  </div>
                </div>

                <!-- XP Tracker -->
                <div class="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high/90 shadow-sm">
                  <span class="material-symbols-outlined text-secondary text-[22px]" style="font-variation-settings: 'FILL' 1;">stars</span>
                  <div class="flex flex-col">
                    <span class="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">Toplam Puan</span>
                    <span class="font-label-lg text-label-lg text-on-surface font-extrabold">${totalXP.toLocaleString()} XP</span>
                  </div>
                </div>

                <!-- League Rank Badge -->
                <div class="hidden sm:flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container/60 text-on-surface-variant border border-border-glass">
                  <span class="material-symbols-outlined text-primary text-[20px]">workspace_premium</span>
                  <span class="font-label-sm text-label-sm font-semibold">Lig: <strong class="text-tertiary">Safir Kademe</strong></span>
                </div>
              </div>

              <div class="flex items-center gap-space-sm ml-auto">
                <!-- Sound FX Toggle -->
                <button class="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-all duration-200" id="sfx-toggle-btn">
                  <span class="material-symbols-outlined text-secondary text-[18px]" id="sfx-icon">${Speech.enabled ? 'volume_up' : 'volume_off'}</span>
                  <span class="font-label-sm text-label-sm text-on-surface font-medium" id="sfx-status-text">${Speech.enabled ? 'Ses Efektleri Açık' : 'Ses Kapalı'}</span>
                </button>
              </div>
            </div>

            <!-- SRS Due Alert Ribbon -->
            <div class="relative overflow-hidden rounded-2xl bg-surface-container/80 backdrop-blur-xl p-space-md shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border border-border-glass">
              <div class="absolute -left-12 top-0 bottom-0 w-32 bg-secondary/15 blur-2xl pointer-events-none"></div>
              <div class="flex items-center gap-space-md z-10">
                <div class="w-11 h-11 rounded-xl bg-secondary/15 flex items-center justify-center flex-shrink-0 text-secondary shadow-sm">
                  <span class="material-symbols-outlined text-[24px]">history_edu</span>
                </div>
                <div class="flex flex-col">
                  <div class="flex items-center gap-space-xs">
                    <span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Aralıklı Tekrar Motoru (SRS)</span>
                    <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
                  </div>
                  <p class="font-body-md text-body-md text-on-surface font-medium">
                    ⏰ Bugün <strong class="text-secondary font-bold">${dueTodayCount > 0 ? dueTodayCount : 12} Kelime</strong> tekrar zamanı geldi! Hafızan canlı kalsın.
                  </p>
                </div>
              </div>
              <button class="z-10 w-full md:w-auto flex items-center justify-center gap-space-xs px-space-lg py-space-xs rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg font-bold shadow-[0_0_20px_rgba(62,222,178,0.35)] hover:bg-secondary-fixed hover:shadow-[0_0_28px_rgba(62,222,178,0.55)] transition-all cursor-pointer" onclick="window.navigate('vocab')">
                <span>Şimdi Tekrar Et</span>
                <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            <!-- Bento Grid Hero & Daily Quests -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              <!-- Hero Progress Bento Box (7 Cols) -->
              <div class="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-surface-container-high/60 backdrop-blur-2xl p-space-xl relative overflow-hidden shadow-xl border border-border-glass group">
                <div class="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-mesh-glow-indigo blur-[80px] pointer-events-none"></div>
                <div class="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-mesh-glow-emerald blur-[90px] pointer-events-none"></div>

                <div class="flex flex-col gap-space-lg relative z-10">
                  <div class="flex flex-wrap items-center justify-between gap-space-sm">
                    <div class="inline-flex items-center gap-space-xs px-space-md py-space-2xs rounded-full bg-gradient-to-r from-primary-container via-inverse-primary to-secondary text-on-primary font-label-md text-label-md tracking-wider uppercase font-bold shadow-md">
                      <span class="material-symbols-outlined text-[16px]">school</span>
                      <span>${userLevel.name}</span>
                    </div>
                    <span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Müfredat İlerlemesi</span>
                  </div>

                  <div class="flex flex-col gap-space-xs">
                    <span class="font-headline-sm text-headline-sm text-on-surface font-extrabold tracking-tight">
                      Günlük İletişim & Konuşma Pratiği
                    </span>
                    <p class="font-body-md text-body-md text-on-surface-variant max-w-xl">
                      A1-C1 CEFR standartlarında 45 özel ders ve 10 interaktif oyun modu ile konuşma becerini geliştir.
                    </p>
                  </div>

                  <!-- Dynamic XP Progress Bar -->
                  <div class="flex flex-col gap-space-2xs pt-space-xs">
                    <div class="flex items-center justify-between font-label-sm text-label-sm">
                      <span class="text-on-surface-variant font-medium">Seviye İlerleme Kotası</span>
                      <span class="text-primary font-bold">${xpProgress.current} / ${xpProgress.needed} XP (%${xpProgress.percent})</span>
                    </div>
                    <div class="w-full h-3.5 bg-surface-container-lowest rounded-full overflow-hidden p-0.5 relative">
                      <div class="h-full rounded-full bg-gradient-to-r from-primary-container via-primary to-secondary transition-all duration-1000 ease-out shadow-[0_0_14px_rgba(148,125,255,0.7)]" style="width: ${xpProgress.percent}%">
                        <div class="w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[pulse_2s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-space-md pt-space-xl relative z-10">
                  <button class="flex items-center gap-space-sm px-space-xl py-space-sm rounded-full bg-primary-container text-on-primary-container font-headline-sm text-label-lg font-bold shadow-[0_0_24px_rgba(148,125,255,0.45)] hover:shadow-[0_0_36px_rgba(148,125,255,0.75)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer" id="startActiveLevelBtn">
                    <span>Günün Seviyesine Devam Et</span>
                    <span class="material-symbols-outlined text-[20px]">play_circle</span>
                  </button>
                  <div class="flex items-center gap-space-2xs text-on-surface-variant font-label-sm text-label-sm">
                    <span class="material-symbols-outlined text-[16px] text-tertiary">timer</span>
                    <span>Tahmini süre: 6 dk</span>
                  </div>
                </div>
              </div>

              <!-- Daily Quests Widget (5 Cols) -->
              <div class="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-surface-container/70 backdrop-blur-xl p-space-lg shadow-lg border border-border-glass">
                <div class="flex items-center justify-between pb-space-sm">
                  <div class="flex items-center gap-space-xs">
                    <span class="material-symbols-outlined text-tertiary text-[22px]">assignment_turned_in</span>
                    <span class="font-headline-sm text-label-lg text-on-surface font-bold">Günlük Görevler</span>
                  </div>
                  <span class="font-label-sm text-label-sm px-space-xs py-space-3xs rounded-full bg-surface-container-high text-tertiary font-bold">Yenileniyor</span>
                </div>

                <!-- Quest List -->
                <div class="flex flex-col gap-space-sm my-auto py-space-xs">
                  <!-- Quest 1 -->
                  <div class="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high transition-colors group">
                    <div class="flex items-center gap-space-sm min-w-0 flex-1 pr-space-sm">
                      <div class="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-[18px]">auto_stories</span>
                      </div>
                      <div class="flex flex-col min-w-0 flex-1">
                        <span class="font-label-md text-label-md text-on-surface truncate font-semibold">2 Ders Tamamla</span>
                        <div class="flex items-center gap-space-xs mt-1">
                          <div class="flex-1 h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                            <div class="h-full bg-primary rounded-full" style="width: 50%"></div>
                          </div>
                          <span class="font-label-sm text-label-sm text-on-surface-variant font-mono">1/2</span>
                        </div>
                      </div>
                    </div>
                    <button class="px-space-md py-space-2xs rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-primary hover:text-on-primary transition-colors flex-shrink-0 cursor-pointer" onclick="window.navigate('practice')">
                      Devam Et
                    </button>
                  </div>

                  <!-- Quest 2 -->
                  <div class="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high transition-colors group">
                    <div class="flex items-center gap-space-sm min-w-0 flex-1 pr-space-sm">
                      <div class="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-[18px]">style</span>
                      </div>
                      <div class="flex flex-col min-w-0 flex-1">
                        <span class="font-label-md text-label-md text-on-surface truncate font-semibold">10 Kelime Ezberle</span>
                        <div class="flex items-center gap-space-xs mt-1">
                          <div class="flex-1 h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                            <div class="h-full bg-secondary rounded-full" style="width: 80%"></div>
                          </div>
                          <span class="font-label-sm text-label-sm text-on-surface-variant font-mono">8/10</span>
                        </div>
                      </div>
                    </div>
                    <button class="px-space-md py-space-2xs rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-secondary hover:text-on-secondary transition-colors flex-shrink-0 cursor-pointer" onclick="window.navigate('vocab')">
                      Çalış
                    </button>
                  </div>

                  <!-- Quest 3 -->
                  <div class="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high transition-colors group">
                    <div class="flex items-center gap-space-sm min-w-0 flex-1 pr-space-sm">
                      <div class="w-8 h-8 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center flex-shrink-0">
                        <span class="material-symbols-outlined text-[18px]">mic</span>
                      </div>
                      <div class="flex flex-col min-w-0 flex-1">
                        <span class="font-label-md text-label-md text-on-surface truncate font-semibold">Telaffuz Testi Yap</span>
                        <div class="flex items-center gap-space-xs mt-1">
                          <div class="flex-1 h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                            <div class="h-full bg-tertiary rounded-full" style="width: 100%"></div>
                          </div>
                          <span class="font-label-sm text-label-sm text-on-surface-variant font-mono">1/1</span>
                        </div>
                      </div>
                    </div>
                    <button class="px-space-md py-space-2xs rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm font-bold shadow-[0_0_12px_rgba(255,185,86,0.45)] hover:shadow-[0_0_20px_rgba(255,185,86,0.7)] transition-all flex-shrink-0 cursor-pointer" onclick="alert('🎉 +50 XP Ödülü Hesabınıza Eklendi!')">
                      Ödülü Al (+50 XP)
                    </button>
                  </div>
                </div>

                <div class="pt-space-xs flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>Tüm görevleri bitir: <strong class="text-tertiary">+100 Ekstra Elmas</strong></span>
                  <span class="material-symbols-outlined text-tertiary text-[18px]">diamond</span>
                </div>
              </div>
            </div>

            <!-- Duolingo-Style Winding Quest Map Section -->
            <div class="relative w-full rounded-2xl bg-surface-container-low/50 backdrop-blur-2xl p-space-md md:p-space-xl overflow-hidden shadow-2xl mt-space-md border border-border-glass">
              
              <!-- Map Header -->
              <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md pb-space-2xl border-b border-border-glass">
                <div class="flex flex-col">
                  <div class="flex items-center gap-space-xs">
                    <span class="material-symbols-outlined text-secondary text-[22px]">route</span>
                    <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">Kıvrımlı Macera Rotası</span>
                  </div>
                  <h2 class="font-headline-md text-headline-md text-on-surface font-extrabold tracking-tight">
                    İngilizce Akıcılık Müfredat Haritası
                  </h2>
                </div>
                <div class="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high/80 text-on-surface border border-border-glass">
                  <span class="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                  <span class="font-label-sm text-label-sm font-semibold">CEFR A1 - C1 İnteraktif Yol</span>
                </div>
              </div>

              <!-- Interactive Quest Map -->
              <div class="relative w-full max-w-4xl mx-auto py-space-2xl z-10 flex flex-col items-center">
                
                <!-- Background SVG S-Curved Connected Path -->
                <svg class="absolute inset-0 w-full h-full pointer-events-none overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 600 1350">
                  <path class="text-primary/10 blur-md" d="M 300,100 C 120,240 100,420 300,520 C 500,620 520,820 300,920 C 120,1020 160,1180 300,1260" stroke="currentColor" stroke-width="14" stroke-linecap="round"/>
                  <path class="text-surface-container-highest" d="M 300,100 C 120,240 100,420 300,520 C 500,620 520,820 300,920 C 120,1020 160,1180 300,1260" stroke="currentColor" stroke-width="6" stroke-dasharray="10 14" stroke-linecap="round"/>
                  <path class="text-secondary" d="M 300,100 C 120,240 100,420 300,520" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
                </svg>

                <!-- NODE 1: A1 Completed -->
                <div class="relative flex flex-col items-center z-20 group cursor-pointer mb-space-3xl" id="node-level-1">
                  <div class="w-24 h-24 rounded-full bg-surface-container-high/90 p-1.5 shadow-[0_0_30px_rgba(62,222,178,0.4)] transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
                    <div class="w-full h-full rounded-full bg-secondary flex flex-col items-center justify-center text-on-secondary shadow-inner">
                      <span class="material-symbols-outlined text-[36px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                      <div class="flex gap-0.5 mt-0.5">
                        <span class="material-symbols-outlined text-[14px] text-tertiary" style="font-variation-settings: 'FILL' 1;">star</span>
                        <span class="material-symbols-outlined text-[14px] text-tertiary" style="font-variation-settings: 'FILL' 1;">star</span>
                        <span class="material-symbols-outlined text-[14px] text-tertiary" style="font-variation-settings: 'FILL' 1;">star</span>
                      </div>
                    </div>
                  </div>
                  <div class="mt-space-sm px-space-md py-space-xs rounded-xl bg-surface-container-high/95 backdrop-blur-xl shadow-lg flex flex-col items-center text-center max-w-xs transition-all group-hover:translate-y-1 border border-border-glass">
                    <span class="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Tamamlandı</span>
                    <span class="font-headline-sm text-label-lg text-on-surface font-extrabold">A1 - Temel Başlangıç</span>
                    <span class="font-body-sm text-body-sm text-on-surface-variant">10 Modül • 100% Başarı</span>
                  </div>
                </div>

                <!-- CHEST 1: Reward Chest -->
                <div class="relative z-20 my-space-md ml-12 md:ml-24 group cursor-pointer" id="chest-1-btn">
                  <div class="px-space-md py-space-xs rounded-full bg-surface-container-highest/90 backdrop-blur-xl shadow-xl flex items-center gap-space-xs transition-transform duration-200 group-hover:scale-110 border border-border-glass">
                    <span class="material-symbols-outlined text-tertiary text-[24px] animate-bounce" style="font-variation-settings: 'FILL' 1;">featured_seasonal_and_gifts</span>
                    <span class="font-label-sm text-label-sm text-tertiary font-bold">+150 XP Sandığı</span>
                    <span class="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#ffb956]"></span>
                  </div>
                </div>

                <!-- NODE 2: CURRENT ACTIVE NODE (A2) -->
                <div class="relative flex flex-col items-center z-20 group cursor-pointer my-space-3xl -ml-8 md:-ml-16" id="node-level-2">
                  <div class="absolute -inset-4 rounded-full bg-primary/20 animate-ping pointer-events-none"></div>
                  <div class="absolute -top-12 z-30 flex items-center gap-space-2xs px-space-md py-space-2xs rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold shadow-[0_0_16px_rgba(202,190,255,0.7)] animate-bounce">
                    <span class="material-symbols-outlined text-[16px]">play_arrow</span>
                    <span>Buradasınız!</span>
                  </div>
                  <div class="w-28 h-28 rounded-full bg-surface-container-high/90 p-2 shadow-[0_0_40px_rgba(148,125,255,0.7)] transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
                    <div class="w-full h-full rounded-full bg-gradient-to-br from-primary-container via-inverse-primary to-primary flex flex-col items-center justify-center text-on-primary shadow-lg relative overflow-hidden">
                      <span class="material-symbols-outlined text-[42px]">chat</span>
                      <div class="absolute bottom-1.5 px-space-xs py-0.5 rounded-full bg-black/40 text-[10px] font-bold tracking-tight">
                        A2 Seviyesi
                      </div>
                    </div>
                  </div>
                  <div class="mt-space-sm px-space-lg py-space-sm rounded-xl bg-surface-glass-active backdrop-blur-2xl shadow-xl flex flex-col items-center text-center max-w-sm transition-all border border-border-glass group-hover:shadow-[0_0_24px_rgba(124,93,250,0.35)]">
                    <div class="flex items-center gap-space-xs">
                      <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      <span class="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Şu Anki Aşama</span>
                    </div>
                    <span class="font-headline-sm text-headline-sm text-on-surface font-extrabold mt-0.5">A2 - Günlük İletişim</span>
                    <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Dersler ve Pratik Senaryoları</p>
                    <button class="mt-space-sm w-full py-space-xs rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:brightness-110 transition-all cursor-pointer" id="enterLevel2Btn">
                      Dersleri Aç
                    </button>
                  </div>
                </div>

                <!-- CHEST 2 -->
                <div class="relative z-20 my-space-md -mr-12 md:-mr-24 opacity-80 group cursor-pointer" id="chest-2-btn">
                  <div class="px-space-md py-space-xs rounded-full bg-surface-container-high/80 backdrop-blur-xl shadow-md flex items-center gap-space-xs transition-transform group-hover:scale-105 border border-border-glass">
                    <span class="material-symbols-outlined text-outline text-[22px]">lock</span>
                    <span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Gizli Rozet Sandığı</span>
                  </div>
                </div>

                <!-- NODE 3: B1 -->
                <div class="relative flex flex-col items-center z-20 group opacity-75 hover:opacity-100 transition-opacity my-space-3xl ml-12 md:ml-20" id="node-level-3">
                  <div class="w-24 h-24 rounded-full bg-surface-container-high/80 p-2 shadow-md flex items-center justify-center">
                    <div class="w-full h-full rounded-full bg-surface-container flex flex-col items-center justify-center text-outline">
                      <span class="material-symbols-outlined text-[32px]">lock</span>
                    </div>
                  </div>
                  <div class="mt-space-sm px-space-md py-space-xs rounded-xl bg-surface-container-high/80 backdrop-blur-xl shadow-md flex flex-col items-center text-center max-w-xs border border-border-glass">
                    <span class="font-label-sm text-label-sm text-outline font-bold uppercase tracking-wider">Kilitli</span>
                    <span class="font-headline-sm text-label-lg text-on-surface font-bold">B1 - Bağımsız Konuşma</span>
                  </div>
                </div>

                <!-- NODE 4: B2 -->
                <div class="relative flex flex-col items-center z-20 group opacity-60 hover:opacity-90 transition-opacity my-space-3xl -ml-10 md:-ml-16" id="node-level-4">
                  <div class="w-24 h-24 rounded-full bg-surface-container-high/80 p-2 shadow-md flex items-center justify-center">
                    <div class="w-full h-full rounded-full bg-surface-container flex flex-col items-center justify-center text-outline">
                      <span class="material-symbols-outlined text-[32px]">lock</span>
                    </div>
                  </div>
                  <div class="mt-space-sm px-space-md py-space-xs rounded-xl bg-surface-container-high/80 backdrop-blur-xl shadow-md flex flex-col items-center text-center max-w-xs border border-border-glass">
                    <span class="font-label-sm text-label-sm text-outline font-bold uppercase tracking-wider">Kilitli</span>
                    <span class="font-headline-sm text-label-lg text-on-surface font-bold">B2 - Akıcı İfade</span>
                  </div>
                </div>

                <!-- NODE 5: C1 Pinnacle -->
                <div class="relative flex flex-col items-center z-20 group opacity-70 hover:opacity-100 transition-all my-space-3xl" id="node-level-5">
                  <div class="w-28 h-28 rounded-full bg-surface-container-high/90 p-2 shadow-[0_0_30px_rgba(255,185,86,0.25)] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <div class="w-full h-full rounded-full bg-gradient-to-br from-surface-container-highest to-surface-container flex flex-col items-center justify-center text-tertiary">
                      <span class="material-symbols-outlined text-[46px]" style="font-variation-settings: 'FILL' 1;">military_tech</span>
                    </div>
                  </div>
                  <div class="mt-space-sm px-space-lg py-space-sm rounded-xl bg-surface-container-high/90 backdrop-blur-xl shadow-xl flex flex-col items-center text-center max-w-xs border border-border-glass">
                    <span class="font-label-sm text-label-sm text-tertiary font-bold uppercase tracking-wider">Zirve Hedefi</span>
                    <span class="font-headline-sm text-headline-sm text-on-surface font-extrabold">C1 - Profesyonel Hakimiyet</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chest Reward Modal -->
            <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-md hidden items-center justify-center p-space-md" id="chest-modal">
              <div class="w-full max-w-md bg-surface-container-high rounded-2xl p-space-xl shadow-2xl flex flex-col items-center text-center relative overflow-hidden border border-border-glass">
                <div class="absolute -top-16 -right-16 w-40 h-40 bg-tertiary/20 rounded-full blur-2xl"></div>
                <div class="w-20 h-20 rounded-2xl bg-tertiary/20 text-tertiary flex items-center justify-center mb-space-md shadow-md animate-bounce">
                  <span class="material-symbols-outlined text-[48px]" style="font-variation-settings: 'FILL' 1;">featured_seasonal_and_gifts</span>
                </div>
                <span class="font-label-sm text-label-sm uppercase tracking-widest text-tertiary font-bold">Seviye Ödülü</span>
                <h3 class="font-headline-md text-headline-md text-on-surface font-extrabold mt-space-2xs">Tebrikler, Kaşif!</h3>
                <p class="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                  İlk basamağı başarıyla aştınız. Sandığınızdan +150 Deneyim Puanı ve "Temel Dil Ustası" özel rozeti çıktı!
                </p>
                <div class="flex items-center gap-space-sm my-space-lg px-space-lg py-space-sm rounded-xl bg-surface-container-lowest">
                  <div class="flex items-center gap-space-2xs text-secondary font-label-lg text-label-lg font-bold">
                    <span class="material-symbols-outlined text-[20px]">bolt</span>
                    <span>+150 XP</span>
                  </div>
                  <span class="text-outline">•</span>
                  <div class="flex items-center gap-space-2xs text-tertiary font-label-lg text-label-lg font-bold">
                    <span class="material-symbols-outlined text-[20px]">military_tech</span>
                    <span>Özel Rozet</span>
                  </div>
                </div>
                <button class="w-full py-space-sm rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg font-bold shadow-lg hover:brightness-110 transition-all cursor-pointer" id="closeChestModalBtn">
                  Ödülleri Cüzdana Ekle
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    `;

    this.attachEvents(state);
  },

  attachEvents(state) {
    // Sound toggle button
    document.getElementById('sfx-toggle-btn')?.addEventListener('click', () => {
      Speech.toggle();
      const icon = document.getElementById('sfx-icon');
      const text = document.getElementById('sfx-status-text');
      if (icon) icon.textContent = Speech.enabled ? 'volume_up' : 'volume_off';
      if (text) text.textContent = Speech.enabled ? 'Ses Efektleri Açık' : 'Ses Kapalı';
    });

    // Start level button handlers
    const openLevelSelect = async (level) => {
      const levelData = await DataManager.loadLevel(level);
      if (levelData) {
        navigate('lessonSelect', { currentLevel: level, levelData });
      }
    };

    document.getElementById('startActiveLevelBtn')?.addEventListener('click', () => openLevelSelect(1));
    document.getElementById('enterLevel2Btn')?.addEventListener('click', () => openLevelSelect(2));
    document.getElementById('node-level-1')?.addEventListener('click', () => openLevelSelect(1));
    document.getElementById('node-level-2')?.addEventListener('click', () => openLevelSelect(2));
    document.getElementById('node-level-3')?.addEventListener('click', () => openLevelSelect(3));

    // Chest modal interaction
    const modal = document.getElementById('chest-modal');
    document.getElementById('chest-1-btn')?.addEventListener('click', () => {
      if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
    });

    document.getElementById('chest-2-btn')?.addEventListener('click', () => {
      alert('🎁 Bu sandık A2 Seviyesini tamamladığınızda açılır!');
    });

    document.getElementById('closeChestModalBtn')?.addEventListener('click', () => {
      if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
    });
  }
};
