// Fetch questions from Open Trivia DB API and map to app format
// Usage: await fetchQuestions({category, difficulty, amount})
// Returns: [{q, options, answer} ...]

const CATEGORY_MAP = {
  general: 9,
  science: 17,
  sports: 21,
  history: 23
};

export async function fetchQuestions({ category, difficulty, amount = 10 }) {
  const catId = CATEGORY_MAP[category] || 9;
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${catId}&difficulty=${difficulty}&type=multiple`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (data.response_code !== 0) throw new Error('No questions found');
    return data.results.map(q => {
      // Decode HTML entities
      const decode = s => s.replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
      let options = [...q.incorrect_answers.map(decode), decode(q.correct_answer)];
      // Randomize options
      options = shuffle(options);
      return {
        q: decode(q.question),
        options,
        answer: options.findIndex(opt => opt === decode(q.correct_answer))
      };
    });
  } catch (err) {
    throw err;
  }
}

// Fisher-Yates shuffle
function shuffle(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
