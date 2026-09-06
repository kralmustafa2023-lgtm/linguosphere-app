// ===========================
// OCR SCANNER SCREEN — Kamera ile Kelime Tarama
// ===========================

import { Speech } from '../speech.js';
import { Storage } from '../storage.js';
import { backArrowSVG, showToast } from '../utils.js';
import { navigate } from '../app.js';

export const OcrScannerScreen = {
  stream: null,

  render(root) {
    root.innerHTML = `
      <div class="screen" style="padding-bottom: 120px;">
        <div class="container container-narrow stagger">
          
          <!-- Sticky Header -->
          <div class="header-bar hover-lift" style="position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,0,0,0.05); margin: 0 -16px 24px -16px; padding: 16px 20px;">
            <button class="back-area hover-lift" id="exitOcrBtn" style="background:none; border:none; cursor:pointer; font-weight: 500; display:flex; align-items:center; gap:6px; color:var(--text-primary);">
              ${backArrowSVG()}
              <span>Geri</span>
            </button>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 15px; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
              <span>📷 Akıllı Kamera OCR</span>
            </div>
          </div>

          <!-- Hero Info -->
          <div style="text-align:center; margin-bottom: 24px;">
            <h2 style="font-family:var(--font-display); font-size:24px; font-weight:800; color:var(--text-primary); margin-bottom:8px;">
              Kitap veya Tabeladaki Metni Tara
            </h2>
            <p style="font-size:14px; color:var(--text-secondary); line-height:1.6;">
              Kameranızı İngilizce metne doğrultun ve tara butonuna dokunun. Çıkan kelimelerin üstüne dokunarak anında defterinize ekleyin.
            </p>
          </div>

          <!-- Camera Stream Container -->
          <div style="position:relative; width:100%; height:320px; border-radius:24px; overflow:hidden; background:#000; box-shadow:var(--shadow-card); border:2px solid var(--accent-primary); margin-bottom:20px; display:flex; align-items:center; justify-content:center;">
            <video id="ocrVideo" autoplay playsinline style="width:100%; height:100%; object-fit:cover;"></video>
            <canvas id="ocrCanvas" style="display:none;"></canvas>
            
            <!-- Scan target viewfinder frame -->
            <div style="position:absolute; inset:24px; border:2px dashed rgba(255,255,255,0.7); border-radius:16px; pointer-events:none; display:flex; align-items:center; justify-content:center;">
              <span style="font-size:12px; color:#fff; background:rgba(0,0,0,0.6); padding:4px 12px; border-radius:8px; font-weight:bold;">Metni Bu Alana Hizalayın</span>
            </div>
          </div>

          <!-- Camera Action Controls -->
          <div style="display:flex; gap:12px; margin-bottom:24px;">
            <button id="captureBtn" class="hover-lift" style="flex:1; padding:16px; border-radius:18px; background:linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:#fff; font-weight:800; font-size:16px; border:none; cursor:pointer; box-shadow:0 8px 24px rgba(124,93,250,0.35); display:flex; align-items:center; justify-content:center; gap:8px;">
              <span class="material-symbols-outlined">photo_camera</span>
              <span>Fotoğrafı Çek & Oku</span>
            </button>
          </div>

          <!-- Processing State Spinner -->
          <div id="ocrStatus" style="display:none; padding:16px; border-radius:16px; background:var(--bg-card); text-align:center; margin-bottom:24px; border:1px solid var(--bg-card-border); font-size:14px; font-weight:700; color:var(--text-primary);">
            ⏳ OCR Yapay Zeka Metni Okuyor...
          </div>

          <!-- OCR Extracted Text & Tappable Words Area -->
          <div id="ocrResultBox" style="display:none; background:var(--bg-card); border:1px solid var(--bg-card-border); border-radius:24px; padding:24px; box-shadow:var(--shadow-card);">
            <div style="font-size:12px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; margin-bottom:12px;">Tanınan Metin (Kelimeye Dokunarak Ekle):</div>
            <div id="ocrWordsContainer" style="font-size:18px; line-height:1.8; color:var(--text-primary);"></div>
            
            <div id="ocrWordPopup" style="margin-top:16px; min-height:24px;"></div>
          </div>

        </div>
      </div>
    `;

    this.initCamera();
    this.attachEvents();
  },

  async initCamera() {
    const video = document.getElementById('ocrVideo');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast('Kamera bu tarayıcıda desteklenmiyor.');
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (video) video.srcObject = this.stream;
    } catch (err) {
      console.warn('Camera access error:', err);
      showToast('Kamera izni verilmedi veya açılamadı.');
    }
  },

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  },

  attachEvents() {
    document.getElementById('exitOcrBtn')?.addEventListener('click', () => {
      this.stopCamera();
      navigate('vocab');
    });

    const captureBtn = document.getElementById('captureBtn');
    const video = document.getElementById('ocrVideo');
    const canvas = document.getElementById('ocrCanvas');
    const statusBox = document.getElementById('ocrStatus');
    const resultBox = document.getElementById('ocrResultBox');
    const wordsContainer = document.getElementById('ocrWordsContainer');

    captureBtn?.addEventListener('click', async () => {
      if (!video || !canvas) return;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.textContent = '⏳ Yapay Zeka Metni Okuyor (Tesseract Engine)...';
      }

      try {
        if (typeof Tesseract === 'undefined') {
          throw new Error('Tesseract OCR kütüphanesi henüz yüklenmedi.');
        }

        const res = await Tesseract.recognize(canvas, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text' && statusBox) {
              statusBox.textContent = `⏳ Tanınıyor... %${Math.round(m.progress * 100)}`;
            }
          }
        });

        const text = res.data.text.trim();
        if (statusBox) statusBox.style.display = 'none';

        if (!text) {
          showToast('Fotoğrafta okunabilir İngilizce metin bulunamadı.');
          return;
        }

        if (resultBox && wordsContainer) {
          resultBox.style.display = 'block';
          const tokens = text.split(/\s+/);
          wordsContainer.innerHTML = tokens.map(t => {
            const clean = t.replace(/[^a-zA-Z]/g, '');
            return `<span class="ocr-word-chip hover-lift" data-word="${clean}" style="display:inline-block; margin:2px 4px; padding:3px 8px; border-radius:8px; background:var(--bg-elevated); border:1px solid var(--bg-card-border); cursor:pointer; font-weight:700;">${t}</span>`;
          }).join(' ');

          // Delegate click on words
          wordsContainer.addEventListener('click', (e) => {
            const chip = e.target.closest('.ocr-word-chip');
            if (!chip) return;
            const w = chip.dataset.word;
            if (!w) return;

            Speech.english(w);
            const popup = document.getElementById('ocrWordPopup');
            if (popup) {
              popup.innerHTML = `
                <div style="display:inline-flex; align-items:center; gap:12px; background:var(--bg-surface); padding:8px 16px; border-radius:14px; border:1px solid var(--accent-primary); box-shadow:0 4px 16px rgba(124,93,250,0.15);">
                  <span>🔍 Seçilen: <strong>${w}</strong></span>
                  <button id="addOcrWordBtn" class="hover-lift" style="background:var(--accent-primary); color:white; border:none; border-radius:8px; padding:4px 10px; font-size:12px; font-weight:700; cursor:pointer;">
                    + Deftere Kaydet
                  </button>
                </div>
              `;

              document.getElementById('addOcrWordBtn')?.addEventListener('click', (ev) => {
                ev.stopPropagation();
                Storage.addCustomWord({
                  en: w,
                  tr: 'Kameradan Eklendi',
                  ex: `Scanned from text: "${text.substring(0, 50)}..."`
                });
                showToast(`"${w}" deftere eklendi! ✨`);
                popup.innerHTML = `<span style="color:var(--color-success)">✓ "${w}" defterine kaydedildi!</span>`;
              });
            }
          });
        }
      } catch (err) {
        console.error('OCR Error:', err);
        if (statusBox) {
          statusBox.style.display = 'block';
          statusBox.textContent = `❌ Tarama hatası: ${err.message}`;
        }
      }
    });
  }
};
