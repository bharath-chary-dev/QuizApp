// Leaderboard logic with admin features
const LS_KEY = 'quiz_high_scores';
const ADMIN_PASS = 'admin123'; // Change this password as needed

export function getHighScores() {
  return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
}

export function saveHighScore(name, score) {
  const scores = getHighScores();
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem(LS_KEY, JSON.stringify(scores.slice(0, 10)));
}

export function deleteHighScore(index) {
  const scores = getHighScores();
  scores.splice(index, 1);
  localStorage.setItem(LS_KEY, JSON.stringify(scores));
}

export function renderLeaderboard(app, route) {
  const scores = getHighScores();
  let isAdmin = false;
  app.innerHTML = `
    <div class="card">
      <h2>Leaderboard</h2>
      <ol id="score-list">
        ${scores.map((s, i) => `<li>${s.name} - <b>${s.score}</b></li>`).join('') || '<li>No scores yet.</li>'}
      </ol>
      <div style="display:flex;gap:1rem;justify-content:center;">
        <button class="btn" id="back-home">Back to Home</button>
        <button class="btn" id="admin-btn">Admin</button>
      </div>
      <div id="admin-panel" style="display:none;margin-top:1.5rem;">
        <h3>Admin Panel</h3>
        <ol id="admin-score-list">
          ${scores.map((s, i) => `<li>${s.name} - <b>${s.score}</b> <button class="btn btn-delete" data-idx="${i}" style="background:#e74c3c;color:#fff;padding:0.2em 0.8em;font-size:0.95em;margin-left:1em;">Delete</button></li>`).join('')}
        </ol>
      </div>
    </div>
  `;
  app.querySelector('#back-home').onclick = () => route('home');
  app.querySelector('#admin-btn').onclick = () => {
    if (!isAdmin) {
      const pass = prompt('Enter admin password:');
      if (pass === ADMIN_PASS) {
        isAdmin = true;
        app.querySelector('#admin-panel').style.display = 'block';
      } else {
        alert('Incorrect password.');
      }
    } else {
      isAdmin = false;
      app.querySelector('#admin-panel').style.display = 'none';
    }
  };
  // Delete logic
  app.querySelectorAll('.btn-delete').forEach(btn => {
    btn.onclick = e => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      if (isAdmin && confirm('Delete this score?')) {
        deleteHighScore(idx);
        renderLeaderboard(app, route);
      }
    };
  });
}
