const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Quiz = require("../models/Quiz");
const { generateOpenRouterQuiz } = require("../services/openrouterService");
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

  const normalizedSubject = subjectMap[subject.toLowerCase()];
  if (!normalizedSubject) {
    throw new ApiError(400, `Invalid subject: "${subject}"`);
  }

  if (!subject || !difficulty || !questionCount) {
    throw new ApiError(400, "Subject, difficulty and question count are required.");
  }

  const allowedDifficulties = ["easy", "medium", "hard"];
  if (!allowedDifficulties.includes(difficulty.toLowerCase())) {
    throw new ApiError(400, "Invalid difficulty selected.");
  }

  const questionCountNum = Number(questionCount);
  let timeLimitSeconds;
  switch (questionCountNum) {
    case 20: timeLimitSeconds = 20 * 60; break;
    case 30: timeLimitSeconds = 45 * 60; break;
    case 50: timeLimitSeconds = 60 * 60; break;
    default: throw new ApiError(400, "Question count must be 20, 30 or 50.");
  }

  const CACHE_DAYS = 7;
  const CACHE_AGO = new Date(Date.now() - CACHE_DAYS * 24 * 60 * 60 * 1000);
  
  const existingQuiz = await Quiz.findOne({
    subject: normalizedSubject,
    difficulty: difficulty.toLowerCase(),
    questionCount: questionCountNum,
    createdAt: { $gte: CACHE_AGO }
  });

  if (existingQuiz) {
    console.log(`✅ Serving cached quiz: ${normalizedSubject} - ${difficulty} (${questionCountNum} questions)`);
    
    const sanitized = existingQuiz.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      points: q.points || 1,
      explanation: q.explanation || "No explanation provided.",
      options: q.options.map(o => ({ _id: o._id, text: o.text }))
    }));
    
    return res.status(200).json({
      success: true,
      message: "Cached quiz retrieved.",
      data: {
        quizId: existingQuiz._id,
        title: existingQuiz.title,
        subject: existingQuiz.subject,
        difficulty: existingQuiz.difficulty,
        questionCount: existingQuiz.questionCount,
        timeLimitSeconds: existingQuiz.timeLimitSeconds,
        questions: sanitized
      }
    });
  }

  // No cache – generate new quiz
  let questions;
  let generatedBy;

  try {
    if (AI_SUBJECTS.includes(normalizedSubject)) {
      console.log(`📚 Generating ${difficulty} ${normalizedSubject} quiz with OpenRouter...`);
      questions = await generateOpenRouterQuiz(normalizedSubject, difficulty, questionCountNum);
      generatedBy = "openrouter";
    } else if (TRIVIA_SUBJECTS.includes(normalizedSubject)) {
      console.log(`📚 Generating ${difficulty} general trivia quiz with Open Trivia DB...`);
      questions = await generateTriviaQuiz(difficulty, questionCountNum);
      generatedBy = "opentdb";
    } else {
      throw new ApiError(400, `No service available for subject: "${normalizedSubject}"`);
    }
  } catch (error) {
    if (error.statusCode) throw error;
    console.error('Quiz generation failed:', error.message);
    throw new ApiError(500, `Failed to generate quiz: ${error.message}`);
  }

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    console.error('❌ Generated questions invalid:', questions);
    throw new ApiError(500, 'No valid questions were generated. Please try again.');
  }

  const validQuestions = questions.map(q => ({
    questionText: q.questionText || 'Question text missing',
    options: (q.options || []).map(o => ({
      text: o.text || 'Option missing',
      isCorrect: !!o.isCorrect,
    })),
    explanation: q.explanation || 'No explanation provided.',
    points: q.points || 1,
  }));

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

  console.log(`💾 New quiz cached: ${normalizedSubject} - ${difficulty} (${questionCountNum} questions)`);

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