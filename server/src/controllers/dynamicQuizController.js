const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// Helper to decode HTML entities returned by Open Trivia API
function decodeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-')
    .replace(/&#39;/g, "'")
    .replace(/&deg;/g, '°')
    .replace(/&eacute;/g, 'é')
    .replace(/&aacute;/g, 'á')
    .replace(/&oacute;/g, 'ó');
}

// Simple array shuffle helper
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Predefined quiz question bank for high-quality fallback generation
const fallbackQuestionBank = {
  javascript: [
    { q: "Which keyword declares a block-scoped variable that cannot be reassigned?", opts: ["const", "let", "var", "static"], correct: 0 },
    { q: "What does the event loop monitor in JavaScript?", opts: ["Call stack and callback queue", "Memory heap and DOM trees", "Network sockets and file streams", "CSS animations and scroll offsets"], correct: 0 },
    { q: "Which value is returned by typeof NaN?", opts: ["'number'", "'NaN'", "'undefined'", "'object'"], correct: 0 },
    { q: "What is the primary benefit of closures in JavaScript?", opts: ["They allow inner functions to access outer scope variables even after outer execution ends", "They automatically release object memory reference pointers", "They compile asynchronous callbacks directly to machine code", "They restrict global scripts from calling window properties"], correct: 0 },
    { q: "How can you prevent any property additions, deletions, or edits on a JavaScript object?", opts: ["Object.freeze(obj)", "Object.seal(obj)", "Object.preventExtensions(obj)", "Object.lock(obj)"], correct: 0 },
    { q: "What is a WeakMap in JavaScript?", opts: ["A Map where keys must be objects and are held weakly", "A Map that allows duplicate keys", "A Map that operates on linear search iterations", "A deprecated object structure kept for backward compatibility"], correct: 0 },
    { q: "Which array method returns the first element that satisfies a testing function?", opts: ["find()", "filter()", "map()", "some()"], correct: 0 },
    { q: "What does the '===' operator check?", opts: ["Both value and type equality", "Value equality only", "Reference pointer addresses only", "Variable declaration syntax rules"], correct: 0 },
    { q: "Which ES6 API is designed to perform interceptable operations on standard object tasks?", opts: ["Reflect", "Proxy", "Symbol", "Promise"], correct: 0 },
    { q: "What is the default value of an uninitialized variable in JavaScript?", opts: ["undefined", "null", "NaN", "false"], correct: 0 }
  ],
  react: [
    { q: "Which React hook is used to manage component state?", opts: ["useState", "useEffect", "useContext", "useRef"], correct: 0 },
    { q: "How do you pass data down from parent to child components?", opts: ["Props", "State", "Context", "Hooks"], correct: 0 },
    { q: "What is the virtual DOM in React?", opts: ["A lightweight in-memory representation of the real DOM", "A separate stylesheet syntax for canvas layouts", "A separate stylesheet syntax for canvas layouts", "An encryption layer for secure component updates"], correct: 0 },
    { q: "Why is the 'key' prop crucial in dynamic component lists?", opts: ["It helps React identify changed, added, or removed items for optimized DOM rendering", "It assigns static style rules in document sheets", "It encrypts list values for database indexing", "It adds automatic event triggers to list nodes"], correct: 0 },
    { q: "Which hook executes side-effects in functional components?", opts: ["useEffect", "useState", "useMemo", "useCallback"], correct: 0 },
    { q: "What is the purpose of React.memo?", opts: ["It memoizes functional components to prevent unnecessary re-renders when props don't change", "It records user activity logs on the dashboard", "It caches API headers for network performance", "It replaces the default Redux store"], correct: 0 }
  ],
  general: [
    { q: "What is the main purpose of an operating system?", opts: ["Manage computer hardware resources and software applications", "Design vector images and shapes", "Host web databases and servers", "Translate human speech to compiled bytecode"], correct: 0 },
    { q: "Which protocol is used to secure traffic over the World Wide Web?", opts: ["HTTPS", "HTTP", "FTP", "SMTP"], correct: 0 },
    { q: "What is the runtime complexity of binary search on a sorted array?", opts: ["O(log n)", "O(n)", "O(n log n)", "O(1)"], correct: 0 },
    { q: "Which component inside a computer executes instruction calculations?", opts: ["CPU", "RAM", "SSD", "GPU"], correct: 0 },
    { q: "Which database type uses tables with defined rows and columns?", opts: ["Relational (SQL)", "Document (NoSQL)", "Graph", "Key-Value"], correct: 0 }
  ]
};

