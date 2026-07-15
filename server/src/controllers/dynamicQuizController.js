const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Quiz = require("../models/Quiz");
const { generateGroqQuiz } = require("../services/groqService");
const { generateTriviaQuiz } = require("../services/triviaService");

// Subjects that use Groq API (AI-generated) - all in lowercase for comparison
const AI_SUBJECTS = [
  "javascript", "react", "html", "css", "mongodb", 
  "node.js", "express", "python", "java", "c++", 
  "c#", "sql", "data structures", "algorithms"
];

// Subjects that use Open Trivia DB
const TRIVIA_SUBJECTS = ["other"];

// Map for converting frontend subjects to schema format (exact match)
const SUBJECT_MAP = {
  "javascript": "JavaScript",
  "react": "React",
  "html": "HTML",
  "css": "CSS",
  "mongodb": "MongoDB",
  "node.js": "Node.js",
  "express": "Express",
  "python": "Python",
  "java": "Java",
  "c++": "C++",
  "c#": "C#",
  "sql": "SQL",
  "data structures": "Data Structures",
  "algorithms": "Algorithms",
  "other": "Other"
};

const generateDynamicQuiz = asyncHandler(async (req, res) => {
  const { subject, difficulty, questionCount } = req.body;

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

  // Normalize subject: convert frontend format (e.g., "javascript") to schema format ("JavaScript")
  const subjectLower = subject.toLowerCase();
  const normalizedSubject = SUBJECT_MAP[subjectLower] || subject; // Fallback to original if not found

  console.log(`📚 Subject received: "${subject}", normalized to: "${normalizedSubject}"`);

  // Determine which service to use
  let questions;
  let generatedBy;

  try {
    if (AI_SUBJECTS.includes(subjectLower)) {
      // Use Groq for programming subjects
      console.log(`📚 Generating ${difficulty} ${normalizedSubject} quiz with Groq...`);
      questions = await generateGroqQuiz(normalizedSubject, difficulty, questionCountNum);
      generatedBy = "groq";
    } else if (TRIVIA_SUBJECTS.includes(subjectLower)) {
      // Use Open Trivia DB for "Other"
      console.log(`📚 Generating ${difficulty} general trivia quiz with Open Trivia DB...`);
      questions = await generateTriviaQuiz(difficulty, questionCountNum);
      generatedBy = "opentdb";
    } else {
      // Fallback: try Groq anyway
      console.warn(`⚠️ Unknown subject "${subject}", using Groq as fallback.`);
      questions = await generateGroqQuiz(normalizedSubject, difficulty, questionCountNum);
      generatedBy = "groq";
    }
  } catch (error) {
    // Check if error is from the service (not our ApiError)
    if (error.statusCode) {
      throw error; // Already an ApiError
    }
    
    console.error('Quiz generation failed:', error.message);
    throw new ApiError(500, `Failed to generate quiz: ${error.message}`);
  }

  // Save quiz to MongoDB with normalized subject (exact match to schema)
  const quiz = await Quiz.create({
    title: `${normalizedSubject} Quiz`,
    subject: normalizedSubject, // ✅ Now matches schema enum exactly
    difficulty: difficulty.toLowerCase(),
    questionCount: questionCountNum,
    generatedBy: generatedBy, // ✅ "groq" or "opentdb"
    questions,
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