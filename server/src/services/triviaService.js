const axios = require('axios');

const generateTriviaQuiz = async (difficulty, count) => {
  try {
    const response = await axios.get('https://opentdb.com/api.php', {
      params: {
        amount: count,
        category: 18,
        difficulty: difficulty,
        type: 'multiple',
      },
    });

    if (response.data.response_code !== 0) {
      throw new Error('Failed to fetch trivia questions');
    }

    return response.data.results.map((q) => ({
      questionText: decodeHTMLEntities(q.question),
      options: [
        { text: decodeHTMLEntities(q.correct_answer), isCorrect: true },
        ...q.incorrect_answers.map((ans) => ({
          text: decodeHTMLEntities(ans),
          isCorrect: false,
        })),
      ],
      explanation: `The correct answer is: ${decodeHTMLEntities(q.correct_answer)}`,
    }));
  } catch (error) {
    console.error('Trivia API Error:', error);
    throw error;
  }
};

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

module.exports = { generateTriviaQuiz };