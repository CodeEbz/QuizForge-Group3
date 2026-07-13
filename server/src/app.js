const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// --- Security & parsing middleware ---
app.use(helmet()); // sets sensible security-related HTTP headers
app.use(express.json({ limit: '1mb' })); // parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// --- CORS: allow only the React app origins listed in .env ---
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin, or if origin matches allowed origins, or if wildcard * is in allowedOrigins
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// --- Logging (only in development to keep production logs clean) ---
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Basic rate limiting to slow down brute-force / abuse ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// --- Health check (useful for uptime monitors / load balancers) ---
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/stats', statsRoutes);

// --- 404 + centralized error handler (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
