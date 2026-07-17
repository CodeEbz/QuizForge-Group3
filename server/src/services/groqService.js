const Groq = require('groq-sdk');
const { parse } = require('best-effort-json-parser');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================
//  NORMALIZE & DEDUPLICATE (100% exact match)
// ============================================================
function normalizeText(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function deduplicateExact(questions) {
  const seen = new Set();
  const unique = [];
  for (const q of questions) {
    const norm = normalizeText(q.questionText);
    if (!seen.has(norm)) {
      seen.add(norm);
      unique.push(q);
    }
  }
  return unique;
}

// ============================================================
//  SYLLABUS (topic lists for variety)
// ============================================================
const SYLLABUS = {
  javascript: [
    "closures (lexical scoping, use cases)",
    "prototypes (inheritance, prototype chain)",
    "async/await (error handling, promises)",
    "promises (chaining, static methods)",
    "event loop (microtasks, macrotasks)",
    "ES6+ features (destructuring, spread, rest, template literals)",
    "this binding (call, apply, bind, arrow functions)",
    "DOM manipulation (selectors, events, traversal)",
    "error handling (try/catch, custom errors)",
    "functional programming (map, filter, reduce, immutability)",
    "modules (import/export, dynamic imports)",
    "class inheritance (super, extends, static methods)",
    "generators and iterators (yield, Symbol.iterator)",
    "symbols and well‑known symbols",
    "proxies and reflect (metaprogramming)",
    "memoization (caching, performance)",
    "currying and partial application",
    "debouncing and throttling",
    "event delegation (bubbling, capturing)",
    "localStorage and sessionStorage",
    "fetch API and HTTP requests",
    "JSON parsing and serialization",
    "regular expressions (pattern matching, flags)",
    "hoisting (var/let/const, function declarations)",
    "strict mode (changes, benefits)",
    "typeof vs instanceof",
    "null vs undefined (differences, comparisons)",
    "== vs === (coercion rules)"
  ],
  
  react: [
    "component lifecycle (mounting, updating, unmounting)",
    "useState hook (state management)",
    "useEffect hook (side effects, cleanup)",
    "useContext hook (context API)",
    "custom hooks (reusable logic)",
    "context API (Provider, Consumer, createContext)",
    "Redux (store, actions, reducers, middleware)",
    "props and state (differences, immutability)",
    "conditional rendering (if, ternary, &&)",
    "lists and keys (rendering, unique keys)",
    "controlled vs uncontrolled components",
    "forms and form handling (onChange, onSubmit)",
    "lifting state up (shared state)",
    "composition vs inheritance (component patterns)",
    "higher‑order components (HOCs)",
    "render props (sharing code)",
    "React Router (routes, links, hooks)",
    "memoization (useMemo, useCallback)",
    "refs and forwardRef (DOM references)",
    "portals (rendering outside parent)",
    "error boundaries (catching errors)",
    "suspense and lazy loading (code splitting)",
    "performance optimization (React.memo, PureComponent)",
    "React Fiber (reconciliation algorithm)",
    "virtual DOM (diffing, updates)",
    "keys reconciliation (efficient updates)",
    "useReducer hook (complex state)",
    "useRef vs createRef",
    "useImperativeHandle (exposing refs)"
  ],
  
  html: [
    "semantic HTML (header, nav, main, article, section, aside, footer)",
    "forms and input types (text, email, password, checkbox, radio, select)",
    "tables (thead, tbody, tfoot, caption, colspan, rowspan)",
    "lists (ordered, unordered, definition)",
    "links and anchors (href, target, bookmark)",
    "media (audio, video, img, figure, figcaption)",
    "iframes (embedding external content)",
    "meta tags (description, keywords, charset, viewport)",
    "document structure (doctype, head, body)",
    "accessibility (ARIA roles, labels, alt text)",
    "HTML5 APIs (drag and drop, geolocation, history, storage)",
    "data attributes (dataset)",
    "HTML entities and symbols ( &nbsp; &amp; &lt; &gt; )",
    "doctype and validation (DTD, HTML5)",
    "canvas (drawing, animations)",
    "SVG (scalable vector graphics)",
    "web workers (background scripts)",
    "history API (pushState, replaceState)",
    "server‑sent events (EventSource)",
    "contenteditable (in‑place editing)"
  ],
  
  css: [
    "selectors (class, ID, attribute, pseudo‑classes, pseudo‑elements)",
    "box model (margin, padding, border, content)",
    "flexbox (container and item properties)",
    "grid (container and item properties, template areas)",
    "positioning (static, relative, absolute, fixed, sticky)",
    "z‑index (stacking context)",
    "colors (hex, RGB, HSL, color names)",
    "typography (font, text styling, @font‑face)",
    "transitions and animations (keyframes, timing functions)",
    "media queries (responsive design, breakpoints)",
    "preprocessors (Sass, Less, syntax and features)",
    "CSS variables (custom properties, var())",
    "transformations (translate, scale, rotate, skew)",
    "pseudo‑elements (::before, ::after)",
    "specificity and cascade (calculation, !important)",
    "inline vs block vs inline‑block (display values)",
    "viewport units (vw, vh, vmin, vmax)",
    "rem vs em vs px (units)",
    "flex vs grid (comparison, use cases)",
    "CSS reset (normalize.css, reset.css)",
    "box‑sizing (content‑box vs border‑box)",
    "overflow (visible, hidden, scroll, auto)",
    "float and clear (legacy layouts)"
  ],
  
  mongodb: [
    "documents (structure, BSON types)",
    "collections (creation, options, capped collections)",
    "CRUD operations (insertOne, insertMany, find, updateOne, deleteOne)",
    "aggregation pipeline ($match, $group, $project, $sort)",
    "indexes (single field, compound, text, geospatial)",
    "schema validation (JSON Schema, validation rules)",
    "embedded documents vs references (data modeling)",
    "transactions (ACID, multi‑document)",
    "replica sets (high availability, failover, elections)",
    "sharding (horizontal scaling, shard keys, ranges)",
    "Mongoose ODM (schemas, models, hooks)",
    "pre/post hooks (middleware in Mongoose)",
    "population (referencing other collections)",
    "query operators ($eq, $gt, $in, $regex, $and, $or)",
    "update operators ($set, $inc, $push, $addToSet, $unset)",
    "capped collections (fixed size, TTL)",
    "TTL indexes (automatic expiration)",
    "geospatial queries (2dsphere, GeoJSON)",
    "change streams (real‑time change notifications)",
    "read preferences (primary, secondary, nearest)",
    "write concerns (acknowledgment levels)",
    "aggregation stages ($lookup, $unwind, $facet)",
    "text search (index, $text operator)",
    "bulk writes (bulk operations)",
    "GridFS (storing large files)"
  ],
  
  "node-js": [
    "event loop (phases, microtasks)",
    "non‑blocking I/O (asynchronous nature)",
    "modules (CommonJS vs ES modules, require vs import)",
    "NPM (package management, scripts)",
    "file system (fs) (read, write, streams)",
    "path module (join, resolve, basename)",
    "os module (OS info, network interfaces)",
    "http/https server (creating servers, request handling)",
    "Express framework (routing, middleware)",
    "middleware (application‑level, router‑level)",
    "routing (route parameters, query strings)",
    "error handling (try/catch, error‑handling middleware)",
    "environment variables (process.env, dotenv)",
    "debugging (console, debugger, inspect)",
    "child processes (spawn, exec, fork)",
    "cluster module (scaling, multi‑core)",
    "streams (readable, writable, duplex, transform)",
    "buffers (binary data handling)",
    "web sockets (socket.io, real‑time communication)",
    "authentication (JWT, OAuth, sessions)",
    "CORS (cross‑origin resource sharing)",
    "helmet security (security headers)",
    "rate limiting (express‑rate‑limit)",
    "logging (morgan, winston)",
    "testing (jest, mocha, chai, supertest)"
  ],
  
  express: [
    "application structure (app, router, middleware)",
    "middleware (application‑level, router‑level, error‑handling)",
    "routing (app.get, app.post, route parameters, chaining)",
    "route parameters (req.params, req.query)",
    "query strings (parsing, validation)",
    "request object (req.body, req.headers, req.ip)",
    "response object (res.send, res.json, res.status)",
    "error handling middleware (next, error objects)",
    "static file serving (express.static)",
    "template engines (ejs, pug, handlebars)",
    "environment configuration (NODE_ENV, config files)",
    "CORS (cors middleware)",
    "helmet (security headers)",
    "compression (gzip, brotli)",
    "session management (express‑session, store)",
    "cookie‑parser (parsing cookies)",
    "body‑parser (parsing JSON, URL‑encoded)",
    "file uploads (multer)",
    "authentication (JWT, passport, sessions)",
    "rate limiting (express‑rate‑limit)",
    "logging (morgan, winston, custom logs)",
    "testing (supertest, integration tests)",
    "REST API design (status codes, HATEOAS)"
  ],
  
  python: [
    "data types (int, float, string, list, tuple, dict, set)",
    "control flow (if, elif, else, for, while)",
    "functions and arguments (args, kwargs, default args)",
    "list comprehensions (syntax, performance)",
    "generators (yield, lazy evaluation)",
    "exception handling (try, except, finally, raise)",
    "file I/O (open, read, write, close, with)",
    "modules and packages (import, __init__.py)",
    "classes and OOP (inheritance, polymorphism, encapsulation)",
    "decorators (function wrappers, class decorators)",
    "context managers (with, __enter__, __exit__)",
    "lambda functions (anonymous functions)",
    "map, filter, reduce (functional tools)",
    "regular expressions (re module, patterns)",
    "datetime (date, time, timedelta, strftime)",
    "collections (Counter, defaultdict, namedtuple, deque)",
    "itertools (cycle, permutations, combinations)",
    "typing (type hints, MyPy)",
    "async/await (asyncio, event loop)",
    "unit testing (unittest, pytest, fixtures)",
    "flask/fastapi basics (routing, requests, responses)",
    "pip and virtualenv (package management)",
    "comprehensions (list, dict, set, generator)",
    "closures (nested functions, capturing state)",
    "shallow vs deep copy (copy module)"
  ],
  
  java: [
    "data types (primitives, wrapper classes)",
    "control statements (if, switch, for, while, do‑while)",
    "OOP (inheritance, polymorphism, encapsulation, abstraction)",
    "interfaces (default methods, functional interfaces)",
    "abstract classes (vs interfaces)",
    "generics (type parameters, wildcards)",
    "collections (ArrayList, HashMap, HashSet, LinkedList, TreeMap)",
    "streams and lambda expressions (filter, map, collect)",
    "exception handling (try‑catch, throws, custom exceptions)",
    "multithreading (Thread, Runnable, synchronized)",
    "synchronization (locks, volatile, atomic)",
    "I/O (FileReader, BufferedReader, FileWriter, Scanner)",
    "serialization (Serializable, externalizable)",
    "reflection (Class, Method, Field, modifiers)",
    "annotations (built‑in, custom, retention)",
    "JVM memory management (heap, stack, GC)",
    "garbage collection (GC algorithms, tuning)",
    "JDBC (DriverManager, Connection, Statement, ResultSet)",
    "Spring basics (IoC, DI, beans)",
    "Maven/Gradle (build tools, dependencies)",
    "Java Streams API (parallel streams, collectors)",
    "Optional (null safety, methods)"
  ],
  
  "c++": [
    "data types (int, float, char, bool, arrays)",
    "control structures (if, switch, for, while, do‑while)",
    "functions and overloading (function overloading, default args)",
    "OOP (classes, inheritance, polymorphism, encapsulation)",
    "templates (function templates, class templates)",
    "STL (vector, map, set, algorithm, iterator)",
    "pointers and references (memory addresses, dereferencing)",
    "memory management (new, delete, RAII)",
    "smart pointers (unique_ptr, shared_ptr, weak_ptr)",
    "move semantics (move constructors, move assignment)",
    "lambda expressions (captures, syntax)",
    "exception handling (try‑catch, noexcept)",
    "file I/O (fstream, ifstream, ofstream)",
    "operator overloading (+, -, ==, <<, >>)",
    "friend functions (accessing private members)",
    "virtual functions (polymorphism, vtable)",
    "multiple inheritance (diamond problem, virtual inheritance)",
    "const correctness (const, constexpr, const member functions)",
    "namespaces (std, custom, using)",
    "STL algorithms (sort, find, accumulate, transform)"
  ],
  
  "c#": [
    "data types (int, string, bool, object, var)",
    "control structures (if, switch, for, foreach, while)",
    "OOP (classes, inheritance, polymorphism, encapsulation)",
    "interfaces (explicit implementation, default methods)",
    "delegates and events (multicast, event handlers)",
    "LINQ (query syntax, method syntax, deferred execution)",
    "generics (type parameters, constraints)",
    "exception handling (try‑catch‑finally, custom exceptions)",
    "collections (List, Dictionary, HashSet, Queue, Stack)",
    "async/await (Task, async methods, cancellation tokens)",
    "task parallel library (Parallel.For, PLINQ)",
    "file I/O (File, StreamReader, StreamWriter, FileStream)",
    "serialization (JSON, XML, binary, System.Text.Json)",
    "attribute‑based programming (built‑in, custom)",
    "reflection (Type, Assembly, MemberInfo)",
    "dependency injection (DI containers, IoC)",
    "entity framework (Code First, Database First, migrations)",
    "ASP.NET Core basics (middleware, controllers, routing)",
    "Razor Pages (views, models, page handlers)",
    "Blazor (components, WebAssembly, Server)"
  ],
  
  sql: [
    "SELECT statements (syntax, columns, aliases)",
    "WHERE clause (comparison, logical, IN, BETWEEN)",
    "JOINs (INNER, LEFT, RIGHT, FULL, CROSS, self‑join)",
    "GROUP BY and HAVING (aggregation, filtering)",
    "ORDER BY (ascending, descending, multiple columns)",
    "aggregate functions (COUNT, SUM, AVG, MAX, MIN)",
    "subqueries (correlated, non‑correlated, EXISTS)",
    "window functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD)",
    "CTEs (WITH clause, recursive CTEs)",
    "INSERT, UPDATE, DELETE (DML operations)",
    "table creation and modification (CREATE, ALTER, DROP)",
    "indexes (clustered, non‑clustered, unique, composite)",
    "primary and foreign keys (referential integrity)",
    "normalization (1NF, 2NF, 3NF, BCNF)",
    "stored procedures (CREATE PROCEDURE, parameters)",
    "triggers (INSERT, UPDATE, DELETE, INSTEAD OF)",
    "views (CREATE VIEW, updatable views, materialized views)",
    "transactions (ACID, BEGIN, COMMIT, ROLLBACK)",
    "ACID properties (Atomicity, Consistency, Isolation, Durability)",
    "query optimization (execution plans, indexes, statistics)",
    "database design (ER diagrams, relationships)",
    "data types (INT, VARCHAR, DATE, DECIMAL, JSON)",
    "UNION and UNION ALL (combining results)"
  ],
  
  "data-structures": [
    "arrays (static, dynamic, multi‑dimensional)",
    "linked lists (singly, doubly, circular)",
    "stacks (LIFO, push, pop, peek)",
    "queues (FIFO, priority, circular)",
    "trees (binary tree, BST, AVL, red‑black)",
    "heaps (min‑heap, max‑heap, heapify)",
    "hash tables (hash functions, collision resolution, load factor)",
    "graphs (directed, undirected, weighted, adjacency matrix/list)",
    "trie (prefix tree, autocomplete)",
    "disjoint set (union‑find, path compression)",
    "segment trees (range queries, updates)",
    "fenwick trees (BIT, prefix sums)",
    "LRU cache (implementation, use cases)",
    "bloom filters (probabilistic set membership)",
    "complexity analysis (Big‑O, time vs space)",
    "recursion vs iteration (use cases, trade‑offs)",
    "BFS vs DFS (traversal, applications)",
    "Dijkstra's algorithm (shortest path, priority queue)",
    "A* algorithm (heuristic, pathfinding)",
    "binary search (iterative, recursive)"
  ],
  
  algorithms: [
    "sorting (merge sort, quick sort, bubble, insertion, selection, heap sort)",
    "searching (binary search, linear search, interpolation search)",
    "graph algorithms (BFS, DFS, Dijkstra, Bellman‑Ford, Floyd‑Warshall)",
    "dynamic programming (memoization, tabulation, classic problems)",
    "greedy algorithms (coin change, interval scheduling, Huffman coding)",
    "divide and conquer (merge sort, quick sort, binary search)",
    "backtracking (N‑Queens, Sudoku, permutation generation)",
    "string algorithms (KMP, Rabin‑Karp, Manacher, Z‑algorithm)",
    "minimum spanning tree (Prim, Kruskal)",
    "shortest path (Dijkstra, Bellman‑Ford, Floyd‑Warshall)",
    "maximum flow (Ford‑Fulkerson, Edmonds‑Karp, Dinic)",
    "topological sort (Kahn's, DFS)",
    "NP‑completeness basics (P vs NP, reductions)",
    "traveling salesman (approximation, DP)",
    "knapsack problem (0/1, fractional, DP)",
    "longest common subsequence (LCS, DP)",
    "edit distance (Levenshtein, DP)",
    "binary exponentiation (fast exponentiation)",
    "sieve of Eratosthenes (prime generation)",
    "two‑pointer technique (arrays, strings)",
    "sliding window (subarrays, substrings)",
    "bit manipulation (bitwise operations, bitmasks)",
    "randomized algorithms (Monte Carlo, Las Vegas)"
  ]
};

function getSyllabus(subject) {
  const key = subject.toLowerCase();
  const aliases = {
    'node.js': 'node-js',
    'nodejs': 'node-js',
    'c++': 'c++',
    'cplusplus': 'c++',
    'c#': 'c#',
    'csharp': 'c#',
    'data structures': 'data-structures'
  };
  return SYLLABUS[aliases[key] || key] || null;
}

// ============================================================
//  BUILD PROMPT – improved for accuracy & distinct options
// ============================================================
function buildPrompt(subject, difficulty, count, usedTopics = []) {
  const syllabus = getSyllabus(subject);
  let topicInstruction = '';

  if (syllabus && syllabus.length > 0) {
    const available = syllabus.filter(t => !usedTopics.includes(t));
    const shuffled = available.sort(() => Math.random() - 0.5);
    const suggested = shuffled.slice(0, Math.min(count, available.length));

    if (suggested.length > 0) {
      topicInstruction = `
**TOPIC VARIETY (Important)**
Try to cover as many different subtopics as possible. 
Prefer these topics, but don't feel limited to them:
${suggested.map((t, i) => `${i+1}. ${t}`).join('\n')}

**GUIDANCE:**
- It's fine to have 2–3 questions on the same important concept.
- Avoid having more than 3 questions on the exact same subtopic.
- If you need more questions, you can repeat topics with different angles.
`;
    } else {
      topicInstruction = `
**TOPIC VARIETY**
Generate questions on a wide variety of topics within ${subject}.
- It's fine to have 2–3 questions on the same important concept.
- Avoid having more than 3 questions on the exact same subtopic.
`;
    }
  } else {
    topicInstruction = `
**TOPIC VARIETY**
Generate questions on a wide variety of topics within ${subject}.
- It's fine to have 2–3 questions on the same important concept.
- Avoid having more than 3 questions on the exact same subtopic.
`;
  }

  const diffMap = {
    easy: 'basic, foundational, simple syntax',
    medium: 'intermediate, nuanced, requires understanding',
    hard: 'advanced, edge cases, complex scenarios'
  };
  const diffDesc = diffMap[difficulty] || difficulty;

  return `Generate ${count} multiple-choice questions about ${subject} at ${diffDesc} difficulty.

${topicInstruction}

**CRITICAL REQUIREMENTS:**
1. Each question must test a specific, factual concept.
2. Correct answer must be **100% factually accurate** – double‑check.
3. Incorrect options: plausible but clearly wrong.
4. All options distinct – no duplicates.
5. Clear, complete sentences.
6. Explanation concise and accurate.
7. **Spread questions across topics** – try to cover different subtopics, but it's okay to have 2–3 questions on important concepts.

**If unsure about a fact, skip that question.**

Return ONLY valid JSON:
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

// ============================================================
//  GENERATE A SINGLE CHUNK – strict validation, no auto‑fix
// ============================================================
const generateChunk = async (subject, difficulty, count, usedTopics = [], retries = 3) => {
  const prompt = buildPrompt(subject, difficulty, count, usedTopics);
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      presence_penalty: 0.8,
      frequency_penalty: 0.6,
      max_tokens: 2048 + count * 30,
    });
    const content = completion.choices[0].message.content;
    const parsed = parse(content);
    if (!parsed.questions || !Array.isArray(parsed.questions)) throw new Error('Invalid response');

    const valid = parsed.questions.filter(q => {
      // 1. Must have exactly 4 options
      if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) return false;

      // 2. All options must have text
      if (!q.options.every(o => o.text && o.text.trim().length > 0)) return false;

      // 3. Remove duplicate options (exact text match) and then check length
      const seenTexts = new Set();
      q.options = q.options.filter(o => {
        const text = o.text.trim().toLowerCase();
        if (seenTexts.has(text)) return false;
        seenTexts.add(text);
        return true;
      });
      if (q.options.length !== 4) return false;

      // 4. Count correct answers – must be exactly 1 (skip if 0 or >1)
      const correctCount = q.options.filter(o => o.isCorrect === true).length;
      if (correctCount !== 1) return false;

      // 5. Ensure all options are distinct (text) – already done by dedup, but safe check
      const texts = q.options.map(o => o.text.trim().toLowerCase());
      if (new Set(texts).size !== 4) return false;

      return true;
    });

    // Fill missing explanations
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
      return generateChunk(subject, difficulty, count, usedTopics, retries - 1);
    }
    throw error;
  }
};

// ============================================================
//  PARALLEL CHUNK RUNNER (concurrency = 2)
// ============================================================
async function runParallelChunks(subject, difficulty, chunkCounts, usedTopics, concurrency = 2) {
  const results = [];
  const tasks = chunkCounts.map((count, i) => () => generateChunk(subject, difficulty, count, usedTopics));
  let index = 0;
  async function next() {
    if (index >= tasks.length) return;
    const i = index++;
    try {
      results[i] = await tasks[i]();
    } catch (e) {
      results[i] = [];
    }
    await next();
  }
  const workers = Array(Math.min(concurrency, tasks.length)).fill().map(next);
  await Promise.all(workers);
  return results.flat();
}

// ============================================================
//  MAIN: GENERATE POOL (with pooling & exact dedup)
// ============================================================
const generateGroqQuiz = async (subject, difficulty, targetCount) => {
  console.log(`📚 Generating ${difficulty} ${subject} quiz (target: ${targetCount})...`);

  const oversample = Math.ceil(targetCount * 1.2);
  const CHUNK_SIZE = 10;
  const totalChunks = Math.ceil(oversample / CHUNK_SIZE);
  const chunkCounts = [];
  for (let i = 0; i < totalChunks; i++) {
    const count = Math.min(CHUNK_SIZE, oversample - i * CHUNK_SIZE);
    chunkCounts.push(count);
  }

  const usedTopics = [];

  const allQuestions = await runParallelChunks(subject, difficulty, chunkCounts, usedTopics, 2);

  const uniqueQuestions = deduplicateExact(allQuestions);

  console.log(`📊 Generated ${allQuestions.length} raw, ${uniqueQuestions.length} unique.`);

  if (uniqueQuestions.length >= targetCount) {
    console.log(`✅ Returning ${targetCount} questions`);
    return uniqueQuestions.slice(0, targetCount);
  }

  console.warn(`⚠️ Only ${uniqueQuestions.length} unique, less than target. Returning all unique.`);
  return uniqueQuestions;
};

module.exports = { generateGroqQuiz };