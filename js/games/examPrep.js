// ===========================
// EXAM PREP GAME / SCREEN — YDS / YÖKDİL / LGS Sınav Modülü (Ultra Modern)
// ===========================

import { playSound, showScoreFloat, backArrowSVG } from '../utils.js';
import { Storage } from '../storage.js';
import { navigate } from '../app.js';

const FALLBACK_EXAMS = [
  {
    id: "yds_cloze_1",
    examType: "YDS / YÖKDİL",
    title: "Bilişsel Dil Edinimi ve Nöroplastisite",
    badge: "Akademik Cloze Test",
    passage: "Recent neuroimaging studies indicate that bilingual individuals develop higher cognitive flexibility ___ (1) their brains constantly manage two active linguistic systems. This persistent executive control ___ (2) the onset of cognitive decline in older adults. Furthermore, researchers have observed that acquiring a new vocabulary ___ (3) structural density in the left inferior parietal cortex. Consequently, regular linguistic exercises are increasingly ___ (4) by neurologists worldwide.",
    questions: [
      {
        blankId: 1,
        options: ["because", "despite", "although", "unless", "in case"],
        correct: "because",
        explanation: "Sebep bildiren bağlaç gereklidir: 'çift dilli bireyler daha yüksek bilişsel esneklik geliştirir ÇÜNKÜ beyinleri iki aktif sistemi yönetir'."
      },
      {
        blankId: 2,
        options: ["delays", "delaying", "delayed", "delay", "is delayed"],
        correct: "delays",
        explanation: "Özne tekil üçüncü şahıstır ('This persistent executive control') ve genel bir bilimsel gerçeği ifade ettiği için Simple Present Tense -s takısı alır."
      },
      {
        blankId: 3,
        options: ["enhances", "depletes", "ignores", "destroys", "neglects"],
        correct: "enhances",
        explanation: "Akademik kelime anlamı: 'Yeni bir kelime dağarcığı edinmek yapısal yoğunluğu ARTIRIR (enhances)'."
      },
      {
        blankId: 4,
        options: ["recommended", "prohibited", "dismissed", "criticized", "condemned"],
        correct: "recommended",
        explanation: "Pasif yapı: 'Nörologlar tarafından tüm dünyada tavsiye edilmektedir (recommended)'."
      }
    ]
  },
  {
    id: "lgs_sample_1",
    examType: "LGS",
    title: "Friendship and Teen Life",
    badge: "Paragraf & Anlam",
    passage: "A true friend is someone who always backs you up when you have a problem. They never share your secrets with others and you can count on them in every situation. If you have such a friend, you are very lucky.",
    questions: [
      {
        blankId: 1,
        questionText: "According to the passage, a true friend ___.",
        options: [
          "always supports you in difficult times",
          "often argues with your family",
          "never listens to your opinions",
          "shares your personal secrets"
        ],
        correct: "always supports you in difficult times",
        explanation: "'backs you up' ifadesi destek olmak (support) anlamına gelir."
      },
      {
        blankId: 2,
        questionText: "Which idiom in the text means 'to trust somebody'?",
        options: ["count on", "back up", "share with", "have a problem"],
        correct: "count on",
        explanation: "'Count on' güvenmek, bel bağlamak (trust/rely on) demektir."
      }
    ]
  }
];

