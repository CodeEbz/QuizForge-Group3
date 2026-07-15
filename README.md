# ⚡ QuizForge - AI-Powered Full-Stack Quiz Application

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React-646CFF.svg)](https://vitejs.dev)
[![AI](https://img.shields.io/badge/AI-Groq-FF6F00.svg)](https://groq.com)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

**QuizForge** is a full-stack interactive quiz application built on the MERN stack (MongoDB, Express, React, Node.js) that leverages **Groq's AI models** to dynamically generate programming and computer science questions. Users can register accounts, track personal learning statistics, climb the global leaderboard, and take quizzes on 15+ subjects with AI-generated explanations.

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠 Tech Stack](#-tech-stack)
- [📂 Project Architecture](#-project-architecture)
- [🔌 API Endpoints](#-api-endpoints)
- [👥 Team Roles & Task Division](#-team-roles--task-division)
- [🚀 Local Installation & Setup](#-local-installation--setup)
- [🌐 Production Deployment Guide](#-production-deployment-guide)

---

## ✨ Key Features

* **AI-Generated Quizzes**: Uses Groq's Llama 3.1 models to generate unique, topic-specific questions on demand.
* **15+ Subjects**: JavaScript, React, Python, Algorithms, Data Structures, HTML, CSS, MongoDB, Node.js, Express, Java, C++, C#, SQL, and more.
* **3 Difficulty Levels**: Easy (20 Qs), Medium (30 Qs), Hard (50 Qs) with built-in timers.
* **Instant Scoring & Explanations**: Automatic grading with detailed answer reviews and AI-generated explanations.
* **Guest Mode**: Instantly explore the platform without registration – choose from a curated set of predefined quizzes.
* **Secure Authentication**: JWT-based authentication with password hashing (bcrypt) and input validation.
* **Interactive Dashboards**: Dynamic landing hub displaying summary statistics, recent attempt history, and global leaderboard.
* **Performance Analytics**: Visual breakdown of performance by subject and difficulty.
* **Flag for Review**: Mark questions you're unsure about and revisit them during review.
* **Responsive UI**: Works seamlessly across desktop and mobile devices.

---

## 🛠 Tech Stack

### Frontend
* **Core**: React 19, React Router DOM v7
* **Build Tool**: Vite, ESLint
* **Styling**: Vanilla CSS (Responsive, Modern CSS variables)
* **State Management**: React Hooks (useState, useEffect, useCallback, useRef)

### Backend & Database
* **Server**: Express, Node.js
* **Database**: MongoDB, Mongoose ODM
* **Security & Middleware**: Helmet, CORS, Express Rate Limit, Morgan, BCryptJS, JSONWebToken
* **AI Integration**: Groq SDK (llama-3.1-8b-instant / llama-3.3-70b-versatile)
* **Fallback API**: Open Trivia DB (Category 18 – Computers)
* **Validation**: Express Validator

---

## 📂 Project Architecture

The repository is structured as two distinct, isolated sub‑projects:

### 📱 Client (`client/`)
Contains the React frontend, static assets, styling, and API service layer.


client/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/                   # Static images and logo resources
│   ├── components/
│   │   ├── Logo.jsx              # Reusable SVG Logo component
│   │   └── Navbar.jsx            # Dynamic and responsive navigation bar
│   ├── data/
│   │   └── guestQuizzes.js       # Predefined quizzes for Guest Mode
│   ├── pages/
│   │   ├── Auth.jsx              # Sign In / Sign Up page
│   │   ├── Dashboard.jsx         # Hub for stats summaries and quiz listings
│   │   ├── Difficulty.jsx        # Quiz difficulty selector
│   │   ├── Leaderboard.jsx       # Global rankings list
│   │   ├── History.jsx           # User attempt history with review
│   │   ├── QuizMenu.jsx          # Topic-wise selector
│   │   ├── QuizPage.jsx          # Interactive quiz taking panel (questions, timer)
│   │   ├── ScorePage.jsx         # Detailed grading scorecard and answer review
│   │   └── Statistics.jsx        # Visual performance metrics by subject/difficulty
│   ├── services/
│   │   └── api.js                # API request engine (handles headers, tokens, guest mode)
│   ├── styles/                   # Custom vanilla CSS modules
│   ├── App.jsx                   # Main routing configuration
│   └── main.jsx                  # React application mount


### ⚙ Server (`server/`)
Contains the Express REST API, MongoDB schemas, and AI integration services.

server/
├── src/
│ ├── config/
│ │ └── db.js # Mongoose connection config
│ ├── controllers/
│ │ ├── attemptController.js # Quiz submission grading and attempt creation
│ │ ├── authController.js # User registration, login, and auth state
│ │ ├── leaderboardController.js # Aggregations for user rankings
│ │ ├── quizController.js # Queries for quiz structures
│ │ ├── statsController.js # Metric aggregations for user statistics
│ │ └── dynamicQuizController.js # AI-driven quiz generation
│ ├── middleware/
│ │ ├── authMiddleware.js # Validates JWT bearer tokens
│ │ ├── errorMiddleware.js # Express central error handler
│ │ └── validateMiddleware.js # Processes validation results
│ ├── models/
│ │ ├── Attempt.js # User attempt schema (with subject/difficulty)
│ │ ├── Quiz.js # Quiz and question structures
│ │ └── User.js # User information schema
│ ├── routes/
│ │ ├── attemptRoutes.js # Routes for attempt submissions and history
│ │ ├── authRoutes.js # Routes for login and registration
│ │ ├── leaderboardRoutes.js # Routes for ranking requests
│ │ ├── quizRoutes.js # Routes for quiz listings and generation
│ │ └── statsRoutes.js # Routes for statistics retrievals
│ ├── services/
│ │ ├── groqService.js # Integration with Groq AI API
│ │ └── triviaService.js # Fallback service using Open Trivia DB
│ ├── utils/
│ │ ├── ApiError.js # Custom API exception classes
│ │ ├── asyncHandler.js # Express route try-catch wrapper
│ │ ├── generateToken.js # Creates JWT for authenticated users
│ │ └── seed.js # Database seeding script for static quizzes
│ └── validators/
│ ├── attemptValidators.js # Schemas for validating attempts
│ ├── authValidators.js # Schemas for validating registry forms
│ └── quizValidators.js # Schemas for validating quiz creations
├── .env.example # Environment template
└── server.js # Root entry point



## 🔌 API Endpoints

All endpoints are prefixed with `/api` and require a `Bearer <token>` in the `Authorization` header once authenticated (except auth endpoints).

| Resource | HTTP Method | Path | Description | Authentication |
|---|---|---|---|---|
| **Auth** | POST | `/auth/register` | Register a new user | None |
| | POST | `/auth/login` | Log in and return JWT | None |
| | GET | `/auth/me` | Retrieve authenticated user profile | Required |
| **Quizzes**| POST | `/quizzes/generate` | Generate a new AI-powered quiz (subject, difficulty, count) | Required |
| | GET | `/quizzes/:id/play`| Fetch quiz details (stripped of answers for play) | Required |
| | GET | `/quizzes/:id/review`| Fetch quiz with correct answers for review | Required |
| **Attempts**| POST | `/attempts` | Submit answers for grading and log attempt | Required |
| | GET | `/attempts/my` | Get current user's attempt history | Required |
| **Stats** | GET | `/stats/me` | Fetch detailed aggregated stats for current user | Required |
| **Leaderboard**| GET | `/leaderboard` | Get global ranks (supports `limit` param) | Required |

---

## 👥 Team Roles & Task Division

### 👑 Project Management & Coordination
* **Eno** (*Project Coordinator*):
  - Directed team communications, scheduled project checkpoints, aligned frontend/backend milestones, and supervised end-to-end integration and delivery.

### 💻 Frontend Development Team
* **Ali & Queen** (*Auth Page*):
  - Implemented the registration and login interface (`Auth.jsx`), integrated with backend `/api/auth` endpoints, form validation, and password reset mock-up.
* **Isaac** (*Dashboard Page*):
  - Built the main landing hub (`Dashboard.jsx`), integrating dynamic statistics, recent activity feeds, and mini-leaderboard.
* **Esther & Fola** (*Quiz Page*):
  - Developed the core test-taking view (`QuizPage.jsx`), managing local state for answers, timer, navigation, and flagging questions.
* **Maxwell** (*Score Page*):
  - Created the results scorecard (`ScorePage.jsx`) with correct/wrong breakdowns, percentage display, and detailed answer review.
* **Onovo** (*Statistics Page*):
  - Authored the metrics panel (`Statistics.jsx`) with subject-based performance bars and difficulty breakdown.
* **Ayo & Nath** (*Profile Page*):
  - Programmed the account details settings page (`Profile.jsx`) enabling display name edits and logout actions.
* **Oluwafaloba** (*UI/UX Design & Styling*):
  - Designed the premium dark theme, glassmorphic layout, responsive navbar, custom quiz widgets, and overall visual aesthetics.

### ⚙ Backend & System Integration Team
* **Kelly** (*Backend Engineer*):
  - Authored the Express app with security middlewares (helmet, CORS, rate limiting) and route controllers. Implemented JWT authentication, bcrypt password hashing, and user protection middleware.
* **Collins** (*Database Manager*):
  - Designed and maintained MongoDB schemas (User, Quiz, Attempt) with optimized indexes and seeding scripts.
* **Neeza** (*AI Integration & Full-Stack Engineer*):
  - Integrated Groq AI SDK (`groqService.js`) for dynamic question generation with Llama models, implemented fallback to Open Trivia DB for the "Other" category.
  - Built the dynamic quiz generation endpoint and handled rate-limiting, chunked generation, and JSON parsing.
  - Developed guest mode support with predefined static quizzes and API mocking.

---

## 🚀 Local Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas)

### Step 1: Set up the Server
1. Navigate to the server folder:
   ```bash
   cd server
Install dependencies:

bash
npm install
Copy .env.example to .env and fill in your credentials:

MONGODB_URI – your MongoDB connection string

JWT_SECRET – a strong random secret

GROQ_API_KEY – your API key from Groq Console

Seed the database with initial quiz data (optional):

bash
npm run seed
Start the backend development server:

bash
npm run dev
The server runs on http://localhost:5000.

Step 2: Set up the Client
Navigate to the client folder:

bash
cd ../client
Install dependencies:

bash
npm install
Start the Vite React development server:

bash
npm run dev
The client runs on http://localhost:5173.

🌐 Production Deployment Guide
Server Deployment (e.g., Render)
Create a Web Service pointing to your backend repository.

Set environment variables:

PORT: 10000 (Render handles this)

NODE_ENV: production

MONGODB_URI: your MongoDB Atlas connection string

JWT_SECRET: a long, randomly generated secret

GROQ_API_KEY: your Groq API key

CLIENT_ORIGINS: your frontend URL (e.g., https://quizforge.vercel.app)

Client Deployment (e.g., Vercel)
Import the client/ folder to Vercel.

Update the API_BASE in client/src/services/api.js to point to your live backend:

javascript
const API_BASE = "https://your-backend-service.onrender.com/api";
Deploy – Vercel will build the React app and serve it via CDN.

Made with ❤️ by the QuizForge Team
Last Updated: July 2026