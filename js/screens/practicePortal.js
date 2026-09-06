// ===========================
// PRACTICE PORTAL SCREEN — Stitch Dual Tab Practice Lab Edition
// ===========================

import { renderSidebar, renderHeaderBar } from '../components/sidebar.js';
import { Speech } from '../speech.js';
import { DataManager } from '../data.js';
import { Storage } from '../storage.js';
import { playSound, levenshtein } from '../utils.js';
import { navigate } from '../app.js';

export const PracticePortalScreen = {
  render(root) {
    root.innerHTML = `
      ${renderSidebar('practice')}
      
      <div class="pl-0 md:pl-72 relative z-10 min-h-screen">
        ${renderHeaderBar()}

        <main class="w-full pt-16 px-4 md:px-space-xl pb-24 md:pb-space-4xl bg-transparent relative min-h-screen">
          <div class="flex flex-col w-full gap-space-2xl">
            
            <!-- Top Master Controls & Switcher -->
            <section class="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg">
              <div class="flex flex-col gap-space-2xs">
                <div class="flex items-center gap-space-xs">
                  <span class="inline-flex w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                  <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">LinguoStream™ Akıcı Pratik</span>
                </div>
                <h1 class="font-headline-md text-headline-md text-on-surface tracking-tight font-extrabold">Etkileşimli Pratik & Canlı Diyalog Laboratuvarı</h1>
              </div>

              <!-- Segment Pill Switcher -->
              <div class="inline-flex p-space-3xs bg-surface-container-low rounded-full shadow-lg border border-border-glass">
                <button class="flex items-center gap-space-xs px-space-lg py-space-xs rounded-full font-label-md text-label-md transition-all duration-300 bg-primary-container text-on-primary-container font-bold shadow-[0_0_24px_rgba(124,93,250,0.45)] cursor-pointer" id="tab-stories-btn">
                  <span class="material-symbols-outlined text-[18px]">auto_stories</span>
                  <span>Etkileşimli Hikayeler</span>
                  <span class="ml-space-2xs px-space-xs py-space-3xs rounded-full bg-on-primary-container/20 text-on-primary-container font-label-sm text-label-sm font-bold">10</span>
                </button>
                <button class="flex items-center gap-space-xs px-space-lg py-space-xs rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all duration-300 cursor-pointer" id="tab-dialogues-btn">
                  <span class="material-symbols-outlined text-[18px]">record_voice_over</span>
                  <span>AI Rol Yapma Diyalogları</span>
                  <span class="ml-space-2xs px-space-xs py-space-3xs rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-bold">Canlı</span>
                </button>
              </div>
            </section>

            <!-- SECTION 1: INTERACTIVE STORIES (Tab 1) -->
            <div class="flex flex-col gap-space-2xl" id="section-stories">
              
              <!-- Story Cards Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                
                <!-- Story Card 1 -->
                <article class="group relative flex flex-col justify-between bg-surface-glass backdrop-blur-2xl rounded-2xl p-space-lg shadow-xl hover:shadow-[0_16px_40px_-8px_rgba(124,93,250,0.3)] border border-border-glass transition-all duration-300 overflow-hidden cursor-pointer" id="story-card-1">
                  <div class="flex flex-col gap-space-md">
                    <div class="relative w-full h-44 rounded-xl overflow-hidden bg-surface-container">
                      <div class="w-full h-full bg-gradient-to-br from-primary/30 to-surface-container-high flex items-center justify-center text-primary">
                        <span class="material-symbols-outlined text-[64px]">local_cafe</span>
                      </div>
                      <div class="absolute top-space-xs left-space-xs flex items-center gap-space-2xs px-space-xs py-space-3xs rounded-full bg-surface/80 backdrop-blur-md border border-border-glass">
                        <span class="w-2 h-2 rounded-full bg-secondary"></span>
                        <span class="font-label-sm text-label-sm text-secondary font-bold">A2 • Kaşif</span>
                      </div>
                    </div>
                    <div class="flex flex-col gap-space-2xs">
                      <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight group-hover:text-primary transition-colors">The Mysterious Coffee Shop in London</h3>
                      <p class="font-body-md text-body-md text-on-surface-variant line-clamp-2">Soho sokaklarında kaybolan Sarah, tabelası olmayan tuhaf ve büyüleyici bir kafeye adım atar...</p>
                    </div>
                  </div>
                  <div class="pt-space-md mt-space-sm flex items-center justify-between border-t border-border-glass">
                    <span class="font-label-sm text-label-sm text-on-surface-variant">+85 XP • 4 dk</span>
                    <button class="flex items-center gap-space-xs px-space-md py-space-xs rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:brightness-110 transition-all cursor-pointer">
                      <span>Şimdi Oku</span>
                      <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </article>

                <!-- Story Card 2 -->
                <article class="group relative flex flex-col justify-between bg-surface-glass backdrop-blur-2xl rounded-2xl p-space-lg shadow-xl hover:shadow-[0_16px_40px_-8px_rgba(45,212,168,0.25)] border border-border-glass transition-all duration-300 overflow-hidden cursor-pointer" id="story-card-2">
                  <div class="flex flex-col gap-space-md">
                    <div class="relative w-full h-44 rounded-xl overflow-hidden bg-surface-container">
                      <div class="w-full h-full bg-gradient-to-br from-secondary/30 to-surface-container-high flex items-center justify-center text-secondary">
                        <span class="material-symbols-outlined text-[64px]">flight_takeoff</span>
                      </div>
                      <div class="absolute top-space-xs left-space-xs flex items-center gap-space-2xs px-space-xs py-space-3xs rounded-full bg-surface/80 backdrop-blur-md border border-border-glass">
                        <span class="w-2 h-2 rounded-full bg-tertiary"></span>
                        <span class="font-label-sm text-label-sm text-tertiary font-bold">B1 • Seyyah</span>
                      </div>
                    </div>
                    <div class="flex flex-col gap-space-2xs">
                      <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight group-hover:text-secondary transition-colors">Lost in Tokyo Airport</h3>
                      <p class="font-body-md text-body-md text-on-surface-variant line-clamp-2">Bavulunu kaybeden Kenan, uluslararası terminaldeki Japon yer görevlisiyle iletişim kurmaya çalışır...</p>
                    </div>
                  </div>
                  <div class="pt-space-md mt-space-sm flex items-center justify-between border-t border-border-glass">
                    <span class="font-label-sm text-label-sm text-on-surface-variant">+120 XP • 6 dk</span>
                    <button class="flex items-center gap-space-xs px-space-md py-space-xs rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-bold hover:bg-secondary hover:text-on-secondary transition-all cursor-pointer">
                      <span>Başla</span>
                      <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </article>

                <!-- Story Card 3 -->
                <article class="group relative flex flex-col justify-between bg-surface-glass backdrop-blur-2xl rounded-2xl p-space-lg shadow-xl hover:shadow-[0_16px_40px_-8px_rgba(242,169,59,0.25)] border border-border-glass transition-all duration-300 overflow-hidden cursor-pointer" id="story-card-3">
                  <div class="flex flex-col gap-space-md">
                    <div class="relative w-full h-44 rounded-xl overflow-hidden bg-surface-container">
                      <div class="w-full h-full bg-gradient-to-br from-tertiary/30 to-surface-container-high flex items-center justify-center text-tertiary">
                        <span class="material-symbols-outlined text-[64px]">business_center</span>
                      </div>
                      <div class="absolute top-space-xs left-space-xs flex items-center gap-space-2xs px-space-xs py-space-3xs rounded-full bg-surface/80 backdrop-blur-md border border-border-glass">
                        <span class="w-2 h-2 rounded-full bg-primary-container"></span>
                        <span class="font-label-sm text-label-sm text-primary-container font-bold">B2 • Profesyonel</span>
                      </div>
                    </div>
                    <div class="flex flex-col gap-space-2xs">
                      <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight group-hover:text-tertiary transition-colors">The Silicon Valley Pitch</h3>
                      <p class="font-body-md text-body-md text-on-surface-variant line-clamp-2">Series-A yatırım toplantısında kurucu ortak Elena, yatırımcıların sorularını yanıtlıyor...</p>
                    </div>
                  </div>
                  <div class="pt-space-md mt-space-sm flex items-center justify-between border-t border-border-glass">
                    <span class="font-label-sm text-label-sm text-on-surface-variant">+160 XP • 8 dk</span>
                    <button class="flex items-center gap-space-xs px-space-md py-space-xs rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-bold hover:bg-tertiary hover:text-on-tertiary transition-all cursor-pointer">
                      <span>Başla</span>
                      <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </article>

              </div>

              <!-- IN-PAGE INTERACTIVE READER EXPERIENCE -->
              <section class="relative flex flex-col bg-surface-glass-active backdrop-blur-3xl rounded-2xl shadow-2xl p-space-xl gap-space-lg overflow-hidden border border-border-glass" id="interactive-reader">
                <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
                  <div class="flex items-center gap-space-md">
                    <div class="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary border border-primary/30">
                      <span class="material-symbols-outlined text-[28px]">auto_stories</span>
                    </div>
                    <div class="flex flex-col">
                      <div class="flex items-center gap-space-xs">
                        <span class="px-space-xs py-space-3xs rounded-full bg-secondary/15 text-secondary font-label-sm text-label-sm font-bold">Aktif Okuma</span>
                        <span class="font-body-sm text-body-sm text-on-surface-variant">Seviye A2</span>
                      </div>
                      <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">The Mysterious Coffee Shop in London</h2>
                    </div>
                  </div>

                  <!-- Translation Toggle -->
                  <div class="flex items-center gap-space-sm">
                    <button class="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-all text-on-surface font-label-sm text-label-sm cursor-pointer" id="toggle-story-tr-btn">
                      <span class="material-symbols-outlined text-[18px]">translate</span>
                      <span id="story-tr-status">Türkçe Çeviri: Açık</span>
                    </button>
                  </div>
                </div>

                <!-- Story Text Body -->
                <div class="flex flex-col gap-space-md py-space-sm">
                  <p class="font-body-xl text-body-xl text-on-surface/50 leading-relaxed">
                    Outside, cold drops of London rain drummed steadily against the ancient brickwork.
                  </p>
                  
                  <!-- Active Sentence -->
                  <div class="flex flex-col p-space-md rounded-xl bg-primary-container/15 border border-primary/30 shadow-lg">
                    <div class="flex items-center justify-between mb-space-xs">
                      <span class="flex items-center gap-space-2xs text-secondary font-label-sm text-label-sm font-bold">
                        <span class="material-symbols-outlined text-[16px]">volume_up</span> Cümle 2 (Dinle & Oku)
                      </span>
                      <button class="text-primary font-bold text-xs hover:underline cursor-pointer" onclick="Speech.speak('Sarah walked into the dimly lit café and whispered, Is this table reserved?')">Seslendir 🔊</button>
                    </div>
                    <p class="font-headline-sm text-headline-sm text-on-surface leading-loose">
                      Sarah walked into the <span class="cursor-pointer font-bold text-secondary underline decoration-secondary/60 px-space-2xs rounded bg-secondary/15 hover:bg-secondary/30 transition-all" id="dimly-word">dimly</span> lit café and whispered, 'Is this table reserved?'
                    </p>

                    <div class="mt-space-sm pt-space-xs bg-surface-container-low/90 rounded-lg p-space-sm flex items-start gap-space-xs border border-border-glass" id="live-translation-box">
                      <span class="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">translate</span>
                      <p class="font-body-md text-body-md text-tertiary font-medium">Sarah loş bir şekilde aydınlatılmış kafeye doğru yürüdü ve fısıldadı: "Bu masa rezerve mi?"</p>
                    </div>
                  </div>

                  <p class="font-body-xl text-body-xl text-on-surface/50 leading-relaxed">
                    The barista looked up with calm amber eyes and smiled mysteriously without saying a word.
                  </p>
                </div>
              </section>
            </div>

            <!-- SECTION 2: AI ROLEPLAY DIALOGUES (Tab 2 - Hidden by default) -->
            <div class="hidden flex-col gap-space-2xl" id="section-dialogues">
              <div class="flex flex-col gap-space-2xs">
                <div class="flex items-center gap-space-xs">
                  <span class="material-symbols-outlined text-primary text-[20px]">smart_toy</span>
                  <span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">Gerçekçi Durumsal AI Koçu</span>
                </div>
                <h2 class="font-headline-md text-headline-md text-on-surface font-bold">AI Rol Yapma & Canlı Konuşma Simülasyonu</h2>
                <p class="font-body-lg text-body-lg text-on-surface-variant">Doğal yapay zeka karakterleriyle karşılıklı konuş ve anlık telaffuz skoru al.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                <div class="p-space-md rounded-2xl bg-primary-container/15 border border-primary/30 shadow-lg cursor-pointer hover:scale-105 transition-transform" onclick="window.navigate('roleplay')">
                  <div class="text-3xl mb-2">☕</div>
                  <h4 class="font-headline-sm text-headline-sm text-on-surface font-bold">Kafede Sipariş</h4>
                  <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Süt seçimi ve kahve siparişi pratiği</p>
                </div>
                <div class="p-space-md rounded-2xl bg-surface-container-low border border-border-glass shadow-lg cursor-pointer hover:scale-105 transition-transform" onclick="window.navigate('roleplay')">
                  <div class="text-3xl mb-2">✈️</div>
                  <h4 class="font-headline-sm text-headline-sm text-on-surface font-bold">Havalimanı Check-in</h4>
                  <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Bagaj ve uçuş bilgisi senaryosu</p>
                </div>
                <div class="p-space-md rounded-2xl bg-surface-container-low border border-border-glass shadow-lg cursor-pointer hover:scale-105 transition-transform" onclick="window.navigate('roleplay')">
                  <div class="text-3xl mb-2">💼</div>
                  <h4 class="font-headline-sm text-headline-sm text-on-surface font-bold">İş Mülakatı</h4>
                  <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">İngilizce mülakat soru cevapları</p>
                </div>
                <div class="p-space-md rounded-2xl bg-surface-container-low border border-border-glass shadow-lg cursor-pointer hover:scale-105 transition-transform" onclick="window.navigate('roleplay')">
                  <div class="text-3xl mb-2">🏨</div>
                  <h4 class="font-headline-sm text-headline-sm text-on-surface font-bold">Otel Rezervasyonu</h4>
                  <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Oda kaydı ve otel pratiği</p>
                </div>
              </div>

              <!-- Minimal Pairs Featured Section -->
              <div class="mt-space-lg p-space-xl rounded-2xl bg-gradient-to-r from-primary-container/20 to-secondary/15 border border-primary/30 flex flex-col md:flex-row items-center justify-between gap-space-lg">
                <div class="flex items-center gap-space-md">
                  <div class="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center text-3xl shadow-lg">
                    🎧
                  </div>
                  <div class="flex flex-col">
                    <span class="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">Yeni Nöro-İşitsel Modül</span>
                    <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Minimal Pairs (Fonetik Ayrım)</h3>
                    <p class="font-body-md text-body-md text-on-surface-variant">Ship vs Sheep, Bit vs Beat gibi Türklerin en çok karıştırdığı ses çiftlerini dinleyerek ayırt et.</p>
                  </div>
                </div>
                <button class="px-space-xl py-space-md rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-lg hover:brightness-110 transition-all cursor-pointer shrink-0" onclick="window.navigate('minimalPairs')">
                  Oyunu Başlat
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    `;

    this.attachEvents();
  },

  attachEvents() {
    const storiesTab = document.getElementById('tab-stories-btn');
    const dialoguesTab = document.getElementById('tab-dialogues-btn');
    const storiesSec = document.getElementById('section-stories');
    const dialoguesSec = document.getElementById('section-dialogues');

    storiesTab?.addEventListener('click', () => {
      storiesSec.classList.remove('hidden');
      storiesSec.classList.add('flex');
      dialoguesSec.classList.add('hidden');
      dialoguesSec.classList.remove('flex');
      
      storiesTab.className = 'flex items-center gap-space-xs px-space-lg py-space-xs rounded-full font-label-md text-label-md transition-all duration-300 bg-primary-container text-on-primary-container font-bold shadow-[0_0_24px_rgba(124,93,250,0.45)] cursor-pointer';
      dialoguesTab.className = 'flex items-center gap-space-xs px-space-lg py-space-xs rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all duration-300 cursor-pointer';
    });

    dialoguesTab?.addEventListener('click', () => {
      dialoguesSec.classList.remove('hidden');
      dialoguesSec.classList.add('flex');
      storiesSec.classList.add('hidden');
      storiesSec.classList.remove('flex');

      dialoguesTab.className = 'flex items-center gap-space-xs px-space-lg py-space-xs rounded-full font-label-md text-label-md transition-all duration-300 bg-primary-container text-on-primary-container font-bold shadow-[0_0_24px_rgba(124,93,250,0.45)] cursor-pointer';
      storiesTab.className = 'flex items-center gap-space-xs px-space-lg py-space-xs rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all duration-300 cursor-pointer';
    });

    document.getElementById('story-card-1')?.addEventListener('click', () => navigate('storyReading'));
    document.getElementById('story-card-2')?.addEventListener('click', () => navigate('storyReading'));
    document.getElementById('story-card-3')?.addEventListener('click', () => navigate('storyReading'));

    let trOpen = true;
    document.getElementById('toggle-story-tr-btn')?.addEventListener('click', () => {
      trOpen = !trOpen;
      const box = document.getElementById('live-translation-box');
      const text = document.getElementById('story-tr-status');
      if (box) box.style.display = trOpen ? 'flex' : 'none';
      if (text) text.textContent = trOpen ? 'Türkçe Çeviri: Açık' : 'Türkçe Çeviri: Kapalı';
    });
  }
};
