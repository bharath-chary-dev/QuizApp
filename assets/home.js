// Home screen, category/difficulty selection, leaderboard
import { getHighScores } from './leaderboard.js';

const categories = [
  { value: 'general', label: 'General Knowledge' },
  { value: 'science', label: 'Science' },
  { value: 'sports', label: 'Sports' },
  { value: 'history', label: 'History' }
];
const difficulties = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

export function renderHome(app, route) {
  const highScores = getHighScores();
  app.innerHTML = `
    <div class="toggle-switch">
      <label class="switch">
        <input type="checkbox" class="theme-toggle" ${document.documentElement.getAttribute('data-theme') === 'light' ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    </div>
    <div class="card">
      <h1>Quiz App</h1>
      <form id="start-form">
        <label>Category:</label>
        <select name="category" required>
          ${categories.map(c => `<option value="${c.value}">${c.label}</option>`).join('')}
        </select>
        <label>Difficulty:</label>
        <select name="difficulty" required>
          ${difficulties.map(d => `<option value="${d.value}">${d.label}</option>`).join('')}
        </select>
        <label>Number of Questions:</label>
        <select name="amount" required>
          ${[10,12,15,20].map(n => `<option value="${n}">${n}</option>`).join('')}
        </select>
        <button class="btn" type="submit">Start Quiz</button>
      </form>
    </div>
    <div class="card">
      <h2>Leaderboard</h2>
      <ol id="leaderboard">
        ${highScores.map(s => `<li>${s.name} - <b>${s.score}</b></li>`).join('') || '<li>No scores yet.</li>'}
      </ol>
      <button class="btn" id="view-leaderboard" style="margin-top:1.2rem;">View Full Leaderboard</button>
    </div>
  `;
  app.querySelector('#start-form').onsubmit = e => {
    e.preventDefault();
    const form = e.target;
    const category = form.category.value;
    const difficulty = form.difficulty.value;
    const amount = parseInt(form.amount.value, 10) || 10;
    route('quiz', { category, difficulty, amount });
  };
  app.querySelector('#view-leaderboard').onclick = () => route('leaderboard');
}
