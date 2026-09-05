// ===========================
// QUIZ GAME — 4 Şıklı Quiz
// ===========================

import { shuffle, playSound, showScoreFloat } from '../utils.js';
import { Storage } from '../storage.js';
import { showGrammarModal } from '../components/grammarModal.js';
import { navigate, AppState } from '../app.js';

export const QuizGame = {
  start(root, lessonData) {
    const questionsList = lessonData ? (lessonData.quizQuestions || lessonData.quiz) : null;
    if (!lessonData || !questionsList || questionsList.length === 0) {
      navigate('modeSelect', { lessonData });
      return;
    }

    const questions = shuffle(questionsList);
    let currentIndex = 0;
    let score = 0;
    let correct = 0;
    let streak = 0;
    let answered = false;

    const labels = ['A', 'B', 'C', 'D'];

    function renderQuestion() {
      const q = questions[currentIndex];
      const options = shuffle(q.o);
      const progress = ((currentIndex + 1) / questions.length) * 100;
      answered = false;

      root.innerHTML = `
      <div class="game-container stagger">
        <!-- Header -->
        <div class="game-header">
          <div class="back-area" id="quitBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <span>Çıkış</span>
          </div>
          <button id="whyGrammarBtn" class="btn hover-lift" style="font-size:12px; font-weight:700; background:rgba(242, 169, 59, 0.15); border:1px solid rgba(242, 169, 59, 0.3); color:#d97706; padding:6px 12px; border-radius:14px; cursor:pointer;">
            💡 Neden Böyle?
          </button>
          <div class="counter" style="background:var(--bg-card);padding:4px 12px;border-radius:var(--radius-full);border:1px solid rgba(0,0,0,0.05)">
            <span class="current" style="color:var(--accent-primary)">${currentIndex + 1}</span> / ${questions.length}
          </div>
        </div>

        <!-- Progress -->
        <div class="game-progress">
          <div class="game-progress-fill" style="width:${progress}%"></div>
        </div>

        <!-- Body -->
        <div class="game-body">
          <div class="game-question-area" style="background:var(--bg-card);border:1px solid rgba(0,0,0,0.04);padding:var(--space-xl);border-radius:var(--radius-xl);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:var(--shadow-card);position:relative;overflow:hidden">
            <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg, transparent, var(--color-info), transparent);opacity:0.3"></div>
            <div style="font-size:36px;margin-bottom:12px;opacity:0.9;filter:drop-shadow(0 4px 12px rgba(95, 168, 255, 0.2))">❓</div>
            <div class="game-question-text" style="font-size:26px;font-family:var(--font-display);letter-spacing:-0.02em;">${q.q}</div>
            <div class="game-question-sub" style="font-style:italic;color:var(--text-tertiary)">Anlamı nedir?</div>
          </div>

          <div class="game-answer-area quiz-options stagger" style="margin-top:var(--space-md)">
            ${options.map((opt, i) => `
              <button class="quiz-option" data-answer="${opt}">
                <div style="display:flex;align-items:center;">
                  <span class="quiz-option-label" style="background:rgba(95, 168, 255, 0.1);color:var(--color-info)">${String.fromCharCode(65 + i)}</span>
                  <span style="flex:1">${opt}</span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

      // Events
      document.getElementById('quitBtn')?.addEventListener('click', () => {
        navigate('modeSelect', { lessonData: AppState.lessonData });
      });

      document.getElementById('whyGrammarBtn')?.addEventListener('click', () => {
        const grammarTip = (lessonData && lessonData.grammar && lessonData.grammar.length) ? lessonData.grammar[0] : null;
        showGrammarModal(
          q.q,
          grammarTip ? grammarTip.exp : `Doğru cevap: "${q.a}". Bu soru soru/kelime kalıpları bilgisini ölçmektedir.`,
          q.q,
          `Doğru Cevap: ${q.a}`
        );
      });

      document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const selected = btn.dataset.answer;
          const isCorrect = selected === q.a;

          // Disable all buttons
          document.querySelectorAll('.quiz-option').forEach(b => {
            b.disabled = true;
            if (b.dataset.answer === q.a) {
              b.classList.add('correct');
            }
          });

          if (isCorrect) {
            btn.classList.add('correct');
            btn.classList.add('answer-correct');
            streak++;
            let pts = 10;
            if (streak >= 3) pts += 5; // Streak bonus
            score += pts;
            correct++;
            playSound('correct');
            showScoreFloat(`+${pts}${streak >= 3 ? ' 🔥' : ''}`);
          } else {
            btn.classList.add('wrong');
            btn.classList.add('answer-wrong');
            score = Math.max(0, score - 5);
            streak = 0;
            Storage.recordMistake({ en: q.q, tr: q.a });
            playSound('wrong');
            showScoreFloat('-5', true);
          }

          // Next question after delay
          setTimeout(() => {
            currentIndex++;
            if (currentIndex >= questions.length) {
              navigate('result', {
                score,
                correct,
                total: questions.length,
                mode: 'quiz',
                points: score
              });
            } else {
              renderQuestion();
            }
          }, 1200);
        });
      });
    }

    renderQuestion();
  }
};

