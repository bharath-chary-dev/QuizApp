// Quiz logic, UI, sound, animation
import { fetchQuestions } from './questions.js';
import { saveHighScore } from './leaderboard.js';

const SOUNDS = {
  correct: new Audio('assets/correct.mp3'),
  wrong: new Audio('assets/wrong.mp3')
};

function playSound(type) {
  if (SOUNDS[type]) {
    SOUNDS[type].currentTime = 0;
    SOUNDS[type].play();
  }
}

function animateScore(el) {
  el.classList.add('score-animate');
  setTimeout(() => el.classList.remove('score-animate'), 600);
}

export function renderQuiz(app, route, { category, difficulty, amount }) {
  let questions = [];
  let current = 0, score = 0, total = 0;
  let totalTime = 0, qTime = 20, timer, qTimer;
  let finished = false;
  let userAnswers = [];
  let error = null;
  let skipped = [];
  let inSkippedPhase = false;
  let quitEarly = false;

  // Set timer by difficulty
  const DIFF_TIME = { easy: 20, medium: 30, hard: 45 };
  function getQTime() {
    return DIFF_TIME[difficulty] || 20;
  }

  // Show loading indicator
  app.innerHTML = `<div class="card" style="text-align:center;"><div class="loader" style="margin:2rem auto;"></div><div>Loading questions...</div></div>`;
  fetchQuestions({ category, difficulty, amount }).then(qs => {
    questions = qs;
    total = questions.length;
    totalTime = total * getQTime();
    showQuestion();
    startTotalTimer();
  }).catch(err => {
    error = err.message || 'Failed to load questions.';
    app.innerHTML = `<div class="card" style="text-align:center;"><div style="color:#c0392b;font-size:1.2rem;">${error}</div><button class="btn" id="retry">Retry</button></div>`;
    document.getElementById('retry').onclick = () => route('quiz', { category, difficulty, amount });
  });

  function showQuestion() {
    // If finished normal, go to skipped phase
    if (!inSkippedPhase && current >= total && skipped.length > 0) {
      inSkippedPhase = true;
      questions = skipped;
      total = questions.length;
      current = 0;
      skipped = [];
      showQuestion();
      return;
    }
    // If all done, show result
    if (current >= total) return showResult();
    qTime = getQTime();
    const q = questions[current];
    app.innerHTML = `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span>Question ${current+1} / ${total}</span>
          <span id="timer" style="font-size:1.2rem;font-weight:600;">${qTime}s</span>
        </div>
        <div class="timer-bar"><div class="timer-bar-inner" id="timer-bar-inner" style="width:100%"></div></div>
        <div class="progress"><div class="progress-bar" style="width:${((current)/total)*100}%"></div></div>
        <h2>${q.q}</h2>
        <div id="options">
          ${q.options.map((opt,i) => `<button class="btn option" data-idx="${i}">${opt}</button>`).join('')}
        </div>
        <div class="quiz-actions" style="display:flex;justify-content:space-between;margin-top:1.5rem;gap:1rem;">
          <button class="btn-quit" id="quit" style="background:#e74c3c;">Quit</button>
          <button class="btn-skip" id="skip" style="background:var(--primary);">Skip</button>
        </div>
      </div>
    `;
    document.querySelectorAll('.option').forEach(btn => {
      btn.onclick = e => answer(parseInt(btn.dataset.idx));
    });
    document.getElementById('skip').onclick = () => skipQuestion();
    document.getElementById('quit').onclick = () => quitQuiz();
    startQTimer();
    animateTimerBar(qTime);
  }

  function skipQuestion() {
    stopQTimer();
    // Save skipped question for later
    skipped.push(questions[current]);
    userAnswers.push({ idx: null, correct: false, skipped: true, q: questions[current] });
    showAnswer(null, true);
  }

  function quitQuiz() {
    stopAllTimers();
    finished = true;
    quitEarly = true;
    showResult();
  }

  function answer(idx) {
    stopQTimer();
    const q = questions[current];
    const correct = idx === q.answer;
    userAnswers.push({ idx, correct, skipped: false, q });
    if (correct) {
      score++;
      playSound('correct');
    } else {
      playSound('wrong');
    }
    showAnswer(idx, false);
  }

  function showAnswer(selectedIdx, skipped = false) {
    const q = questions[current];
    const options = document.querySelectorAll('.option');
    options.forEach((btn, i) => {
      btn.disabled = true;
      btn.classList.remove('correct', 'wrong', 'neutral');
      if (i === q.answer) {
        btn.classList.add('correct');
      } else if (selectedIdx === i && !skipped && selectedIdx !== null) {
        btn.classList.add('wrong');
      } else {
        btn.classList.add('neutral');
      }
    });
    setTimeout(() => {
      current++;
      showQuestion();
    }, 1200);
  }

  function showResult() {
    finished = true;
    stopAllTimers();
    // Only show score if quiz completed or quit
    let showSave = !quitEarly && score >= 6;
    app.innerHTML = `
      <div class="card">
        <h2>Quiz Finished!</h2>
        <div style="font-size:2rem;">Score: <b>${score}</b> / ${userAnswers.length}</div>
        ${showSave ? `<form id="save-score">
          <input type="text" name="name" placeholder="Your name" maxlength="12" required style="margin:1rem 0;">
          <button class="btn" type="submit">Save Score</button>
        </form>` : ''}
        ${!quitEarly ? `<button class="btn" id="view-result">View Result</button>` : ''}
        <button class="btn" id="restart">Restart</button>
        <button class="btn" id="home">Home</button>
      </div>
    `;
    document.getElementById('restart').onclick = () => route('quiz', { category, difficulty, amount });
    document.getElementById('home').onclick = () => route('home');
    if (showSave) {
      document.getElementById('save-score').onsubmit = e => {
        e.preventDefault();
        const name = e.target.name.value.trim() || 'Anon';
        saveHighScore(name, score);
        route('leaderboard');
      };
    }
    if (!quitEarly) {
      document.getElementById('view-result').onclick = () => showAnswersReview();
    }
  }

  function showAnswersReview() {
    app.innerHTML = `
      <div class="card">
        <h2>Quiz Answers</h2>
        <ol style="padding-left:1.2rem;">
          ${userAnswers.map((ua, idx) => `
            <li style="margin-bottom:1.2rem;">
              <div style="margin-bottom:0.5rem;font-weight:500;">${ua.q.q}</div>
              <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
                ${ua.q.options.map((opt, i) => {
                  let cls = '';
                  if (i === ua.q.answer) cls = 'correct';
                  else if (ua.idx === i && !ua.skipped && ua.idx !== null && i !== ua.q.answer) cls = 'wrong';
                  else cls = 'neutral';
                  return `<span class="option ${cls}" style="padding:0.4em 1em;min-width:80px;text-align:center;">${opt}</span>`;
                }).join('')}
              </div>
              ${ua.skipped ? '<div style="color:#f39c12;font-size:0.95em;margin-top:0.3em;">Skipped</div>' : ua.idx === ua.q.answer ? '<div style="color:var(--primary);font-size:0.95em;margin-top:0.3em;">Correct</div>' : '<div style="color:#e74c3c;font-size:0.95em;margin-top:0.3em;">Wrong</div>'}
            </li>
          `).join('')}
        </ol>
        <button class="btn" id="restart">Restart</button>
        <button class="btn" id="home">Home</button>
      </div>
    `;
    document.getElementById('restart').onclick = () => route('quiz', { category, difficulty, amount });
    document.getElementById('home').onclick = () => route('home');
  }

  function startQTimer() {
    stopQTimer();
    const totalQTime = getQTime();
    updateTimerBar(qTime, totalQTime);
    qTimer = setInterval(() => {
      qTime--;
      document.getElementById('timer').textContent = qTime + 's';
      updateTimerBar(qTime, totalQTime);
      if (qTime <= 0) {
        playSound('wrong');
        showAnswer(null, false); // treat as wrong
      }
    }, 1000);
  }

  function animateTimerBar(seconds) {
    const bar = document.getElementById('timer-bar-inner');
    if (bar) {
      bar.style.transition = `width ${seconds}s linear`;
      bar.style.width = '0%';
    }
  }

  function updateTimerBar(qTime, totalQTime) {
    const bar = document.getElementById('timer-bar-inner');
    if (bar) {
      const percent = Math.max(0, (qTime / totalQTime) * 100);
      bar.style.transition = 'width 0.3s linear';
      bar.style.width = percent + '%';
    }
  }
  function stopQTimer() { if (qTimer) clearInterval(qTimer); }

  function startTotalTimer() {
    timer = setInterval(() => {
      totalTime--;
      if (totalTime <= 0 && !finished) {
        showResult();
      }
    }, 1000);
  }
  function stopAllTimers() {
    if (timer) clearInterval(timer);
    if (qTimer) clearInterval(qTimer);
  }

  startTotalTimer();
  showQuestion();
}
