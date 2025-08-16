# QuizApp

A modern, professional, and fully responsive Quiz Application built with HTML, CSS, and JavaScript.

## Features

- **Dynamic Questions:** Fetches questions from the [Open Trivia DB API](https://opentdb.com/api.php) based on selected category, difficulty, and number of questions.
- **Professional UI:** Clean green-black theme, dark/light toggle, smooth transitions, and responsive design for desktop and mobile.
- **Quiz Logic:**
  - Multiple-choice questions with timer per difficulty (Easy: 20s, Medium: 30s, Hard: 45s).
  - Skip and Quit buttons (skip moves to next, quit ends quiz and shows score).
  - Skipped questions are shown after all normal questions.
  - Score is shown only at the end or on quit.
  - Save score only if ≥6 correct answers and not quit.
  - View detailed results after quiz completion.
- **Leaderboard:**
  - Highscores saved in localStorage.
  - Leaderboard accessible from home screen.
  - Admin login (default password: `admin123`) to view and delete any scorecard.
- **Accessibility & Extensibility:**
  - Modular, well-commented code for easy maintenance and future enhancements.
  - Placeholders and comments for adding new categories, question types, or sound effects.

## Getting Started

1. **Clone or Download** this repository to your local machine.
2. **Open `index.html`** in your browser. No build tools or server required.
3. **Play the Quiz!**
   - Select category, difficulty, and number of questions.
   - Use the dark/light toggle for your preferred theme.
   - View highscores and use admin features from the leaderboard.

## Admin Features
- Click "View Full Leaderboard" on the home screen.
- Click the "Admin" button and enter the password (`admin123` by default).
- Delete any scorecard. Changes are permanent and update localStorage.
- You can change the admin password in `assets/leaderboard.js` (`ADMIN_PASS` variable).

## Customization & Future Enhancements
- Easily add new categories, question types, or sound effects by editing the modular JS files.
- Theme colors and UI elements can be adjusted in `assets/styles.css`.
- Placeholders and comments are included for future features.

## Technical Details
- **No frameworks:** Pure HTML, CSS, and JavaScript (ES6+).
- **Responsive:** Works on all modern browsers and devices.
- **Data Storage:** Highscores are stored in browser localStorage.

---

**Enjoy your QuizApp!**