export const ExamPrepGame = {
  async start(root) {
    let exams = [];
    try {
      const res = await fetch('data/examPrep.json');
      if (res.ok) {
        exams = await res.json();
      }
    } catch (e) {
      console.warn('Exam prep yerel verisi kullanılıyor:', e);
    }

    if (!exams || exams.length === 0) {
      exams = FALLBACK_EXAMS;
    }

    // Exam Selection Screen
    function renderExamSelection() {
      root.innerHTML = `
        <div class="screen" style="padding-bottom: 120px;">
          <div class="container container-narrow stagger">
            
            <!-- Sticky Header -->
            <div class="header-bar hover-lift" style="position: sticky; top: 0; z-index: 100; background: var(--bg-glass-strong); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid var(--bg-card-border); margin: 0 0 24px 0; padding: 16px 8px; border-radius: 16px;">
              <button class="back-area hover-lift" id="exitSelectionBtn" style="background:none; border:none; cursor:pointer; font-weight: 600; display:flex; align-items:center; gap:6px; color:var(--text-primary);">
                ${backArrowSVG()}
                <span>Ana Menü</span>
              </button>
              <div style="font-family: var(--font-display); font-weight: 700; font-size: 15px; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
                <span>🎯 Sınav Modülü Seçimi</span>
              </div>
            </div>

            <!-- Hero Banner -->
            <div style="text-align:center; margin-bottom: 32px;">
              <div style="font-size:52px; margin-bottom:12px; filter:drop-shadow(0 8px 24px rgba(124, 93, 250, 0.25)); display:inline-block;">
                📝
              </div>
              <h1 style="font-family:var(--font-display); font-size:30px; font-weight:800; color:var(--text-primary); letter-spacing:-0.03em; margin-bottom:8px;">
                Akademik & Ulusal Sınav Hazırlığı
              </h1>
              <p style="font-size:14px; color:var(--text-secondary); max-width:360px; margin:0 auto; line-height:1.6;">
                ÖSYM ve MEB formatına uygun Cloze Testler, paragraf soruları ve detaylı Türkçe açıklamalı çözümler.
              </p>
            </div>

            <!-- Exam List Cards -->
            <div style="display:flex; flex-direction:column; gap:16px;">
              ${exams.map((exam, idx) => `
                <div class="exam-card hover-lift" data-index="${idx}" style="background:linear-gradient(135deg, var(--bg-card), var(--bg-surface)); border:1.5px solid var(--bg-card-border); border-radius:24px; padding:22px; cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:16px; box-shadow:var(--shadow-sm); transition:all 0.25s;">
                  <div style="display:flex; align-items:center; gap:16px; flex:1;">
                    <div style="width:56px; height:56px; border-radius:18px; background:linear-gradient(135deg, rgba(124, 93, 250, 0.2), rgba(62, 222, 178, 0.15)); border:1px solid var(--bg-card-border); display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0;">
                      ${exam.examType.includes('LGS') ? '🎒' : '🎓'}
                    </div>
                    <div>
                      <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                        <span style="font-size:11px; font-weight:800; padding:3px 10px; border-radius:20px; background:rgba(124, 93, 250, 0.15); color:var(--accent-primary);">${exam.examType}</span>
                        <span style="font-size:12px; font-weight:600; color:var(--text-muted);">${exam.questions.length} Soru</span>
                      </div>
                      <div style="font-family:var(--font-display); font-size:17px; font-weight:700; color:var(--text-primary);">${exam.title}</div>
                      <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">${exam.badge || 'Detaylı Çözümler & Net Hesaplama'}</div>
                    </div>
                  </div>
                  <div style="width:40px; height:40px; border-radius:50%; background:var(--bg-glass); border:1px solid var(--bg-card-border); display:flex; align-items:center; justify-content:center; color:var(--accent-primary); font-weight:bold; font-size:18px;">
                    ➔
                  </div>
                </div>
              `).join('')}
            </div>

          </div>
        </div>
      `;

      document.getElementById('exitSelectionBtn')?.addEventListener('click', () => {
        navigate('home');
      });

      document.querySelectorAll('.exam-card').forEach(card => {
        card.addEventListener('click', () => {
          const idx = parseInt(card.dataset.index, 10);
          startExam(idx);
        });
      });
    }

    function startExam(examIndex) {
      let questionIndex = 0;
      let correct = 0;
      let wrong = 0;
      let answered = false;

      function renderCurrent() {
        const currentExam = exams[examIndex];
        const q = currentExam.questions[questionIndex];
        const totalInExam = currentExam.questions.length;

        // Highlight active blank if pattern exists in passage
        let renderedPassage = currentExam.passage;
        if (q.blankId && renderedPassage.includes(`___ (${q.blankId})`)) {
          renderedPassage = renderedPassage.replace(
            `___ (${q.blankId})`,
            `<mark style="background:rgba(255, 185, 86, 0.35); color:var(--text-primary); padding:2px 8px; border-radius:6px; font-weight:bold; border-bottom:2px solid var(--color-warning);">___ (${q.blankId})</mark>`
          );
        }

        root.innerHTML = `
          <div class="screen" style="padding-bottom: 120px;">
            <div class="container container-narrow stagger">
              
              <!-- Sticky Header -->
              <div class="header-bar hover-lift" style="position: sticky; top: 0; z-index: 100; background: var(--bg-glass-strong); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid var(--bg-card-border); margin: 0 0 24px 0; padding: 16px 8px; border-radius: 16px;">
                <button class="back-area hover-lift" id="exitExamBtn" style="background:none; border:none; cursor:pointer; font-weight: 600; display:flex; align-items:center; gap:6px; color:var(--text-primary);">
                  ${backArrowSVG()}
                  <span>Sınavlar</span>
                </button>
                <div style="font-family: var(--font-display); font-weight: 700; font-size: 15px; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
                  <span style="padding:2px 8px; border-radius:6px; background:rgba(124, 93, 250, 0.15); color:var(--accent-primary); font-size:12px; font-weight:800;">${currentExam.examType}</span>
                  <span style="max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${currentExam.title}</span>
                </div>
                <div style="font-weight: 700; font-size: 13px; color:var(--accent-primary); background:var(--bg-glass); padding:4px 10px; border-radius:12px; border:1px solid var(--bg-card-border);">
                  ${questionIndex + 1} / ${totalInExam}
                </div>
              </div>

              <!-- Reading Passage Card -->
              <div style="background:var(--bg-card); border:1px solid var(--bg-card-border); border-radius:24px; padding:24px; box-shadow:var(--shadow-card); margin-bottom:24px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <div style="font-size:12px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.05em;">📖 Paragraf Metni</div>
                  <div style="font-size:11px; color:var(--text-muted);">Soru Metni</div>
                </div>
                <p style="font-size:16px; line-height:1.9; color:var(--text-primary); font-family:var(--font-body); letter-spacing:0.01em;">
                  ${renderedPassage}
                </p>
              </div>

              <!-- Question & Options Card -->
              <div style="background:var(--bg-elevated); border:1px solid var(--bg-card-border); border-radius:24px; padding:24px; box-shadow:var(--shadow-card); margin-bottom:24px;">
                <h3 style="font-size:16px; font-weight:700; color:var(--text-primary); margin-bottom:18px; line-height:1.5;">
                  ${q.questionText || `(${q.blankId}) numaralı boşluğa uygun gelen seçeneği bulunuz:`}
                </h3>

                <div style="display:flex; flex-direction:column; gap:12px;">
                  ${q.options.map((opt, i) => `
                    <button class="exam-opt-btn hover-lift" data-opt="${opt}" style="text-align:left; padding:16px 20px; border-radius:18px; background:var(--bg-surface); border:1.5px solid var(--bg-card-border); color:var(--text-primary); font-size:15px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:14px; transition:all 0.2s;">
                      <span style="width:32px; height:32px; border-radius:50%; background:rgba(124, 93, 250, 0.12); color:var(--accent-primary); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; flex-shrink:0;">${String.fromCharCode(65 + i)}</span>
                      <span style="flex:1;">${opt}</span>
                    </button>
                  `).join('')}
                </div>

                <!-- Explanation Box -->
                <div id="examExplanation" style="display:none; margin-top:20px; padding:18px; border-radius:18px; font-size:14px; line-height:1.6;"></div>
              </div>

              <button id="nextExamQBtn" class="hover-lift" style="display:none; width:100%; padding:18px; border-radius:20px; background:linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); color:#fff; font-weight:700; font-size:16px; border:none; cursor:pointer; box-shadow:0 8px 24px rgba(124,93,250,0.35);">
                ${questionIndex + 1 === totalInExam ? 'Sonuçları Gör ➔' : 'Sonraki Soruya Geç ➔'}
              </button>

            </div>
          </div>
        `;

        document.getElementById('exitExamBtn')?.addEventListener('click', () => {
          renderExamSelection();
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
              btn.style.boxShadow = '0 0 16px rgba(16, 185, 129, 0.25)';
              playSound('correct');
              correct++;
              showScoreFloat('+25');
            } else {
              btn.style.borderColor = 'var(--color-error)';
              btn.style.background = 'rgba(239, 68, 68, 0.15)';
              btn.style.boxShadow = '0 0 16px rgba(239, 68, 68, 0.25)';
              playSound('wrong');
              wrong++;
              showScoreFloat('-5', true);

              // Highlight correct option
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
              expBox.style.border = `1.5px solid ${isCorrect ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`;
              expBox.innerHTML = `
                <div style="font-weight:700; margin-bottom:6px; color:${isCorrect ? 'var(--color-success)' : 'var(--color-error)'}; font-size:15px;">
                  ${isCorrect ? '✓ Harika! Doğru Seçim.' : '✗ Yanlış Cevap.'}
                </div>
                <div style="color:var(--text-primary);">${q.explanation || 'Bu soru bağlam ve gramer uyumunu ölçmektedir.'}</div>
              `;
            }

            if (nextBtn) nextBtn.style.display = 'block';
          });
        });

        document.getElementById('nextExamQBtn')?.addEventListener('click', () => {
          questionIndex++;
          if (questionIndex >= totalInExam) {
            const totalQuestions = correct + wrong;
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

    renderExamSelection();
  }
};
