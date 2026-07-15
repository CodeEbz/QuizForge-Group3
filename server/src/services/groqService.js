const Groq = require('groq-sdk');
const { parse } = require('best-effort-json-parser');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Normalize for dedup (exact and near-exact) ---
function normalizeText(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function isDuplicate(q1, q2) {
  const t1 = normalizeText(q1.questionText);
  const t2 = normalizeText(q2.questionText);
  if (t1 === t2) return true;
  const words1 = new Set(t1.split(' '));
  const words2 = new Set(t2.split(' '));
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const overlap = intersection.size / Math.min(words1.size, words2.size);
  return overlap >= 0.8;
}

// --- Syllabus (optional topic list) ---
const SYLLABUS = {
  javascript: [
    "closures", "prototypes", "async/await", "promises", "event loop",
    "ES6 features", "this binding", "DOM manipulation", "error handling",
    "functional programming", "modules", "class inheritance", "generators"
  ],
  react: [
    "component lifecycle", "useState", "useEffect", "useContext", "custom hooks",
    "context API", "Redux", "props and state", "conditional rendering",
    "lists and keys", "forms", "lifting state up", "composition vs inheritance"
  ],
  html: [
    "semantic HTML", "forms", "tables", "lists", "links", "media",
    "iframes", "meta tags", "accessibility", "HTML5 APIs", "data attributes",
    "entities", "doctype", "validation", "canvas", "SVG"
  ],
  css: [
    "selectors", "box model", "flexbox", "grid", "positioning", "z-index",
    "colors", "typography", "transitions", "animations", "media queries",
    "Sass/Less", "CSS variables", "transformations", "pseudo-elements",
    "specificity", "box-sizing", "overflow"
  ],
  // Add more subjects as needed
};

function getSyllabus(subject) {
  return SYLLABUS[subject.toLowerCase()] || null;
}

function buildPrompt(subject, difficulty, count, usedTopics = []) {
  const syllabus = getSyllabus(subject);
  let topicInstruction = '';
  if (syllabus) {
    const available = syllabus.filter(t => !usedTopics.includes(t));
    const selected = available.slice(0, count);
    if (selected.length > 0) {
      topicInstruction = `Cover the following subtopics: ${selected.join(', ')}. Use each topic exactly once.`;
    }
  }
  if (!topicInstruction) {
    topicInstruction = 'Ensure each question covers a distinct subtopic within the subject.';
  }

  return `Generate ${count} multiple-choice questions about ${subject} at ${difficulty} difficulty.

${topicInstruction}

**CRITICAL REQUIREMENTS:**
1. Each question must test a specific, factual concept.
2. The correct answer must be **precise and factually accurate**.
3. Incorrect options (distractors) must be **plausible but clearly wrong** – they should represent common misconceptions or nearby concepts, not vague statements.
4. All options must be **clear, complete sentences** (not just fragments).
5. The explanation must **clearly justify** why the correct answer is right.

Return ONLY valid JSON with structure:
{
  "questions": [
    {
      "questionText": "What is the primary role of the 'useState' hook in React?",
      "options": [
        {"text": "To manage state in functional components", "isCorrect": true},
        {"text": "To handle side effects in class components", "isCorrect": false},
        {"text": "To create global state across the app", "isCorrect": false},
        {"text": "To fetch data from an API", "isCorrect": false}
      ],
      "explanation": "useState is a React Hook that lets you add state to functional components."
    }
  ]
}`;
}

const generateGroqQuizChunk = async (subject, difficulty, count, usedTopics = [], retries = 3) => {
  const prompt = buildPrompt(subject, difficulty, count, usedTopics);
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.6,
      presence_penalty: 0.8,
      frequency_penalty: 0.6,
      max_tokens: 2048,
    });
    const content = completion.choices[0].message.content;
    const parsed = parse(content);
    if (!parsed.questions || !Array.isArray(parsed.questions)) throw new Error('Invalid response');

    const valid = parsed.questions.filter(q => {
      if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) return false;
      const allHaveText = q.options.every(o => o.text && o.text.trim().length > 0);
      const correctCount = q.options.filter(o => o.isCorrect === true).length;
      if (correctCount === 0) {
        q.options[0].isCorrect = true;
        return true;
      }
      return allHaveText && correctCount === 1;
    });

    valid.forEach(q => {
      if (!q.explanation || q.explanation.trim() === '') {
        const correctText = q.options.find(o => o.isCorrect)?.text || 'The correct answer.';
        q.explanation = `The correct answer is: ${correctText}`;
      }
    });

    return valid;
  } catch (error) {
    if (error.status === 429 && retries > 0) {
      console.warn(`⏳ Rate limit, retrying... (${retries} left)`);
      await wait(5000);
      return generateGroqQuizChunk(subject, difficulty, count, usedTopics, retries - 1);
    }
    throw error;
  }
};

// ✅ Main exported function – renamed to match the controller's import
const generateGroqQuiz = async (subject, difficulty, targetCount) => {
  console.log(`📚 Generating ${difficulty} ${subject} quiz (target: ${targetCount})...`);

  const oversample = Math.ceil(targetCount * 2.5);
  const CHUNK_SIZE = 8;
  const totalChunks = Math.ceil(oversample / CHUNK_SIZE);
  const allQuestions = [];
  const usedTopics = [];
  const seen = new Set();

  for (let i = 0; i < totalChunks; i++) {
    const chunkCount = Math.min(CHUNK_SIZE, oversample - i * CHUNK_SIZE);
    console.log(`📚 Chunk ${i+1}/${totalChunks} (${chunkCount})...`);
    try {
      const chunk = await generateGroqQuizChunk(subject, difficulty, chunkCount, usedTopics);
      const filtered = chunk.filter(q => {
        const norm = normalizeText(q.questionText);
        if (seen.has(norm)) return false;
        for (const existing of allQuestions) {
          if (isDuplicate(q, existing)) return false;
        }
        seen.add(norm);
        return true;
      });
      filtered.forEach(q => {
        const topic = q.questionText.split(' ').slice(0, 3).join(' ');
        usedTopics.push(topic);
      });
      allQuestions.push(...filtered);
      console.log(`✅ Chunk ${i+1} added ${filtered.length} new questions (total ${allQuestions.length})`);
    } catch (err) {
      console.error(`❌ Chunk ${i+1} failed:`, err.message);
    }
    if (i < totalChunks - 1) await wait(2500);
  }

  if (allQuestions.length >= targetCount) {
    console.log(`✅ Generated ${allQuestions.length} unique questions, returning ${targetCount}`);
    return allQuestions.slice(0, targetCount);
  }

  console.warn(`⚠️ Only ${allQuestions.length} unique questions. Padding with duplicates (no label).`);
  const result = [...allQuestions];
  let idx = 0;
  while (result.length < targetCount) {
    const q = allQuestions[idx % allQuestions.length];
    result.push({ ...q });
    idx++;
  }
  console.log(`📊 Final quiz size: ${result.length} questions (${allQuestions.length} unique, ${result.length - allQuestions.length} padded)`);
  return result;
};

module.exports = { generateGroqQuiz };