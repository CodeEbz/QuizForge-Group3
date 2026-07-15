const OpenAI = require('openai');
const { parse } = require('best-effort-json-parser');

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Normalize text ---
function normalizeText(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

// --- Syllabus for HTML (full topic list) ---
const SYLLABUS = {
  html: [
    "semantic HTML tags",
    "forms and input types",
    "tables",
    "lists (ordered, unordered, definition)",
    "links and anchors",
    "media (audio, video, img)",
    "iframe",
    "meta tags",
    "document structure (head, body, header, footer)",
    "accessibility (ARIA roles)",
    "HTML5 APIs (drag and drop, geolocation, storage)",
    "data attributes",
    "HTML entities and symbols",
    "doctype and validation",
    "canvas",
    "SVG",
    "web workers",
    "history API",
    "server-sent events",
    "contenteditable"
  ]
  // Add other subjects as needed
};

function getSyllabus(subject) {
  const key = subject.toLowerCase();
  return SYLLABUS[key] || null;
}

// --- Build prompt with explicit topics ---
function buildPrompt(subject, difficulty, count) {
  const syllabus = getSyllabus(subject);
  let topicInstruction = '';
  if (syllabus) {
    // Pick `count` unique topics from syllabus
    const shuffled = [...syllabus].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    topicInstruction = `Cover these specific subtopics, one question per topic: ${selected.join(', ')}.`;
  } else {
    topicInstruction = `Generate questions covering distinct subtopics within ${subject}.`;
  }

  return `Generate ${count} multiple‑choice questions about ${subject} at ${difficulty} difficulty.

${topicInstruction}

**CRITICAL:**
- Each question must be on a DIFFERENT subtopic from the list above.
- **DO NOT repeat any question or subtopic.**
- The correct answer must be factually accurate.
- Incorrect options must be plausible but clearly wrong.
- All options must be complete sentences.
- Provide a short explanation for each correct answer.

Return ONLY valid JSON with structure:
{
  "questions": [
    {
      "questionText": "...",
      "options": [
        {"text": "...", "isCorrect": false},
        {"text": "...", "isCorrect": false},
        {"text": "...", "isCorrect": true},
        {"text": "...", "isCorrect": false}
      ],
      "explanation": "..."
    }
  ]
}`;
}

// --- Extract JSON ---
function extractJSON(text) {
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];
  return text;
}

// --- Generate in one request ---
const generateOpenRouterQuiz = async (subject, difficulty, targetCount) => {
  console.log(`📚 Generating ${difficulty} ${subject} quiz (target: ${targetCount})...`);

  const prompt = buildPrompt(subject, difficulty, targetCount);
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const completion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'meta-llama/llama-3.3-70b-instruct', // Good at following instructions
        temperature: 0.5,
        max_tokens: 4096,
      });

      const rawContent = completion.choices[0].message.content;
      const jsonStr = extractJSON(rawContent);
      let parsed;
      try {
        parsed = parse(jsonStr);
      } catch (e) {
        const cleaned = jsonStr.replace(/'/g, '"').replace(/,(\s*[}\]])/g, '$1');
        parsed = JSON.parse(cleaned);
      }

      if (!parsed || !parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid JSON format');
      }

      // Validate each question
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

      // Deduplicate (just in case)
      const unique = [];
      const seen = new Set();
      for (const q of valid) {
        const norm = normalizeText(q.questionText);
        if (seen.has(norm)) continue;
        seen.add(norm);
        unique.push(q);
      }

      // If we have enough, return
      if (unique.length >= targetCount) {
        console.log(`✅ Generated ${unique.length} unique questions`);
        return unique.slice(0, targetCount);
      }

      // If not enough, we'll retry
      console.warn(`⚠️ Only ${unique.length}/${targetCount} unique. Retrying...`);
    } catch (error) {
      if (error.status === 429 && attempts < maxAttempts) {
        const waitTime = 3000 * attempts;
        console.warn(`⏳ Rate limit, waiting ${waitTime/1000}s... (attempt ${attempts}/${maxAttempts})`);
        await wait(waitTime);
        continue;
      }
      throw error;
    }
  }

  // If all attempts fail, return what we have
  console.warn('⚠️ Max attempts reached. Returning partial results.');
  return [];
};

module.exports = { generateOpenRouterQuiz };