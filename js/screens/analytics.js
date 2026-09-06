// ===========================
// ANALYTICS SCREEN — Stitch 5-D Radar & Mastery Dashboard Edition
// ===========================

import { renderSidebar, renderHeaderBar } from '../components/sidebar.js';
import { Storage } from '../storage.js';
import { getUserLevel, getXPProgress, BADGES } from '../progress.js';
import { navigate } from '../app.js';

export const AnalyticsScreen = {
  render(root) {
    const state = Storage.load();
    const userLevel = getUserLevel(state.totalXP);
    const xpProgress = getXPProgress(state.totalXP);
    const totalXP = state.totalXP || 0;
    const streak = state.dailyStreak || 0;
    const srsItems = Object.values(state.srsData || {});
    const customWords = Storage.getCustomWords();
    const mistakes = Storage.getMistakes();

    const box5Count = srsItems.filter(i => i.box === 5).length;
    const activeCount = srsItems.length;
    const masteryPercent = activeCount > 0 ? Math.round((box5Count / activeCount) * 100) : 65;

    root.innerHTML = `
      ${renderSidebar('analytics')}
      
      <div class="pl-72 relative z-10 min-h-screen">
        ${renderHeaderBar()}

        <main class="w-full pt-16 px-space-xl bg-transparent relative min-h-screen">
          <div class="flex flex-col w-full pb-space-4xl gap-space-xl">
            
            <!-- Overview Header & Period Selector -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md pt-space-md">
              <div class="flex flex-col gap-space-2xs">
                <div class="flex items-center gap-space-xs text-secondary">
                  <span class="material-symbols-outlined text-[18px]">insights</span>
                  <span class="font-label-sm text-label-sm uppercase tracking-wider font-bold">Kognitif Gelişim Panosu</span>
                </div>
                <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight font-extrabold">İlerleme & Yetenek Analitiği</h1>
                <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Yapay zekâ destekli nöro-dilbilimsel performans değerlendirmesi, 5 boyutlu yetkinlik haritası ve haftalık ivme metriği.
                </p>
              </div>

              <!-- Filter Toggle Segment -->
              <div class="flex items-center gap-space-2xs bg-surface-container-low p-space-3xs rounded-full self-start md:self-auto shadow-sm border border-border-glass">
                <button class="px-space-md py-space-xs rounded-full font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">Bu Hafta</button>
                <button class="px-space-md py-space-xs rounded-full font-label-sm text-label-sm bg-primary-container text-on-primary-container font-bold shadow-[0_0_12px_rgba(124,93,250,0.4)] transition-all cursor-pointer">Son 30 Gün</button>
                <button class="px-space-md py-space-xs rounded-full font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">Tüm Zamanlar</button>
              </div>
            </div>

            <!-- 1. Hero Stats Bento Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
              <!-- Stat 1: Toplam Çalışma Süresi -->
              <div class="relative overflow-hidden rounded-2xl bg-surface-container/70 backdrop-blur-xl p-space-lg shadow-md flex flex-col justify-between group hover:bg-surface-container-high/70 transition-all duration-300 border border-border-glass">
                <div class="flex items-center justify-between mb-space-md">
                  <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Çalışma Süresi</span>
                  <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <span class="material-symbols-outlined text-[22px]">timer</span>
                  </div>
                </div>
                <div class="flex flex-col gap-space-2xs">
                  <div class="flex items-baseline gap-space-xs">
                    <span class="font-headline-lg text-headline-lg text-on-surface font-black">48.5</span>
                    <span class="font-headline-sm text-headline-sm text-primary font-bold">Saat</span>
                  </div>
                  <div class="flex items-center gap-space-xs font-label-sm text-label-sm text-secondary pt-space-xs">
                    <span class="material-symbols-outlined text-[16px]">trending_up</span>
                    <span>+3.2 saat bu hafta (%12 artış)</span>
                  </div>
                </div>
              </div>

              <!-- Stat 2: Öğrenilen Kelimeler -->
              <div class="relative overflow-hidden rounded-2xl bg-surface-container/70 backdrop-blur-xl p-space-lg shadow-md flex flex-col justify-between group hover:bg-surface-container-high/70 transition-all duration-300 border border-border-glass">
                <div class="flex items-center justify-between mb-space-md">
                  <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Kelime Haznesi</span>
                  <div class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                    <span class="material-symbols-outlined text-[22px]">menu_book</span>
                  </div>
                </div>
                <div class="flex flex-col gap-space-2xs">
                  <div class="flex items-baseline gap-space-xs">
                    <span class="font-headline-lg text-headline-lg text-on-surface font-black">${activeCount || 640}</span>
                    <span class="font-body-md text-body-md text-on-surface-variant font-semibold">kelime</span>
                  </div>
                  <div class="flex items-center gap-space-xs font-label-sm text-label-sm text-secondary pt-space-xs">
                    <span class="material-symbols-outlined text-[16px]">verified</span>
                    <span class="text-on-surface-variant"><strong class="text-secondary font-bold">${box5Count || 120} kelime</strong> tam ustalıkta</span>
                  </div>
                </div>
              </div>

              <!-- Stat 3: Seri Durumu -->
              <div class="relative overflow-hidden rounded-2xl bg-surface-container/70 backdrop-blur-xl p-space-lg shadow-md flex flex-col justify-between group hover:bg-surface-container-high/70 transition-all duration-300 border border-border-glass">
                <div class="flex items-center justify-between mb-space-md">
                  <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Seri Kararlılığı</span>
                  <div class="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary border border-tertiary/20">
                    <span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
                  </div>
                </div>
                <div class="flex flex-col gap-space-2xs">
                  <div class="flex items-baseline gap-space-xs">
                    <span class="font-headline-lg text-headline-lg text-on-surface font-black">${streak}</span>
                    <span class="font-headline-sm text-headline-sm text-tertiary font-bold">Gün</span>
                  </div>
                  <div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant pt-space-xs">
                    <span class="material-symbols-outlined text-[16px] text-tertiary">award_star</span>
                    <span>En uzun rekor: <strong class="text-on-surface font-bold">14 gün</strong></span>
                  </div>
                </div>
              </div>

              <!-- Stat 4: Toplam XP -->
              <div class="relative overflow-hidden rounded-2xl bg-surface-container/70 backdrop-blur-xl p-space-lg shadow-md flex flex-col justify-between group hover:bg-surface-container-high/70 transition-all duration-300 border border-border-glass">
                <div class="flex items-center justify-between mb-space-md">
                  <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Kazanılan Puan</span>
                  <div class="w-10 h-10 rounded-xl bg-primary-fixed/20 flex items-center justify-center text-primary-fixed border border-primary-fixed/20">
                    <span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' 1;">bolt</span>
                  </div>
                </div>
                <div class="flex flex-col gap-space-2xs">
                  <div class="flex items-baseline gap-space-xs">
                    <span class="font-headline-lg text-headline-lg text-on-surface font-black">${totalXP.toLocaleString()}</span>
                    <span class="font-label-md text-label-md text-secondary uppercase font-bold">XP</span>
                  </div>
                  <div class="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant pt-space-xs">
                    <span class="material-symbols-outlined text-[16px] text-primary">military_tech</span>
                    <span>Elmas Lig: <strong class="text-primary font-bold">#4 Sırada</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Dual Analytics Row: Spider Radar + Weekly Activity Bar Chart -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              
              <!-- 5-Dimensional Skill Radar Chart (7 cols) -->
              <div class="lg:col-span-7 bg-surface-container/70 backdrop-blur-xl rounded-2xl p-space-xl shadow-md flex flex-col justify-between relative overflow-hidden border border-border-glass">
                <div class="flex items-center justify-between mb-space-md">
                  <div class="flex flex-col">
                    <div class="flex items-center gap-space-xs">
                      <span class="w-2 h-2 rounded-full bg-secondary"></span>
                      <span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Nöral Yetkinlik Ağı</span>
                    </div>
                    <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">5 Boyutlu Dil Radar Matrisi</h2>
                  </div>
                  <span class="px-space-sm py-space-3xs rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold border border-border-glass">CEFR B2 Hedefi</span>
                </div>

                <!-- Radar SVG Visualization Container -->
                <div class="relative w-full aspect-square max-w-[380px] mx-auto my-space-sm flex items-center justify-center">
                  <svg class="w-full h-full overflow-visible" viewBox="0 0 400 400">
                    <defs>
                      <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#7c5dfa" stop-opacity="0.45"/>
                        <stop offset="70%" stop-color="#3edeb2" stop-opacity="0.25"/>
                        <stop offset="100%" stop-color="#3edeb2" stop-opacity="0.05"/>
                      </radialGradient>
                    </defs>
                    <polygon points="200,40 352,151 294,328 106,328 48,151" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
                    <line x1="200" y1="200" x2="200" y2="40" stroke="rgba(255,255,255,0.15)"/>
                    <line x1="200" y1="200" x2="352" y2="151" stroke="rgba(255,255,255,0.15)"/>
                    <line x1="200" y1="200" x2="294" y2="328" stroke="rgba(255,255,255,0.15)"/>
                    <line x1="200" y1="200" x2="106" y2="328" stroke="rgba(255,255,255,0.15)"/>
                    <line x1="200" y1="200" x2="48" y2="151" stroke="rgba(255,255,255,0.15)"/>
                    
                    <polygon points="200,59.2 304.1,166.2 284.0,315.6 141.9,279.9 81.5,161.5" fill="url(#radarFill)" stroke="#3edeb2" stroke-width="2.5"/>
                    <circle cx="200" cy="59.2" r="5" fill="#3edeb2"/>
                    <circle cx="304.1" cy="166.2" r="5" fill="#3edeb2"/>
                    <circle cx="284.0" cy="315.6" r="5.5" fill="#3edeb2"/>
                    <circle cx="141.9" cy="279.9" r="5" fill="#ffb956"/>
                    <circle cx="81.5" cy="161.5" r="5" fill="#3edeb2"/>

                    <text x="200" y="24" fill="#e2e1ed" text-anchor="middle" font-weight="bold" font-size="13">Kelime %88</text>
                    <text x="360" y="156" fill="#e2e1ed" text-anchor="start" font-weight="bold" font-size="13">Dilbilgisi %72</text>
                    <text x="296" y="352" fill="#3edeb2" text-anchor="start" font-weight="bold" font-size="13">Dinleme %94</text>
                    <text x="100" y="352" fill="#ffb956" text-anchor="end" font-weight="bold" font-size="13">Konuşma %65</text>
                    <text x="34" y="156" fill="#e2e1ed" text-anchor="end" font-weight="bold" font-size="13">Okuma %82</text>
                  </svg>
                </div>

                <div class="mt-space-md p-space-md rounded-xl bg-surface-container-high/60 flex items-start gap-space-sm border border-border-glass">
                  <span class="material-symbols-outlined text-tertiary text-[24px] shrink-0">lightbulb</span>
                  <div class="flex flex-col gap-space-3xs">
                    <span class="font-label-md text-label-md text-on-surface font-bold">Bilişsel Odak Tavsiyesi</span>
                    <p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      💡 Konuşma skorunu <strong class="text-tertiary font-bold">%65'ten %80'e</strong> çıkarmak için bugün AI Telaffuz Laboratuvarı'nda <span class="text-on-surface underline font-semibold cursor-pointer hover:text-secondary transition-colors" onclick="window.navigate('practice')">"Kafede Sipariş AI Rol Yapma"</span> senaryosunu tamamla.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Right Side: Weekly Activity Chart (5 cols) -->
              <div class="lg:col-span-5 bg-surface-container/70 backdrop-blur-xl rounded-2xl p-space-xl shadow-md flex flex-col justify-between border border-border-glass">
                <div class="flex items-center justify-between">
                  <div class="flex flex-col">
                    <div class="flex items-center gap-space-xs">
                      <span class="w-2 h-2 rounded-full bg-primary"></span>
                      <span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">İvme Grafiği</span>
                    </div>
                    <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Haftalık Aktivite (XP)</h2>
                  </div>
                </div>

                <div class="relative w-full h-64 my-space-md flex flex-col justify-end">
                  <div class="grid grid-cols-7 gap-space-xs h-full items-end pt-8 pb-space-xs">
                    <div class="flex flex-col items-center gap-space-xs h-full justify-end group">
                      <span class="font-label-sm text-[10px] text-on-surface-variant">65</span>
                      <div class="w-full max-w-[28px] h-[65%] rounded-t-lg bg-gradient-to-t from-primary/40 to-primary"></div>
                      <span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Pzt</span>
                    </div>
                    <div class="flex flex-col items-center gap-space-xs h-full justify-end group">
                      <span class="font-label-sm text-[10px] text-on-surface-variant">45</span>
                      <div class="w-full max-w-[28px] h-[45%] rounded-t-lg bg-gradient-to-t from-primary/30 to-primary/80"></div>
                      <span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Sal</span>
                    </div>
                    <div class="flex flex-col items-center gap-space-xs h-full justify-end group">
                      <span class="font-label-sm text-[10px] text-on-surface-variant">85</span>
                      <div class="w-full max-w-[28px] h-[85%] rounded-t-lg bg-gradient-to-t from-primary/50 to-primary"></div>
                      <span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Çar</span>
                    </div>
                    <div class="flex flex-col items-center gap-space-xs h-full justify-end group">
                      <span class="font-label-sm text-[10px] text-on-surface-variant">30</span>
                      <div class="w-full max-w-[28px] h-[30%] rounded-t-lg bg-gradient-to-t from-primary/20 to-primary/60"></div>
                      <span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Per</span>
                    </div>
                    <div class="flex flex-col items-center gap-space-xs h-full justify-end group">
                      <span class="font-label-sm text-[10px] text-on-surface-variant">90</span>
                      <div class="w-full max-w-[28px] h-[90%] rounded-t-lg bg-gradient-to-t from-primary to-secondary"></div>
                      <span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Cum</span>
                    </div>
                    <div class="flex flex-col items-center gap-space-xs h-full justify-end group">
                      <span class="font-label-sm text-[10px] text-on-surface-variant">75</span>
                      <div class="w-full max-w-[28px] h-[75%] rounded-t-lg bg-gradient-to-t from-primary/50 to-primary"></div>
                      <span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Cmt</span>
                    </div>
                    <div class="flex flex-col items-center gap-space-xs h-full justify-end group relative">
                      <span class="font-label-sm text-[10px] text-secondary font-bold">110</span>
                      <div class="w-full max-w-[28px] h-[98%] rounded-t-lg bg-gradient-to-t from-primary via-secondary to-secondary shadow-[0_0_16px_rgba(62,222,178,0.3)]"></div>
                      <span class="font-label-sm text-label-sm text-secondary font-bold">Paz</span>
                    </div>
                  </div>
                </div>

                <div class="pt-space-md flex items-center justify-between bg-surface-container-high/40 rounded-xl p-space-md border border-border-glass">
                  <div class="flex flex-col">
                    <span class="font-label-sm text-label-sm text-on-surface-variant">Haftalık Toplam</span>
                    <span class="font-headline-sm text-headline-sm text-on-surface font-black">500 XP</span>
                  </div>
                  <div class="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-secondary/15 text-secondary font-label-sm text-label-sm font-bold">
                    <span class="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Kota Aşıldı</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Kelime Ustalaşma Dağılımı Donut Chart -->
            <div class="bg-surface-container/70 backdrop-blur-xl rounded-2xl p-space-xl shadow-md flex flex-col gap-space-lg border border-border-glass">
              <div class="flex items-center justify-between">
                <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Kelime Ustalaşma Dağılımı (%${masteryPercent})</h2>
                <span class="font-label-sm text-label-sm text-secondary font-bold">Spaced Repetition (SRS)</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center">
                <div class="md:col-span-4 flex items-center justify-center relative">
                  <div class="w-40 h-40 rounded-full border-8 border-secondary flex flex-col items-center justify-center shadow-[0_0_24px_rgba(62,222,178,0.3)]">
                    <span class="font-headline-lg text-headline-lg text-on-surface font-black">%${masteryPercent}</span>
                    <span class="font-label-sm text-label-sm text-secondary font-bold uppercase">Kalıcı Ustalık</span>
                  </div>
                </div>

                <div class="md:col-span-8 flex flex-col gap-space-md">
                  <div class="bg-surface-container-high/50 p-space-md rounded-xl flex flex-col gap-space-2xs border border-border-glass">
                    <div class="flex justify-between font-label-md text-label-md font-bold">
                      <span class="text-on-surface">Tamamen Öğrenildi (Kalıcı Bellek)</span>
                      <span class="text-secondary">${box5Count} / ${activeCount || 1}</span>
                    </div>
                    <div class="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                      <div class="bg-secondary h-full rounded-full" style="width: ${masteryPercent}%;"></div>
                    </div>
                  </div>
                </div>
              </div>
            <!-- 4. Hata Örüntü Analitiği (Error Pattern Analytics) -->
            <div class="bg-surface-container/70 backdrop-blur-xl rounded-2xl p-space-xl shadow-md flex flex-col gap-space-lg border border-border-glass">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div class="flex items-center gap-space-xs">
                  <span class="w-3 h-3 rounded-full bg-soft-coral animate-pulse"></span>
                  <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Hata Örüntü Teşhisi & Zayıf Noktalar</h2>
                </div>
                <span class="font-label-sm text-label-sm px-space-sm py-space-3xs rounded-full bg-error-container/40 text-error font-bold">Pedagojik Geri Bildirim</span>
              </div>

              ${(() => {
                const categoryStats = state.errorCategoryStats || {};
                const categories = [
                  { key: 'tense', label: 'Zamanlar (Tenses)', desc: 'İngilizce zaman çekimlerinde zorlanıyorsun. Türkçe ile zaman mantığı farklıdır.', tip: 'Simple Past vs Present Perfect farkını tekrar et.', icon: 'schedule', color: 'text-primary', bg: 'bg-primary/20' },
                  { key: 'article', label: 'Artikeller (a / an / the)', desc: 'Türkçe\'de artikel olmadığı için "the" kullanımını atlama eğilimi var.', tip: 'Belirli (the) ve belirsiz (a/an) nesneler arasındaki kuralı pekiştir.', icon: 'spellcheck', color: 'text-soft-coral', bg: 'bg-soft-coral/20' },
                  { key: 'preposition', label: 'Edatlar (in / on / at)', desc: 'Zaman ve mekan edatlarını ezber yerine görsel mekan mantığıyla çalış.', tip: '"at 5 PM", "on Monday", "in July" kalıplarını tekrar et.', icon: 'near_me', color: 'text-tertiary', bg: 'bg-tertiary/20' },
                  { key: 'wordOrder', label: 'Kelime Sırası (S-V-O)', desc: 'Türkçe Özne-Nesne-Yüklem sırası İngilizce Özne-Fiil-Nesne ile karışabiliyor.', tip: 'Cümle kurarken fiili daima özneden hemen sonra getir.', icon: 'reorder', color: 'text-secondary', bg: 'bg-secondary/20' },
                  { key: 'vocabulary', label: 'Kelime Dağarcığı', desc: 'Benzer anlamlı veya eş sesli kelimeleri ayırt etmekte pratik ihtiyacı.', tip: 'Kelime defterindeki kartları Spaced Repetition ile düzenli gözden geçir.', icon: 'menu_book', color: 'text-accent-primary', bg: 'bg-primary/20' }
                ];

                const totalErrors = Object.values(categoryStats).reduce((a, b) => a + b, 0) || 12; // Demo fallback if zero
                
                return `
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    ${categories.map(c => {
                      const count = categoryStats[c.key] !== undefined && categoryStats[c.key] > 0 ? categoryStats[c.key] : (c.key === 'article' ? 7 : c.key === 'tense' ? 5 : 2);
                      const percent = Math.min(100, Math.round((count / totalErrors) * 100));
                      return `
                        <div class="p-space-md rounded-xl bg-surface-container-high/40 border border-border-glass flex flex-col gap-space-sm hover:bg-surface-container-high/70 transition-all">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-space-sm">
                              <div class="w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center ${c.color}">
                                <span class="material-symbols-outlined text-[18px]">${c.icon}</span>
                              </div>
                              <span class="font-label-lg text-label-lg text-on-surface font-bold">${c.label}</span>
                            </div>
                            <span class="font-label-sm text-label-sm ${c.color} font-black">${count} hata (%${percent})</span>
                          </div>
                          
                          <div class="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                            <div class="h-full rounded-full bg-gradient-to-r from-primary to-soft-coral" style="width: ${percent}%;"></div>
                          </div>
                          
                          <p class="font-body-sm text-body-sm text-on-surface-variant text-[13px] leading-relaxed">${c.desc}</p>
                          <div class="font-label-sm text-[12px] text-secondary font-semibold flex items-center gap-1">
                            <span>💡 Tavsiye:</span> ${c.tip}
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                `;
              })()}
            </div>

          </div>
        </main>
      </div>
    `;
  }
};
