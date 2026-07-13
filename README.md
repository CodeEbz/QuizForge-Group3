# ⚡ QuizForge - Full-Stack Interactive PWA Quiz Application

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React-646CFF.svg)](https://vitejs.dev)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-success.svg)](#-offline-capabilities--syncing-flow)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

QuizForge is a full-stack interactive quiz application built on the MERN stack (MongoDB, Express, React, Node.js) with first-class **Progressive Web App (PWA) Offline Capabilities**. 

It allows users to register accounts, track personal learning statistics, climb the global leaderboard, and take quizzes on various computer science topics. If the user loses network connection, QuizForge automatically transitions to offline mode, allowing them to play cached/static quizzes and storing attempts locally to sync with the database once reconnected.

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠 Tech Stack](#-tech-stack)
- [📂 Project Architecture](#-project-architecture)
- [🔌 API Endpoints](#-api-endpoints)
- [👥 Team Roles & Task Division](#-team-roles--task-division)
- [🚀 Local Installation & Setup](#-local-installation--setup)
- [📶 Offline Capabilities & Syncing Flow](#-offline-capabilities--syncing-flow)
- [🌐 Production Deployment Guide](#-production-deployment-guide)

---

## ✨ Key Features
* **PWA & Offline-First Design**: Caches the application shell using a Service Worker. Works completely offline.
* **Local Grading Fallback**: Automatically grades attempts locally when offline and stores them in `localStorage`.
* **Auto-Syncing Mechanism**: Detects when the user comes back online and synchronizes local attempts with the database.
* **Secure Authentication**: Uses JSON Web Tokens (JWT) stored securely, with input validation and rate limiting.
* **Interactive Dashboards**: Dynamic landing hub displaying summary statistics and recent attempt history.
* **Global Leaderboard**: Live-updating rankings based on user scores.
* **Performance Graphs**: Visual categorization of performance metrics by category and difficulty.

---

## 🛠 Tech Stack

### Frontend
* **Core**: React 19, React Router DOM v7
* **Build Tool**: Vite, ESLint
* **Styling**: Vanilla CSS (Responsive, Modern CSS variables)
* **PWA**: Custom Service Worker caching (`sw.js`)

### Backend & Database
* **Server**: Express, Node.js
* **Database**: MongoDB, Mongoose ODM
* **Security & Middleware**: Helmet, CORS, Express Rate Limit, Morgan, BCryptJS, JSONWebToken
* **Validation**: Express Validator

---

## 📂 Project Architecture

The repository is structured as two distinct, isolated sub-projects:

### 📱 Client (`client/`)
Contains the React frontend, static assets, styling, and service worker configuration.
```text
client/
├── public/
│   ├── favicon.ico
│   └── sw.js                     # PWA Service worker handles caching and fetch routing
├── src/
│   ├── assets/                   # Static images and logo resources
│   ├── components/
│   │   ├── Logo.jsx              # Reusable vector SVG Logo component
│   │   └── Navbar.jsx            # Dynamic and responsive navigation bar
│   ├── data/
│   │   └── offlineQuizzes.js     # Hardcoded quizzes for offline play
│   ├── pages/
│   │   ├── Auth.jsx              # Sign In and Sign Up page
│   │   ├── Dashboard.jsx         # Hub for stats summaries and quiz lists
│   │   ├── Difficulty.jsx        # Quiz difficulty selector screen
│   │   ├── Leaderboard.jsx       # Global rankings list
│   │   ├── Profile.jsx           # User details and log out actions
│   │   ├── QuizMenu.jsx          # Topic-wise selector for quizzes
│   │   ├── QuizPage.jsx          # Interactive quiz taking panel (questions, timer)
│   │   ├── ScorePage.jsx         # Detailed grading scorecard and answers review
│   │   └── Statistics.jsx        # Visual details of performance metrics
│   ├── services/
│   │   ├── api.js                # API request engine (handles headers, tokens, guest mock)
│   │   └── offlineSync.js        # Background attempt manager synchronizing stored scores
│   ├── styles/                   # Custom vanilla CSS modules for pages and components
│   ├── App.jsx                   # Main layout routing configuration
│   └── main.jsx                  # React application mount script with service worker hook
```

### ⚙ Server (`server/`)
Contains the Express REST API and MongoDB schema definitions.
```text
server/
├── src/
│   ├── config/
│   │   └── db.js                 # Mongoose connection config
│   ├── controllers/
│   │   ├── attemptController.js  # Quiz submission grading and creation
│   │   ├── authController.js     # User registration, login, and auth state
│   │   ├── leaderboardController.js # Aggregations for user rankings
│   │   ├── quizController.js     # Queries for quiz structures
│   │   └── statsController.js    # Metric aggregations for user statistics
│   ├── middleware/
│   │   ├── authMiddleware.js     # Validates JWT bearer tokens
│   │   ├── errorMiddleware.js    # Express central error handler
│   │   └── validateMiddleware.js # Processes validation results
│   ├── models/
│   │   ├── Attempt.js            # User score attempt schema
│   │   ├── Quiz.js               # Quiz and question structures schema
│   │   └── User.js               # User information schema
│   ├── routes/
│   │   ├── attemptRoutes.js      # Routes for attempt creations
│   │   ├── authRoutes.js         # Routes for login and authentication
│   │   ├── leaderboardRoutes.js  # Routes for ranking requests
│   │   ├── quizRoutes.js         # Routes for quiz listings
│   │   └── statsRoutes.js        # Routes for statistics retrievals
│   ├── utils/
│   │   ├── ApiError.js           # Customized API exception classes
│   │   ├── asyncHandler.js       # Express route try-catch wrapper
│   │   ├── generateToken.js      # Creates JWT for authenticated users
│   │   └── seed.js               # Database seeding script for quizzes
│   └── validators/
│       ├── attemptValidators.js  # Schemas for validating attempts
│       ├── authValidators.js     # Schemas for validating registry forms
│       └── quizValidators.js     # Schemas for validating quiz creations
├── .env.example                  # Environment template file
├── server.js                     # Root entry point of the Node application
```

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api` and require a `Bearer <token>` token in the `Authorization` header once authenticated.

| Resource | HTTP Method | Path | Description | Authentication |
|---|---|---|---|---|
| **Auth** | POST | `/auth/register` | Register a new user | None |
| | POST | `/auth/login` | Log in existing user and return JWT | None |
| | GET | `/auth/me` | Retrieve authenticated user profile | Required |
| **Quizzes**| GET | `/quizzes` | Fetch list of quizzes (supports `category` & `difficulty` query filters) | Required |
| | GET | `/quizzes/:id` | Fetch full quiz details (with correct answers for review) | Required |
| | GET | `/quizzes/:id/play`| Fetch quiz details (stripped of answers for play) | Required |
| **Attempts**| POST | `/attempts` | Submit answers for grading and log attempt | Required |
| **Stats** | GET | `/stats/me` | Fetch detailed aggregated stats for current user | Required |
| **Leaderboard**| GET | `/leaderboard` | Get global ranks (supports `limit` query param) | Required |

---

## 👥 Team Roles & Task Division

Below is the official breakdown of the contributors in Group 3 and their contributions to the project:

### 👑 Project Management & Coordination
* **Eno** (*Project Coordinator*):
  - Directed team communications, scheduled project checkpoints, aligned frontend/backend milestones, and supervised the end-to-end integration and delivery process.

### 💻 Frontend Development Team
* **Ali** (*Auth page*):
  - Programmed the registration and login interface ([Auth.jsx](client/src/pages/Auth.jsx)). Structured form state binds and integrated the client with backend `/api/auth` endpoints.
* **Isaac** (*Dashboard page*):
  - Coded the main welcome landing hub ([Dashboard.jsx](client/src/pages/Dashboard.jsx)), integrating dynamic statistics summaries, recent activity feeds, and mini-leaderboard hooks.
* **Esther & Fola** (*Quiz page*):
  - Built the core test-taking view ([QuizPage.jsx](client/src/pages/QuizPage.jsx)) managing local option selection arrays, timer decrements, and dynamic navigation.
* **Maxwell** (*Score page*):
  - Built the results scorecard ([ScorePage.jsx](client/src/pages/ScorePage.jsx)), displaying correct/wrong counts, grading percentages, and a full option-by-option answer review table.
* **Onovo** (*Statistics page*):
  - Authored the metrics panel ([Statistics.jsx](client/src/pages/Statistics.jsx)), creating responsive graphical percentage tracks grouped by category and difficulty boxes.
* **Ayo & Nath** (*Profile page*):
  - Programmed the account details settings page ([Profile.jsx](client/src/pages/Profile.jsx)), enabling display name edits, password mocks, and clear session logouts.

### ⚙ Backend & System Integration Team
* **Kelly** (*Backend Engineer*):
  - Authored the modular Express app config ([app.js](server/src/app.js)) with security middlewares (`helmet`, CORS) and route controllers. Handled JWT generation, bcrypt password hashing, and user authentication protection.
* **Collins** (*Database Manager*):
  - Managed schemas for MongoDB collections ([User.js](server/src/models/User.js), [Quiz.js](server/src/models/Quiz.js), [Attempt.js](server/src/models/Attempt.js)). Optimized query performances via composite indexes and structured the expanded seed data array.
* **Neeza** (*DevOps and Deployment Engineer*):
  - Structured development environment bindings (`.env`), set up deployment routes, and handled automated build validation scripts for client/server packages.
* **Full-Stack & PWA Integration** (*Joint Team Effort*):
  - Authored the service worker ([sw.js](client/public/sw.js)) for static asset caching, programmed local grading fallbacks ([offlineQuizzes.js](client/src/data/offlineQuizzes.js)), and created the background attempts synchronization manager ([offlineSync.js](client/src/services/offlineSync.js)).

---

## 🚀 Local Installation & Setup

Follow these steps to run the full-stack system on your local machine:

### Prerequisites
- Node.js (version 18 or higher recommended)
- MongoDB instance running locally on port `27017`

### Step 1: Set up the Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the environment variables:
   - Copy `.env.example` to `.env` (a pre-configured `.env` is already supplied for local MongoDB at `mongodb://127.0.0.1:27017/QuizForge`).
4. Seed the database with quizzes and users:
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000`.*

### Step 2: Set up the Client
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The client will run on `http://localhost:5173`.*

---

## 📶 Offline Capabilities & Syncing Flow

To verify that the offline play and background syncing systems are working properly:

1. **Load Page**: Start both servers and open `http://localhost:5173` in Google Chrome or Microsoft Edge.
2. **Authenticate**: Register a new account or Log In with seeded credentials (`admin@quizapp.com` / `password123`).
3. **Simulate Offline**: Open Chrome DevTools (`F12`), navigate to the **Network** tab, and toggle the throttling dropdown from **No Throttling** to **Offline**.
4. **Interact**: Reload the page. Notice that the application shell loads successfully via the Service Worker cache.
5. **Dashboard Banner**: An orange warning banner will display on the dashboard: *"⚠️ You are running offline. Quizzes can be played and progress will sync once reconnected."*
6. **Take Offline Quiz**: Go to **Quizzes**, select **JavaScript**, select **Easy**, and play the quiz.
7. **Score Local Save**: Submit the quiz. You will see a success card: *"💾 Quiz Saved Offline. Your score was graded locally. It will auto-sync with the global leaderboard once your internet connection is restored."*
8. **Restore Network**: Go back to DevTools and toggle **Offline** back to **No Throttling**.
9. **Verify Sync**: The background listener detects the connection, uploads the graded attempt to MongoDB, and displays a green notification banner: *"✨ Synced 1 offline quizzes successfully!"*. The dashboard metrics will update automatically.

---

## 🌐 Production Deployment Guide

When you are ready to deploy live, follow these guidelines:

### Server Deployment (e.g., Render)
1. Set up a free Web Service on Render pointing to your backend GitHub repository.
2. In the Render environment configuration, define the following variables:
   - `PORT`: `10000` (Render handles this automatically)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/QuizForge?retryWrites=true&w=majority` (Your MongoDB Atlas connection URI)
   - `JWT_SECRET`: A long, randomly generated secret string
   - `CLIENT_ORIGINS`: Your Vercel frontend URL (e.g. `https://quizforge.vercel.app`)

### Client Deployment (e.g., Vercel)
1. Import your frontend directory (`client/`) to Vercel.
2. Update the `API_BASE` in `client/src/services/api.js` to point to your live Render backend URL:
   ```javascript
   const API_BASE = "https://your-backend-service.onrender.com/api";
   ```
3. Deploy! Vercel will build the static PWA shell, compile the service worker, and distribute it globally via CDN.
