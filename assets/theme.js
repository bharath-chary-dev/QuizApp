// Theme toggle logic
export function setTheme() {
  const theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

export function initThemeToggle(route) {
  document.addEventListener('click', e => {
    if (e.target && e.target.matches('.theme-toggle')) {
      toggleTheme();
      if (route) route('home');
    }
  });
}
