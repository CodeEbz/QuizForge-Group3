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
          correctOptionIndex: 2 // const
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
          correctOptionIndex: 1 // console.log
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
          correctOptionIndex: 2 // Object
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
          correctOptionIndex: 1
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
          correctOptionIndex: 1
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
          correctOptionIndex: 0
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
          correctOptionIndex: 1
        }
      ]
    }
  }
};

/**
 * Returns a fallback offline quiz structure or a default placeholder if subject is not seeded
 */
export function getOfflineQuiz(subject, difficulty) {
  const sub = subject.toLowerCase();
  const diff = difficulty.toLowerCase();
  
  if (offlineQuizzes[sub] && offlineQuizzes[sub][diff]) {
    return offlineQuizzes[sub][diff];
  }
  
  // Generic fallback if subject is not found offline
  return {
    title: `${subject.toUpperCase()} Quiz (Offline Fallback)`,
    description: "Generic offline quiz questions.",
    category: sub,
    difficulty: diff,
    questions: [
      {
        _id: `off-gen-1`,
        questionText: `Which of the following describes ${subject}?`,
        options: [
          { _id: "off-gen-1-o1", text: "It is a programming language or software tool." },
          { _id: "off-gen-1-o2", text: "It is a hardware device." },
          { _id: "off-gen-1-o3", text: "It is an operating system." },
          { _id: "off-gen-1-o4", text: "None of the above." }
        ],
        correctOptionIndex: 0
      }
    ]
  };
}
