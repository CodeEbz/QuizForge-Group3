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

const generateTriviaQuiz = async (difficulty, count, retries = 5) => {
  console.log(`📚 Fetching ${count} ${difficulty} trivia questions...`);

  const categories = [18, null];
  let lastError = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    for (const category of categories) {
      try {
        const params = {
          amount: count,
          difficulty: difficulty,
          type: 'multiple',
        };
        if (category !== null) params.category = category;

        console.log(`   Attempt ${attempt}: trying category ${category || 'any'}...`);
        const response = await axios.get('https://opentdb.com/api.php', {
          params,
          timeout: 15000,
        });

        if (response.data.response_code === 0 && response.data.results?.length > 0) {
          console.log(`✅ Found ${response.data.results.length} questions!`);
          return response.data.results.map((q) => {
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
        }
      } catch (error) {
        const isRateLimit = error.response?.status === 429 || error.code === 'ECONNABORTED';
        if (isRateLimit) {
          console.warn(`   ⚠️ Rate limit hit (attempt ${attempt}). Waiting longer...`);
          const delay = Math.pow(2, attempt) * 1000;
          await wait(delay);
          continue;
        }
        console.warn(`   Category ${category || 'any'} failed: ${error.message}`);
        lastError = error;
      }
    }

    if (attempt < retries) {
      const delay = Math.pow(2, attempt) * 2000;
      console.log(`⏳ Waiting ${delay/1000}s before next attempt...`);
      await wait(delay);
    }
  }

  throw new Error(`Failed to fetch trivia questions after ${retries} attempts. Last error: ${lastError?.message || 'Unknown'}`);
};

module.exports = { generateTriviaQuiz };