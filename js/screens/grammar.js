// ===========================
// GRAMMAR SCREEN — Magic UI / Aceternity Style
// ===========================

const GRAMMAR_COLORS = {
  purple: '#7c5dfa',
  blue: '#5fa8ff',
  green: '#2dd4a8',
  yellow: '#f2a93b',
  pink: '#f06a8e'
};

export const GrammarScreen = {
  render(root, lessonData) {
    if (!lessonData || !lessonData.grammar) { navigate('home'); return; }

    const grammarRules = lessonData.grammar;

    root.innerHTML = `
      <div class="screen">
        <div class="container container-narrow">
          
          <!-- Sticky Header -->
          <div class="header-bar" style="position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,0,0,0.05); margin: 0 -16px 24px -16px; padding: 16px 20px;">
            <div class="back-area hover-lift" id="backBtn" style="margin: 0; padding: 0;">
              ${backArrowSVG()}
              <span style="font-weight: 500;">Geri Dön</span>
            </div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 15px; letter-spacing: -0.01em; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              Gramer
            </div>
          </div>

          <div class="stagger">
            <h1 class="text-display" style="font-size:32px; font-weight:700; letter-spacing:-0.03em; margin-bottom: 8px; color:var(--text-primary);">Dilbilgisi Kuralları</h1>
            <p class="text-secondary" style="margin-bottom: 32px; font-weight: 500; font-size:15px; line-height:1.6;">
              Oyunlara başlamadan önce bu kuralları gözden geçirmenizde büyük fayda var.
            </p>

            <div class="grammar-list" style="display:flex; flex-direction:column; gap:24px;">
              ${grammarRules.map((grammar, index) => {
                const colorKeys = Object.keys(GRAMMAR_COLORS);
                const color = GRAMMAR_COLORS[colorKeys[index % colorKeys.length]];
                
                // Fallback architecture to prevent "undefined"
                const title = grammar.rule || grammar.topic || 'Genel Kural';
                const desc = grammar.exp || grammar.explanation || 'Bu konuda açıklama bulunamadı.';
                const ex = grammar.ex || (grammar.examples && grammar.examples.length ? grammar.examples[0].en : '');
                const exTR = grammar.exTR || (grammar.examples && grammar.examples.length ? grammar.examples[0].tr : '');

                return `
                  <div class="magic-card hover-lift" style="--magic-color: ${color}; position:relative; overflow:hidden; border-radius:24px; padding:24px; background:var(--bg-card); border:1px solid var(--bg-card-border); box-shadow:0 12px 40px rgba(0,0,0,0.04);">
                    <!-- Sparkle effect indicator -->
                    <div style="position:absolute; top:24px; left:0; width:4px; height:24px; background:${color}; border-radius:0 4px 4px 0; box-shadow: 0 0 16px ${color}"></div>
                    
                    <h3 style="font-family:var(--font-display); font-weight:800; font-size:20px; margin-bottom:8px; color:var(--text-primary); letter-spacing:-0.02em;">${title}</h3>
                    <p style="font-size:16px; color:var(--text-secondary); margin-bottom:20px; line-height:1.6; font-weight:500;">${desc}</p>
                    
                    ${ex ? `
                      <div style="background:var(--bg-elevated); border:1px solid var(--bg-card-border); border-radius:16px; padding:16px; position:relative;">
                         <div style="position:absolute; top:-12px; left:16px; background:var(--bg-card); padding:2px 10px; font-size:11px; font-weight:800; color:${color}; text-transform:uppercase; letter-spacing:0.1em; border:1px solid var(--bg-card-border); border-radius:12px;">Örnek Kullanım</div>
                         <div style="font-size:16px; font-weight:700; color:var(--text-primary); margin-bottom:6px; letter-spacing:-0.01em;">"${ex}"</div>
                         <div style="font-size:14px; font-weight:500; color:var(--text-tertiary); font-style:italic;">${exTR}</div>
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
            
            <button class="btn hover-lift" id="startBtn" style="margin-top: 48px; width:100%; background:linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:white; font-weight:700; font-size:16px; min-height:56px; border-radius:16px; border:none; box-shadow:0 4px 16px rgba(var(--accent-primary-rgb), 0.25);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              Anladım, Kapat
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(lessonData);
  },

  attachEvents(lessonData) {
    document.getElementById('backBtn')?.addEventListener('click', () => {
      navigate('modeSelect', { lessonData });
    });
    
    document.getElementById('startBtn')?.addEventListener('click', () => {
      navigate('modeSelect', { lessonData });
    });
  }
};
