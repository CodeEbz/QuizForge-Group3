const Groq = require('groq-sdk');
const { parse } = require('best-effort-json-parser');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Validate and clean a question ---
const validateQuestion = (q) => {
  // Check if question has text
  if (!q.questionText || q.questionText.trim() === '') {
    return null;
  }

  // Check options
  if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
    return null;
  }

  // Clean and validate each option
  const validOptions = q.options
    .map(opt => ({
      text: opt.text || 'Option missing',
      isCorrect: !!opt.isCorrect,
    }))
    // Ensure at least one option is marked correct
    .map((opt, index, arr) => {
      // If no option is correct, make the first one correct
      if (!arr.some(o => o.isCorrect)) {
        if (index === 0) return { ...opt, isCorrect: true };
      }
      return opt;
    });

  // Check if any option is correct after fixing
  if (!validOptions.some(o => o.isCorrect)) {
    validOptions[0].isCorrect = true;
  }

  return {
    questionText: q.questionText.trim(),
    options: validOptions,
    explanation: q.explanation || 'No explanation provided.',
  };
};

const generateQuiz = async (subject, difficulty, count, retries = 3) => {
  const prompt = `Generate ${count} multiple-choice questions about ${subject} programming at ${difficulty} difficulty level.

  IMPORTANT: Return ONLY valid JSON. No markdown, no explanation, no extra text.

  The JSON must have this exact structure:
  {
    "questions": [
      {
        "questionText": "What is the output of console.log(typeof [])?",
        "options": [
          { "text": "array", "isCorrect": false },
          { "text": "object", "isCorrect": true },
          { "text": "undefined", "isCorrect": false },
          { "text": "null", "isCorrect": false }
        ],
        "explanation": "In JavaScript, arrays are objects, so typeof [] returns 'object'."
      }
    ]
  }

  Make sure exactly ${count} questions are generated. Each question must have 4 options with exactly 1 correct answer.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      max_tokens: 2048,
    });

    const content = completion.choices[0].message.content;
    const parsed = parse(content);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response structure');
    }

    const validQuestions = parsed.questions
      .map(validateQuestion)
      .filter(q => q !== null);

    // ✅ If we have enough, return them
    if (validQuestions.length >= count) {
      return validQuestions.slice(0, count);
    }

    // ✅ If we need more, generate them recursively
    if (validQuestions.length > 0 && retries > 0) {
      console.log(`📚 Need ${count - validQuestions.length} more questions, generating extras...`);
      const extra = await generateQuiz(subject, difficulty, count - validQuestions.length, retries - 1);
      validQuestions.push(...extra);
    }

    if (validQuestions.length === 0) {
      throw new Error('No valid questions generated');
    }

    if (validQuestions.length < count) {
      console.warn(`⚠️ Only ${validQuestions.length}/${count} valid questions generated`);
    }

    return validQuestions.slice(0, count);
  } catch (error) {
    if (error.status === 429 && retries > 0) {
      console.warn(`⚠️ Rate limit hit, waiting 5s... (${retries} retries left)`);
      await wait(5000);
      return generateQuiz(subject, difficulty, count, retries - 1);
    }
    throw error;
  }
};

// --- Main function ---
const generateGroqQuiz = async (subject, difficulty, count) => {
  console.log(`📚 Generating ${difficulty} ${subject} quiz (${count} questions)...`);

  if (count <= 20) {
    return await generateQuiz(subject, difficulty, count);
  }

  const CHUNK_SIZE = 8;
  const totalChunks = Math.ceil(count / CHUNK_SIZE);
  const allQuestions = [];

  for (let i = 0; i < totalChunks; i++) {
    const chunkCount = Math.min(CHUNK_SIZE, count - (i * CHUNK_SIZE));
    console.log(`📚 Chunk ${i+1}/${totalChunks} (${chunkCount} questions)...`);

    try {
      const chunk = await generateQuiz(subject, difficulty, chunkCount);
      allQuestions.push(...chunk);
      console.log(`✅ Chunk ${i+1} completed (${chunk.length} questions)`);
    } catch (err) {
      console.error(`❌ Chunk ${i+1} failed:`, err.message);
      if (allQuestions.length === 0) throw err;
    }

    if (i < totalChunks - 1) {
      console.log(`⏳ Waiting 2.5s...`);
      await wait(2500);
    }
  }

  if (allQuestions.length === 0) {
    throw new Error('Failed to generate any questions.');
  }

  console.log(`✅ Generated ${allQuestions.length} questions`);
  return allQuestions.slice(0, count);
};

module.exports = { generateGroqQuiz };