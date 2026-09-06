// ===========================
// EXAM PREP GAME / SCREEN — YDS / YÖKDİL / LGS Sınav Modülü
// ===========================

import { playSound, showScoreFloat } from '../utils.js';
import { Storage } from '../storage.js';
import { navigate } from '../app.js';

export const ExamPrepGame = {
  async start(root) {
    let exams = [];
    try {
      const res = await fetch('data/examPrep.json');
      exams = await res.json();
    } catch (e) {
      console.error('Exam prep verisi yüklenemedi:', e);
      exams = [];
    }

    if (!exams.length) {
      root.innerHTML = '<div class="p-8 text-center text-on-surface">Sınav soruları yüklenemedi.</div>';
      return;
    }

    let examIndex = 0;
    let questionIndex = 0;
    let correct = 0;
    let wrong = 0;
    let answered = false;

    function renderCurrent() {
      const currentExam = exams[examIndex];
      const q = currentExam.questions[questionIndex];
      const totalInExam = currentExam.questions.length;

      root.innerHTML = `
        <div class="screen" style="padding-bottom: 120px;">
          <div class="container container-narrow stagger">
            
            <!-- Sticky Header -->
            <div class="header-bar hover-lift" style="position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,0,0,0.05); margin: 0 -16px 24px -16px; padding: 16px 20px;">
              <button class="back-area hover-lift" id="exitExamBtn" style="background:none; border:none; cursor:pointer; font-weight: 500; display:flex; align-items:center; gap:6px; color:var(--text-primary);">
                <span class="material-symbols-outlined">arrow_back</span>
                <span>Çıkış</span>
              </button>
              <div style="font-family: var(--font-display); font-weight: 700; font-size: 15px; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
                <span class="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-bold">${currentExam.examType}</span>
                <span>${currentExam.title}</span>
              </div>
              <div style="font-weight: 700; font-size: 14px; color:var(--accent-primary);">
                Soru ${questionIndex + 1} / ${totalInExam}
              </div>
            </div>

            <!-- Reading Passage Card -->
            <div style="background:var(--bg-card); border:1px solid var(--bg-card-border); border-radius:24px; padding:24px; box-shadow:var(--shadow-card); margin-bottom:24px;">
              <div style="font-size:12px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; margin-bottom:8px;">Paragraf Metni</div>
              <p style="font-size:16px; line-height:1.8; color:var(--text-primary); font-family:serif;">
                ${currentExam.passage.replace(`___ (${q.blankId})`, `<mark style="background:rgba(255, 185, 86, 0.35); color:var(--text-primary); padding:2px 8px; border-radius:6px; font-weight:bold;">___ (${q.blankId})</mark>`)}
              </p>
            </div>

            <!-- Question & Options Card -->
            <div style="background:var(--bg-elevated); border:1px solid var(--bg-card-border); border-radius:24px; padding:24px; box-shadow:var(--shadow-card); margin-bottom:24px;">
              <h3 style="font-size:16px; font-weight:700; color:var(--text-primary); margin-bottom:16px;">
                ${q.questionText || `(${q.blankId}) numaralı boşluğa uygun gelen seçeneği bulunuz:`}
              </h3>

              <div style="display:flex; flex-direction:column; gap:10px;">
                ${q.options.map((opt, i) => `
                  <button class="exam-opt-btn hover-lift" data-opt="${opt}" style="text-align:left; padding:16px 20px; border-radius:16px; background:var(--bg-surface); border:1.5px solid var(--bg-card-border); color:var(--text-primary); font-size:15px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:12px; transition:all 0.2s;">
                    <span style="width:28px; height:28px; border-radius:50%; background:rgba(124, 93, 250, 0.1); color:var(--accent-primary); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px;">${String.fromCharCode(65 + i)}</span>
                    <span>${opt}</span>
                  </button>
                `).join('')}
              </div>

              <!-- Explanation Box -->
              <div id="examExplanation" style="display:none; margin-top:20px; padding:16px; border-radius:16px; font-size:14px; line-height:1.6;"></div>
            </div>

            <button id="nextExamQBtn" class="hover-lift" style="display:none; width:100%; padding:16px; border-radius:16px; background:linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:#fff; font-weight:700; font-size:16px; border:none; cursor:pointer; box-shadow:0 8px 24px rgba(124,93,250,0.35);">
              Sonraki Soruya Geç ➔
            </button>

          </div>
        </div>
      `;

      document.getElementById('exitExamBtn')?.addEventListener('click', () => {
        navigate('practice');
      });

      document.querySelectorAll('.exam-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;

          const chosen = btn.dataset.opt;
          const isCorrect = chosen === q.correct;
          const expBox = document.getElementById('examExplanation');
          const nextBtn = document.getElementById('nextExamQBtn');

          if (isCorrect) {
            btn.style.borderColor = 'var(--color-success)';
            btn.style.background = 'rgba(16, 185, 129, 0.15)';
            playSound('correct');
            correct++;
            showScoreFloat('+20');
          } else {
            btn.style.borderColor = 'var(--color-error)';
            btn.style.background = 'rgba(239, 68, 68, 0.15)';
            playSound('wrong');
            wrong++;
            showScoreFloat('-5', true);

            // Highlight correct
            document.querySelectorAll('.exam-opt-btn').forEach(b => {
              if (b.dataset.opt === q.correct) {
                b.style.borderColor = 'var(--color-success)';
                b.style.background = 'rgba(16, 185, 129, 0.15)';
              }
            });
          }

          if (expBox) {
            expBox.style.display = 'block';
            expBox.style.background = isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
            expBox.style.border = `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`;
            expBox.innerHTML = `<strong>${isCorrect ? '✓ Doğru Cevap!' : '✗ Yanlış Cevap.'}</strong><br>${q.explanation}`;
          }

          if (nextBtn) nextBtn.style.display = 'block';
        });
      });

      document.getElementById('nextExamQBtn')?.addEventListener('click', () => {
        questionIndex++;
        if (questionIndex >= totalInExam) {
          const totalQuestions = correct + wrong;
          // Net hesabı (4 yanlış 1 doğruyu götürür mantığı)
          const net = Math.max(0, correct - (wrong * 0.25));
          navigate('result', {
            score: Math.round(net * 25),
            correct,
            total: totalQuestions,
            mode: 'examPrep',
            points: Math.round(net * 25),
            examNet: net.toFixed(2)
          });
        } else {
          answered = false;
          renderCurrent();
        }
      });
    }

    renderCurrent();
  }
};
