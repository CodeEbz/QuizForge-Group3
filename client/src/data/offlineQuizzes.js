export const offlineQuizzes = {
  "javascript": {
    "easy": {
      title: "JavaScript Fundamentals (Offline)",
      description: "Offline-ready basic JavaScript questions.",
      category: "javascript",
      difficulty: "easy",
      questions: [
        {
          _id: "off-js-1",
          questionText: "Which keyword declares a variable that cannot be reassigned?",
          options: [
            { _id: "off-js-1-o1", text: "var" },
            { _id: "off-js-1-o2", text: "let" },
            { _id: "off-js-1-o3", text: "const" },
            { _id: "off-js-1-o4", text: "static" }
          ],
          correctOptionIndex: 2,
          explanation: "The 'const' keyword creates a read-only reference to a value. The variable identifier cannot be reassigned."
        },
        {
          _id: "off-js-2",
          questionText: "What is the correct syntax to log 'Hello World' to the console?",
          options: [
            { _id: "off-js-2-o1", text: "print('Hello World')" },
            { _id: "off-js-2-o2", text: "console.log('Hello World')" },
            { _id: "off-js-2-o3", text: "log.console('Hello World')" },
            { _id: "off-js-2-o4", text: "response.write('Hello World')" }
          ],
          correctOptionIndex: 1,
          explanation: "The console.log() method writes a message to the browser or runtime developer console."
        },
        {
          _id: "off-js-3",
          questionText: "Which of the following is NOT a primitive data type in JavaScript?",
          options: [
            { _id: "off-js-3-o1", text: "String" },
            { _id: "off-js-3-o2", text: "Number" },
            { _id: "off-js-3-o3", text: "Object" },
            { _id: "off-js-3-o4", text: "Boolean" }
          ],
          correctOptionIndex: 2,
          explanation: "In JavaScript, primitive types include String, Number, Boolean, Null, Undefined, Symbol, and BigInt. Objects are reference types."
        },
        {
          _id: "off-js-4",
          questionText: "Which operator checks for both value and type equality?",
          options: [
            { _id: "off-js-4-o1", text: "==" },
            { _id: "off-js-4-o2", text: "=" },
            { _id: "off-js-4-o3", text: "===" },
            { _id: "off-js-4-o4", text: "equals" }
          ],
          correctOptionIndex: 2,
          explanation: "The strict equality operator (===) compares both the value and the type of two operands without type coercion."
        },
        {
          _id: "off-js-5",
          questionText: "What is the default value of an uninitialized variable in JavaScript?",
          options: [
            { _id: "off-js-5-o1", text: "undefined" },
            { _id: "off-js-5-o2", text: "null" },
            { _id: "off-js-5-o3", text: "NaN" },
            { _id: "off-js-5-o4", text: "void" }
          ],
          correctOptionIndex: 0,
          explanation: "A variable that has been declared but not assigned a value is automatically assigned the primitive value 'undefined'."
        }
      ]
    }
  },
  "react": {
    "easy": {
      title: "React Core Concepts (Offline)",
      description: "Offline-ready basic React questions.",
      category: "react",
      difficulty: "easy",
      questions: [
        {
          _id: "off-re-1",
          questionText: "Which React hook manages component state?",
          options: [
            { _id: "off-re-1-o1", text: "useEffect" },
            { _id: "off-re-1-o2", text: "useState" },
            { _id: "off-re-1-o3", text: "useContext" },
            { _id: "off-re-1-o4", text: "useRef" }
          ],
          correctOptionIndex: 1,
          explanation: "The useState hook is used to declare state variables in React functional components."
        },
        {
          _id: "off-re-2",
          questionText: "How do you pass data down from parent to child components?",
          options: [
            { _id: "off-re-2-o1", text: "State" },
            { _id: "off-re-2-o2", text: "Props" },
            { _id: "off-re-2-o3", text: "Context" },
            { _id: "off-re-2-o4", text: "Hooks" }
          ],
          correctOptionIndex: 1,
          explanation: "Props (short for properties) are read-only arguments passed from parent components to child components."
        },
        {
          _id: "off-re-3",
          questionText: "Which hook executes side-effects in functional components?",
          options: [
            { _id: "off-re-3-o1", text: "useState" },
            { _id: "off-re-3-o2", text: "useEffect" },
            { _id: "off-re-3-o3", text: "useMemo" },
            { _id: "off-re-3-o4", text: "useCallback" }
          ],
          correctOptionIndex: 1,
          explanation: "The useEffect hook lets you perform side effects (fetching data, DOM manipulation, subscriptions) in functional components."
        },
        {
          _id: "off-re-4",
          questionText: "What is the virtual DOM in React?",
          options: [
            { _id: "off-re-4-o1", text: "A lightweight in-memory representation of the real DOM" },
            { _id: "off-re-4-o2", text: "A separate browser window display" },
            { _id: "off-re-4-o3", text: "An encryption layer for secure components" },
            { _id: "off-re-4-o4", text: "A secondary HTML document loaded in an iframe" }
          ],
          correctOptionIndex: 0,
          explanation: "React maintains a virtual representation of the DOM in memory, syncing changes to the actual DOM via reconciliation."
        },
        {
          _id: "off-re-5",
          questionText: "Why is the 'key' prop crucial in dynamic component lists?",
          options: [
            { _id: "off-re-5-o1", text: "It helps React identify changed, added, or removed items for optimized rendering" },
            { _id: "off-re-5-o2", text: "It assigns static style rules in document sheets" },
            { _id: "off-re-5-o3", text: "It encrypts list values for database indexing" },
            { _id: "off-re-5-o4", text: "It adds automatic event triggers to list nodes" }
          ],
          correctOptionIndex: 0,
          explanation: "Keys help React identify which items have changed, been added, or been removed, minimizing DOM manipulations."
        }
      ]
    }
  },
  "html": {
    "easy": {
      title: "HTML Fundamentals (Offline)",
      description: "Offline-ready basic HTML questions.",
      category: "html",
      difficulty: "easy",
      questions: [
        {
          _id: "off-ht-1",
          questionText: "What does HTML stand for?",
          options: [
            { _id: "off-ht-1-o1", text: "Hyper Text Markup Language" },
            { _id: "off-ht-1-o2", text: "High Text Machine Language" },
            { _id: "off-ht-1-o3", text: "Hyper Transfer Markup Language" },
            { _id: "off-ht-1-o4", text: "Hyper Text Machine Language" }
          ],
          correctOptionIndex: 0,
          explanation: "HTML stands for Hyper Text Markup Language. It is the standard markup language for creating web pages."
        },
        {
          _id: "off-ht-2",
          questionText: "Which HTML element is used to define the largest heading?",
          options: [
            { _id: "off-ht-2-o1", text: "<h1>" },
            { _id: "off-ht-2-o2", text: "<h6 >" },
            { _id: "off-ht-2-o3", text: "<head>" },
            { _id: "off-ht-2-o4", text: "<heading>" }
          ],
          correctOptionIndex: 0,
          explanation: "Heading levels range from <h1> (most important/largest) to <h6> (least important/smallest)."
        },
        {
          _id: "off-ht-3",
          questionText: "Which element is used to create a hyperlink?",
          options: [
            { _id: "off-ht-3-o1", text: "<link>" },
            { _id: "off-ht-3-o2", text: "<a>" },
            { _id: "off-ht-3-o3", text: "<href>" },
            { _id: "off-ht-3-o4", text: "<a>" }
          ],
          correctOptionIndex: 1,
          explanation: "The <a> (anchor) tag, combined with the 'href' attribute, creates hyperlinks to web pages or assets."
        },
        {
          _id: "off-ht-4",
          questionText: "Which attribute is used to specify an image source URL?",
          options: [
            { _id: "off-ht-4-o1", text: "href" },
            { _id: "off-ht-4-o2", text: "src" },
            { _id: "off-ht-4-o3", text: "alt" },
            { _id: "off-ht-4-o4", text: "link" }
          ],
          correctOptionIndex: 1,
          explanation: "The 'src' attribute inside the <img> tag specifies the absolute or relative path to the image."
        },
        {
          _id: "off-ht-5",
          questionText: "Which HTML5 element is best suited for wrapping standalone article content?",
          options: [
            { _id: "off-ht-5-o1", text: "<section>" },
            { _id: "off-ht-5-o2", text: "<div>" },
            { _id: "off-ht-5-o3", text: "<article>" },
            { _id: "off-ht-5-o4", text: "<aside>" }
          ],
          correctOptionIndex: 2,
          explanation: "The <article> element represents a self-contained, independent composition (e.g. a blog post or news story)."
        }
      ]
    }
  },
  "css": {
    "easy": {
      title: "CSS Fundamentals (Offline)",
      description: "Offline-ready basic CSS questions.",
      category: "css",
      difficulty: "easy",
      questions: [
        {
          _id: "off-cs-1",
          questionText: "Which CSS property controls the spacing inside an element?",
          options: [
            { _id: "off-cs-1-o1", text: "margin" },
            { _id: "off-cs-1-o2", text: "padding" },
            { _id: "off-cs-1-o3", text: "border" },
            { _id: "off-cs-1-o4", text: "spacing" }
          ],
          correctOptionIndex: 1,
          explanation: "Padding is the property that defines the inner spacing between an element's content and its border."
        },
        {
          _id: "off-cs-2",
          questionText: "What is the default value of the position property in CSS?",
          options: [
            { _id: "off-cs-2-o1", text: "static" },
            { _id: "off-cs-2-o2", text: "relative" },
            { _id: "off-cs-2-o3", text: "absolute" },
            { _id: "off-cs-2-o4", text: "fixed" }
          ],
          correctOptionIndex: 0,
          explanation: "The default value of position is 'static'. Static elements follow the normal document page layout flow."
        },
        {
          _id: "off-cs-3",
          questionText: "Which CSS property specifies the stack order of overlapping elements?",
          options: [
            { _id: "off-cs-3-o1", text: "index" },
            { _id: "off-cs-3-o2", text: "stack" },
            { _id: "off-cs-3-o3", text: "z-index" },
            { _id: "off-cs-3-o4", text: "flex-order" }
          ],
          correctOptionIndex: 2,
          explanation: "The z-index property specifies the stack order of positioned elements (relative, absolute, or fixed)."
        },
        {
          _id: "off-cs-4",
          questionText: "How do you select an element with id 'header' in CSS?",
          options: [
            { _id: "off-cs-4-o1", text: ".header" },
            { _id: "off-cs-4-o2", text: "#header" },
            { _id: "off-cs-4-o3", text: "header" },
            { _id: "off-cs-4-o4", text: "*header" }
          ],
          correctOptionIndex: 1,
          explanation: "The hash sign (#) is used in CSS selectors to target elements by their unique HTML ID attribute value."
        },
        {
          _id: "off-cs-5",
          questionText: "Which CSS display value enables a flexible layout model?",
          options: [
            { _id: "off-cs-5-o1", text: "block" },
            { _id: "off-cs-5-o2", text: "grid" },
            { _id: "off-cs-5-o3", text: "flex" },
            { _id: "off-cs-5-o4", text: "inline-block" }
          ],
          correctOptionIndex: 2,
          explanation: "Setting 'display: flex' establishes a flex container context, enabling flexible space allocation."
        }
      ]
    }
  },
  "mongodb": {
    "easy": {
      title: "MongoDB Core concepts (Offline)",
      description: "Offline-ready basic MongoDB questions.",
      category: "mongodb",
      difficulty: "easy",
      questions: [
        {
          _id: "off-mg-1",
          questionText: "What type of database is MongoDB?",
          options: [
            { _id: "off-mg-1-o1", text: "Document-oriented (NoSQL)" },
            { _id: "off-mg-1-o2", text: "Relational (SQL)" },
            { _id: "off-mg-1-o3", text: "Graph Database" },
            { _id: "off-mg-1-o4", text: "Flat File Database" }
          ],
          correctOptionIndex: 0,
          explanation: "MongoDB is a NoSQL document database. It stores data in flexible JSON-like BSON documents."
        },
        {
          _id: "off-mg-2",
          questionText: "In MongoDB, what is a row in a SQL database analogous to?",
          options: [
            { _id: "off-mg-2-o1", text: "Collection" },
            { _id: "off-mg-2-o2", text: "Document" },
            { _id: "off-mg-2-o3", text: "Field" },
            { _id: "off-mg-2-o4", text: "Index" }
          ],
          correctOptionIndex: 1,
          explanation: "In MongoDB, records are stored as 'Documents' which roughly map to traditional SQL database rows."
        },
        {
          _id: "off-mg-3",
          questionText: "Which command inserts a single document in MongoDB?",
          options: [
            { _id: "off-mg-3-o1", text: "db.collection.add()" },
            { _id: "off-mg-3-o2", text: "db.collection.push()" },
            { _id: "off-mg-3-o3", text: "db.collection.insertOne()" },
            { _id: "off-mg-3-o4", text: "db.collection.create()" }
          ],
          correctOptionIndex: 2,
          explanation: "The insertOne() method is used to insert a single document into a collection."
        },
        {
          _id: "off-mg-4",
          questionText: "What is the primary default identifier field for MongoDB documents?",
          options: [
            { _id: "off-mg-4-o1", text: "_id" },
            { _id: "off-mg-4-o2", text: "id" },
            { _id: "off-mg-4-o3", text: "uid" },
            { _id: "off-mg-4-o4", text: "uuid" }
          ],
          correctOptionIndex: 0,
          explanation: "Every document in MongoDB requires a primary key named '_id' which defaults to an ObjectId."
        },
        {
          _id: "off-mg-5",
          questionText: "Which index type optimizes queries on sub-documents?",
          options: [
            { _id: "off-mg-5-o1", text: "Text Index" },
            { _id: "off-mg-5-o2", text: "Embedded Index / Dot Notation Path" },
            { _id: "off-mg-5-o3", text: "Geospatial Index" },
            { _id: "off-mg-5-o4", text: "Compound Index" }
          ],
          correctOptionIndex: 1,
          explanation: "Indexing specific fields inside nested documents (using dot notation) creates an embedded index."
        }
      ]
    }
  },
  "nodejs": {
    "easy": {
      title: "Node.js Core concepts (Offline)",
      description: "Offline-ready basic Node.js questions.",
      category: "nodejs",
      difficulty: "easy",
      questions: [
        {
          _id: "off-nd-1",
          questionText: "What is Node.js built on?",
          options: [
            { _id: "off-nd-1-o1", text: "Google Chrome's V8 JavaScript Engine" },
            { _id: "off-nd-1-o2", text: "Firefox SpiderMonkey" },
            { _id: "off-nd-1-o3", text: "Java Virtual Machine" },
            { _id: "off-nd-1-o4", text: "Microsoft Chakra Engine" }
          ],
          correctOptionIndex: 0,
          explanation: "Node.js compiles and runs JavaScript code using Google Chrome's open-source high-performance V8 engine."
        },
        {
          _id: "off-nd-2",
          questionText: "Which object is used in CommonJS Node.js to load modules?",
          options: [
            { _id: "off-nd-2-o1", text: "import" },
            { _id: "off-nd-2-o2", text: "require" },
            { _id: "off-nd-2-o3", text: "include" },
            { _id: "off-nd-2-o4", text: "load" }
          ],
          correctOptionIndex: 1,
          explanation: "In Node's default CommonJS module system, the require() function is used to load and run module assets."
        },
        {
          _id: "off-nd-3",
          questionText: "What is the primary manager for installing third-party Node packages?",
          options: [
            { _id: "off-nd-3-o1", text: "pip" },
            { _id: "off-nd-3-o2", text: "maven" },
            { _id: "off-nd-3-o3", text: "npm" },
            { _id: "off-nd-3-o4", text: "composer" }
          ],
          correctOptionIndex: 2,
          explanation: "npm (Node Package Manager) is the default package registry manager bundled with Node.js."
        },
        {
          _id: "off-nd-4",
          questionText: "Which core Node.js module handles file operations?",
          options: [
            { _id: "off-nd-4-o1", text: "fs" },
            { _id: "off-nd-4-o2", text: "path" },
            { _id: "off-nd-4-o3", text: "http" },
            { _id: "off-nd-4-o4", text: "os" }
          ],
          correctOptionIndex: 0,
          explanation: "The core 'fs' (file system) module provides APIs to read, write, and manipulate physical files."
        },
        {
          _id: "off-nd-5",
          questionText: "What architecture model defines Node's non-blocking I/O execution?",
          options: [
            { _id: "off-nd-5-o1", text: "Multi-threaded process pooling" },
            { _id: "off-nd-5-o2", text: "Event-driven single-threaded event loop" },
            { _id: "off-nd-5-o3", text: "Sequential compiled routines" },
            { _id: "off-nd-5-o4", text: "Asymmetric parallel computing" }
          ],
          correctOptionIndex: 1,
          explanation: "Node.js uses a single-threaded event loop architecture combined with non-blocking kernel operations."
        }
      ]
    }
  },
  "expressjs": {
    "easy": {
      title: "Express.js Core (Offline)",
      description: "Offline-ready basic Express.js questions.",
      category: "expressjs",
      difficulty: "easy",
      questions: [
        {
          _id: "off-ex-1",
          questionText: "What is Express.js?",
          options: [
            { _id: "off-ex-1-o1", text: "A minimal and flexible web application framework for Node.js" },
            { _id: "off-ex-1-o2", text: "A relational database query engine" },
            { _id: "off-ex-1-o3", text: "A client-side styling library" },
            { _id: "off-ex-1-o4", text: "A compiler for WebAssembly code" }
          ],
          correctOptionIndex: 0,
          explanation: "Express.js is the standard minimal routing and web server framework built for Node.js environments."
        },
        {
          _id: "off-ex-2",
          questionText: "How do you define middleware functions in Express?",
          options: [
            { _id: "off-ex-2-o1", text: "app.load()" },
            { _id: "off-ex-2-o2", text: "app.use()" },
            { _id: "off-ex-2-o3", text: "app.route()" },
            { _id: "off-ex-2-o4", text: "app.inject()" }
          ],
          correctOptionIndex: 1,
          explanation: "The app.use() method registers middleware handlers that execute during HTTP request lifecycles."
        },
        {
          _id: "off-ex-3",
          questionText: "Which parameters represent the request and response in Express route handlers?",
          options: [
            { _id: "off-ex-3-o1", text: "req, res" },
            { _id: "off-ex-3-o2", text: "input, output" },
            { _id: "off-ex-3-o3", text: "data, headers" },
            { _id: "off-ex-3-o4", text: "query, body" }
          ],
          correctOptionIndex: 0,
          explanation: "Express route callbacks standardly receive 'req' (Request object) and 'res' (Response object) parameters."
        },
        {
          _id: "off-ex-4",
          questionText: "Which method sends a JSON response in Express?",
          options: [
            { _id: "off-ex-4-o1", text: "res.send()" },
            { _id: "off-ex-4-o2", text: "res.write()" },
            { _id: "off-ex-4-o3", text: "res.json()" },
            { _id: "off-ex-4-o4", text: "res.stringify()" }
          ],
          correctOptionIndex: 2,
          explanation: "The res.json() method parses the payload, sets JSON headers, and sends the response payload."
        },
        {
          _id: "off-ex-5",
          questionText: "What is the default routing path for wildcard catch-all matching?",
          options: [
            { _id: "off-ex-5-o1", text: "/" },
            { _id: "off-ex-5-o2", text: "*" },
            { _id: "off-ex-5-o3", text: "all" },
            { _id: "off-ex-5-o4", text: "wildcard" }
          ],
          correctOptionIndex: 1,
          explanation: "An asterisk '*' acts as a wildcard parameter matching any URL routes that were not handled earlier."
        }
      ]
    }
  },
  "python": {
    "easy": {
      title: "Python Fundamentals (Offline)",
      description: "Offline-ready basic Python questions.",
      category: "python",
      difficulty: "easy",
      questions: [
        {
          _id: "off-py-1",
          questionText: "Which keyword defines a function in Python?",
          options: [
            { _id: "off-py-1-o1", text: "def" },
            { _id: "off-py-1-o2", text: "function" },
            { _id: "off-py-1-o3", text: "func" },
            { _id: "off-py-1-o4", text: "define" }
          ],
          correctOptionIndex: 0,
          explanation: "In Python, functions are defined using the 'def' keyword followed by the function name."
        },
        {
          _id: "off-py-2",
          questionText: "Which data structure in Python is ordered, mutable, and allows duplicate items?",
          options: [
            { _id: "off-py-2-o1", text: "Tuple" },
            { _id: "off-py-2-o2", text: "List" },
            { _id: "off-py-2-o3", text: "Set" },
            { _id: "off-py-2-o4", text: "Dictionary" }
          ],
          correctOptionIndex: 1,
          explanation: "A List in Python is ordered, mutable, and allows duplicate elements. Tuples are immutable; Sets are unordered."
        },
        {
          _id: "off-py-3",
          questionText: "How do you write a comment in Python?",
          options: [
            { _id: "off-py-3-o1", text: "// comment" },
            { _id: "off-py-3-o2", text: "/* comment */" },
            { _id: "off-py-3-o3", text: "# comment" },
            { _id: "off-py-3-o4", text: "-- comment" }
          ],
          correctOptionIndex: 2,
          explanation: "Python uses the hash character (#) to denote single-line comments in source files."
        },
        {
          _id: "off-py-4",
          questionText: "Which function returns the length of a string or list?",
          options: [
            { _id: "off-py-4-o1", text: "len()" },
            { _id: "off-py-4-o2", text: "length()" },
            { _id: "off-py-4-o3", text: "count()" },
            { _id: "off-py-4-o4", text: "size()" }
          ],
          correctOptionIndex: 0,
          explanation: "The built-in len() function returns the number of items in an iterable object or character count in a string."
        },
        {
          _id: "off-py-5",
          questionText: "What is the file extension for compiled Python bytecode?",
          options: [
            { _id: "off-py-5-o1", text: ".py" },
            { _id: "off-py-5-o2", text: ".pyc" },
            { _id: "off-py-5-o3", text: ".pyd" },
            { _id: "off-py-5-o4", text: ".pyo" }
          ],
          correctOptionIndex: 1,
          explanation: "Compiled Python bytecode files are saved with a '.pyc' extension, caching modules for faster execution imports."
        }
      ]
    }
  },
  "java": {
    "easy": {
      title: "Java Fundamentals (Offline)",
      description: "Offline-ready basic Java questions.",
      category: "java",
      difficulty: "easy",
      questions: [
        {
          _id: "off-jv-1",
          questionText: "Which keyword declares a class in Java?",
          options: [
            { _id: "off-jv-1-o1", text: "class" },
            { _id: "off-jv-1-o2", text: "struct" },
            { _id: "off-jv-1-o3", text: "interface" },
            { _id: "off-jv-1-o4", text: "object" }
          ],
          correctOptionIndex: 0,
          explanation: "Java classes are declared using the 'class' keyword, encapsulating data variables and member methods."
        },
        {
          _id: "off-jv-2",
          questionText: "What is the entry point method signature for any standard Java console application?",
          options: [
            { _id: "off-jv-2-o1", text: "void main(String[] args)" },
            { _id: "off-jv-2-o2", text: "public static void main(String[] args)" },
            { _id: "off-jv-2-o3", text: "public void main(args)" },
            { _id: "off-jv-2-o4", text: "static main(String args)" }
          ],
          correctOptionIndex: 1,
          explanation: "The Java Virtual Machine looks specifically for 'public static void main(String[] args)' to launch console runtimes."
        },
        {
          _id: "off-jv-3",
          questionText: "Which memory region holds object instances in Java?",
          options: [
            { _id: "off-jv-3-o1", text: "Stack" },
            { _id: "off-jv-3-o2", text: "Register" },
            { _id: "off-jv-3-o3", text: "Heap" },
            { _id: "off-jv-3-o4", text: "Code segment" }
          ],
          correctOptionIndex: 2,
          explanation: "Object instances and arrays are allocated on the managed memory Heap; local variables are kept in stack frames."
        },
        {
          _id: "off-jv-4",
          questionText: "Which keyword calls the constructor of the parent class?",
          options: [
            { _id: "off-jv-4-o1", text: "super" },
            { _id: "off-jv-4-o2", text: "this" },
            { _id: "off-jv-4-o3", text: "parent" },
            { _id: "off-jv-4-o4", text: "base" }
          ],
          correctOptionIndex: 0,
          explanation: "The 'super' keyword calls methods or constructors of the direct parent superclass inside class hierarchies."
        },
        {
          _id: "off-jv-5",
          questionText: "Which Java utility class is used to read input from the console?",
          options: [
            { _id: "off-jv-5-o1", text: "Reader" },
            { _id: "off-jv-5-o2", text: "Scanner" },
            { _id: "off-jv-5-o3", text: "ConsoleReader" },
            { _id: "off-jv-5-o4", text: "SystemInput" }
          ],
          correctOptionIndex: 1,
          explanation: "The java.util.Scanner class parses primitives and strings from console streams using token regex rules."
        }
      ]
    }
  },
  "cpp": {
    "easy": {
      title: "C++ Programming (Offline)",
      description: "Offline-ready basic C++ questions.",
      category: "cpp",
      difficulty: "easy",
      questions: [
        {
          _id: "off-cp-1",
          questionText: "Which operator is used to allocate dynamic memory in C++?",
          options: [
            { _id: "off-cp-1-o1", text: "new" },
            { _id: "off-cp-1-o2", text: "malloc" },
            { _id: "off-cp-1-o3", text: "alloc" },
            { _id: "off-cp-1-o4", text: "create" }
          ],
          correctOptionIndex: 0,
          explanation: "In C++, the 'new' operator allocates dynamic memory on the free store (heap) and triggers type constructors."
        },
        {
          _id: "off-cp-2",
          questionText: "Which stream object writes output to the console in C++?",
          options: [
            { _id: "off-cp-2-o1", text: "std::cin" },
            { _id: "off-cp-2-o2", text: "std::cout" },
            { _id: "off-cp-2-o3", text: "std::cerr" },
            { _id: "off-cp-2-o4", text: "std::print" }
          ],
          correctOptionIndex: 1,
          explanation: "std::cout (character output stream) is used to output text data to the default standard console device."
        },
        {
          _id: "off-cp-3",
          questionText: "What file extension is traditionally used for header files in C++?",
          options: [
            { _id: "off-cp-3-o1", text: ".cpp" },
            { _id: "off-cp-3-o2", text: ".cc" },
            { _id: "off-cp-3-o3", text: ".h" },
            { _id: "off-cp-3-o4", text: ".hpp" }
          ],
          correctOptionIndex: 2,
          explanation: "C++ header files traditionally use the '.h' or '.hpp' extensions containing declarations and interfaces."
        },
        {
          _id: "off-cp-4",
          questionText: "Which keyword specifies that a variable cannot be modified after initialization?",
          options: [
            { _id: "off-cp-4-o1", text: "const" },
            { _id: "off-cp-4-o2", text: "static" },
            { _id: "off-cp-4-o3", text: "readonly" },
            { _id: "off-cp-4-o4", text: "final" }
          ],
          correctOptionIndex: 0,
          explanation: "The 'const' keyword enforces compile-time immutability, preventing variable re-assignment tasks."
        },
        {
          _id: "off-cp-5",
          questionText: "Which operator retrieves the memory address of a variable?",
          options: [
            { _id: "off-cp-5-o1", text: "*" },
            { _id: "off-cp-5-o2", text: "&" },
            { _id: "off-cp-5-o3", text: "->" },
            { _id: "off-cp-5-o4", text: "address" }
          ],
          correctOptionIndex: 1,
          explanation: "The address-of operator (&) returns the actual pointer memory address pointing to its operand."
        }
      ]
    }
  },
  "csharp": {
    "easy": {
      title: "C# Programming (Offline)",
      description: "Offline-ready basic C# questions.",
      category: "csharp",
      difficulty: "easy",
      questions: [
        {
          _id: "off-csh-1",
          questionText: "Which framework is C# primarily associated with?",
          options: [
            { _id: "off-csh-1-o1", text: ".NET" },
            { _id: "off-csh-1-o2", text: "Java SE" },
            { _id: "off-csh-1-o3", text: "Cocoa Touch" },
            { _id: "off-csh-1-o4", text: "NodeJS" }
          ],
          correctOptionIndex: 0,
          explanation: "C# is an object-oriented language developed by Microsoft designed to run on the cross-platform .NET framework."
        },
        {
          _id: "off-csh-2",
          questionText: "Which keyword represents the current object instance in C#?",
          options: [
            { _id: "off-csh-2-o1", text: "self" },
            { _id: "off-csh-2-o2", text: "this" },
            { _id: "off-csh-2-o3", text: "me" },
            { _id: "off-csh-2-o4", text: "base" }
          ],
          correctOptionIndex: 1,
          explanation: "The 'this' keyword refers to the current executing class instance inside non-static member functions."
        },
        {
          _id: "off-csh-3",
          questionText: "Which operator handles null-coalescing operations in C#?",
          options: [
            { _id: "off-csh-3-o1", text: "?" },
            { _id: "off-csh-3-o2", text: "?." },
            { _id: "off-csh-3-o3", text: "??" },
            { _id: "off-csh-3-o4", text: "::" }
          ],
          correctOptionIndex: 2,
          explanation: "The null-coalescing operator (??) returns the left-hand operand if it is not null; else it returns the right-hand value."
        },
        {
          _id: "off-csh-4",
          questionText: "What type of garbage collection does C# use?",
          options: [
            { _id: "off-csh-4-o1", text: "Automatic Managed Garbage Collection" },
            { _id: "off-csh-4-o2", text: "Manual Reference Counting" },
            { _id: "off-csh-4-o3", text: "Pointer Deallocation Pool" },
            { _id: "off-csh-4-o4", text: "None of the above" }
          ],
          correctOptionIndex: 0,
          explanation: "The .NET Common Language Runtime (CLR) automatically handles memory reclaiming using a Garbage Collector."
        },
        {
          _id: "off-csh-5",
          questionText: "Which class is the root base class of all types in C#?",
          options: [
            { _id: "off-csh-5-o1", text: "System.Type" },
            { _id: "off-csh-5-o2", text: "System.Object" },
            { _id: "off-csh-5-o3", text: "System.Root" },
            { _id: "off-csh-5-o4", text: "System.Base" }
          ],
          correctOptionIndex: 1,
          explanation: "System.Object is the ultimate base class of all C# classes, structures, and value type interfaces."
        }
      ]
    }
  },
  "sql": {
    "easy": {
      title: "SQL Databases (Offline)",
      description: "Offline-ready basic SQL questions.",
      category: "sql",
      difficulty: "easy",
      questions: [
        {
          _id: "off-sq-1",
          questionText: "Which SQL clause filters records from a query?",
          options: [
            { _id: "off-sq-1-o1", text: "WHERE" },
            { _id: "off-sq-1-o2", text: "HAVING" },
            { _id: "off-sq-1-o3", text: "FILTER" },
            { _id: "off-sq-1-o4", text: "GROUP BY" }
          ],
          correctOptionIndex: 0,
          explanation: "The WHERE clause is used to filter records in SELECT, UPDATE, or DELETE operations before grouping."
        },
        {
          _id: "off-sq-2",
          questionText: "Which command removes all rows from a table without logging individual deletions?",
          options: [
            { _id: "off-sq-2-o1", text: "DELETE" },
            { _id: "off-sq-2-o2", text: "TRUNCATE" },
            { _id: "off-sq-2-o3", text: "DROP" },
            { _id: "off-sq-2-o4", text: "REMOVE" }
          ],
          correctOptionIndex: 1,
          explanation: "TRUNCATE is a DDL command that quickly empties a table by deallocating its data pages, bypass logging."
        },
        {
          _id: "off-sq-3",
          questionText: "Which join returns all matching records from both tables?",
          options: [
            { _id: "off-sq-3-o1", text: "LEFT JOIN" },
            { _id: "off-sq-3-o2", text: "RIGHT JOIN" },
            { _id: "off-sq-3-o3", text: "INNER JOIN" },
            { _id: "off-sq-3-o4", text: "CROSS JOIN" }
          ],
          correctOptionIndex: 2,
          explanation: "INNER JOIN returns records that have matching values in both tables being joined."
        },
        {
          _id: "off-sq-4",
          questionText: "Which SQL function counts the number of rows?",
          options: [
            { _id: "off-sq-4-o1", text: "COUNT()" },
            { _id: "off-sq-4-o2", text: "SUM()" },
            { _id: "off-sq-4-o3", text: "ROWS()" },
            { _id: "off-sq-4-o4", text: "TOTAL()" }
          ],
          correctOptionIndex: 0,
          explanation: "The COUNT() aggregate function returns the total number of table rows matching query conditions."
        },
        {
          _id: "off-sq-5",
          questionText: "Which constraint guarantees that all values in a column are unique?",
          options: [
            { _id: "off-sq-5-o1", text: "NOT NULL" },
            { _id: "off-sq-5-o2", text: "UNIQUE" },
            { _id: "off-sq-5-o3", text: "PRIMARY KEY" },
            { _id: "off-sq-5-o4", text: "CHECK" }
          ],
          correctOptionIndex: 1,
          explanation: "The UNIQUE constraint ensures that all values in a column or index set are distinct from each other."
        }
      ]
    }
  },
  "data-structures": {
    "easy": {
      title: "Data Structures (Offline)",
      description: "Offline-ready basic Data Structures questions.",
      category: "data-structures",
      difficulty: "easy",
      questions: [
        {
          _id: "off-ds-1",
          questionText: "Which data structure follows LIFO (Last In First Out) order?",
          options: [
            { _id: "off-ds-1-o1", text: "Queue" },
            { _id: "off-ds-1-o2", text: "Stack" },
            { _id: "off-ds-1-o3", text: "Tree" },
            { _id: "off-ds-1-o4", text: "Heap" }
          ],
          correctOptionIndex: 1,
          explanation: "A Stack is a linear data structure that operates on a LIFO (Last In, First Out) access model."
        },
        {
          _id: "off-ds-2",
          questionText: "Which data structure follows FIFO (First In First Out) order?",
          options: [
            { _id: "off-ds-2-o1", text: "Stack" },
            { _id: "off-ds-2-o2", text: "Queue" },
            { _id: "off-ds-2-o3", text: "Linked List" },
            { _id: "off-ds-2-o4", text: "Graph" }
          ],
          correctOptionIndex: 1,
          explanation: "A Queue operates on a FIFO (First In, First Out) model, where items are inserted at the back and removed from the front."
        },
        {
          _id: "off-ds-3",
          questionText: "What is the node at the top of a tree structure called?",
          options: [
            { _id: "off-ds-3-o1", text: "Leaf" },
            { _id: "off-ds-3-o2", text: "Parent" },
            { _id: "off-ds-3-o3", text: "Root" },
            { _id: "off-ds-3-o4", text: "Stem" }
          ],
          correctOptionIndex: 2,
          explanation: "The top-most node in a hierarchical tree data structure is called the Root. It has no parents."
        },
        {
          _id: "off-ds-4",
          questionText: "Which data structure maps keys directly to values for fast lookup?",
          options: [
            { _id: "off-ds-4-o1", text: "Hash Table" },
            { _id: "off-ds-4-o2", text: "Binary Tree" },
            { _id: "off-ds-4-o3", text: "Linked List" },
            { _id: "off-ds-4-o4", text: "Stack" }
          ],
          correctOptionIndex: 0,
          explanation: "A Hash Table maps keys to values using a hashing function, achieving average O(1) time complexity for lookup."
        },
        {
          _id: "off-ds-5",
          questionText: "What is a dynamic data structure where nodes point to next nodes in a sequence?",
          options: [
            { _id: "off-ds-5-o1", text: "Array" },
            { _id: "off-ds-5-o2", text: "Linked List" },
            { _id: "off-ds-5-o3", text: "Stack" },
            { _id: "off-ds-5-o4", text: "Binary Search Tree" }
          ],
          correctOptionIndex: 1,
          explanation: "A Linked List is a linear collection of data elements (nodes), where each node points to the next node."
        }
      ]
    }
  },
  "algorithms": {
    "easy": {
      title: "Algorithms (Offline)",
      description: "Offline-ready basic Algorithms questions.",
      category: "algorithms",
      difficulty: "easy",
      questions: [
        {
          _id: "off-al-1",
          questionText: "What is the average time complexity of Quick Sort?",
          options: [
            { _id: "off-al-1-o1", text: "O(n log n)" },
            { _id: "off-al-1-o2", text: "O(n)" },
            { _id: "off-al-1-o3", text: "O(n^2)" },
            { _id: "off-al-1-o4", text: "O(log n)" }
          ],
          correctOptionIndex: 0,
          explanation: "Quick Sort is a divide-and-conquer algorithm with an average time complexity of O(n log n)."
        },
        {
          _id: "off-al-2",
          questionText: "Which algorithm finds the shortest path in a weighted graph with non-negative weights?",
          options: [
            { _id: "off-al-2-o1", text: "Kruskal's Algorithm" },
            { _id: "off-al-2-o2", text: "Dijkstra's Algorithm" },
            { _id: "off-al-2-o3", text: "Prim's Algorithm" },
            { _id: "off-al-2-o4", text: "Binary Search" }
          ],
          correctOptionIndex: 1,
          explanation: "Dijkstra's algorithm solves the single-source shortest path problem for weighted graphs with non-negative weights."
        },
        {
          _id: "off-al-3",
          questionText: "Which sorting algorithm works by repeatedly swapping adjacent elements that are out of order?",
          options: [
            { _id: "off-al-3-o1", text: "Merge Sort" },
            { _id: "off-al-3-o2", text: "Quick Sort" },
            { _id: "off-al-3-o3", text: "Bubble Sort" },
            { _id: "off-al-3-o4", text: "Selection Sort" }
          ],
          correctOptionIndex: 2,
          explanation: "Bubble Sort is a simple comparison sort that steps through the list, swapping adjacent elements if they are in the wrong order."
        },
        {
          _id: "off-al-4",
          questionText: "What is the runtime complexity of binary search on a sorted list?",
          options: [
            { _id: "off-al-4-o1", text: "O(log n)" },
            { _id: "off-al-4-o2", text: "O(n)" },
            { _id: "off-al-4-o3", text: "O(n log n)" },
            { _id: "off-al-4-o4", text: "O(1)" }
          ],
          correctOptionIndex: 0,
          explanation: "Binary search repeatedly halves the search space, yielding a logarithmic time complexity of O(log n)."
        },
        {
          _id: "off-al-5",
          questionText: "Which algorithm design pattern divides a problem into subproblems recursively?",
          options: [
            { _id: "off-al-5-o1", text: "Greedy Choice" },
            { _id: "off-al-5-o2", text: "Divide and Conquer" },
            { _id: "off-al-5-o3", text: "Dynamic Programming" },
            { _id: "off-al-5-o4", text: "Backtracking" }
          ],
          correctOptionIndex: 1,
          explanation: "Divide and Conquer works by recursively breaking down a problem into two or more sub-problems of the same type."
        }
      ]
    }
  },
  "computer-science": {
    "easy": {
      title: "Computer Science Quiz (Offline)",
      description: "Predefined general computer science questions for guest mode fallbacks.",
      category: "computer-science",
      difficulty: "easy",
      questions: [
        {
          _id: "off-cs-gen-1",
          questionText: "Which component inside a computer executes mathematical and logical operations?",
          options: [
            { _id: "off-cs-gen-1-o1", text: "CPU (Central Processing Unit)" },
            { _id: "off-cs-gen-1-o2", text: "RAM" },
            { _id: "off-cs-gen-1-o3", text: "Hard Drive" },
            { _id: "off-cs-gen-1-o4", text: "Graphics Card" }
          ],
          correctOptionIndex: 0,
          explanation: "The CPU is the primary processing unit that executes operations and instruction steps inside a computer."
        },
        {
          _id: "off-cs-gen-2",
          questionText: "What does IP stand for in internet communication protocols?",
          options: [
            { _id: "off-cs-gen-2-o1", text: "Intranet Port" },
            { _id: "off-cs-gen-2-o2", text: "Internet Protocol" },
            { _id: "off-cs-gen-2-o3", text: "Internal Process" },
            { _id: "off-cs-gen-2-o4", text: "Instruction Path" }
          ],
          correctOptionIndex: 1,
          explanation: "IP stands for Internet Protocol, which defines addressing rules to route data packets across networks."
        },
        {
          _id: "off-cs-gen-3",
          questionText: "Which storage type is volatile and loses contents when the computer is powered off?",
          options: [
            { _id: "off-cs-gen-3-o1", text: "SSD" },
            { _id: "off-cs-gen-3-o2", text: "ROM" },
            { _id: "off-cs-gen-3-o3", text: "RAM (Random Access Memory)" },
            { _id: "off-cs-gen-3-o4", text: "USB Flash Drive" }
          ],
          correctOptionIndex: 2,
          explanation: "RAM is volatile memory. It requires electrical power to maintain state data and holds current application information."
        },
        {
          _id: "off-cs-gen-4",
          questionText: "What is the primary function of a Domain Name Server (DNS)?",
          options: [
            { _id: "off-cs-gen-4-o1", text: "Translating human-readable domain names to numerical IP addresses" },
            { _id: "off-cs-gen-4-o2", text: "Encrypting local password database storage" },
            { _id: "off-cs-gen-4-o3", text: "Compressing images for faster network transmission" },
            { _id: "off-cs-gen-4-o4", text: "Caching HTML files inside the local browser" }
          ],
          correctOptionIndex: 0,
          explanation: "DNS functions as the phone book of the internet, resolving hostname domain strings (e.g. google.com) into routing IP targets."
        },
        {
          _id: "off-cs-gen-5",
          questionText: "Which network device forwards data packets between separate computer networks?",
          options: [
            { _id: "off-cs-gen-5-o1", text: "Hub" },
            { _id: "off-cs-gen-5-o2", text: "Router" },
            { _id: "off-cs-gen-5-o3", text: "Repeater" },
            { _id: "off-cs-gen-5-o4", text: "Network Interface Card" }
          ],
          correctOptionIndex: 1,
          explanation: "Routers forward packets between network networks by inspecting destination IP headers and selecting optimized pathways."
        }
      ]
    }
  }
};

/**
 * Returns a fallback offline quiz structure or a default placeholder if subject is not seeded
 */
export function getOfflineQuiz(subject, difficulty) {
  const sub = subject.toLowerCase().replace(/\s+/g, "").replace(/\./g, "").replace(/\+/g, "p").replace(/#/g, "sharp");
  const diff = difficulty.toLowerCase();
  
  // Standard mapped redirects for abbreviations/symbols
  let lookupKey = sub;
  if (sub === "cpp") lookupKey = "cpp";
  else if (sub === "csharp") lookupKey = "csharp";
  else if (sub === "nodejs") lookupKey = "nodejs";
  else if (sub === "expressjs") lookupKey = "expressjs";
  
  if (offlineQuizzes[lookupKey] && offlineQuizzes[lookupKey][diff]) {
    return offlineQuizzes[lookupKey][diff];
  }
  
  // Return the high-quality general computer-science quiz fallback instead of the buggy template
  return {
    title: `${subject.toUpperCase()} Fallback Quiz`,
    description: "Predefined general computer science and technology questions.",
    category: lookupKey,
    difficulty: diff,
    questions: offlineQuizzes["computer-science"]["easy"].questions
  };
}
