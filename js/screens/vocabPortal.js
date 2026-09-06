// ===========================
// VOCAB PORTAL SCREEN — Stitch Dictionary & Mistake Bank Edition
// ===========================

import { renderSidebar, renderHeaderBar } from '../components/sidebar.js';
import { Speech } from '../speech.js';
import { Storage } from '../storage.js';
import { navigate } from '../app.js';

export const VocabPortalScreen = {
  render(root) {
    const state = Storage.load();
    const mistakes = state.mistakeBank || [
      { word: 'Subtle', meaning: 'Hafif, göze çarpmayan', box: 1, wrongCount: 4, level: 'B2', phonetic: '/ˈsʌt.əl/', example: 'There was a subtle difference in tone during the keynote.' },
      { word: 'Reluctant', meaning: 'İsteksiz, gönülsüz', box: 0, wrongCount: 3, level: 'B2', phonetic: '/rɪˈlʌk.tənt/', example: 'He was reluctant to sign the agreement.' },
      { word: 'Acquire', meaning: 'Edinmek, elde etmek', box: 2, wrongCount: 2, level: 'B2', phonetic: '/əˈkwaɪ.ər/', example: 'Children acquire languages easily.' },
      { word: 'Prejudiced', meaning: 'Ön yargılı, peşin hükümlü', box: 1, wrongCount: 2, level: 'B2', phonetic: '/ˈpredʒ.ə.dɪst/', example: 'Judges must not be prejudiced.' }
    ];

    const customWords = state.customVocab || [
      { word: 'Eloquent', meaning: 'Güzel ve etkili konuşan', category: 'Akademik', stars: 3, phonetic: '/ˈel.ə.kwənt/', example: 'She gave an eloquent speech advocating for sustainability.' },
      { word: 'Leverage', meaning: 'Kaldıraç; gücünden yararlanmak', category: 'İş & Finans', stars: 4, phonetic: '/ˈliː.vɚ.ɪdʒ/', example: 'We need to leverage our network.' },
      { word: 'Itinerary', meaning: 'Seyahat planı, gezi programı', category: 'Seyahat', stars: 2, phonetic: '/aɪˈtɪn.ə.rer.i/', example: 'Here is your travel itinerary.' }
    ];

    root.innerHTML = `
      ${renderSidebar('vocab')}
      
      <div class="pl-0 md:pl-72 relative z-10 min-h-screen">
        ${renderHeaderBar()}

        <main class="w-full pt-16 px-4 md:px-space-xl pb-24 md:pb-space-4xl bg-transparent relative min-h-screen">
          <div class="flex flex-col w-full gap-space-2xl">
            
            <!-- Dynamic Header with Segment Switcher -->
            <div class="relative w-full rounded-2xl overflow-hidden bg-surface-container-low/70 backdrop-blur-2xl p-space-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg border border-border-glass">
              <div class="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-mesh-glow-indigo blur-[90px] pointer-events-none"></div>
              <div class="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-mesh-glow-coral blur-[90px] pointer-events-none"></div>
              
              <div class="flex flex-col gap-space-2xs z-10">
                <div class="flex items-center gap-space-xs">
                  <span class="px-space-xs py-space-3xs rounded-full bg-tertiary-container/30 text-tertiary font-label-sm text-label-sm uppercase tracking-widest font-bold">Adaptif Bellek Motoru</span>
                  <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Spaced Repetition Aktif</span>
                </div>
                <h1 class="font-headline-md text-headline-md text-on-surface font-black tracking-tight flex items-center gap-space-xs">
                  Leksikal Hata & Kelime Bankası
                </h1>
                <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Algoritmik hafıza matrisiyle zayıf nöral bağlantıları güçlendir, hata geçmişini kalıcı akıcılığa dönüştür.
                </p>
              </div>

              <!-- Segment Switcher -->
              <div class="z-10 p-space-3xs rounded-xl bg-surface-container-highest/60 backdrop-blur-md flex items-center shadow-inner self-stretch md:self-auto border border-border-glass">
                <button class="flex-1 md:flex-none flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg font-label-lg text-label-lg transition-all duration-300 bg-primary-container text-on-primary-container font-bold shadow-md cursor-pointer" id="tab-mistakes-btn">
                  <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
                  <span>Hata Kumbarası (${mistakes.length})</span>
                </button>
                <button class="flex-1 md:flex-none flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg font-label-lg text-label-lg transition-all duration-300 text-on-surface-variant hover:text-on-surface cursor-pointer" id="tab-custom-btn">
                  <span class="material-symbols-outlined text-[20px]">menu_book</span>
                  <span>Özel Kelime Defterim (${customWords.length})</span>
                </button>
              </div>
            </div>

            <!-- ==================== MODÜL A: HATA KUMBARASI ==================== -->
            <section class="flex flex-col gap-space-xl transition-opacity duration-300" id="module-mistakes">
              
              <!-- Motivational Banner Callout -->
              <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-surface-container-high/90 via-surface-container/80 to-surface-container-high/90 p-space-xl shadow-xl backdrop-blur-xl border border-border-glass">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-xl relative z-10">
                  <div class="flex items-start gap-space-md max-w-2xl">
                    <div class="w-14 h-14 rounded-2xl bg-soft-coral/15 flex items-center justify-center shrink-0 shadow-inner">
                      <span class="material-symbols-outlined text-[32px] text-soft-coral" style="font-variation-settings: 'FILL' 1;">savings</span>
                    </div>
                    <div class="flex flex-col gap-space-2xs">
                      <span class="font-label-md text-label-md text-soft-coral font-bold tracking-wider uppercase">Nöral Pekiştirme Kuralı</span>
                      <p class="font-body-xl text-body-xl text-on-surface font-semibold leading-snug">
                        "Hata yapmak öğrenmenin en hızlı yoludur!"
                      </p>
                      <p class="font-body-md text-body-md text-on-surface-variant">
                        Yanlış işaretlediğin kelimeleri aralıklı tekrarda 3 kez ardışık doğru bilerek kumbaradan kalıcı olarak temizle.
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center gap-space-md">
                    <button class="px-space-xl py-space-md rounded-xl bg-gradient-to-r from-soft-coral to-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center gap-space-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer" onclick="window.navigate('quiz')">
                      <span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' 1;">bolt</span>
                      <span>Yanlışlarımı Çalış (${mistakes.length} Kelime)</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Mistake Word Cards Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-lg">
                ${mistakes.map((item, idx) => `
                  <div class="group relative rounded-2xl bg-surface-container/90 backdrop-blur-xl p-space-lg flex flex-col justify-between gap-space-lg shadow-lg hover:shadow-2xl border border-border-glass transition-all duration-300">
                    <div class="flex flex-col gap-space-sm">
                      <div class="flex items-start justify-between gap-space-xs">
                        <span class="px-space-xs py-space-3xs rounded-full bg-error/15 text-error font-label-sm text-label-sm font-bold flex items-center gap-1">
                          <span class="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span> ${item.wrongCount || 3} Kez Yanlış
                        </span>
                        <span class="font-label-sm text-label-sm font-bold text-on-surface-variant">${item.box || 1}/3</span>
                      </div>

                      <div class="flex items-baseline justify-between mt-space-2xs">
                        <div class="flex items-center gap-space-xs">
                          <h2 class="font-headline-sm text-headline-sm text-on-surface font-extrabold tracking-tight">${item.word}</h2>
                          <button class="w-7 h-7 rounded-full bg-secondary/15 text-secondary flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer" onclick="Speech.speak('${item.word}')">
                            <span class="material-symbols-outlined text-[16px]">volume_up</span>
                          </button>
                        </div>
                        <span class="font-phonetic-ipa text-phonetic-ipa text-on-surface-variant font-medium">${item.phonetic || ''}</span>
                      </div>

                      <p class="font-body-md text-body-md text-secondary font-semibold">${item.meaning}</p>

                      ${item.example ? `
                        <div class="rounded-xl bg-surface-container-low/70 p-space-sm mt-space-xs border border-border-glass">
                          <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider block mb-1">Örnek Bağlam</span>
                          <p class="font-body-sm text-body-sm text-on-surface-variant italic leading-relaxed">"${item.example}"</p>
                        </div>
                      ` : ''}
                    </div>

                    <div class="flex items-center gap-space-xs pt-space-xs">
                      <button class="flex-1 py-space-sm px-space-md rounded-xl bg-surface-container-highest hover:bg-secondary-container hover:text-on-secondary-container text-on-surface font-label-md text-label-md font-bold transition-all duration-200 flex items-center justify-center gap-space-xs cursor-pointer" onclick="window.navigate('quiz')">
                        <span class="material-symbols-outlined text-[18px]">quiz</span>
                        <span>Hemen Test Et</span>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>

            <!-- ==================== MODÜL B: ÖZEL KELİME DEFTERİM ==================== -->
            <section class="hidden flex-col gap-space-xl transition-opacity duration-300" id="module-custom">
              
              <!-- Search & Add Action Bar -->
              <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md bg-surface-container-low/70 backdrop-blur-xl p-space-lg rounded-2xl shadow-lg border border-border-glass">
                <div class="flex flex-1 items-center gap-space-md">
                  <div class="relative w-full sm:w-80">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
                    <input type="text" class="w-full pl-10 pr-space-md py-space-sm rounded-xl bg-surface-container-lowest/80 text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none border border-border-glass" placeholder="Kelime ara..." id="custom-search-input"/>
                  </div>
                </div>

                <div class="flex items-center gap-space-sm">
                  <button class="px-space-md py-space-sm rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-space-xs shadow-md hover:bg-secondary hover:text-on-secondary transition-all cursor-pointer" onclick="window.navigate('ocrScanner')">
                    <span class="material-symbols-outlined text-[20px]">photo_camera</span>
                    <span>Kamerayla Tara (OCR)</span>
                  </button>
                  <button class="px-space-lg py-space-sm rounded-xl bg-primary-container text-on-primary-container font-label-lg text-label-lg font-bold flex items-center justify-center gap-space-xs shadow-lg hover:scale-[1.02] transition-all cursor-pointer" id="toggle-drawer-btn">
                    <span class="material-symbols-outlined text-[20px]">add_circle</span>
                    <span>Yeni Kelime Ekle</span>
                  </button>
                </div>
              </div>

              <!-- Inline Word Creator Drawer -->
              <div class="hidden rounded-2xl bg-surface-container-high/90 backdrop-blur-2xl p-space-xl shadow-2xl border border-border-glass flex-col gap-space-md" id="word-creator-drawer">
                <div class="flex items-center justify-between pb-space-xs">
                  <h3 class="font-headline-sm text-headline-sm text-on-surface font-extrabold">Yeni Kelime Kaydet</h3>
                  <button class="text-on-surface-variant hover:text-on-surface" id="close-drawer-btn">
                    <span class="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <form id="add-word-form" class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <input type="text" id="new-word-en" placeholder="İngilizce Kelime (örn: Ubiquitous)" required class="px-space-md py-space-sm rounded-xl bg-surface-container-lowest text-on-surface border border-border-glass"/>
                  <input type="text" id="new-word-tr" placeholder="Türkçe Karşılığı (örn: Her yerde bulunan)" required class="px-space-md py-space-sm rounded-xl bg-surface-container-lowest text-on-surface border border-border-glass"/>
                  <input type="text" id="new-word-ex" placeholder="Örnek Cümle (İsteğe bağlı)" class="md:col-span-2 px-space-md py-space-sm rounded-xl bg-surface-container-lowest text-on-surface border border-border-glass"/>
                  <div class="md:col-span-2 flex justify-end gap-space-sm">
                    <button type="submit" class="px-space-xl py-space-sm rounded-xl bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold shadow-md cursor-pointer">
                      Kaydet & Deftere Ekle
                    </button>
                  </div>
                </form>
              </div>

              <!-- Custom Words Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg" id="custom-words-list">
                ${customWords.map(item => `
                  <div class="rounded-2xl bg-surface-container/90 backdrop-blur-xl p-space-lg flex flex-col justify-between shadow-lg border border-border-glass">
                    <div class="flex flex-col gap-space-sm">
                      <div class="flex items-center justify-between">
                        <span class="px-space-xs py-space-3xs rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">
                          ${item.category || 'Genel'}
                        </span>
                      </div>

                      <div class="flex items-baseline justify-between mt-space-2xs">
                        <div class="flex items-center gap-space-xs">
                          <h3 class="font-headline-sm text-headline-sm text-on-surface font-extrabold">${item.word}</h3>
                          <button class="w-7 h-7 rounded-full bg-secondary/15 text-secondary flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer" onclick="Speech.speak('${item.word}')">
                            <span class="material-symbols-outlined text-[16px]">volume_up</span>
                          </button>
                        </div>
                        <span class="font-phonetic-ipa text-phonetic-ipa text-on-surface-variant font-medium">${item.phonetic || ''}</span>
                      </div>
                      
                      <p class="font-body-md text-body-md text-secondary font-semibold">${item.meaning}</p>
                      
                      ${item.example ? `
                        <div class="rounded-xl bg-surface-container-low/80 p-space-sm font-body-sm text-body-sm text-on-surface-variant italic border border-border-glass">
                          "${item.example}"
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>

          </div>
        </main>
      </div>
    `;

    this.attachEvents();
  },

  attachEvents() {
    const mistakesBtn = document.getElementById('tab-mistakes-btn');
    const customBtn = document.getElementById('tab-custom-btn');
    const mistakesSec = document.getElementById('module-mistakes');
    const customSec = document.getElementById('module-custom');

    mistakesBtn?.addEventListener('click', () => {
      mistakesSec.classList.remove('hidden');
      mistakesSec.classList.add('flex');
      customSec.classList.add('hidden');
      customSec.classList.remove('flex');

      mistakesBtn.className = 'flex-1 md:flex-none flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg font-label-lg text-label-lg transition-all duration-300 bg-primary-container text-on-primary-container font-bold shadow-md cursor-pointer';
      customBtn.className = 'flex-1 md:flex-none flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg font-label-lg text-label-lg transition-all duration-300 text-on-surface-variant hover:text-on-surface cursor-pointer';
    });

    customBtn?.addEventListener('click', () => {
      customSec.classList.remove('hidden');
      customSec.classList.add('flex');
      mistakesSec.classList.add('hidden');
      mistakesSec.classList.remove('flex');

      customBtn.className = 'flex-1 md:flex-none flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg font-label-lg text-label-lg transition-all duration-300 bg-primary-container text-on-primary-container font-bold shadow-md cursor-pointer';
      mistakesBtn.className = 'flex-1 md:flex-none flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-lg font-label-lg text-label-lg transition-all duration-300 text-on-surface-variant hover:text-on-surface cursor-pointer';
    });

    const drawer = document.getElementById('word-creator-drawer');
    document.getElementById('toggle-drawer-btn')?.addEventListener('click', () => {
      if (drawer) {
        drawer.classList.toggle('hidden');
        drawer.classList.toggle('flex');
      }
    });

    document.getElementById('close-drawer-btn')?.addEventListener('click', () => {
      if (drawer) {
        drawer.classList.add('hidden');
        drawer.classList.remove('flex');
      }
    });

    document.getElementById('add-word-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const en = document.getElementById('new-word-en').value;
      const tr = document.getElementById('new-word-tr').value;
      const ex = document.getElementById('new-word-ex').value;
      if (en && tr) {
        Storage.addCustomWord(en, tr, ex);
        alert('Kelime başarıyla kaydedildi!');
        VocabPortalScreen.render(document.getElementById('app'));
      }
    });
  }
};
