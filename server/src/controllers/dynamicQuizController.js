const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Quiz = require("../models/Quiz");
const { generateGroqQuiz } = require("../services/groqService");
const { generateTriviaQuiz } = require("../services/triviaService");

// Map URL slugs to proper enum values
const subjectMap = {
  "javascript": "JavaScript",
  "react": "React",
  "html": "HTML",
  "css": "CSS",
  "mongodb": "MongoDB",
  "node-js": "Node.js",
  "express": "Express",
  "python": "Python",
  "java": "Java",
  "c++": "C++",
  "c#": "C#",
  "sql": "SQL",
  "data-structures": "Data Structures",
  "algorithms": "Algorithms",
  "other": "Other"
};

const AI_SUBJECTS = [
  "JavaScript", "React", "HTML", "CSS", "MongoDB",
  "Node.js", "Express", "Python", "Java", "C++",
  "C#", "SQL", "Data Structures", "Algorithms"
];

const TRIVIA_SUBJECTS = ["Other"];

const generateDynamicQuiz = asyncHandler(async (req, res) => {
  const { subject, difficulty, questionCount } = req.body;

  // Normalize subject to proper enum value
  const normalizedSubject = subjectMap[subject.toLowerCase()];
  if (!normalizedSubject) {
    throw new ApiError(400, `Invalid subject: "${subject}"`);
  }

  // Validate required fields
  if (!subject || !difficulty || !questionCount) {
    throw new ApiError(400, "Subject, difficulty and question count are required.");
  }

  // Validate difficulty
  const allowedDifficulties = ["easy", "medium", "hard"];
  if (!allowedDifficulties.includes(difficulty.toLowerCase())) {
    throw new ApiError(400, "Invalid difficulty selected.");
  }

  // Validate question count and assign timer
  const questionCountNum = Number(questionCount);
  let timeLimitSeconds;
  switch (questionCountNum) {
    case 20:
      timeLimitSeconds = 20 * 60;
      break;
    case 30:
      timeLimitSeconds = 45 * 60;
      break;
    case 50:
      timeLimitSeconds = 60 * 60;
      break;
    default:
      throw new ApiError(400, "Question count must be 20, 30 or 50.");
  }

  // Determine which service to use
  let questions;
  let generatedBy;

  try {
    if (AI_SUBJECTS.includes(normalizedSubject)) {
      console.log(`📚 Generating ${difficulty} ${normalizedSubject} quiz with Groq...`);
      questions = await generateGroqQuiz(normalizedSubject, difficulty, questionCountNum);
      generatedBy = "groq";
    } else if (TRIVIA_SUBJECTS.includes(normalizedSubject)) {
      console.log(`📚 Generating ${difficulty} general trivia quiz with Open Trivia DB...`);
      questions = await generateTriviaQuiz(difficulty, questionCountNum);
      generatedBy = "opentdb";
    } else {
      throw new ApiError(400, `No service available for subject: "${normalizedSubject}"`);
    }
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error('Quiz generation failed:', error.message);
    throw new ApiError(500, `Failed to generate quiz: ${error.message}`);
  }

  // Validate questions
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    console.error('❌ Generated questions invalid:', questions);
    throw new ApiError(500, 'No valid questions were generated. Please try again.');
  }

  // Ensure each question has required fields
  const validQuestions = questions.map(q => ({
    questionText: q.questionText || 'Question text missing',
    options: (q.options || []).map(o => ({
      text: o.text || 'Option missing',
      isCorrect: !!o.isCorrect,
    })),
    explanation: q.explanation || 'No explanation provided.',
    points: q.points || 1,
  }));

  // Save quiz to MongoDB
  const quiz = await Quiz.create({
    title: `${normalizedSubject} Quiz`,
    subject: normalizedSubject,
    difficulty: difficulty.toLowerCase(),
    questionCount: questionCountNum,
    generatedBy: generatedBy,
    questions: validQuestions,
    timeLimitSeconds,
    createdBy: req.user._id,
  });

  // Remove correct answers before sending to frontend
  const sanitizedQuestions = quiz.questions.map((question) => ({
    _id: question._id,
    questionText: question.questionText,
    points: question.points || 1,
    explanation: question.explanation || "No explanation provided.",
    options: question.options.map((option) => ({
      _id: option._id,
      text: option.text,
    })),
  }));

  res.status(201).json({
    success: true,
    message: "Quiz generated successfully.",
    data: {
      quizId: quiz._id,
      title: quiz.title,
      subject: quiz.subject,
      difficulty: quiz.difficulty,
      questionCount: quiz.questionCount,
      timeLimitSeconds: quiz.timeLimitSeconds,
      questions: sanitizedQuestions,
    },
  });
});

module.exports = {
  generateDynamicQuiz,
};