// ===========================
// GRAMMAR MODAL COMPONENT — 1-Click Grammar Helper ("💡 Neden Böyle?")
// ===========================

export function showGrammarModal(title, explanation, example = '', exampleTR = '') {
  const existing = document.getElementById('grammarModalOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'grammarModalOverlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 99999;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: fadeIn 0.3s ease;
  `;

  overlay.innerHTML = `
    <div style="background: var(--bg-card); border: 1px solid var(--bg-card-border); border-radius: 28px; padding: 28px; width: 100%; max-width: 440px; box-shadow: 0 24px 60px rgba(0,0,0,0.2); animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); position: relative; text-align: left;">
      
      <button id="closeGrammarModal" style="position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.05); border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); font-weight: 700; font-size: 16px;">✕</button>

      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
        <div style="width: 44px; height: 44px; border-radius: 14px; background: rgba(242, 169, 59, 0.15); border: 1px solid rgba(242, 169, 59, 0.3); display: flex; align-items: center; justify-content: center; font-size: 24px;">💡</div>
        <div>
          <div style="font-size: 11px; font-weight: 800; color: var(--color-warning); text-transform: uppercase; letter-spacing: 0.1em;">Gramer İpucu</div>
          <div style="font-family: var(--font-display); font-weight: 800; font-size: 18px; color: var(--text-primary);">${title || 'Neden Böyle?'}</div>
        </div>
      </div>

      <div style="font-size: 15px; color: var(--text-secondary); line-height: 1.6; font-weight: 500; margin-bottom: 20px; background: var(--bg-elevated); padding: 16px; border-radius: 16px; border: 1px solid var(--bg-card-border);">
        ${explanation || 'Bu yapının doğru kullanımı yukarıdaki gibidir.'}
      </div>

      ${example ? `
        <div style="background: rgba(124, 93, 250, 0.08); border: 1px solid rgba(124, 93, 250, 0.2); border-radius: 16px; padding: 16px;">
          <div style="font-size: 11px; font-weight: 800; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Örnek Cümle</div>
          <div style="font-family: var(--font-display); font-weight: 700; font-size: 15px; color: var(--text-primary); margin-bottom: 2px;">"${example}"</div>
          <div style="font-size: 13px; font-weight: 500; color: var(--text-tertiary); font-style: italic;">${exampleTR}</div>
        </div>
      ` : ''}

      <button id="gotItBtn" class="btn hover-lift" style="width: 100%; margin-top: 24px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color: white; font-weight: 700; padding: 14px; border-radius: 16px; border: none; font-size: 15px; cursor: pointer; box-shadow: 0 4px 16px rgba(124,93,250,0.25);">
        Anladım, Teşekkürler!
      </button>

    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  document.getElementById('closeGrammarModal')?.addEventListener('click', close);
  document.getElementById('gotItBtn')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}
