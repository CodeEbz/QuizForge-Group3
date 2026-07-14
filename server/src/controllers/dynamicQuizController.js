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
    { q: "Which keyword declares a block-scoped variable that cannot be reassigned?", opts: ["const", "let", "var", "static"], correct: 0, exp: "The 'const' keyword creates a read-only reference to a value, which cannot be reassigned." },
    { q: "What does the event loop monitor in JavaScript?", opts: ["Call stack and callback queue", "Memory heap and DOM trees", "Network sockets and file streams", "CSS animations and scroll offsets"], correct: 0, exp: "The event loop continuously checks if the call stack is empty and pushes callbacks from the queue." },
    { q: "Which value is returned by typeof NaN?", opts: ["'number'", "'NaN'", "'undefined'", "'object'"], correct: 0, exp: "In JavaScript, NaN (Not-a-Number) is classified as a numeric type, so typeof returns 'number'." },
    { q: "What is the primary benefit of closures in JavaScript?", opts: ["Accessing outer scope variables even after outer execution ends", "Automatically releasing object references", "Compiling callbacks directly to machine code", "Restricting global script operations"], correct: 0, exp: "A closure is the combination of a function and the lexical environment within which that function was declared." },
    { q: "How can you prevent any property additions, deletions, or edits on a JavaScript object?", opts: ["Object.freeze()", "Object.seal()", "Object.preventExtensions()", "Object.lock()"], correct: 0, exp: "Object.freeze() makes an object fully immutable, preventing additions, deletions, or value modifications." },
    { q: "What is a WeakMap in JavaScript?", opts: ["A Map where keys must be objects and are held weakly", "A Map that allows duplicate keys", "A Map that operates on linear search iterations", "A deprecated object structure kept for compatibility"], correct: 0, exp: "WeakMap keys must be garbage-collectable objects, allowing metadata memory recovery automatically." },
    { q: "Which array method returns the first element that satisfies a testing function?", opts: ["find()", "filter()", "map()", "some()"], correct: 0, exp: "find() returns the value of the first element in the array that satisfies the provided testing function." },
    { q: "What does the strict equality (===) operator check?", opts: ["Both value and type equality", "Value equality only", "Reference pointer addresses only", "Variable declaration syntax rules"], correct: 0, exp: "Strict equality compares both the data values and their type without coercion." },
    { q: "Which ES6 API is designed to perform interceptable operations on standard object tasks?", opts: ["Proxy", "Reflect", "Symbol", "Promise"], correct: 0, exp: "The Proxy object wraps another object and intercepts operations like getter/setter lookups." },
    { q: "What is the default value of an uninitialized variable in JavaScript?", opts: ["undefined", "null", "NaN", "false"], correct: 0, exp: "Declared variables without assignments default to the primitive value 'undefined'." }
  ],
  react: [
    { q: "Which React hook is used to manage component state?", opts: ["useState", "useEffect", "useContext", "useRef"], correct: 0, exp: "useState declares and binds state variables inside functional React components." },
    { q: "How do you pass data down from parent to child components?", opts: ["Props", "State", "Context", "Hooks"], correct: 0, exp: "Props are read-only properties passed down class hierarchies from parent elements." },
    { q: "What is the virtual DOM in React?", opts: ["A lightweight in-memory representation of the real DOM", "A separate stylesheet syntax for canvas layouts", "An encryption layer for secure component updates", "A secondary window frame inside the viewport"], correct: 0, exp: "React uses a virtual copy of the DOM to run diffing processes and execute minimal browser reflows." },
    { q: "Why is the 'key' prop crucial in dynamic component lists?", opts: ["It helps React identify changed, added, or removed items for optimized DOM rendering", "It assigns static style rules in document sheets", "It encrypts list values for database indexing", "It adds automatic event triggers to list nodes"], correct: 0, exp: "Keys establish identity between renders, allowing React to rearrange DOM elements instead of rebuilding them." },
    { q: "Which hook executes side-effects in functional components?", opts: ["useEffect", "useState", "useMemo", "useCallback"], correct: 0, exp: "useEffect schedules execution of non-pure rendering side-effects like API loads or subscriptions." },
    { q: "What is the purpose of React.memo?", opts: ["It memoizes functional components to prevent unnecessary re-renders when props don't change", "It records user activity logs on the dashboard", "It caches API headers for network performance", "It replaces the default Redux store"], correct: 0, exp: "React.memo is a higher-order component that skips rendering a component if its props are unchanged." },
    { q: "What are React fragments used for?", opts: ["Grouping multiple elements without adding extra nodes to the DOM", "Splitting code chunks for lazy loading", "Caching API query results locally", "Managing parent context states"], correct: 0, exp: "Fragments (<> or <React.Fragment>) allow rendering list siblings without injecting redundant <div> nodes." },
    { q: "Which hook returns a mutable ref object whose .current property persists?", opts: ["useRef", "useState", "useMemo", "useReducer"], correct: 0, exp: "useRef persists values across renders without triggering a component re-render cycle." },
    { q: "In React, data flows in which direction?", opts: ["Unidirectionally (top-down)", "Bidirectionally", "Bottom-up only", "Asynchronously parent-to-parent"], correct: 0, exp: "React uses one-way data binding, passing props down from parent nodes to child nodes." },
    { q: "What hook replaces lifecycle methods like componentDidMount in function components?", opts: ["useEffect with an empty dependency array", "useState", "useContext", "useLayoutEffect on mount"], correct: 0, exp: "useEffect(() => {}, []) runs exactly once after the initial component mounting render." }
  ],
  html: [
    { q: "What does HTML stand for?", opts: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Transfer Markup Language", "Hyper Text Machine Language"], correct: 0, exp: "HTML is Hyper Text Markup Language, the structural standard for web browser pages." },
    { q: "Which HTML element defines the largest heading?", opts: ["<h1>", "<h6>", "<head>", "<heading>"], correct: 0, exp: "Heading elements range from <h1> (most important/largest) to <h6> (least important/smallest)." },
    { q: "Which element is used to create a hyperlink?", opts: ["<a>", "<link>", "<href>", "<a>"], correct: 0, exp: "The anchor element <a> creates routing hyperlinks using its href source parameter." },
    { q: "Which attribute specifies an image source URL?", opts: ["src", "href", "alt", "link"], correct: 0, exp: "The src (source) attribute inside an <img> tag points directly to the image file." },
    { q: "Which HTML5 element represents standalone article content?", opts: ["<article>", "<section>", "<div>", "<aside>"], correct: 0, exp: "<article> indicates self-contained, modular syndicatable text panels." },
    { q: "What is the purpose of the 'alt' attribute on images?", opts: ["Provides alternative text if the image fails to load", "Specifies image width limits", "Applies filter animations to graphics", "Sets background colors behind borders"], correct: 0, exp: "The 'alt' attribute provides accessibility text for screen readers or broken image fallbacks." },
    { q: "Which HTML5 tag is used to embed audio files?", opts: ["<audio>", "<sound>", "<music>", "<embed>"], correct: 0, exp: "The <audio> element is the HTML5 standard for native browser music/sound playback." },
    { q: "Which input type creates a tickable option box?", opts: ["checkbox", "radio", "button", "text"], correct: 0, exp: "type='checkbox' creates independent select/deselect toggles." },
    { q: "What does the target='_blank' attribute do on links?", opts: ["Opens the linked document in a new window or tab", "Directs traffic to parent layouts", "Hides the link text visually", "Downloads the file immediately"], correct: 0, exp: "target='_blank' forces the browser client to launch a new viewport tab." },
    { q: "Which tag defines a table row?", opts: ["<tr>", "<td>", "<th>", "<table>"], correct: 0, exp: "<tr> stands for table row; it wraps table cells (<td>) and headers (<th>)." }
  ],
  css: [
    { q: "Which CSS property controls the spacing inside an element?", opts: ["padding", "margin", "border", "spacing"], correct: 0, exp: "Padding represents internal padding gaps between borders and text content." },
    { q: "What is the default value of the position property?", opts: ["static", "relative", "absolute", "fixed"], correct: 0, exp: "position defaults to static, placing elements in normal document flow rules." },
    { q: "Which CSS property specifies the stack order of overlapping elements?", opts: ["z-index", "index", "stack-order", "layer"], correct: 0, exp: "z-index controls 3D rendering order along the z-axis for positioned boxes." },
    { q: "How do you select an element with ID 'header' in CSS?", opts: ["#header", ".header", "header", "*header"], correct: 0, exp: "The hash selector # indicates search matches for HTML ID attributes." },
    { q: "Which CSS display value enables a flexible layout model?", opts: ["flex", "grid", "block", "inline-block"], correct: 0, exp: "display: flex enables flexible axis alignment and spacing layouts." },
    { q: "Which property changes the text color of an element?", opts: ["color", "font-color", "text-color", "foreground"], correct: 0, exp: "The color property specifies the foreground color of text." },
    { q: "What is the box-sizing property value that includes borders in width calculations?", opts: ["border-box", "content-box", "padding-box", "inherit"], correct: 0, exp: "border-box includes padding and borders inside the element's total declared width/height." },
    { q: "Which CSS selector targets elements on hover?", opts: [":hover", "::hover", ".hover", "#hover"], correct: 0, exp: "The :hover pseudo-class applies styles when user cursors enter element areas." },
    { q: "How do you add a background color in CSS?", opts: ["background-color", "color-background", "bg-color", "color"], correct: 0, exp: "background-color sets solid color displays behind box elements." },
    { q: "Which property specifies font sizes?", opts: ["font-size", "size", "text-size", "font-style"], correct: 0, exp: "font-size sets scale rules for text characters." }
  ],
  mongodb: [
    { q: "What type of database is MongoDB?", opts: ["Document-oriented (NoSQL)", "Relational (SQL)", "Graph", "Key-Value"], correct: 0, exp: "MongoDB is a document store database saving documents in flexible BSON structures." },
    { q: "In MongoDB, what is a row in a SQL database analogous to?", opts: ["Document", "Collection", "Field", "Index"], correct: 0, exp: "Data records are kept as individual documents within collections." },
    { q: "Which command inserts a single document in MongoDB?", opts: ["db.collection.insertOne()", "db.collection.add()", "db.collection.insert()", "db.collection.create()"], correct: 0, exp: "insertOne() is the standard collection operation to save one document." },
    { q: "What is the default unique identifier field in MongoDB documents?", opts: ["_id", "id", "uid", "uuid"], correct: 0, exp: "_id represents the primary key ObjectID used for indexing." },
    { q: "Which index type optimizes queries on sub-documents?", opts: ["Embedded Index (Dot Notation)", "Compound Index", "Text Index", "Geospatial Index"], correct: 0, exp: "Embedded dot notation indexes target nested properties inside arrays or objects." },
    { q: "How does MongoDB store data under the hood?", opts: ["BSON (Binary JSON)", "XML", "CSV", "Plain text"], correct: 0, exp: "MongoDB serializes JSON structures into BSON for optimized storage size and read speeds." },
    { q: "What MongoDB feature groups multiple operations into a pipeline?", opts: ["Aggregation Framework", "Map-Reduce", "Indexing", "Query Projection"], correct: 0, exp: "The aggregation framework uses multistage pipelines to transform and group data." },
    { q: "Which operator matches values that are greater than a specified value?", opts: ["$gt", "$gte", "$lt", "$ne"], correct: 0, exp: "$gt stands for 'greater than' in MongoDB query filters." },
    { q: "What is a collection in MongoDB?", opts: ["A group of documents", "A database server", "An array of fields", "A type of query index"], correct: 0, exp: "Collections are equivalent to relational tables, containing sets of documents." },
    { q: "Which command deletes multiple documents matching a filter?", opts: ["deleteMany()", "delete()", "remove()", "drop()"], correct: 0, exp: "deleteMany() removes all collection documents matching the query filter." }
  ],
  nodejs: [
    { q: "What is Node.js built on?", opts: ["Google Chrome's V8 JavaScript Engine", "Firefox SpiderMonkey", "Java VM", "Microsoft Chakra"], correct: 0, exp: "Node.js compiles JS directly to machine code using Google's V8 engine." },
    { q: "Which function imports modules in CommonJS?", opts: ["require()", "import()", "include()", "load()"], correct: 0, exp: "require() loads modules synchronously under the CommonJS specification." },
    { q: "What is npm?", opts: ["Node Package Manager", "Network Protocol Manager", "Node Process Monitor", "Node Parser Module"], correct: 0, exp: "npm handles registry lookups and package installations for Node projects." },
    { q: "Which core Node.js module handles file operations?", opts: ["fs", "path", "http", "os"], correct: 0, exp: "The core 'fs' module provides physical file system read/write operations." },
    { q: "What model defines Node's non-blocking I/O execution?", opts: ["Single-threaded event loop", "Multi-threaded process pooling", "Sequential execution", "Asynchronous thread spawning"], correct: 0, exp: "Node delegate operations to the kernel event loop for non-blocking processing." },
    { q: "What is the global object in Node.js analogous to window in browsers?", opts: ["global", "process", "root", "context"], correct: 0, exp: "The keyword global references the topmost namespace object in Node." },
    { q: "Which core module is used to launch HTTP servers?", opts: ["http", "net", "fs", "url"], correct: 0, exp: "The core 'http' module allows creating servers and making requests." },
    { q: "What does the process object provide?", opts: ["Information and control over the current running Node process", "File reading streams", "Database connection tools", "HTML rendering templates"], correct: 0, exp: "process is a global wrapper providing runtime stats, environment variables, and exit codes." },
    { q: "What module resolves file and folder directories?", opts: ["path", "fs", "os", "url"], correct: 0, exp: "The 'path' module provides utility helpers to clean and resolve directories." },
    { q: "Which method schedules a callback to run on the next event loop tick?", opts: ["process.nextTick()", "setTimeout()", "setImmediate()", "setInterval()"], correct: 0, exp: "process.nextTick() executes callbacks immediately after the current operation finishes." }
  ],
  expressjs: [
    { q: "What is Express.js?", opts: ["A minimal web framework for Node.js", "A NoSQL database", "A compiler utility", "A client routing helper"], correct: 0, exp: "Express is the standard routing framework facilitating server creation on Node." },
    { q: "How do you register middlewares in Express?", opts: ["app.use()", "app.load()", "app.set()", "app.route()"], correct: 0, exp: "app.use() appends middleware callbacks to the application route stack." },
    { q: "Which parameters represent requests and responses in route handlers?", opts: ["req, res", "request, response", "input, output", "query, body"], correct: 0, exp: "req represents HTTP request details; res represents responses." },
    { q: "Which method sends JSON payloads in Express?", opts: ["res.json()", "res.send()", "res.write()", "res.stringify()"], correct: 0, exp: "res.json() formats arrays/objects into JSON and appends correct headers." },
    { q: "What is the wildcard parameter in Express routes?", opts: ["*", "/:", "?", "all"], correct: 0, exp: "An asterisk * matches any path parameters, representing catch-all routes." },
    { q: "How do you extract route parameters from /users/:id?", opts: ["req.params.id", "req.query.id", "req.body.id", "req.headers.id"], correct: 0, exp: "req.params contains all mapped key-value tokens parsed from routes." },
    { q: "Which Express method starts a server listening on a port?", opts: ["app.listen()", "app.start()", "app.connect()", "app.run()"], correct: 0, exp: "app.listen() starts basic HTTP server loops on target ports." },
    { q: "Which function passes execution to the next middleware?", opts: ["next()", "proceed()", "continue()", "skip()"], correct: 0, exp: "Calling next() tells Express to invoke the subsequent middleware in line." },
    { q: "How do you parse incoming urlencoded bodies?", opts: ["express.urlencoded()", "express.json()", "body-parser.text()", "req.parse()"], correct: 0, exp: "express.urlencoded() parses URL query forms into req.body objects." },
    { q: "What is the purpose of router instances in Express?", opts: ["Create modular, mountable route handlers", "Connect to database layers", "Cache static assets", "Encrypt passwords"], correct: 0, exp: "express.Router creates isolated router mini-applications for clean code structure." }
  ],
  python: [
    { q: "Which keyword defines a function in Python?", opts: ["def", "function", "func", "define"], correct: 0, exp: "Python uses 'def' to define functions." },
    { q: "Which Python structure is ordered, mutable, and permits duplicates?", opts: ["List", "Tuple", "Set", "Dictionary"], correct: 0, exp: "Lists are mutable sequences allowing duplicate elements." },
    { q: "How do you write comments in Python?", opts: ["# comment", "// comment", "/* comment */", "-- comment"], correct: 0, exp: "# denotes single-line Python code comments." },
    { q: "Which function returns element counts or string lengths?", opts: ["len()", "length()", "size()", "count()"], correct: 0, exp: "len() yields character counts or collection lengths." },
    { q: "What extension is compiled Python bytecode saved as?", opts: [".pyc", ".py", ".pyd", ".pyo"], correct: 0, exp: ".pyc holds compiled module bytecodes." },
    { q: "How do you import libraries in Python?", opts: ["import module", "require('module')", "include module", "load module"], correct: 0, exp: "The import statement loads external packages or modules." },
    { q: "What keyword instantiates loops that repeat while conditions are true?", opts: ["while", "for", "loop", "repeat"], correct: 0, exp: "while loops execute code blocks as long as assertions hold true." },
    { q: "Which method appends elements to Python lists?", opts: ["append()", "push()", "add()", "insert()"], correct: 0, exp: "append() adds items at the end of lists." },
    { q: "What block handles exceptions in Python?", opts: ["try / except", "try / catch", "begin / rescue", "throw / handle"], correct: 0, exp: "try/except blocks catch and process python runtime errors." },
    { q: "Which function converts values to string representations?", opts: ["str()", "string()", "convert()", "toString()"], correct: 0, exp: "str() returns the string representation of an object." }
  ],
  java: [
    { q: "Which keyword declares a class in Java?", opts: ["class", "struct", "object", "interface"], correct: 0, exp: "Java defines objects using class files." },
    { q: "What is the standard main method entry signature in Java?", opts: ["public static void main(String[] args)", "void main()", "public void main(args)", "static void main(args)"], correct: 0, exp: "Java runtimes execute static main methods with string arrays." },
    { q: "Which memory region holds object instances?", opts: ["Heap", "Stack", "Register", "Cache"], correct: 0, exp: "Object memory is allocated on the JVM garbage-collected heap." },
    { q: "Which keyword references parent class constructors?", opts: ["super", "parent", "base", "this"], correct: 0, exp: "super delegates class initialization to base object levels." },
    { q: "Which utility reads console input?", opts: ["Scanner", "Reader", "Console", "SystemInput"], correct: 0, exp: "java.util.Scanner parses console strings into tokens." },
    { q: "Which keyword represents constants in Java?", opts: ["final", "const", "static", "readonly"], correct: 0, exp: "final variables cannot be modified after assignment." },
    { q: "What compiler tool turns Java files into bytecode?", opts: ["javac", "java", "javadoc", "jar"], correct: 0, exp: "javac (Java Compiler) compiles source code to class bytecode." },
    { q: "Which loop runs at least once before checks?", opts: ["do-while", "while", "for", "foreach"], correct: 0, exp: "do-while loops execute body statements before assertions." },
    { q: "Which collections interface allows duplicates and maintains order?", opts: ["List", "Set", "Map", "Queue"], correct: 0, exp: "List interfaces maintain indexing sequences of elements." },
    { q: "What exception is thrown when dereferencing null objects?", opts: ["NullPointerException", "IllegalArgumentException", "IndexOutOfBoundsException", "RuntimeException"], correct: 0, exp: "NullPointerException occurs when code calls instances on unassigned references." }
  ],
  cpp: [
    { q: "Which operator allocates dynamic heap memory in C++?", opts: ["new", "malloc", "alloc", "create"], correct: 0, exp: "new handles dynamic heap allocations and instantiates variables." },
    { q: "Which stream writes text output to the console?", opts: ["std::cout", "std::cin", "std::cerr", "std::print"], correct: 0, exp: "std::cout outputs variables to consoles using bitwise insertion." },
    { q: "What extension is standard C++ header files?", opts: [".h", ".cpp", ".cc", ".hpp"], correct: 0, exp: ".h or .hpp contain definitions and interfaces." },
    { q: "Which keyword creates immutable variables?", opts: ["const", "readonly", "static", "final"], correct: 0, exp: "const enforces compile-time immutable values." },
    { q: "Which operator retrieves variable memory addresses?", opts: ["&", "*", "->", "address"], correct: 0, exp: "The address-of operator & returns memory pointers." },
    { q: "Which operator dereferences pointers?", opts: ["*", "&", "->", "val"], correct: 0, exp: "The dereference operator * retrieves memory values from pointers." },
    { q: "Which keyword is used to release dynamic memory allocated with new?", opts: ["delete", "free", "release", "dispose"], correct: 0, exp: "delete deallocates memory blocks created with new to prevent memory leaks." },
    { q: "Which namespace contains standard libraries?", opts: ["std", "sys", "main", "core"], correct: 0, exp: "std (standard) is the namespace for C++ standard containers and utilities." },
    { q: "What is a destructor in C++?", opts: ["A function called when an object is destroyed", "A method to delete arrays", "A compile-time memory cleaner", "A system error handler"], correct: 0, exp: "Destructors (~ClassName) run cleanups automatically when objects leave scopes." },
    { q: "Which C++ collection represents a dynamic array?", opts: ["std::vector", "std::list", "std::array", "std::map"], correct: 0, exp: "std::vector represents contiguous heap arrays that resize automatically." }
  ],
  csharp: [
    { q: "Which framework is C# primarily built for?", opts: [".NET", "JVM", "NodeJS", "Cocoa"], correct: 0, exp: "C# is Microsoft's primary managed language running on .NET runtimes." },
    { q: "Which keyword references the current executing instance?", opts: ["this", "self", "me", "base"], correct: 0, exp: "this refers to local object scopes." },
    { q: "Which operator represents null-coalescing?", opts: ["??", "?.", "?", "::"], correct: 0, exp: "?? evaluates fallback expressions if the left parameter resolves null." },
    { q: "How is memory managed in C#?", opts: ["Automatic Garbage Collection", "Manual Reference Counting", "Pointer Deallocation", "None of the above"], correct: 0, exp: "The CLR handles allocation cleanup using built-in garbage collection engines." },
    { q: "Which class is the root base class in C#?", opts: ["System.Object", "System.Type", "System.Root", "System.Base"], correct: 0, exp: "System.Object is the parent type of all primitive and custom C# objects." },
    { q: "Which keyword defines query options on variables in C#?", opts: ["var", "dynamic", "let", "auto"], correct: 0, exp: "var permits implicit type declarations resolved by compilers." },
    { q: "Which keyword imports namespace assemblies?", opts: ["using", "import", "require", "include"], correct: 0, exp: "using namespace imports referenced libraries into file scopes." },
    { q: "What modifier declares class properties accessible only in subclasses?", opts: ["protected", "private", "public", "internal"], correct: 0, exp: "protected scopes access to inheriting class levels." },
    { q: "What C# property wraps getter and setter routines?", opts: ["Properties", "Fields", "Accessors", "Variables"], correct: 0, exp: "Properties (get; set;) map object properties with encapsulating code accessors." },
    { q: "Which exception occurs when casting incompatible object types?", opts: ["InvalidCastException", "NullReferenceException", "ArgumentException", "TypeException"], correct: 0, exp: "InvalidCastException is thrown when invalid explicit class casts fail." }
  ],
  sql: [
    { q: "Which SQL clause filters records before grouping?", opts: ["WHERE", "HAVING", "FILTER", "LIMIT"], correct: 0, exp: "WHERE filters rows before aggregate calculations." },
    { q: "Which command quickly empties tables without logging row deletions?", opts: ["TRUNCATE", "DELETE", "DROP", "CLEAR"], correct: 0, exp: "TRUNCATE releases tables' database pages directly." },
    { q: "Which JOIN yields intersecting records in both tables?", opts: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"], correct: 0, exp: "INNER JOIN selects records where matching key parameters intersect." },
    { q: "Which SQL function counts database records?", opts: ["COUNT()", "SUM()", "TOTAL()", "ROWS()"], correct: 0, exp: "COUNT() returns column or row tallies." },
    { q: "Which constraint demands distinct row values?", opts: ["UNIQUE", "PRIMARY KEY", "NOT NULL", "CHECK"], correct: 0, exp: "UNIQUE constraints force column value uniqueness." },
    { q: "Which clause filters aggregate results after grouping?", opts: ["HAVING", "WHERE", "ORDER BY", "FILTER"], correct: 0, exp: "HAVING filters aggregate groups." },
    { q: "Which SQL statement adds data records to tables?", opts: ["INSERT INTO", "ADD ROW", "UPDATE", "CREATE"], correct: 0, exp: "INSERT INTO inserts query payloads." },
    { q: "Which statement alters database structures like adding table columns?", opts: ["ALTER TABLE", "UPDATE TABLE", "MODIFY", "CREATE"], correct: 0, exp: "ALTER TABLE modifies schema definitions." },
    { q: "What key connects records to unique keys in other tables?", opts: ["Foreign Key", "Primary Key", "Index Key", "Unique Constraint"], correct: 0, exp: "Foreign Keys bind relational constraints across tables." },
    { q: "Which clause sorts query outputs?", opts: ["ORDER BY", "GROUP BY", "SORT", "FILTER"], correct: 0, exp: "ORDER BY sorts fields ascending or descending." }
  ],
  datastructures: [
    { q: "Which data structure follows LIFO access rules?", opts: ["Stack", "Queue", "Tree", "List"], correct: 0, exp: "Stacks execute Last In, First Out operations." },
    { q: "Which structure operates on FIFO queue models?", opts: ["Queue", "Stack", "Map", "Heap"], correct: 0, exp: "Queues push items to backs and pop from fronts." },
    { q: "What is the top-most node in trees called?", opts: ["Root", "Parent", "Leaf", "Branch"], correct: 0, exp: "Root nodes represent tree hierarchies entry levels." },
    { q: "Which structure offers O(1) average lookup times?", opts: ["Hash Table", "Binary Search Tree", "Linked List", "Array"], correct: 0, exp: "Hash tables resolve hashed keys directly to memory bins." },
    { q: "What structure links nodes sequentially using pointers?", opts: ["Linked List", "Array", "Stack", "Binary Tree"], correct: 0, exp: "Linked lists chain elements sequentially using pointers." },
    { q: "What binary tree maintains sorted nodes for fast search?", opts: ["Binary Search Tree (BST)", "Max Heap", "AVL Tree", "Trie"], correct: 0, exp: "BST keeps left children smaller and right children larger than parents." },
    { q: "What structure represents networks of vertices and edges?", opts: ["Graph", "Tree", "Trie", "Hash Table"], correct: 0, exp: "Graphs bind custom nodes (vertices) using connection lines (edges)." },
    { q: "What structure maintains elements in tree order to extract min or max values quickly?", opts: ["Heap", "Stack", "Queue", "Array"], correct: 0, exp: "Heaps maintain heap-ordered properties to query root values in O(1)." },
    { q: "What specialized tree structure optimizes string search autocomplete?", opts: ["Trie", "Red-Black Tree", "B-Tree", "Segment Tree"], correct: 0, exp: "Tries (prefix trees) key sub-nodes by character components." },
    { q: "What is the difference between arrays and linked lists?", opts: ["Arrays hold contiguous memory; linked lists chain separate memory blocks", "Arrays resize automatically; lists do not", "Lists offer faster indexing than arrays", "Arrays cannot contain primitives"], correct: 0, exp: "Arrays are contiguous static memory blocks; linked lists link dynamic nodes." }
  ],
  algorithms: [
    { q: "What is the average time complexity of Quick Sort?", opts: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"], correct: 0, exp: "Quick Sort uses divide-and-conquer partition schemes to sort in O(n log n)." },
    { q: "Which algorithm finds shortest paths in weighted non-negative graphs?", opts: ["Dijkstra's", "Kruskal's", "Prim's", "Binary Search"], correct: 0, exp: "Dijkstra's visits nodes in order of shortest tentative distances." },
    { q: "Which sorting algorithm repeatedly swaps adjacent elements?", opts: ["Bubble Sort", "Merge Sort", "Quick Sort", "Selection Sort"], correct: 0, exp: "Bubble sort iteratively shifts heavier variables to array ends." },
    { q: "What is the runtime complexity of binary search?", opts: ["O(log n)", "O(n)", "O(n log n)", "O(1)"], correct: 0, exp: "Binary search halves sorted ranges iteratively." },
    { q: "Which design pattern resolves problems by solving subproblems recursively?", opts: ["Divide and Conquer", "Greedy Choice", "Dynamic Programming", "Backtracking"], correct: 0, exp: "Divide and conquer divides tasks into sibling subproblems." },
    { q: "What sorting algorithm splits arrays recursively, sorting and merging segments?", opts: ["Merge Sort", "Insertion Sort", "Heap Sort", "Bubble Sort"], correct: 0, exp: "Merge sort divides arrays, sorting sub-segments before merging in O(n)." },
    { q: "What algorithm paradigm caches subproblem answers to optimize calculations?", opts: ["Dynamic Programming", "Greedy Paradigm", "Divide and Conquer", "Brute Force"], correct: 0, exp: "Dynamic programming memoizes sub-solutions to save compute cycles." },
    { q: "Which graph traversal uses queues to visit nodes layer by layer?", opts: ["Breadth-First Search (BFS)", "Depth-First Search (DFS)", "Dijkstra's", "A* Search"], correct: 0, exp: "BFS traverses neighbor layers sequentially using queues." },
    { q: "Which algorithm finds minimum spanning trees by growing edges?", opts: ["Kruskal's / Prim's", "Dijkstra's", "Bellman-Ford", "DFS"], correct: 0, exp: "Kruskal's and Prim's locate minimal edge spanning subsets." },
    { q: "What design pattern searches branches, stepping back when paths fail?", opts: ["Backtracking", "Dynamic Programming", "Greedy", "BFS"], correct: 0, exp: "Backtracking tests routes, reversing when boundaries reject steps (e.g. N-Queens)." }
  ],
  general: [
    { q: "What is the main purpose of an operating system?", opts: ["Manage computer hardware resources and software applications", "Design vector images and shapes", "Host web databases and servers", "Translate human speech to compiled bytecode"], correct: 0, exp: "An operating system acts as an intermediary layer managing computer resources." },
    { q: "Which protocol secures traffic over the Web?", opts: ["HTTPS", "HTTP", "FTP", "SMTP"], correct: 0, exp: "HTTPS encrypts communications using SSL/TLS protocols." },
    { q: "What is the runtime complexity of binary search on a sorted array?", opts: ["O(log n)", "O(n)", "O(n log n)", "O(1)"], correct: 0, exp: "Binary search halves sorted arrays iteratively, executing in logarithmic time." },
    { q: "Which component inside a computer executes instruction calculations?", opts: ["CPU", "RAM", "SSD", "GPU"], correct: 0, exp: "The Central Processing Unit parses instruction bytecodes and calculates operations." },
    { q: "Which database type uses tables with defined rows and columns?", opts: ["Relational (SQL)", "Document (NoSQL)", "Graph", "Key-Value"], correct: 0, exp: "Relational database systems organize tabular row-and-column schemas." },
    { q: "What does RAM stand for?", opts: ["Random Access Memory", "Read Active Memory", "Run Access Memory", "Rate Active Memory"], correct: 0, exp: "RAM is Random Access Memory, providing volatile scratchpad workspace." },
    { q: "Which device forwards packets between networks?", opts: ["Router", "Hub", "Switch", "Repeater"], correct: 0, exp: "Routers inspect network destination headers to direct packets across networks." },
    { q: "What is a compiler?", opts: ["A program that translates source code into machine code", "A text editing tool", "A script that secures network sockets", "A database backups manager"], correct: 0, exp: "Compilers translate high-level code representations into machine-readable binaries." },
    { q: "What port is standard secure HTTPS web traffic served on?", opts: ["443", "80", "22", "8080"], correct: 0, exp: "Port 443 handles secure SSL web requests, while Port 80 handles HTTP." },
    { q: "What is the primary function of a domain name server (DNS)?", opts: ["Translate hostnames to numeric IP addresses", "Cache media images", "Host application databases", "Store user accounts"], correct: 0, exp: "DNS resolves hostnames (e.g. google.com) into readable IP addresses." }
  ],
  trivia: [
    { q: "Which planet is known as the Red Planet?", opts: ["Mars", "Venus", "Jupiter", "Saturn"], correct: 0, exp: "Mars is covered in iron oxide (rust) dust, giving it a distinct reddish appearance." },
    { q: "Who painted the Mona Lisa?", opts: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"], correct: 0, exp: "The Italian polymath Leonardo da Vinci painted the Mona Lisa in Florence." },
    { q: "Which ocean is the largest on Earth?", opts: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], correct: 0, exp: "The Pacific Ocean covers more than 30% of the Earth's surface." },
    { q: "What is the capital city of France?", opts: ["Paris", "London", "Rome", "Berlin"], correct: 0, exp: "Paris is the capital and most populous city of France." },
    { q: "Which element has the chemical symbol 'O'?", opts: ["Oxygen", "Osmium", "Gold", "Helium"], correct: 0, exp: "O stands for Oxygen, atomic number 8 on the periodic table." },
    { q: "How many bones are in an adult human body?", opts: ["206", "300", "150", "250"], correct: 0, exp: "Adult skeletons contain exactly 206 bones after infant bones fuse." },
    { q: "Which country is home to the Kangaroo?", opts: ["Australia", "South Africa", "New Zealand", "Brazil"], correct: 0, exp: "Kangaroos are marsupials native to Australia." },
    { q: "Who wrote 'Romeo and Juliet'?", opts: ["William Shakespeare", "Charles Dickens", "Mark Twain", "Jane Austen"], correct: 0, exp: "The famous tragic play Romeo and Juliet was written by William Shakespeare in the 1590s." },
    { q: "What is the tallest mountain in the world?", opts: ["Mount Everest", "K2", "Mount Kilimanjaro", "Mount Denali"], correct: 0, exp: "Mount Everest in the Himalayas is the highest mountain above sea level." },
    { q: "Which programming language is named after a British comedy troupe?", opts: ["Python", "Java", "Ruby", "Pascal"], correct: 0, exp: "Python's creator Guido van Rossum named the language after 'Monty Python's Flying Circus'." }
  ]
};

// Fallback dynamic generator in case OpenAI key fails or is missing
function generateLocalFallbackQuiz(category, difficulty, count) {
  // Map abbreviations/slugs to correct fallback bank keys
  let lookupKey = category.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  if (lookupKey === 'c') lookupKey = 'cpp';
  
  // Non-tech topics should use trivia bank, not general CS
  const triviaTopics = ['other', 'sports', 'politics', 'history', 'geography', 'film', 'music', 'television', 'mythology', 'sciencenature'];
  const catKey = fallbackQuestionBank[lookupKey]
    ? lookupKey
    : (triviaTopics.includes(lookupKey) ? 'trivia' : 'general');
  
  const sourceBank = fallbackQuestionBank[catKey];
  const shuffled = shuffleArray([...sourceBank]);
  
  const questions = [];
  for (let i = 0; i < count; i++) {
    const template = shuffled[i % shuffled.length];
    const variationText = i >= shuffled.length ? ` (Variant ${Math.floor(i / shuffled.length) + 1})` : '';
    
    const formattedOptions = template.opts.map((opt, idx) => ({
      text: opt,
      isCorrect: idx === template.correct
    }));

    questions.push({
      questionText: template.q + variationText,
      options: shuffleArray(formattedOptions),
      points: 1,
      explanation: template.exp || 'Verified correct option.'
    });
  }

  return {
    title: `Dynamic ${category.toUpperCase()} Quiz (${difficulty.toUpperCase()})`,
    description: `A dynamically generated fallback quiz covering ${category}.`,
    category: catKey,
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
      // Request more questions than needed to allow shuffling variety, capped at 50 (API max)
      const fetchAmount = Math.min(count + 10, 50);
      const triviaUrl = `https://opentdb.com/api.php?amount=${fetchAmount}&category=${triviaId}&difficulty=${difficulty.toLowerCase()}&type=multiple`;
      
      const response = await fetch(triviaUrl);
      const data = await response.json();

      if (data.response_code === 0 && data.results && data.results.length > 0) {
        // Shuffle results to vary question order across attempts
        const shuffledResults = shuffleArray(data.results).slice(0, count);
        const questions = shuffledResults.map((item) => {
          const decodedCorrect = decodeHTML(item.correct_answer);
          const correctOpt = { text: decodedCorrect, isCorrect: true };
          const incorrectOpts = item.incorrect_answers.map((ans) => ({
            text: decodeHTML(ans),
            isCorrect: false
          }));

          const options = shuffleArray([correctOpt, ...incorrectOpts]);

          return {
            questionText: decodeHTML(item.question),
            options,
            points: 1,
            explanation: `The correct answer is "${decodedCorrect}". This represents verified general knowledge trivia for category "${item.category}" and difficulty "${item.difficulty}".`
          };
        });

        const categoryName = shuffledResults[0].category || 'Trivia';

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
IMPORTANT: All questions MUST be strictly about "${category}" only. Do NOT include questions from unrelated topics.
Each question must have exactly 4 options, exactly one option must be marked as correct (isCorrect: true), and the correct answer MUST be factually accurate and verifiable.
Provide a detailed explanation confirming why the correct option is right.
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
      ],
      "explanation": "Detailed explanation of why Option B is correct."
    }
  ]
}
Do not wrap your output in markdown code blocks. Return only the raw JSON.`;

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
              points: 1,
              explanation: q.explanation || `The correct option is indeed the right answer for this question.`
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
