// Quiz App Main JS (modular, ES6+)
import { renderHome } from './home.js';
import { renderQuiz } from './quiz.js';
import { renderLeaderboard } from './leaderboard.js';
import { setTheme, initThemeToggle } from './theme.js';

const app = document.getElementById('app');

function route(page, data) {
  app.innerHTML = '';
  if (page === 'home') renderHome(app, route);
  else if (page === 'quiz') renderQuiz(app, route, data);
  else if (page === 'leaderboard') renderLeaderboard(app, route);
}

window.addEventListener('DOMContentLoaded', () => {
  setTheme();
  initThemeToggle(route);
  route('home');
});

// Expose for debugging
window.route = route;
