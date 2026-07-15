const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

/**
 * Custom error class for API response failures
 */
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * Standard HTTP requester helper
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("quizforge_token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token && token !== "guest") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(response.status, result.message || "Something went wrong");
    }

    return result;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new Error(err.message || "Network Error");
  }
}

// Check if we are running in Guest Mode
export function isGuestMode() {
  return localStorage.getItem("quizforge_token") === "guest";
}

// Local mock data for guest mode
const guestUser = {
  id: "guest-id",
  name: "Guest Explorer",
  email: "guest@quizforge.local",
  role: "guest",
  createdAt: new Date().toISOString()
};

// --- API Object ---
export const api = {
  /**
   * Log in user
   */
  async login(email, password) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Register new user
   */
  async register(name, email, password) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  /**
   * Get current user profile
   */
  async getMe() {
    if (isGuestMode()) {
      return { success: true, data: guestUser };
    }
    return request("/auth/me");
  },

  /**
   * List quizzes matching filter criteria
   */
  async getQuizzes({ category, difficulty }) {
    if (isGuestMode()) {
      return { success: true, data: [] };
    }
    let url = "/quizzes?";
    if (category) url += `category=${category}&`;
    if (difficulty) url += `difficulty=${difficulty}&`;
    return request(url);
  },

  /**
   * Get a quiz formatted for playing (no answer keys)
   */
  async getQuizForPlay(id) {
    if (isGuestMode()) {
      throw new Error("Guest mode uses predefined quizzes from guestQuizzes.js");
    }
    return request(`/quizzes/${id}/play`);
  },

  /**
   * Get a quiz for review (with correct answers)
   */
  getQuizForReview(quizId) {
    if (isGuestMode()) {
      throw new Error("Guest mode uses local quiz data for review");
    }
    return request(`/quizzes/${quizId}/review`, {
      method: 'GET',
    });
  },

  /**
   * Submit quiz attempt answers for grading
   */
  async submitAttempt({ quizId, answers, timeTakenSeconds }) {
    if (isGuestMode()) {
      throw new Error("Guest attempts are computed locally");
    }
    return request("/attempts", {
      method: "POST",
      body: JSON.stringify({ quizId, answers, timeTakenSeconds }),
    });
  },

  /**
   * Fetch current user's aggregated statistics
   */
  async getStats() {
    if (isGuestMode()) {
      return {
        success: true,
        data: {
          summary: {
            totalAttempts: 0,
            totalScore: 0,
            averagePercentage: 0,
            bestPercentage: 0,
            averageTimeTakenSeconds: 0
          },
          recentAttempts: []
        }
      };
    }
    return request("/stats/me");
  },

  /**
   * Fetch global leaderboard
   */
  async getLeaderboard(limit = 10) {
    if (isGuestMode()) {
      return {
        success: true,
        data: [
          { rank: 1, name: "Sign up to compete!", totalScore: 0 },
          { rank: 2, name: "Join the leaderboard!", totalScore: 0 }
        ]
      };
    }
    return request(`/leaderboard?limit=${limit}`);
  },

  /**
   * Request password reset (simulated)
   */
  async forgotPassword(email) {
    return request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email })
    });
  },

  /**
   * Get user's own quiz attempts history
   */
  async getMyAttempts(page = 1, limit = 10) {
    if (isGuestMode()) {
      return { success: true, data: [] };
    }
    return request(`/attempts/my?page=${page}&limit=${limit}`);
  },

  /**
   * Get single attempt details
   */
  async getAttemptById(id) {
    if (isGuestMode()) {
      return { success: true, data: null };
    }
    if (!id) {
      throw new Error("Attempt ID is required");
    }
    return request(`/attempts/${id}`);
  },

  /**
   * Generate a dynamic quiz from Groq or Open Trivia APIs
   */
  async generateQuiz({ subject, difficulty, questionCount, triviaCategoryId }) {
    if (isGuestMode()) {
      throw new Error("Guest mode uses predefined quizzes");
    }
    return request("/quizzes/generate", {
      method: "POST",
      body: JSON.stringify({
        subject,
        difficulty,
        questionCount,
        triviaCategoryId,
      }),
    });
  }
};