// Fallback dynamic generator in case OpenAI key fails or is missing
function generateLocalFallbackQuiz(category, difficulty, count) {
  const catKey = fallbackQuestionBank[category.toLowerCase()] ? category.toLowerCase() : "general";
  const sourceBank = fallbackQuestionBank[catKey];
  
  const questions = [];
  for (let i = 0; i < count; i++) {
    // Select questions circularly if requested count exceeds bank size
    const templates = sourceBank[i % sourceBank.length];
    
    // Add variations to make questions look dynamic
    const variationText = i >= sourceBank.length ? ` (Scenario B - Q${i + 1})` : "";
    
    const formattedOptions = templates.opts.map((opt, idx) => ({
      text: opt,
      isCorrect: idx === templates.correct
    }));

    questions.push({
      questionText: templates.q + variationText,
      options: shuffleArray(formattedOptions),
      points: 1
    });
  }

  return {
    title: `Dynamic ${category.toUpperCase()} Quiz (${difficulty.toUpperCase()})`,
    description: `A dynamically generated fallback quiz covering ${category}.`,
    category: category.toLowerCase(),
    difficulty: difficulty.toLowerCase(),
    questions,
    timeLimitSeconds: count * 60,
    isPublished: true
  };
}

/**
 * @route   POST /api/quizzes/generate
 * @desc    Generate a quiz dynamically using OpenAI or Open Trivia API.
 *          Persists the quiz document and returns a playable representation.
 * @access  Public (Optional auth; falls back to admin creator if unauthenticated)
 */
