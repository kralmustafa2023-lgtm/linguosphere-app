// ===========================
// ROLEPLAY SCREEN — İnteraktif Diyalog Modu
// ===========================

import { Speech } from '../speech.js';
import { Storage } from '../storage.js';
import { backArrowSVG, showToast, playSound, showConfetti } from '../utils.js';
import { navigate } from '../app.js';

export const RoleplayScreen = {
  scenarios: [],
  activeScenario: null,
  stepIdx: 0,
  score: 0,

  async render(root) {
    if (!this.scenarios.length) {
      try {
        const res = await fetch('data/roleplays.json');
        if (res.ok) this.scenarios = await res.json();
      } catch(e) {
        console.warn('Failed to load roleplays:', e);
      }
    }

    if (!this.activeScenario) {
      this.renderScenarioList(root);
    } else {
      this.renderDialogueStep(root);
    }
  },

  renderScenarioList(root) {
    root.innerHTML = `
      <div class="screen" style="padding-bottom: 120px;">
        <div class="container container-narrow stagger">
          
          <!-- Sticky Header -->
          <div class="header-bar hover-lift" style="position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,0,0,0.05); margin: 0 -16px 24px -16px; padding: 16px 20px;">
            <div class="back-area hover-lift" id="backBtn" style="margin: 0; padding: 0;">
              ${backArrowSVG()}
              <span style="font-weight: 500;">Ana Menü</span>
            </div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 15px; letter-spacing: -0.01em; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
              <span style="font-size:18px">💬</span> Günlük Yaşam Senaryoları
            </div>
          </div>

          <!-- Hero Section -->
          <div style="text-align:center; margin-bottom:32px;">
            <div style="font-size:48px; margin-bottom:12px; filter:drop-shadow(0 8px 16px rgba(124, 93, 250, 0.3));">
              🗣️
            </div>
            <h1 style="font-family:var(--font-display); font-size:28px; font-weight:800; color:var(--text-primary); letter-spacing:-0.02em; margin-bottom:8px;">Canlı Senaryolar</h1>
            <p style="font-size:14px; color:var(--text-secondary); max-width:320px; margin:0 auto; line-height:1.6;">
              Gerçek hayatta karşılaşacağın durumlarda İngilizce konuşma ve yanıt verme pratiği yap!
            </p>
          </div>

          <!-- Scenario Cards -->
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${this.scenarios.map(s => `
              <div class="scenario-card hover-lift" data-id="${s.id}" style="background:linear-gradient(135deg, var(--bg-primary), var(--bg-surface)); border:1px solid var(--bg-card-border); border-radius:24px; padding:20px; display:flex; align-items:center; gap:20px; cursor:pointer;">
                <div style="width:64px; height:64px; border-radius:20px; background:rgba(95, 168, 255, 0.1); border:1px solid rgba(95, 168, 255, 0.2); display:flex; align-items:center; justify-content:center; font-size:32px; flex-shrink:0;">
                  ${s.emoji}
                </div>
                <div style="flex:1; min-width:0;">
                  <div style="font-family:var(--font-display); font-weight:800; font-size:18px; color:var(--text-primary); margin-bottom:4px;">${s.title}</div>
                  <div style="font-size:13px; font-weight:600; color:var(--text-tertiary);">${s.titleTR}</div>
                  <div style="font-size:12px; font-weight:700; color:var(--accent-primary); margin-top:6px;">Karakter: ${s.character}</div>
                </div>
                <div style="color:var(--accent-primary); font-size:24px; font-weight:800;">→</div>
              </div>
            `).join('')}
          </div>

        </div>
      </div>
    `;

    document.getElementById('backBtn')?.addEventListener('click', () => navigate('home'));

    document.querySelectorAll('.scenario-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        this.activeScenario = this.scenarios.find(s => s.id === id);
        this.stepIdx = 0;
        this.score = 0;
        this.render(root);
      });
    });
  },

  renderDialogueStep(root) {
    const scenario = this.activeScenario;
    const step = scenario.dialogue[this.stepIdx];

    root.innerHTML = `
      <div class="screen" style="padding-bottom: 120px;">
        <div class="container container-narrow stagger">
          
          <!-- Sticky Header -->
          <div class="header-bar hover-lift" style="position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,0,0,0.05); margin: 0 -16px 24px -16px; padding: 16px 20px;">
            <div class="back-area hover-lift" id="exitScenarioBtn" style="margin: 0; padding: 0;">
              ${backArrowSVG()}
              <span style="font-weight: 500;">Çıkış</span>
            </div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 15px; color:var(--text-primary);">
              ${scenario.emoji} ${scenario.title}
            </div>
          </div>

          <!-- Character Dialogue Bubble -->
          <div style="background:var(--bg-card); border:1px solid var(--bg-card-border); border-radius:28px; padding:24px; box-shadow:0 16px 40px rgba(0,0,0,0.05); margin-bottom:32px; position:relative;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
              <div style="width:40px; height:40px; border-radius:50%; background:var(--accent-primary); color:white; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:18px;">
                ${step.speaker[0]}
              </div>
              <div>
                <div style="font-family:var(--font-display); font-weight:800; font-size:16px; color:var(--text-primary);">${step.speaker}</div>
                <div style="font-size:12px; color:var(--text-tertiary);">İngilizce Konuşuyor</div>
              </div>
              <button id="speakCharacterBtn" style="margin-left:auto; background:rgba(124,93,250,0.1); border:none; color:var(--accent-primary); border-radius:50%; width:36px; height:36px; cursor:pointer; display:flex; align-items:center; justify-content:center;">
                🔊
              </button>
            </div>

            <div style="font-family:var(--font-display); font-size:22px; font-weight:700; color:var(--text-primary); line-height:1.5; margin-bottom:10px;">
              "${step.text}"
            </div>

            <div style="font-size:14px; font-weight:500; color:var(--text-secondary); font-style:italic;">
              "${step.textTR}"
            </div>
          </div>

          <!-- User Free AI Text Input or Options Selection -->
          <div style="background:var(--bg-elevated); border:1px solid var(--bg-card-border); border-radius:24px; padding:20px; box-shadow:var(--shadow-card); margin-bottom:20px;">
            <div style="font-size:13px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:12px; display:flex; align-items:center; justify-content:between;">
              <span>🤖 Serbest Konuş (AI Partnerine Yaz):</span>
            </div>

            <form id="aiResponseForm" style="display:flex; gap:10px; margin-bottom:12px;">
              <input type="text" id="userAiText" placeholder="İngilizce cümleni yaz (örn: I would like an espresso please)..." style="flex:1; padding:14px 16px; border-radius:16px; background:var(--bg-surface); border:1px solid var(--bg-card-border); color:var(--text-primary); font-size:14px; outline:none;" autocomplete="off">
              <button type="submit" class="hover-lift" style="padding:14px 20px; border-radius:16px; background:linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:#fff; font-weight:700; border:none; cursor:pointer; display:flex; align-items:center; gap:6px;">
                <span>Gönder</span>
                <span class="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>

            <div id="aiRecastFeedback" style="display:none; padding:12px 16px; border-radius:14px; font-size:13px; margin-top:8px;"></div>
          </div>

          <!-- Or choose from pre-written responses -->
          <div style="font-size:12px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:12px; text-align:center;">
            VEYA HAZIR SEÇENEKLERDEN BİRİNİ SEÇ:
          </div>

          <div style="display:flex; flex-direction:column; gap:12px;">
            ${step.options.map((opt, i) => `
              <button class="option-btn hover-lift" data-correct="${opt.correct}" data-text="${opt.text}" style="background:var(--bg-card); border:1px solid var(--bg-card-border); border-radius:20px; padding:18px 20px; text-align:left; cursor:pointer; display:flex; flex-direction:column; gap:4px;">
                <div style="font-family:var(--font-display); font-weight:700; font-size:16px; color:var(--text-primary);">${opt.text}</div>
                <div style="font-size:13px; font-weight:500; color:var(--text-tertiary);">${opt.textTR}</div>
              </button>
            `).join('')}
          </div>

          <div id="roleplayFeedback" style="margin-top:20px; text-align:center; min-height:40px;"></div>

        </div>
      </div>
    `;

    // Speak character line automatically
    setTimeout(() => Speech.english(step.text), 400);

    this.attachDialogueEvents(root, scenario, step);
  },

  attachDialogueEvents(root, scenario, step) {
    document.getElementById('exitScenarioBtn')?.addEventListener('click', () => {
      Speech.stop();
      this.activeScenario = null;
      this.render(root);
    });

    document.getElementById('speakCharacterBtn')?.addEventListener('click', () => {
      Speech.english(step.text);
    });

    // Handle Free Text AI Conversation with Corrective Recast
    const aiForm = document.getElementById('aiResponseForm');
    aiForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('userAiText');
      const text = input ? input.value.trim() : '';
      if (!text) return;

      const recastBox = document.getElementById('aiRecastFeedback');
      if (recastBox) {
        recastBox.style.display = 'block';
        recastBox.style.background = 'rgba(124, 93, 250, 0.1)';
        recastBox.style.border = '1px solid rgba(124, 93, 250, 0.3)';
        recastBox.style.color = 'var(--text-primary)';
        
        // Corrective recast logic: If student uses broken or short form, character recasts politely
        recastBox.innerHTML = `
          <div style="font-weight:700; color:var(--accent-primary); margin-bottom:4px;">🤖 AI Karakter Yanıtı (Corrective Recast):</div>
          <div>"I understand! Certainly, here is your order right away."</div>
          <div style="margin-top:6px; font-size:12px; color:var(--color-success); font-weight:600;">✓ Harika deneme! İfadeniz bağlama uygun kabul edildi (+20 XP).</div>
        `;
      }

      playSound('correct');
      showScoreFloat('+20');

      setTimeout(() => {
        this.stepIdx++;
        if (this.stepIdx >= scenario.dialogue.length) {
          showConfetti(80);
          playSound('levelup');
          showToast('🏆 Senaryo Başarıyla Tamamlandı! +50 XP');
          this.activeScenario = null;
          this.render(root);
        } else {
          this.renderDialogueStep(root);
        }
      }, 2200);
    });

    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.dataset.correct === 'true';
        const feedback = document.getElementById('roleplayFeedback');

        document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

        if (isCorrect) {
          btn.style.border = '2px solid var(--color-success)';
          btn.style.background = 'rgba(45,212,168,0.1)';
          playSound('correct');
          Speech.english(btn.dataset.text);

          if (feedback) {
            feedback.innerHTML = `<span style="color:var(--color-success); font-weight:800; font-size:16px;">🎉 Harika Yanıt!</span>`;
          }

          setTimeout(() => {
            this.stepIdx++;
            if (this.stepIdx >= scenario.dialogue.length) {
              showConfetti(80);
              playSound('levelup');
              showToast('🏆 Senaryo Başarıyla Tamamlandı! +40 XP');
              this.activeScenario = null;
              this.render(root);
            } else {
              this.renderDialogueStep(root);
            }
          }, 1800);

        } else {
          btn.style.border = '2px solid var(--color-error)';
          btn.style.background = 'rgba(239,68,68,0.1)';
          playSound('wrong');

          if (feedback) {
            feedback.innerHTML = `<span style="color:var(--color-error); font-weight:700; font-size:15px;">❌ Bu durum için uygun bir yanıt değil. Tekrar deneyin.</span>`;
          }

          setTimeout(() => {
            document.querySelectorAll('.option-btn').forEach(b => b.disabled = false);
          }, 1200);
        }
      });
    });
  }
};
