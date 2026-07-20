const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Quiz = require("../models/Quiz");
const { generateGroqQuiz } = require("../services/groqService");
const { generateTriviaQuiz } = require("../services/triviaService");

// Map of user‑friendly subject keys to display names
const subjectMap = {
  "javascript": "JavaScript",
  "react": "React",
  "html": "HTML",
  "css": "CSS",
  "mongodb": "MongoDB",
  "node-js": "Node.js",
  nodejs: "Node.js",
  "expressjs": "Express",
  "python": "Python",
  "java": "Java",
  "c++": "C++",
  "c#": "C#",
  "c":"C#",
  "sql": "SQL",
  "data-structures": "Data Structures",
  "algorithms": "Algorithms",
  "other": "Other"
};

// Other quiz handled by Open Trivia DB API
const TRIVIA_SUBJECTS = ["Other"];

// ============================================================
//  POOL CONFIGURATION – per difficulty
// ============================================================
const getPoolTarget = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':   return 30;
    case 'medium': return 40;
    case 'hard':   return 60;
    default:       return 50;
  }
};

const POOL_GENERATE_EXTRA = 1.2;
const MAX_GENERATION_ATTEMPTS = 2;

// ============================================================
//  HELPER: Deduplication (exact match only)
// ============================================================
function normalizeText(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function deduplicateQuestions(questions) {
  const unique = [];
  const seen = new Set();
  for (const q of questions) {
    const norm = normalizeText(q.questionText);
    if (seen.has(norm)) continue;
    seen.add(norm);
    unique.push(q);
  }
  return unique;
}

// ============================================================
//  POOL MANAGEMENT
// ============================================================
const getOrCreatePool = async (subject, difficulty, userId) => {
  let pool = await Quiz.findOne({
    subject: subject,
    difficulty: difficulty.toLowerCase(),
    isPool: true,
  });

  if (!pool) {
    console.log(`🔄 No pool found for ${subject} - ${difficulty}. Generating new pool...`);

    const poolTarget = getPoolTarget(difficulty);
    const required = Math.ceil(poolTarget * POOL_GENERATE_EXTRA);

    let rawQuestions = [];
    let attempts = 0;

    while (attempts < MAX_GENERATION_ATTEMPTS && rawQuestions.length < required) {
      attempts++;
      const remaining = required - rawQuestions.length;
      console.log(`   Attempt ${attempts}: requesting ${remaining} questions...`);
      try {
        const batch = await generateGroqQuiz(subject, difficulty, remaining);
        if (batch && batch.length > 0) {
          rawQuestions = rawQuestions.concat(batch);
          console.log(`   ✅ Received ${batch.length} questions (total so far: ${rawQuestions.length})`);
        } else {
          console.warn(`   ⚠️ Received 0 questions on attempt ${attempts}`);
        }
      } catch (error) {
        console.error(`   ❌ Attempt ${attempts} failed:`, error.message);
        if (attempts >= MAX_GENERATION_ATTEMPTS) break;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (rawQuestions.length === 0) {
      throw new Error(`Failed to generate any questions for ${subject} - ${difficulty}.`);
    }

    const uniqueQuestions = deduplicateQuestions(rawQuestions);
    console.log(`   ✅ Generated ${rawQuestions.length} raw, ${uniqueQuestions.length} unique.`);

    if (uniqueQuestions.length < 15) {
      throw new Error(`Too few unique questions (${uniqueQuestions.length}) generated for pool.`);
    }

    const formatted = uniqueQuestions.map(q => ({
      questionText: q.questionText || 'Question text missing',
      options: (q.options || []).map(o => ({
        text: o.text || 'Option missing',
        isCorrect: !!o.isCorrect,
      })),
      explanation: q.explanation || 'No explanation provided.',
      points: q.points || 1,
    }));

    pool = await Quiz.create({
      title: `${subject} Quiz`,
      subject: subject,
      difficulty: difficulty.toLowerCase(),
      questionCount: formatted.length,
      generatedBy: 'pool',
      questions: formatted,
      timeLimitSeconds: 0,
      createdBy: userId,
      isPool: true,
    });

    console.log(`💾 Pool saved with ${formatted.length} questions.`);
  } else {
    console.log(`✅ Found existing pool with ${pool.questions.length} questions.`);
  }
  return pool;
};

// ============================================================
//  MAIN CONTROLLER
// ============================================================
const generateDynamicQuiz = asyncHandler(async (req, res) => {
  const { subject, difficulty, questionCount } = req.body;

  // Debug logging
  console.log(`📥 Received: subject=${subject}, difficulty=${difficulty}, questionCount=${questionCount} (type: ${typeof questionCount})`);
  console.log(`📥 Full body:`, JSON.stringify(req.body, null, 2));

  // Validate subject
  const normalizedSubject = subjectMap[subject.toLowerCase()];
  if (!normalizedSubject) {
    throw new ApiError(400, `Invalid subject: "${subject}"`);
  }

  // Validate required fields
  if (!subject || !difficulty) {
    throw new ApiError(400, "Subject and difficulty are required.");
  }

  // Validate difficulty
  const allowedDifficulties = ["easy", "medium", "hard"];
  if (!allowedDifficulties.includes(difficulty.toLowerCase())) {
    throw new ApiError(400, "Invalid difficulty selected.");
  }

  // ---- AGGRESSIVE QUESTION COUNT FALLBACK ----
  let questionCountNum;
  if (!questionCount || isNaN(parseInt(questionCount, 10))) {
    switch (difficulty.toLowerCase()) {
      case 'easy':   questionCountNum = 20; break;
      case 'medium': questionCountNum = 30; break;
      case 'hard':   questionCountNum = 50; break;
      default:       questionCountNum = 20; break;
    }
    console.warn(`⚠️ questionCount missing/invalid. Using fallback: ${questionCountNum}`);
  } else {
    questionCountNum = parseInt(questionCount, 10);
  }

  if (![20, 30, 50].includes(questionCountNum)) {
    console.error(`❌ Invalid questionCount: ${questionCountNum}`);
    throw new ApiError(400, `Question count must be 20, 30 or 50. Received: ${questionCountNum}`);
  }

  console.log(`✅ Validated questionCount: ${questionCountNum}`);

  let timeLimitSeconds;
  switch (questionCountNum) {
    case 20: timeLimitSeconds = 20 * 60; break;
    case 30: timeLimitSeconds = 45 * 60; break;
    case 50: timeLimitSeconds = 60 * 60; break;
    default: throw new ApiError(400, "Question count must be 20, 30 or 50.");
  }

  // ----------------------------------------------------------
  //  STEP 1: Handle "Other" (Trivia) – SAVE TO DATABASE
  // ----------------------------------------------------------
  if (TRIVIA_SUBJECTS.includes(normalizedSubject)) {
    console.log(`📚 Generating ${difficulty} trivia with Open Trivia DB...`);
    let questions;
    try {
      questions = await generateTriviaQuiz(difficulty, questionCountNum);
    } catch (error) {
      throw new ApiError(500, `Trivia generation failed: ${error.message}`);
    }
    if (!questions || questions.length === 0) {
      throw new ApiError(500, 'No trivia questions generated.');
    }

    // ✅ Format questions for database
    const formatted = questions.map((q, index) => ({
      questionText: q.questionText,
      options: q.options.map((o, i) => ({
        text: o.text,
        isCorrect: !!o.isCorrect,
      })),
      explanation: q.explanation || "No explanation provided.",
      points: q.points || 1,
    }));

    // ✅ Save trivia quiz to database (NOT as a pool)
    const quiz = await Quiz.create({
      title: `${normalizedSubject} Quiz`,
      subject: normalizedSubject,
      difficulty: difficulty.toLowerCase(),
      questionCount: formatted.length,
      generatedBy: 'opentdb',
      questions: formatted,
      timeLimitSeconds: timeLimitSeconds,
      createdBy: req.user._id,
      isPool: false, // Important: NOT a pool
    });

    console.log(`💾 Trivia quiz saved with ID: ${quiz._id}`);

    // ✅ Format for frontend (hide correct answers)
    const sanitizedQuestions = quiz.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      points: q.points || 1,
      explanation: q.explanation || "No explanation provided.",
      options: q.options.map((o) => ({
        _id: o._id,
        text: o.text,
      })),
      // ✅ Add correctOptionId for accurate grading
      correctOptionId: q.options.find(o => o.isCorrect)?._id || null,
    }));

    return res.status(200).json({
      success: true,
      message: "Trivia quiz generated.",
      data: {
        quizId: quiz._id, // ✅ Now a real ObjectId
        title: quiz.title,
        subject: quiz.subject,
        difficulty: quiz.difficulty,
        questionCount: quiz.questionCount,
        timeLimitSeconds: quiz.timeLimitSeconds,
        questions: sanitizedQuestions,
      },
    });
  }

  // ----------------------------------------------------------
  //  STEP 2: Get (or create) a pool for this subject & difficulty
  // ----------------------------------------------------------
  let pool = await getOrCreatePool(normalizedSubject, difficulty, req.user._id);

  // ----------------------------------------------------------
  //  STEP 3: Enforce that the pool has enough questions
  // ----------------------------------------------------------
  const needed = questionCountNum;

  if (pool.questions.length < needed) {
    console.warn(`⚠️ Pool too small (${pool.questions.length} < ${needed}). Deleting and regenerating.`);
    await Quiz.deleteOne({ _id: pool._id });
    pool = await getOrCreatePool(normalizedSubject, difficulty, req.user._id);

    if (pool.questions.length < needed) {
      throw new ApiError(
        500,
        `Unable to generate enough questions for ${normalizedSubject} (${difficulty}). Pool has ${pool.questions.length}, need ${needed}. Please try later.`
      );
    }
  }

  // ----------------------------------------------------------
  //  STEP 4: Randomly select EXACTLY `needed` questions
  // ----------------------------------------------------------
  const shuffled = [...pool.questions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, needed);

  if (selected.length !== needed) {
    console.error(`❌ Selected ${selected.length} questions, but expected ${needed}. Forcing fix.`);
    while (selected.length < needed) {
      const extra = pool.questions[Math.floor(Math.random() * pool.questions.length)];
      selected.push(extra);
    }
    if (selected.length > needed) {
      selected.length = needed;
    }
  }

  console.log(`✅ Selected ${selected.length} questions (requested ${needed})`);

  // ----------------------------------------------------------
  //  STEP 5: Format response (hide correct answers)
  // ----------------------------------------------------------
  const sanitizedQuestions = selected.map(q => {
    const correctOption = q.options.find(o => o.isCorrect);
    return {
      _id: q._id,
      questionText: q.questionText,
      points: q.points || 1,
      explanation: q.explanation || "No explanation provided.",
      options: q.options.map(o => ({ _id: o._id, text: o.text })),
      correctOptionId: correctOption ? correctOption._id : null,
    };
  });

  // ----------------------------------------------------------
  //  STEP 6: Return the quiz
  // ----------------------------------------------------------
  res.status(200).json({
    success: true,
    message: "Quiz generated from pool.",
    data: {
      quizId: pool._id,
      title: pool.title,
      subject: pool.subject,
      difficulty: pool.difficulty,
      questionCount: needed,
      timeLimitSeconds,
      questions: sanitizedQuestions,
    },
  });
});

module.exports = { generateDynamicQuiz };