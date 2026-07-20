const axios = require('axios');

const decodeHTMLEntities = (text) => {
  const entities = {
    '&quot;': '"',
    '&#039;': "'",
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&eacute;': 'é',
    '&iacute;': 'í',
    '&oacute;': 'ó',
    '&uacute;': 'ú',
  };
  return text.replace(/&quot;|&#039;|&amp;|&lt;|&gt;|&eacute;|&iacute;|&oacute;|&uacute;/g, (match) => entities[match] || match);
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Categories that typically have many hard questions
const FALLBACK_CATEGORIES = [9, 10, 11, 18, 21, 22, 23, 24, 25, 26, 27, 28];

// Static fallback questions (hard) – you can expand this list
const STATIC_FALLBACK = [
  {
    questionText: "What is the capital of Finland?",
    options: [
      { text: "Helsinki", isCorrect: true },
      { text: "Stockholm", isCorrect: false },
      { text: "Oslo", isCorrect: false },
      { text: "Copenhagen", isCorrect: false },
    ],
    explanation: "Helsinki is the capital of Finland."
  },
  {
    questionText: "Which element has the chemical symbol 'W'?",
    options: [
      { text: "Tungsten", isCorrect: true },
      { text: "Wolfram", isCorrect: false },
      { text: "Wolfsbane", isCorrect: false },
      { text: "Wagner", isCorrect: false },
    ],
    explanation: "Tungsten is also known as Wolfram, symbol W."
  },
  // Add at least 50 static hard questions or generate them
  // (For now, we'll generate dummy ones if needed)
];

const generateTriviaQuiz = async (difficulty, count = 50) => {
  console.log(`📚 Generating ${count} ${difficulty} trivia questions for "Other"...`);

  const allQuestions = [];
  const batchSize = 20; // safe batch size
  let needed = count;

  // Shuffle categories to avoid hitting the same one repeatedly
  const categories = [...FALLBACK_CATEGORIES].sort(() => Math.random() - 0.5);

  for (const category of categories) {
    if (needed <= 0) break;

    try {
      const params = {
        amount: Math.min(batchSize, needed),
        difficulty: difficulty,
        type: 'multiple',
        category: category,
      };

      console.log(`   Fetching ${params.amount} from category ${category}...`);
      const response = await axios.get('https://opentdb.com/api.php', {
        params,
        timeout: 15000,
      });

      if (response.data.response_code === 0 && response.data.results?.length > 0) {
        const fetched = response.data.results.length;
        console.log(`   ✅ Got ${fetched} questions`);

        const formatted = response.data.results.map((q) => {
          const correctAnswer = decodeHTMLEntities(q.correct_answer);
          const options = [
            { text: correctAnswer, isCorrect: true },
            ...q.incorrect_answers.map((ans) => ({
              text: decodeHTMLEntities(ans),
              isCorrect: false,
            })),
          ];
          // Shuffle options
          for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
          }
          return {
            questionText: decodeHTMLEntities(q.question),
            options,
            explanation: `The correct answer is: ${correctAnswer}`,
          };
        });

        allQuestions.push(...formatted);
        needed -= fetched;
      } else {
        console.log(`   ⚠️ No results from category ${category}`);
      }
    } catch (error) {
      const isRateLimit = error.response?.status === 429 || error.code === 'ECONNABORTED';
      if (isRateLimit) {
        console.warn(`   ⚠️ Rate limit hit. Waiting 5.5s...`);
        await wait(5500);
      } else {
        console.warn(`   ❌ Error fetching category ${category}: ${error.message}`);
      }
    }

    // Wait 5.5 seconds between each request (OpenTDB requires 5s)
    await wait(5500);
  }

  // If we still don't have enough, fill with static fallback
  if (allQuestions.length < count) {
    console.warn(`⚠️ Only got ${allQuestions.length} questions, filling with fallback...`);
    const fallbackNeeded = count - allQuestions.length;
    // Take from STATIC_FALLBACK (cycle if needed)
    const fallbackPool = STATIC_FALLBACK.length > 0 ? STATIC_FALLBACK : generateDummyQuestions(count);
    for (let i = 0; i < fallbackNeeded; i++) {
      const idx = i % fallbackPool.length;
      allQuestions.push(fallbackPool[idx]);
    }
  }

  // Shuffle final list and return exactly `count`
  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Helper to generate dummy questions if no static ones exist
function generateDummyQuestions(n) {
  const questions = [];
  for (let i = 0; i < n; i++) {
    questions.push({
      questionText: `Fallback hard question ${i+1}`,
      options: [
        { text: 'Option A', isCorrect: false },
        { text: 'Option B', isCorrect: false },
        { text: 'Option C', isCorrect: true },
        { text: 'Option D', isCorrect: false },
      ],
      explanation: 'This is a fallback question.',
    });
  }
  return questions;
}

module.exports = { generateTriviaQuiz };