const generateQuiz = asyncHandler(async (req, res) => {
  const { category, difficulty, triviaCategoryId } = req.body;

  if (!category || !difficulty) {
    throw new ApiError(400, 'Category and difficulty are required');
  }

  // Determine question count based on difficulty
  let count = 20;
  if (difficulty.toLowerCase() === 'medium') count = 30;
  if (difficulty.toLowerCase() === 'hard') count = 50;

  let quizData = null;
  let generatorUsed = '';

  // 1. Check if we should use Open Trivia API (either category is "other" or triviaCategoryId is provided)
  const isTrivia = category.toLowerCase() === 'other' || triviaCategoryId;

  if (isTrivia) {
    const triviaId = triviaCategoryId || 9; // Default to General Knowledge (9) if none provided
    try {
      generatorUsed = 'Open Trivia API';
      const triviaUrl = `https://opentdb.com/api.php?amount=${count}&category=${triviaId}&difficulty=${difficulty.toLowerCase()}&type=multiple`;
      
      const response = await fetch(triviaUrl);
      const data = await response.json();

      if (data.response_code === 0 && data.results && data.results.length > 0) {
        const questions = data.results.map((item) => {
          const correctOpt = { text: decodeHTML(item.correct_answer), isCorrect: true };
          const incorrectOpts = item.incorrect_answers.map((ans) => ({
            text: decodeHTML(ans),
            isCorrect: false
          }));

          const options = shuffleArray([correctOpt, ...incorrectOpts]);

          return {
            questionText: decodeHTML(item.question),
            options,
            points: 1
          };
        });

        const categoryName = data.results[0].category || 'Trivia';

        quizData = {
          title: `Trivia: ${categoryName} (${difficulty.toUpperCase()})`,
          description: `Dynamic trivia quiz fetched from the Open Trivia Database.`,
          category: 'other',
          difficulty: difficulty.toLowerCase(),
          questions,
          timeLimitSeconds: count * 60,
          isPublished: true
        };
      } else {
        console.warn(`Open Trivia API returned code ${data.response_code}. Falling back to local generation.`);
      }
    } catch (err) {
      console.error('Failed to fetch from Open Trivia API:', err);
    }
  }

  // 2. OpenAI Generation (For standard programming topics or custom topics)
  if (!quizData && process.env.OPENAI_API_KEY) {
    try {
      generatorUsed = 'OpenAI API';
      const prompt = `Generate a high-quality quiz with exactly ${count} multiple-choice questions on the topic "${category}" with a difficulty level of "${difficulty.toLowerCase()}".
Each question must have exactly 4 options, and exactly one option must be marked as correct.
Provide the response as a single valid JSON object matching the following structure:
{
  "title": "Quiz Title",
  "description": "Short quiz description",
  "questions": [
    {
      "questionText": "Question text here?",
      "options": [
        { "text": "Option A text", "isCorrect": false },
        { "text": "Option B text", "isCorrect": true },
        { "text": "Option C text", "isCorrect": false },
        { "text": "Option D text", "isCorrect": false }
      ]
    }
  ]
}
Do not wrap your output in markdown code blocks like \`\`\`json. Return only the raw JSON.`;

      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a professional quiz generator that outputs only raw JSON matching the requested structure.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (aiResponse.ok) {
        const aiResult = await aiResponse.json();
        const generated = JSON.parse(aiResult.choices[0].message.content.trim());
        
        if (generated && generated.questions && generated.questions.length > 0) {
          const questions = generated.questions.map((q) => {
            return {
              questionText: q.questionText,
              options: q.options,
              points: 1
            };
          });

          quizData = {
            title: generated.title || `AI Generated: ${category} Quiz`,
            description: generated.description || `A dynamically generated AI quiz on ${category}.`,
            category: category.toLowerCase().replace(/\s+/g, '-'),
            difficulty: difficulty.toLowerCase(),
            questions,
            timeLimitSeconds: count * 60,
            isPublished: true
          };
        }
      } else {
        console.warn(`OpenAI API returned non-OK status: ${aiResponse.status}. Falling back to local generation.`);
      }
    } catch (err) {
      console.error('Failed to generate quiz with OpenAI API:', err);
    }
  }

  // 3. Fallback Generation if both APIs were skipped, failed, or key was missing
  if (!quizData) {
    generatorUsed = 'Local Dynamic Generator';
    quizData = generateLocalFallbackQuiz(category, difficulty, count);
  }

  // Create the quiz document in database
  let creatorId = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_quizforge_2026');
      creatorId = decoded.id;
    } catch (e) {
      console.warn('Optional auth token verification failed in generator:', e.message);
    }
  }

  if (!creatorId) {
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      creatorId = admin._id;
    } else {
      const user = await User.findOne();
      if (user) {
        creatorId = user._id;
      } else {
        creatorId = new mongoose.Types.ObjectId();
      }
    }
  }

  const quiz = await Quiz.create({
    ...quizData,
    createdBy: creatorId
  });

  // Return the playable version (stripped of isCorrect option values)
  const sanitizedQuestions = quiz.questions.map((q) => ({
    _id: q._id,
    questionText: q.questionText,
    points: q.points,
    options: q.options.map((o) => ({ _id: o._id, text: o.text })),
  }));

  res.status(201).json({
    success: true,
    message: 'Quiz generated dynamically successfully',
    generator: generatorUsed,
    data: {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      timeLimitSeconds: quiz.timeLimitSeconds,
      questions: sanitizedQuestions
    }
  });
});

module.exports = {
  generateQuiz
};
