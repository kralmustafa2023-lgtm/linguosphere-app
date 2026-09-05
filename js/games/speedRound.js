// ===========================
// SPEED ROUND GAME
// ===========================

export const SpeedGame = {
  start(root, lessonData) {
    const vocab = lessonData ? (lessonData.vocabulary || []) : [];
    const speedWordsList = (lessonData && lessonData.speedWords) ? lessonData.speedWords : vocab.map(v => v.en);
    if (!lessonData || speedWordsList.length === 0) {
      navigate('modeSelect', { lessonData });
      return;
    }

    const speedWords = shuffle(speedWordsList);
    
    const questions = speedWords.map(word => {
      const vItem = vocab.find(v => v.en === word);
      if (!vItem) return null;
      
      const wrongs = shuffle(vocab.filter(v => v.en !== word))
        .slice(0, 3)
        .map(v => v.tr);
      
      return {
        en: word,
        tr: vItem.tr,
        options: shuffle([vItem.tr, ...wrongs])
      };
    }).filter(Boolean);

    if (questions.length === 0) {
      navigate('modeSelect', { lessonData });
      return;
    }

    let currentIndex = 0;
    let score = 0;
    let correct = 0;
    let timeLeft = 10;
    let timerInterval = null;
    const TOTAL_TIME = 10;

    function renderQuestion() {
      const q = questions[currentIndex];
      const progress = ((currentIndex + 1) / questions.length) * 100;
      timeLeft = TOTAL_TIME;

      root.innerHTML = `
        <div class="game-container stagger">
          <div class="game-header">
          <div class="back-area" id="exitBtn" style="cursor:pointer;display:flex;align-items:center;gap:8px;color:var(--text-secondary);font-weight:600;font-size:14px">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            <span>\u00C7\u0131k\u0131\u015F</span>
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-md)">
            <div class="score-display" style="background:var(--bg-glass-strong);padding:6px 16px;border-radius:var(--radius-full);border:1px solid rgba(0,0,0,0.06);box-shadow:var(--shadow-sm)">
              <span style="color:var(--color-success)">${score || 0}</span>
              <span class="score-label" style="opacity:0.7"> XP</span>
            </div>
          </div>
        </div>
        <div class="game-progress">
            <div class="game-progress-fill" style="width:${progress}%"></div>
          </div>

          <div class="game-body">
            <!-- Timer -->
            <div class="timer-container">
              <svg class="timer-svg" viewBox="0 0 100 100">
                <circle class="timer-track" cx="50" cy="50" r="45"/>
                <circle class="timer-circle" id="timerCircle" cx="50" cy="50" r="45" 
                        style="stroke:var(--color-success)"/>
              </svg>
              <div class="timer-number" id="timerNumber">${timeLeft}</div>
            </div>

            <!-- Word -->
            <div class="speed-word-display">${q.en}</div>

            <!-- Options -->
            <div class="game-answer-area">
              <div class="quiz-options">
                ${q.options.map(opt => `
                  <button class="quiz-option" data-answer="${opt}">${opt}</button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      startTimer(q);

      document.getElementById('exitBtn')?.addEventListener('click', () => {
        clearInterval(timerInterval);
        navigate('modeSelect', { lessonData: AppState.lessonData });
      });

      document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
          clearInterval(timerInterval);
          const selected = btn.dataset.answer;
          const isCorrect = selected === q.tr;

          document.querySelectorAll('.quiz-option').forEach(b => {
            b.disabled = true;
            if (b.dataset.answer === q.tr) b.classList.add('correct');
          });

          if (isCorrect) {
            btn.classList.add('correct');
            btn.classList.add('answer-correct');
            const timeBonus = Math.max(2, Math.round((timeLeft / TOTAL_TIME) * 10));
            const pts = 20 + timeBonus;
            score += pts;
            correct++;
            playSound('correct');
            showScoreFloat(`+${pts} \u26A1`);
          } else {
            btn.classList.add('wrong');
            btn.classList.add('answer-wrong');
            playSound('wrong');
          }

          setTimeout(nextQuestion, 1000);
        });
      });
    }

    function startTimer(q) {
      const circumference = 2 * Math.PI * 45;
      
      timerInterval = setInterval(() => {
        timeLeft--;
        const timerNumber = document.getElementById('timerNumber');
        const timerCircle = document.getElementById('timerCircle');
        
        if (!timerNumber || !timerCircle) {
          clearInterval(timerInterval);
          return;
        }

        timerNumber.textContent = timeLeft;
        const percent = timeLeft / TOTAL_TIME;
        timerCircle.style.strokeDashoffset = circumference * (1 - percent);

        if (timeLeft <= 3) {
          timerCircle.style.stroke = 'var(--color-error)';
          timerNumber.classList.add('timer-urgent');
        } else if (timeLeft <= 6) {
          timerCircle.style.stroke = 'var(--color-warning)';
          timerNumber.classList.remove('timer-urgent');
        } else {
          timerCircle.style.stroke = 'var(--color-success)';
          timerNumber.classList.remove('timer-urgent');
        }

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          document.querySelectorAll('.quiz-option').forEach(b => {
            b.disabled = true;
            if (b.dataset.answer === q.tr) b.classList.add('correct');
          });
          playSound('wrong');
          setTimeout(nextQuestion, 1000);
        }
      }, 1000);
    }

    function nextQuestion() {
      currentIndex++;
      if (currentIndex >= questions.length) {
        navigate('result', {
          score,
          correct,
          total: questions.length,
          mode: 'speedRound',
          points: score
        });
      } else {
        renderQuestion();
      }
    }

    renderQuestion();
  }
};
