export const guestQuizzes = {
  javascript: [
    {
      _id: "js-1",
      questionText: "Which keyword is used to declare a constant in JavaScript?",
      points: 1,
      explanation: "The const keyword creates a block-scoped variable whose value cannot be reassigned.",
      options: [
        { _id: "js1-a", text: "var", isCorrect: false },
        { _id: "js1-b", text: "const", isCorrect: true },
        { _id: "js1-c", text: "let", isCorrect: false },
        { _id: "js1-d", text: "static", isCorrect: false }
      ]
    },
    {
      _id: "js-2",
      questionText: "Which method converts a JSON string into a JavaScript object?",
      points: 1,
      explanation: "JSON.parse() converts a JSON string into a JavaScript object.",
      options: [
        { _id: "js2-a", text: "JSON.parse()", isCorrect: true },
        { _id: "js2-b", text: "JSON.stringify()", isCorrect: false },
        { _id: "js2-c", text: "JSON.convert()", isCorrect: false },
        { _id: "js2-d", text: "JSON.object()", isCorrect: false }
      ]
    },
    {
      _id: "js-3",
      questionText: "Which operator checks both value and data type?",
      points: 1,
      explanation: "The strict equality operator (===) compares both value and type.",
      options: [
        { _id: "js3-a", text: "==", isCorrect: false },
        { _id: "js3-b", text: "=", isCorrect: false },
        { _id: "js3-c", text: "===", isCorrect: true },
        { _id: "js3-d", text: "!==", isCorrect: false }
      ]
    },
    {
      _id: "js-4",
      questionText: "Which array method creates a new array by applying a function to every element?",
      points: 1,
      explanation: "map() returns a new transformed array without modifying the original.",
      options: [
        { _id: "js4-a", text: "forEach()", isCorrect: false },
        { _id: "js4-b", text: "filter()", isCorrect: false },
        { _id: "js4-c", text: "map()", isCorrect: true },
        { _id: "js4-d", text: "reduce()", isCorrect: false }
      ]
    },
    {
      _id: "js-5",
      questionText: "Which keyword is used to create a class in JavaScript?",
      points: 1,
      explanation: "The class keyword was introduced in ES6 to define classes.",
      options: [
        { _id: "js5-a", text: "object", isCorrect: false },
        { _id: "js5-b", text: "prototype", isCorrect: false },
        { _id: "js5-c", text: "class", isCorrect: true },
        { _id: "js5-d", text: "constructor", isCorrect: false }
      ]
    }
  ],
  react: [
    {
      _id: "react-1",
      questionText: "Which hook is used to manage component state?",
      points: 1,
      explanation: "useState allows functional components to store and update state.",
      options: [
        { _id: "react1-a", text: "useRef", isCorrect: false },
        { _id: "react1-b", text: "useMemo", isCorrect: false },
        { _id: "react1-c", text: "useState", isCorrect: true },
        { _id: "react1-d", text: "useEffect", isCorrect: false }
      ]
    },
    {
      _id: "react-2",
      questionText: "JSX stands for:",
      points: 1,
      explanation: "JSX stands for JavaScript XML.",
      options: [
        { _id: "react2-a", text: "Java Syntax Extension", isCorrect: false },
        { _id: "react2-b", text: "JavaScript XML", isCorrect: true },
        { _id: "react2-c", text: "JSON XML", isCorrect: false },
        { _id: "react2-d", text: "JavaScript XHTML", isCorrect: false }
      ]
    },
    {
      _id: "react-3",
      questionText: "Which hook runs side effects?",
      points: 1,
      explanation: "useEffect is designed for side effects such as API calls and subscriptions.",
      options: [
        { _id: "react3-a", text: "useState", isCorrect: false },
        { _id: "react3-b", text: "useReducer", isCorrect: false },
        { _id: "react3-c", text: "useEffect", isCorrect: true },
        { _id: "react3-d", text: "useMemo", isCorrect: false }
      ]
    },
    {
      _id: "react-4",
      questionText: "Props in React are:",
      points: 1,
      explanation: "Props are read-only values passed from a parent component.",
      options: [
        { _id: "react4-a", text: "Mutable state", isCorrect: false },
        { _id: "react4-b", text: "Read-only data passed to components", isCorrect: true },
        { _id: "react4-c", text: "Database records", isCorrect: false },
        { _id: "react4-d", text: "CSS classes", isCorrect: false }
      ]
    },
    {
      _id: "react-5",
      questionText: "Which command creates a React app using Vite?",
      points: 1,
      explanation: "npm create vite@latest is the recommended Vite starter command.",
      options: [
        { _id: "react5-a", text: "npm install react", isCorrect: false },
        { _id: "react5-b", text: "npm create vite@latest", isCorrect: true },
        { _id: "react5-c", text: "npm react new", isCorrect: false },
        { _id: "react5-d", text: "create-react vite", isCorrect: false }
      ]
    }
  ],
  html: [
    {
      _id: "html-1",
      questionText: "Which HTML tag is used to create a hyperlink?",
      points: 1,
      explanation: "The <a> (anchor) tag creates hyperlinks between pages or resources.",
      options: [
        { _id: "html1-a", text: "<link>", isCorrect: false },
        { _id: "html1-b", text: "<a>", isCorrect: true },
        { _id: "html1-c", text: "<href>", isCorrect: false },
        { _id: "html1-d", text: "<url>", isCorrect: false }
      ]
    },
    {
      _id: "html-2",
      questionText: "Which HTML element is used for the largest heading?",
      points: 1,
      explanation: "<h1> represents the highest-level heading.",
      options: [
        { _id: "html2-a", text: "<heading>", isCorrect: false },
        { _id: "html2-b", text: "<head>", isCorrect: false },
        { _id: "html2-c", text: "<h6>", isCorrect: false },
        { _id: "html2-d", text: "<h1>", isCorrect: true }
      ]
    },
    {
      _id: "html-3",
      questionText: "Which tag is used to insert an image?",
      points: 1,
      explanation: "The <img> tag embeds an image into a webpage.",
      options: [
        { _id: "html3-a", text: "<picture>", isCorrect: false },
        { _id: "html3-b", text: "<image>", isCorrect: false },
        { _id: "html3-c", text: "<img>", isCorrect: true },
        { _id: "html3-d", text: "<src>", isCorrect: false }
      ]
    },
    {
      _id: "html-4",
      questionText: "Which attribute specifies alternative text for an image?",
      points: 1,
      explanation: "The alt attribute provides alternative text for accessibility and when an image cannot load.",
      options: [
        { _id: "html4-a", text: "title", isCorrect: false },
        { _id: "html4-b", text: "alt", isCorrect: true },
        { _id: "html4-c", text: "src", isCorrect: false },
        { _id: "html4-d", text: "name", isCorrect: false }
      ]
    },
    {
      _id: "html-5",
      questionText: "Which HTML element is used to create an unordered list?",
      points: 1,
      explanation: "The <ul> element creates a bulleted list.",
      options: [
        { _id: "html5-a", text: "<ol>", isCorrect: false },
        { _id: "html5-b", text: "<list>", isCorrect: false },
        { _id: "html5-c", text: "<ul>", isCorrect: true },
        { _id: "html5-d", text: "<li>", isCorrect: false }
      ]
    }
  ],
  css: [
    {
      _id: "css-1",
      questionText: "Which CSS property changes the text color?",
      points: 1,
      explanation: "The color property controls the color of text.",
      options: [
        { _id: "css1-a", text: "font-color", isCorrect: false },
        { _id: "css1-b", text: "text-color", isCorrect: false },
        { _id: "css1-c", text: "color", isCorrect: true },
        { _id: "css1-d", text: "foreground", isCorrect: false }
      ]
    },
    {
      _id: "css-2",
      questionText: "Which property changes the background color of an element?",
      points: 1,
      explanation: "background-color sets the background color of an element.",
      options: [
        { _id: "css2-a", text: "bgcolor", isCorrect: false },
        { _id: "css2-b", text: "background-color", isCorrect: true },
        { _id: "css2-c", text: "background", isCorrect: false },
        { _id: "css2-d", text: "color", isCorrect: false }
      ]
    },
    {
      _id: "css-3",
      questionText: "Which CSS layout model is designed for one-dimensional layouts?",
      points: 1,
      explanation: "Flexbox is intended for arranging items in a row or column.",
      options: [
        { _id: "css3-a", text: "Grid", isCorrect: false },
        { _id: "css3-b", text: "Flexbox", isCorrect: true },
        { _id: "css3-c", text: "Float", isCorrect: false },
        { _id: "css3-d", text: "Table", isCorrect: false }
      ]
    },
    {
      _id: "css-4",
      questionText: "Which property controls the space outside an element's border?",
      points: 1,
      explanation: "Margin controls the outer spacing around an element.",
      options: [
        { _id: "css4-a", text: "padding", isCorrect: false },
        { _id: "css4-b", text: "spacing", isCorrect: false },
        { _id: "css4-c", text: "margin", isCorrect: true },
        { _id: "css4-d", text: "border-spacing", isCorrect: false }
      ]
    },
    {
      _id: "css-5",
      questionText: "Which selector targets an element with id='header'?",
      points: 1,
      explanation: "The # symbol selects an element by its id.",
      options: [
        { _id: "css5-a", text: ".header", isCorrect: false },
        { _id: "css5-b", text: "*header", isCorrect: false },
        { _id: "css5-c", text: "#header", isCorrect: true },
        { _id: "css5-d", text: "header#", isCorrect: false }
      ]
    }
  ],
  mongodb: [
    {
      _id: "mongo-1",
      questionText: "MongoDB stores data primarily as:",
      points: 1,
      explanation: "MongoDB stores data in BSON documents inside collections.",
      options: [
        { _id: "mongo1-a", text: "Rows", isCorrect: false },
        { _id: "mongo1-b", text: "Documents", isCorrect: true },
        { _id: "mongo1-c", text: "Tables", isCorrect: false },
        { _id: "mongo1-d", text: "Graphs", isCorrect: false }
      ]
    },
    {
      _id: "mongo-2",
      questionText: "Which command inserts one document into a collection?",
      points: 1,
      explanation: "insertOne() inserts a single document into a MongoDB collection.",
      options: [
        { _id: "mongo2-a", text: "addOne()", isCorrect: false },
        { _id: "mongo2-b", text: "insert()", isCorrect: false },
        { _id: "mongo2-c", text: "insertOne()", isCorrect: true },
        { _id: "mongo2-d", text: "saveOne()", isCorrect: false }
      ]
    },
    {
      _id: "mongo-3",
      questionText: "What is the equivalent of a table in MongoDB?",
      points: 1,
      explanation: "Collections group related documents, similar to tables in relational databases.",
      options: [
        { _id: "mongo3-a", text: "Schema", isCorrect: false },
        { _id: "mongo3-b", text: "Collection", isCorrect: true },
        { _id: "mongo3-c", text: "Database", isCorrect: false },
        { _id: "mongo3-d", text: "Index", isCorrect: false }
      ]
    },
    {
      _id: "mongo-4",
      questionText: "Which method retrieves documents from a collection?",
      points: 1,
      explanation: "find() returns documents that match a query.",
      options: [
        { _id: "mongo4-a", text: "search()", isCorrect: false },
        { _id: "mongo4-b", text: "get()", isCorrect: false },
        { _id: "mongo4-c", text: "find()", isCorrect: true },
        { _id: "mongo4-d", text: "fetch()", isCorrect: false }
      ]
    },
    {
      _id: "mongo-5",
      questionText: "Which field uniquely identifies every MongoDB document?",
      points: 1,
      explanation: "Every MongoDB document has a unique _id field.",
      options: [
        { _id: "mongo5-a", text: "id", isCorrect: false },
        { _id: "mongo5-b", text: "_key", isCorrect: false },
        { _id: "mongo5-c", text: "_id", isCorrect: true },
        { _id: "mongo5-d", text: "uuid", isCorrect: false }
      ]
    }
  ],
  nodejs: [
    {
      _id: "node-1",
      questionText: "Node.js is built on which JavaScript engine?",
      points: 1,
      explanation: "Node.js runs on Google's V8 JavaScript engine.",
      options: [
        { _id: "node1-a", text: "SpiderMonkey", isCorrect: false },
        { _id: "node1-b", text: "V8", isCorrect: true },
        { _id: "node1-c", text: "JavaScriptCore", isCorrect: false },
        { _id: "node1-d", text: "Chakra", isCorrect: false }
      ]
    },
    {
      _id: "node-2",
      questionText: "Which file commonly stores a Node.js project's dependencies?",
      points: 1,
      explanation: "package.json stores project metadata and dependencies.",
      options: [
        { _id: "node2-a", text: "node.json", isCorrect: false },
        { _id: "node2-b", text: "package.json", isCorrect: true },
        { _id: "node2-c", text: "modules.json", isCorrect: false },
        { _id: "node2-d", text: "dependencies.json", isCorrect: false }
      ]
    },
    {
      _id: "node-3",
      questionText: "Which package manager comes bundled with Node.js?",
      points: 1,
      explanation: "npm is installed automatically with Node.js.",
      options: [
        { _id: "node3-a", text: "Composer", isCorrect: false },
        { _id: "node3-b", text: "Yarn", isCorrect: false },
        { _id: "node3-c", text: "npm", isCorrect: true },
        { _id: "node3-d", text: "NuGet", isCorrect: false }
      ]
    },
    {
      _id: "node-4",
      questionText: "Which module allows Node.js to create an HTTP server?",
      points: 1,
      explanation: "The built-in http module provides server functionality.",
      options: [
        { _id: "node4-a", text: "server", isCorrect: false },
        { _id: "node4-b", text: "http", isCorrect: true },
        { _id: "node4-c", text: "network", isCorrect: false },
        { _id: "node4-d", text: "express", isCorrect: false }
      ]
    },
    {
      _id: "node-5",
      questionText: "Node.js primarily uses which programming language?",
      points: 1,
      explanation: "Applications in Node.js are written in JavaScript.",
      options: [
        { _id: "node5-a", text: "TypeScript only", isCorrect: false },
        { _id: "node5-b", text: "JavaScript", isCorrect: true },
        { _id: "node5-c", text: "Java", isCorrect: false },
        { _id: "node5-d", text: "Python", isCorrect: false }
      ]
    }
  ],
  express: [
    {
      _id: "express-1",
      questionText: "What is Express primarily used for?",
      points: 1,
      explanation: "Express is a minimal web framework for building web servers and APIs with Node.js.",
      options: [
        { _id: "express1-a", text: "Building mobile apps", isCorrect: false },
        { _id: "express1-b", text: "Creating Node.js web servers and APIs", isCorrect: true },
        { _id: "express1-c", text: "Managing databases", isCorrect: false },
        { _id: "express1-d", text: "Compiling JavaScript", isCorrect: false }
      ]
    },
    {
      _id: "express-2",
      questionText: "Which method defines a GET route in Express?",
      points: 1,
      explanation: "app.get() registers a route that responds to HTTP GET requests.",
      options: [
        { _id: "express2-a", text: "app.route()", isCorrect: false },
        { _id: "express2-b", text: "app.get()", isCorrect: true },
        { _id: "express2-c", text: "app.use()", isCorrect: false },
        { _id: "express2-d", text: "app.fetch()", isCorrect: false }
      ]
    },
    {
      _id: "express-3",
      questionText: "Which middleware parses incoming JSON request bodies?",
      points: 1,
      explanation: "express.json() parses JSON request bodies into req.body.",
      options: [
        { _id: "express3-a", text: "express.static()", isCorrect: false },
        { _id: "express3-b", text: "express.json()", isCorrect: true },
        { _id: "express3-c", text: "express.body()", isCorrect: false },
        { _id: "express3-d", text: "bodyParser.url()", isCorrect: false }
      ]
    },
    {
      _id: "express-4",
      questionText: "Which object contains URL parameters such as '/users/:id'?",
      points: 1,
      explanation: "req.params contains values extracted from route parameters.",
      options: [
        { _id: "express4-a", text: "req.body", isCorrect: false },
        { _id: "express4-b", text: "req.params", isCorrect: true },
        { _id: "express4-c", text: "req.query", isCorrect: false },
        { _id: "express4-d", text: "req.headers", isCorrect: false }
      ]
    },
    {
      _id: "express-5",
      questionText: "Which method starts an Express server?",
      points: 1,
      explanation: "app.listen() starts the server and listens for incoming requests.",
      options: [
        { _id: "express5-a", text: "app.run()", isCorrect: false },
        { _id: "express5-b", text: "app.start()", isCorrect: false },
        { _id: "express5-c", text: "app.listen()", isCorrect: true },
        { _id: "express5-d", text: "app.server()", isCorrect: false }
      ]
    }
  ],
  python: [
    {
      _id: "python-1",
      questionText: "Which keyword defines a function in Python?",
      points: 1,
      explanation: "Functions are declared using the def keyword.",
      options: [
        { _id: "python1-a", text: "func", isCorrect: false },
        { _id: "python1-b", text: "function", isCorrect: false },
        { _id: "python1-c", text: "def", isCorrect: true },
        { _id: "python1-d", text: "define", isCorrect: false }
      ]
    },
    {
      _id: "python-2",
      questionText: "Which data type stores key-value pairs in Python?",
      points: 1,
      explanation: "A dictionary stores data as key-value pairs.",
      options: [
        { _id: "python2-a", text: "List", isCorrect: false },
        { _id: "python2-b", text: "Tuple", isCorrect: false },
        { _id: "python2-c", text: "Dictionary", isCorrect: true },
        { _id: "python2-d", text: "Set", isCorrect: false }
      ]
    },
    {
      _id: "python-3",
      questionText: "Which keyword is used to create a class?",
      points: 1,
      explanation: "Python uses the class keyword for defining classes.",
      options: [
        { _id: "python3-a", text: "object", isCorrect: false },
        { _id: "python3-b", text: "class", isCorrect: true },
        { _id: "python3-c", text: "struct", isCorrect: false },
        { _id: "python3-d", text: "new", isCorrect: false }
      ]
    },
    {
      _id: "python-4",
      questionText: "What is the correct file extension for Python files?",
      points: 1,
      explanation: "Python source files use the .py extension.",
      options: [
        { _id: "python4-a", text: ".pt", isCorrect: false },
        { _id: "python4-b", text: ".python", isCorrect: false },
        { _id: "python4-c", text: ".py", isCorrect: true },
        { _id: "python4-d", text: ".pyt", isCorrect: false }
      ]
    },
    {
      _id: "python-5",
      questionText: "Which function prints output to the console?",
      points: 1,
      explanation: "print() displays output in the terminal or console.",
      options: [
        { _id: "python5-a", text: "echo()", isCorrect: false },
        { _id: "python5-b", text: "printf()", isCorrect: false },
        { _id: "python5-c", text: "print()", isCorrect: true },
        { _id: "python5-d", text: "console.log()", isCorrect: false }
      ]
    }
  ],
  java: [
    {
      _id: "java-1",
      questionText: "Which keyword is used to create an object in Java?",
      points: 1,
      explanation: "Objects are instantiated using the new keyword.",
      options: [
        { _id: "java1-a", text: "class", isCorrect: false },
        { _id: "java1-b", text: "new", isCorrect: true },
        { _id: "java1-c", text: "create", isCorrect: false },
        { _id: "java1-d", text: "object", isCorrect: false }
      ]
    },
    {
      _id: "java-2",
      questionText: "Which method is the entry point of a Java application?",
      points: 1,
      explanation: "Execution begins in the main() method.",
      options: [
        { _id: "java2-a", text: "start()", isCorrect: false },
        { _id: "java2-b", text: "run()", isCorrect: false },
        { _id: "java2-c", text: "main()", isCorrect: true },
        { _id: "java2-d", text: "execute()", isCorrect: false }
      ]
    },
    {
      _id: "java-3",
      questionText: "Java is primarily a:",
      points: 1,
      explanation: "Java is an object-oriented programming language.",
      options: [
        { _id: "java3-a", text: "Markup language", isCorrect: false },
        { _id: "java3-b", text: "Object-oriented programming language", isCorrect: true },
        { _id: "java3-c", text: "Database", isCorrect: false },
        { _id: "java3-d", text: "Web server", isCorrect: false }
      ]
    },
    {
      _id: "java-4",
      questionText: "Which keyword prevents a method from being overridden?",
      points: 1,
      explanation: "The final keyword prevents subclasses from overriding a method.",
      options: [
        { _id: "java4-a", text: "static", isCorrect: false },
        { _id: "java4-b", text: "private", isCorrect: false },
        { _id: "java4-c", text: "final", isCorrect: true },
        { _id: "java4-d", text: "const", isCorrect: false }
      ]
    },
    {
      _id: "java-5",
      questionText: "Which company originally developed Java?",
      points: 1,
      explanation: "Java was originally developed by Sun Microsystems before Oracle acquired it.",
      options: [
        { _id: "java5-a", text: "Microsoft", isCorrect: false },
        { _id: "java5-b", text: "Sun Microsystems", isCorrect: true },
        { _id: "java5-c", text: "IBM", isCorrect: false },
        { _id: "java5-d", text: "Google", isCorrect: false }
      ]
    }
  ],
  "C++": [
    {
      _id: "c++-1",
      questionText: "C++ is an extension of which programming language?",
      points: 1,
      explanation: "C++ was developed as an extension of the C programming language.",
      options: [
        { _id: "c++1-a", text: "Java", isCorrect: false },
        { _id: "c++1-b", text: "C", isCorrect: true },
        { _id: "c++1-c", text: "Python", isCorrect: false },
        { _id: "c++1-d", text: "Pascal", isCorrect: false }
      ]
    },
    {
      _id: "c++-2",
      questionText: "Which operator is used to access members through a pointer?",
      points: 1,
      explanation: "The arrow operator (->) accesses members of an object through a pointer.",
      options: [
        { _id: "c++2-a", text: ".", isCorrect: false },
        { _id: "c++2-b", text: "::", isCorrect: false },
        { _id: "c++2-c", text: "->", isCorrect: true },
        { _id: "c++2-d", text: "&", isCorrect: false }
      ]
    },
    {
      _id: "c++-3",
      questionText: "Which keyword creates a dynamically allocated object?",
      points: 1,
      explanation: "The new keyword allocates memory dynamically.",
      options: [
        { _id: "c++3-a", text: "malloc", isCorrect: false },
        { _id: "c++3-b", text: "create", isCorrect: false },
        { _id: "c++3-c", text: "new", isCorrect: true },
        { _id: "c++3-d", text: "alloc", isCorrect: false }
      ]
    },
    {
      _id: "c++-4",
      questionText: "Which function outputs text to the console?",
      points: 1,
      explanation: "std::cout is used with the insertion operator (<<) to print output.",
      options: [
        { _id: "c++4-a", text: "print()", isCorrect: false },
        { _id: "c++4-b", text: "std::cout", isCorrect: true },
        { _id: "c++4-c", text: "echo()", isCorrect: false },
        { _id: "c++4-d", text: "console.log()", isCorrect: false }
      ]
    },
    {
      _id: "c++-5",
      questionText: "Which header is commonly included for input and output streams?",
      points: 1,
      explanation: "The <iostream> header provides std::cin and std::cout.",
      options: [
        { _id: "c++5-a", text: "<stdio.h>", isCorrect: false },
        { _id: "c++5-b", text: "<iostream>", isCorrect: true },
        { _id: "c++5-c", text: "<string>", isCorrect: false },
        { _id: "c++5-d", text: "<vector>", isCorrect: false }
      ]
    }
  ],
  "C#": [
    {
      _id: "c#-1",
      questionText: "Which company developed C#?",
      points: 1,
      explanation: "C# was developed by Microsoft as part of the .NET platform.",
      options: [
        { _id: "c#1-a", text: "Oracle", isCorrect: false },
        { _id: "c#1-b", text: "Microsoft", isCorrect: true },
        { _id: "c#1-c", text: "Google", isCorrect: false },
        { _id: "c#1-d", text: "IBM", isCorrect: false }
      ]
    },
    {
      _id: "c#-2",
      questionText: "Which keyword is used to define a class in C#?",
      points: 1,
      explanation: "Classes in C# are declared using the class keyword.",
      options: [
        { _id: "c#2-a", text: "object", isCorrect: false },
        { _id: "c#2-b", text: "struct", isCorrect: false },
        { _id: "c#2-c", text: "class", isCorrect: true },
        { _id: "c#2-d", text: "new", isCorrect: false }
      ]
    },
    {
      _id: "c#-3",
      questionText: "Which method is the entry point of a C# application?",
      points: 1,
      explanation: "Execution starts in the Main() method.",
      options: [
        { _id: "c#3-a", text: "Start()", isCorrect: false },
        { _id: "c#3-b", text: "Main()", isCorrect: true },
        { _id: "c#3-c", text: "Run()", isCorrect: false },
        { _id: "c#3-d", text: "Execute()", isCorrect: false }
      ]
    },
    {
      _id: "c#-4",
      questionText: "Which symbol is used for single-line comments in C#?",
      points: 1,
      explanation: "Single-line comments begin with //.",
      options: [
        { _id: "c#4-a", text: "/* */", isCorrect: false },
        { _id: "c#4-b", text: "#", isCorrect: false },
        { _id: "c#4-c", text: "//", isCorrect: true },
        { _id: "c#4-d", text: "--", isCorrect: false }
      ]
    },
    {
      _id: "c#-5",
      questionText: "Which keyword creates an object in C#?",
      points: 1,
      explanation: "Objects are instantiated using the new keyword.",
      options: [
        { _id: "c#5-a", text: "create", isCorrect: false },
        { _id: "c#5-b", text: "instance", isCorrect: false },
        { _id: "c#5-c", text: "new", isCorrect: true },
        { _id: "c#5-d", text: "object", isCorrect: false }
      ]
    }
  ],
  "SQL": [
    {
      _id: "sql-1",
      questionText: "Which SQL statement retrieves data from a table?",
      points: 1,
      explanation: "SELECT retrieves records from a database table.",
      options: [
        { _id: "sql1-a", text: "GET", isCorrect: false },
        { _id: "sql1-b", text: "SELECT", isCorrect: true },
        { _id: "sql1-c", text: "FETCH", isCorrect: false },
        { _id: "sql1-d", text: "SHOW", isCorrect: false }
      ]
    },
    {
      _id: "sql-2",
      questionText: "Which clause filters rows in a SQL query?",
      points: 1,
      explanation: "WHERE filters records based on a condition.",
      options: [
        { _id: "sql2-a", text: "ORDER BY", isCorrect: false },
        { _id: "sql2-b", text: "GROUP BY", isCorrect: false },
        { _id: "sql2-c", text: "WHERE", isCorrect: true },
        { _id: "sql2-d", text: "HAVING", isCorrect: false }
      ]
    },
    {
      _id: "sql-3",
      questionText: "Which SQL command inserts a new row into a table?",
      points: 1,
      explanation: "INSERT INTO adds new rows to a table.",
      options: [
        { _id: "sql3-a", text: "CREATE", isCorrect: false },
        { _id: "sql3-b", text: "UPDATE", isCorrect: false },
        { _id: "sql3-c", text: "INSERT INTO", isCorrect: true },
        { _id: "sql3-d", text: "ALTER", isCorrect: false }
      ]
    },
    {
      _id: "sql-4",
      questionText: "Which keyword sorts query results?",
      points: 1,
      explanation: "ORDER BY sorts records in ascending or descending order.",
      options: [
        { _id: "sql4-a", text: "SORT BY", isCorrect: false },
        { _id: "sql4-b", text: "GROUP BY", isCorrect: false },
        { _id: "sql4-c", text: "ORDER BY", isCorrect: true },
        { _id: "sql4-d", text: "ARRANGE", isCorrect: false }
      ]
    },
    {
      _id: "sql-5",
      questionText: "Which SQL function counts the number of rows?",
      points: 1,
      explanation: "COUNT() returns the total number of matching rows.",
      options: [
        { _id: "sql5-a", text: "TOTAL()", isCorrect: false },
        { _id: "sql5-b", text: "COUNT()", isCorrect: true },
        { _id: "sql5-c", text: "SUM()", isCorrect: false },
        { _id: "sql5-d", text: "ROWS()", isCorrect: false }
      ]
    }
  ],
  "Data Structures": [
    {
      _id: "ds-1",
      questionText: "Which data structure follows the Last-In, First-Out (LIFO) principle?",
      points: 1,
      explanation: "Stacks remove the most recently added element first.",
      options: [
        { _id: "ds1-a", text: "Queue", isCorrect: false },
        { _id: "ds1-b", text: "Stack", isCorrect: true },
        { _id: "ds1-c", text: "Tree", isCorrect: false },
        { _id: "ds1-d", text: "Graph", isCorrect: false }
      ]
    },
    {
      _id: "ds-2",
      questionText: "Which data structure follows the First-In, First-Out (FIFO) principle?",
      points: 1,
      explanation: "Queues process elements in the order they are inserted.",
      options: [
        { _id: "ds2-a", text: "Stack", isCorrect: false },
        { _id: "ds2-b", text: "Queue", isCorrect: true },
        { _id: "ds2-c", text: "Tree", isCorrect: false },
        { _id: "ds2-d", text: "Linked List", isCorrect: false }
      ]
    },
    {
      _id: "ds-3",
      questionText: "Which data structure stores key-value pairs for fast lookup?",
      points: 1,
      explanation: "A hash table (hash map) stores key-value pairs.",
      options: [
        { _id: "ds3-a", text: "Stack", isCorrect: false },
        { _id: "ds3-b", text: "Hash Table", isCorrect: true },
        { _id: "ds3-c", text: "Queue", isCorrect: false },
        { _id: "ds3-d", text: "Array", isCorrect: false }
      ]
    },
    {
      _id: "ds-4",
      questionText: "Which traversal visits the root node before its children?",
      points: 1,
      explanation: "Preorder traversal visits the root before recursively visiting its children.",
      options: [
        { _id: "ds4-a", text: "Inorder", isCorrect: false },
        { _id: "ds4-b", text: "Postorder", isCorrect: false },
        { _id: "ds4-c", text: "Preorder", isCorrect: true },
        { _id: "ds4-d", text: "Level Order", isCorrect: false }
      ]
    },
    {
      _id: "ds-5",
      questionText: "What is the average time complexity for accessing an array element by index?",
      points: 1,
      explanation: "Array indexing is a constant-time operation: O(1).",
      options: [
        { _id: "ds5-a", text: "O(n)", isCorrect: false },
        { _id: "ds5-b", text: "O(log n)", isCorrect: false },
        { _id: "ds5-c", text: "O(1)", isCorrect: true },
        { _id: "ds5-d", text: "O(n²)", isCorrect: false }
      ]
    }
  ],
  "Algorithms": [
    {
      _id: "algo-1",
      questionText: "Which algorithm is commonly used to search a sorted array efficiently?",
      points: 1,
      explanation: "Binary Search repeatedly divides the search space in half.",
      options: [
        { _id: "algo1-a", text: "Linear Search", isCorrect: false },
        { _id: "algo1-b", text: "Binary Search", isCorrect: true },
        { _id: "algo1-c", text: "Bubble Sort", isCorrect: false },
        { _id: "algo1-d", text: "Quick Sort", isCorrect: false }
      ]
    },
    {
      _id: "algo-2",
      questionText: "What is the average time complexity of Binary Search?",
      points: 1,
      explanation: "Binary Search runs in O(log n) on sorted data.",
      options: [
        { _id: "algo2-a", text: "O(1)", isCorrect: false },
        { _id: "algo2-b", text: "O(log n)", isCorrect: true },
        { _id: "algo2-c", text: "O(n)", isCorrect: false },
        { _id: "algo2-d", text: "O(n²)", isCorrect: false }
      ]
    },
    {
      _id: "algo-3",
      questionText: "Which sorting algorithm repeatedly swaps adjacent elements until sorted?",
      points: 1,
      explanation: "Bubble Sort repeatedly compares adjacent elements.",
      options: [
        { _id: "algo3-a", text: "Merge Sort", isCorrect: false },
        { _id: "algo3-b", text: "Bubble Sort", isCorrect: true },
        { _id: "algo3-c", text: "Quick Sort", isCorrect: false },
        { _id: "algo3-d", text: "Heap Sort", isCorrect: false }
      ]
    },
    {
      _id: "algo-4",
      questionText: "Which algorithm finds the shortest path in a weighted graph with non-negative edge weights?",
      points: 1,
      explanation: "Dijkstra's algorithm efficiently computes shortest paths.",
      options: [
        { _id: "algo4-a", text: "Depth-First Search", isCorrect: false },
        { _id: "algo4-b", text: "Breadth-First Search", isCorrect: false },
        { _id: "algo4-c", text: "Dijkstra's Algorithm", isCorrect: true },
        { _id: "algo4-d", text: "Bubble Sort", isCorrect: false }
      ]
    },
    {
      _id: "algo-5",
      questionText: "Which search algorithm requires the data to be sorted?",
      points: 1,
      explanation: "Binary Search only works correctly on sorted collections.",
      options: [
        { _id: "algo5-a", text: "Linear Search", isCorrect: false },
        { _id: "algo5-b", text: "Binary Search", isCorrect: true },
        { _id: "algo5-c", text: "Depth-First Search", isCorrect: false },
        { _id: "algo5-d", text: "Breadth-First Search", isCorrect: false }
      ]
    }
  ]
};