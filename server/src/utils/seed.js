/**
 * seeds the DB with one admin user and a set of high-quality quizzes for various subjects.
 * Run with: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

const quizzesToSeed = [
  // === JAVASCRIPT EASY ===
  {
    title: 'JavaScript Fundamentals',
    description: 'Basic syntax, variables, data types, and simple operators.',
    category: 'javascript',
    difficulty: 'easy',
    timeLimitSeconds: 1200,
    questions: [
      {
        questionText: 'Which keyword declares a variable that cannot be reassigned?',
        points: 1,
        options: [
          { text: 'var', isCorrect: false },
          { text: 'let', isCorrect: false },
          { text: 'const', isCorrect: true },
          { text: 'static', isCorrect: false }
        ]
      },
      {
        questionText: 'What is the correct syntax to log "Hello World" to the console?',
        points: 1,
        options: [
          { text: 'print("Hello World")', isCorrect: false },
          { text: 'console.log("Hello World")', isCorrect: true },
          { text: 'log.console("Hello World")', isCorrect: false },
          { text: 'response.write("Hello World")', isCorrect: false }
        ]
      },
      {
        questionText: 'Which data type is NOT primitive in JavaScript?',
        points: 1,
        options: [
          { text: 'String', isCorrect: false },
          { text: 'Number', isCorrect: false },
          { text: 'Boolean', isCorrect: false },
          { text: 'Object', isCorrect: true }
        ]
      },
      {
        questionText: 'How do you write a single-line comment in JavaScript?',
        points: 1,
        options: [
          { text: '// This is a comment', isCorrect: true },
          { text: '/* This is a comment */', isCorrect: false },
          { text: '# This is a comment', isCorrect: false },
          { text: '<!-- This is a comment -->', isCorrect: false }
        ]
      },
      {
        questionText: 'What does the operator "===" do?',
        points: 1,
        options: [
          { text: 'Compares value only', isCorrect: false },
          { text: 'Compares both value and type', isCorrect: true },
          { text: 'Assigns a constant value', isCorrect: false },
          { text: 'Checks if variables point to the same memory space', isCorrect: false }
        ]
      }
    ]
  },
  // === JAVASCRIPT MEDIUM ===
  {
    title: 'JavaScript Scope & Async',
    description: 'Closures, promises, scopes, and advanced ES6+ arrays.',
    category: 'javascript',
    difficulty: 'medium',
    timeLimitSeconds: 2700,
    questions: [
      {
        questionText: 'What is the output of: console.log(typeof NaN);',
        points: 1,
        options: [
          { text: '"number"', isCorrect: true },
          { text: '"NaN"', isCorrect: false },
          { text: '"undefined"', isCorrect: false },
          { text: '"object"', isCorrect: false }
        ]
      },
      {
        questionText: 'Which of the following is true about Closures in JavaScript?',
        points: 1,
        options: [
          { text: 'They allow inner functions to access outer function scope even after the outer function has finished executing.', isCorrect: true },
          { text: 'They prevent memory leaks by automatically deleting unused variables.', isCorrect: false },
          { text: 'They are only created when using arrow functions.', isCorrect: false },
          { text: 'They speed up script loading times.', isCorrect: false }
        ]
      },
      {
        questionText: 'What does Promise.all() do?',
        points: 1,
        options: [
          { text: 'Runs promises in series and stops at the first rejection.', isCorrect: false },
          { text: 'Runs promises in parallel and resolves only when all promises resolve, or rejects immediately when one rejects.', isCorrect: true },
          { text: 'Resolves as soon as any promise in the array resolves.', isCorrect: false },
          { text: 'Converts callback-based APIs into modern async/await syntax.', isCorrect: false }
        ]
      },
      {
        questionText: 'Which array method returns a new array with all elements that pass a test?',
        points: 1,
        options: [
          { text: 'map()', isCorrect: false },
          { text: 'forEach()', isCorrect: false },
          { text: 'filter()', isCorrect: true },
          { text: 'find()', isCorrect: false }
        ]
      },
      {
        questionText: 'What is the "event loop" responsible for in JS?',
        points: 1,
        options: [
          { text: 'Garbage collection of DOM nodes.', isCorrect: false },
          { text: 'Handling execution of multiple threads.', isCorrect: false },
          { text: 'Monitoring the call stack and callback queue to execute asynchronous callbacks.', isCorrect: true },
          { text: 'Securing API endpoints against script injection.', isCorrect: false }
        ]
      }
    ]
  },
  // === JAVASCRIPT HARD ===
  {
    title: 'JavaScript Advanced concepts',
    description: 'Prototypes, event loop details, memory management, and meta-programming.',
    category: 'javascript',
    difficulty: 'hard',
    timeLimitSeconds: 3600,
    questions: [
      {
        questionText: 'How can you prevent any modifications (adding, deleting, or changing properties) to an object?',
        points: 1,
        options: [
          { text: 'Object.seal(obj)', isCorrect: false },
          { text: 'Object.freeze(obj)', isCorrect: true },
          { text: 'Object.preventExtensions(obj)', isCorrect: false },
          { text: 'Object.lock(obj)', isCorrect: false }
        ]
      },
      {
        questionText: 'What is the output of: console.log([] == ![]);',
        points: 1,
        options: [
          { text: 'true', isCorrect: true },
          { text: 'false', isCorrect: false },
          { text: 'TypeError', isCorrect: false },
          { text: 'undefined', isCorrect: false }
        ]
      },
      {
        questionText: 'Which microtask queue is processed before standard promises in Node.js event loop?',
        points: 1,
        options: [
          { text: 'setImmediate', isCorrect: false },
          { text: 'setTimeout', isCorrect: false },
          { text: 'process.nextTick', isCorrect: true },
          { text: 'requestAnimationFrame', isCorrect: false }
        ]
      },
      {
        questionText: 'What is a WeakMap in JavaScript?',
        points: 1,
        options: [
          { text: 'A Map where keys must be objects and are held weakly, allowing them to be garbage collected if there are no other references.', isCorrect: true },
          { text: 'A Map that allows duplicated keys.', isCorrect: false },
          { text: 'A Map that runs slower for lookups but consumes less initial memory.', isCorrect: false },
          { text: 'A deprecated version of Map kept for backward compatibility.', isCorrect: false }
        ]
      },
      {
        questionText: 'What is the purpose of the Reflect API in ES6?',
        points: 1,
        options: [
          { text: 'To perform mathematical calculations on vectors.', isCorrect: false },
          { text: 'To duplicate objects deep-copied.', isCorrect: false },
          { text: 'To provide methods for interceptable JavaScript operations, aligning with Proxy traps.', isCorrect: true },
          { text: 'To render HTML components dynamically in canvas.', isCorrect: false }
        ]
      }
    ]
  },
  // === REACT EASY ===
  {
    title: 'React Core Concepts',
    description: 'Components, JSX, props, and standard state hooks.',
    category: 'react',
    difficulty: 'easy',
    timeLimitSeconds: 1200,
    questions: [
      {
        questionText: 'Which React hook is used to manage local component state?',
        points: 1,
        options: [
          { text: 'useEffect', isCorrect: false },
          { text: 'useContext', isCorrect: false },
          { text: 'useState', isCorrect: true },
          { text: 'useReducer', isCorrect: false }
        ]
      },
      {
        questionText: 'How do you pass data from a parent component to a child component?',
        points: 1,
        options: [
          { text: 'Via local state', isCorrect: false },
          { text: 'Via props', isCorrect: true },
          { text: 'Via URL search query parameters', isCorrect: false },
          { text: 'Via Redux dispatchers', isCorrect: false }
        ]
      },
      {
        questionText: 'What is JSX in React?',
        points: 1,
        options: [
          { text: 'A type of databases tailored for React apps.', isCorrect: false },
          { text: 'A syntax extension to JavaScript that template UI layout with HTML-like tags.', isCorrect: true },
          { text: 'A CSS preprocessor designed for fast layouts.', isCorrect: false },
          { text: 'An build engine replacing Babel and Vite.', isCorrect: false }
        ]
      },
      {
        questionText: 'What is the default port for local development servers using Create React App?',
        points: 1,
        options: [
          { text: '8080', isCorrect: false },
          { text: '5000', isCorrect: false },
          { text: '3000', isCorrect: true },
          { text: '5173', isCorrect: false }
        ]
      },
      {
        questionText: 'Why is it important to use a "key" prop in dynamic lists?',
        points: 1,
        options: [
          { text: 'To style elements uniquely in CSS.', isCorrect: false },
          { text: 'To encrypt list item contents.', isCorrect: false },
          { text: 'To help React identify which items have changed, been added, or removed, optimizing DOM updates.', isCorrect: true },
          { text: 'To automatically assign event listeners to children.', isCorrect: false }
        ]
      }
    ]
  },
  // === HTML EASY ===
  {
    title: 'HTML Structure & Semantics',
    description: 'Semantic tags, forms, tables, and anchor attributes.',
    category: 'html',
    difficulty: 'easy',
    timeLimitSeconds: 1200,
    questions: [
      {
        questionText: 'What does HTML stand for?',
        points: 1,
        options: [
          { text: 'Hyper Text Markup Language', isCorrect: true },
          { text: 'High Text Machine Language', isCorrect: false },
          { text: 'Hyper Transfer Markup Language', isCorrect: false },
          { text: 'Hyper Text Machine Language', isCorrect: false }
        ]
      },
      {
        questionText: 'Which HTML5 element is used to represent self-contained content, like a blog post or news story?',
        points: 1,
        options: [
          { text: '<section>', isCorrect: false },
          { text: '<article>', isCorrect: true },
          { text: '<div>', isCorrect: false },
          { text: '<aside>', isCorrect: false }
        ]
      },
      {
        questionText: 'Which attribute opens a linked document in a new browser tab?',
        points: 1,
        options: [
          { text: 'target="_new"', isCorrect: false },
          { text: 'target="_blank"', isCorrect: true },
          { text: 'rel="noopener"', isCorrect: false },
          { text: 'href="newtab"', isCorrect: false }
        ]
      },
      {
        questionText: 'Which tag is used to create an ordered list?',
        points: 1,
        options: [
          { text: '<ul>', isCorrect: false },
          { text: '<li>', isCorrect: false },
          { text: '<ol>', isCorrect: true },
          { text: '<dl>', isCorrect: false }
        ]
      },
      {
        questionText: 'What is the purpose of the "alt" attribute on an image tag?',
        points: 1,
        options: [
          { text: 'To set alternative CSS styles.', isCorrect: false },
          { text: 'To define alternate image source URLs.', isCorrect: false },
          { text: 'To provide a text description for screen readers and search engines.', isCorrect: true },
          { text: 'To rotate the image by 90 degrees.', isCorrect: false }
        ]
      }
    ]
  },
  // === CSS EASY ===
  {
    title: 'CSS Styling Rules',
    description: 'CSS selectors, box model, margins, colors, and layout units.',
    category: 'css',
    difficulty: 'easy',
    timeLimitSeconds: 1200,
    questions: [
      {
        questionText: 'Which CSS property controls the spacing inside an element, between content and border?',
        points: 1,
        options: [
          { text: 'margin', isCorrect: false },
          { text: 'spacing', isCorrect: false },
          { text: 'padding', isCorrect: true },
          { text: 'border', isCorrect: false }
        ]
      },
      {
        questionText: 'How do you select an element with the class "card" in CSS?',
        points: 1,
        options: [
          { text: '#card', isCorrect: false },
          { text: '.card', isCorrect: true },
          { text: 'card', isCorrect: false },
          { text: '*card', isCorrect: false }
        ]
      },
      {
        questionText: 'Which value of "position" keeps an element fixed relative to the viewport even when scrolling?',
        points: 1,
        options: [
          { text: 'absolute', isCorrect: false },
          { text: 'relative', isCorrect: false },
          { text: 'fixed', isCorrect: true },
          { text: 'static', isCorrect: false }
        ]
      },
      {
        questionText: 'What does the CSS property "display: flex" do?',
        points: 1,
        options: [
          { text: 'Enables a grid-like layout for columns.', isCorrect: false },
          { text: 'Hides the element from search crawlers.', isCorrect: false },
          { text: 'Initializes a flex container to align and distribute child elements flexibly.', isCorrect: true },
          { text: 'Makes elements stretch across the full browser width.', isCorrect: false }
        ]
      },
      {
        questionText: 'Which of the following is a relative font unit based on the font-size of the root html element?',
        points: 1,
        options: [
          { text: 'px', isCorrect: false },
          { text: 'em', isCorrect: false },
          { text: 'rem', isCorrect: true },
          { text: 'vh', isCorrect: false }
        ]
      }
    ]
  },
  // === PYTHON EASY ===
  {
    title: 'Python Essentials',
    description: 'Basic syntax, lists, dictionaries, loops, and indentations.',
    category: 'python',
    difficulty: 'easy',
    timeLimitSeconds: 1200,
    questions: [
      {
        questionText: 'How do you write a comment in Python?',
        points: 1,
        options: [
          { text: '// This is a comment', isCorrect: false },
          { text: '# This is a comment', isCorrect: true },
          { text: '/* This is a comment */', isCorrect: false },
          { text: '<!-- This is a comment -->', isCorrect: false }
        ]
      },
      {
        questionText: 'Which data structure in Python is ordered, mutable, and allows duplicate values?',
        points: 1,
        options: [
          { text: 'List', isCorrect: true },
          { text: 'Tuple', isCorrect: false },
          { text: 'Set', isCorrect: false },
          { text: 'Dictionary', isCorrect: false }
        ]
      },
      {
        questionText: 'How do you declare a function in Python?',
        points: 1,
        options: [
          { text: 'function myFunc():', isCorrect: false },
          { text: 'def myFunc():', isCorrect: true },
          { text: 'func myFunc():', isCorrect: false },
          { text: 'void myFunc():', isCorrect: false }
        ]
      },
      {
        questionText: 'What is the output of print(2 ** 3) in Python?',
        points: 1,
        options: [
          { text: '6', isCorrect: false },
          { text: '8', isCorrect: true },
          { text: '9', isCorrect: false },
          { text: '5', isCorrect: false }
        ]
      },
      {
        questionText: 'How do you add an item to the end of a list in Python?',
        points: 1,
        options: [
          { text: 'list.add(item)', isCorrect: false },
          { text: 'list.push(item)', isCorrect: false },
          { text: 'list.append(item)', isCorrect: true },
          { text: 'list.insert(item)', isCorrect: false }
        ]
      }
    ]
  },
  // === SQL EASY ===
  {
    title: 'SQL Queries Basics',
    description: 'Select, where clauses, order by, and basic joins.',
    category: 'sql',
    difficulty: 'easy',
    timeLimitSeconds: 1200,
    questions: [
      {
        questionText: 'Which SQL statement is used to retrieve data from a database?',
        points: 1,
        options: [
          { text: 'GET', isCorrect: false },
          { text: 'SELECT', isCorrect: true },
          { text: 'EXTRACT', isCorrect: false },
          { text: 'OPEN', isCorrect: false }
        ]
      },
      {
        questionText: 'Which SQL clause is used to filter records?',
        points: 1,
        options: [
          { text: 'HAVING', isCorrect: false },
          { text: 'WHERE', isCorrect: true },
          { text: 'GROUP BY', isCorrect: false },
          { text: 'ORDER BY', isCorrect: false }
        ]
      },
      {
        questionText: 'How can you sort the results alphabetically in ascending order?',
        points: 1,
        options: [
          { text: 'SORT BY name', isCorrect: false },
          { text: 'ORDER BY name ASC', isCorrect: true },
          { text: 'ALIGN BY name', isCorrect: false },
          { text: 'ORDER BY name DESC', isCorrect: false }
        ]
      },
      {
        questionText: 'Which JOIN returns all records when there is a match in either left or right table?',
        points: 1,
        options: [
          { text: 'INNER JOIN', isCorrect: false },
          { text: 'LEFT JOIN', isCorrect: false },
          { text: 'FULL OUTER JOIN', isCorrect: true },
          { text: 'RIGHT JOIN', isCorrect: false }
        ]
      },
      {
        questionText: 'Which function finds the total number of records in a table?',
        points: 1,
        options: [
          { text: 'SUM()', isCorrect: false },
          { text: 'COUNT()', isCorrect: true },
          { text: 'TOTAL()', isCorrect: false },
          { text: 'MAX()', isCorrect: false }
        ]
      }
    ]
  }
];

const seed = async () => {
  await connectDB();

  console.log('Clearing database collection and recreating admin...');
  await User.deleteMany({ email: 'admin@quizapp.com' });
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@quizapp.com',
    password: 'password123',
    role: 'admin',
  });
  console.log('Admin user recreated: admin@quizapp.com / password123');

  console.log('Seeding quizzes...');
  for (const qData of quizzesToSeed) {
    // Delete existing matches first so seeding can run repeatedly without duplicates
    await Quiz.deleteMany({ title: qData.title, category: qData.category, difficulty: qData.difficulty });
    await Quiz.create({
      ...qData,
      createdBy: admin._id
    });
    console.log(`Seeded quiz: "${qData.title}" [${qData.category} - ${qData.difficulty}]`);
  }

  console.log('Seed completed successfully!');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
