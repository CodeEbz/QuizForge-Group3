const axios = require('axios');

const decodeHTMLEntities = (text) => {
  // Keep your existing decoder, or better: use `he` library
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

const generateTriviaQuiz = async (difficulty, count) => {
  try {
    const response = await axios.get('https://opentdb.com/api.php', {
      params: {
        amount: count,
        // category: 18,   // Comment out to get questions from any category
        difficulty: difficulty,
        type: 'multiple',
      },
    });

    if (response.data.response_code !== 0) {
      throw new Error('Failed to fetch trivia questions');
    }

    return response.data.results.map((q) => {
      // Build options with unique _id
      const correctAnswer = decodeHTMLEntities(q.correct_answer);
      const incorrectAnswers = q.incorrect_answers.map((ans, idx) => ({
        _id: `inc-${idx}`,              // ✅ unique ID for each incorrect option
        text: decodeHTMLEntities(ans),
        isCorrect: false,
      }));

      const options = [
        {
          _id: 'correct',               // ✅ unique ID for correct option
          text: correctAnswer,
          isCorrect: true,
        },
        ...incorrectAnswers,
      ];

      // Shuffle options so correct answer isn't always first
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }

      return {
        questionText: decodeHTMLEntities(q.question),
        options: options,
        explanation: `The correct answer is: ${correctAnswer}`,
      };
    });
  } catch (error) {
    console.error('Trivia API Error:', error);
    throw new Error('Failed to fetch trivia questions');
  }
};

module.exports = { generateTriviaQuiz };