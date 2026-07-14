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

// Local mock data for guest mode (offline-first fallback)
const guestUser = {
  id: "guest-id",
  name: "Guest Explorer",
  email: "guest@quizforge.local",
  role: "guest",
  createdAt: new Date().toISOString()
};

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
   * List quizzes matching filter criteria (category, difficulty)
   */
  async getQuizzes({ category, difficulty }) {
    if (isGuestMode()) {
      return { success: true, data: [] }; // will fallback to static local quizzes
    }
    
    let url = "/quizzes?";
    if (category) url += `category=${category}&`;
    if (difficulty) url += `difficulty=${difficulty}&`;
    
    return request(url);
  },

  /**
   * Get a quiz formatted for playing (question texts, no answer keys)
   */
  async getQuizForPlay(id) {
    return request(`/quizzes/${id}/play`);
  },

  /**
   * Get a full quiz (including correct answers) for review on the score page
   */
  async getQuizForReview(id) {
    if (isGuestMode()) {
      return { success: true, data: null };
    }
    return request(`/quizzes/${id}`);
  },

  /**
   * Submit quiz attempt answers for grading
   */
  async submitAttempt({ quizId, answers, timeTakenSeconds }) {
    if (isGuestMode()) {
      // Local grading will be done in the frontend
      throw new Error("Guest attempts are computed locally");
    }
    return request("/attempts", {
      method: "POST",
      body: JSON.stringify({ quizId, answers, timeTakenSeconds }),
    });
  },

  /**
   * Fetch current user's aggregated statistics and recent history
   */
  async getStats() {
    if (isGuestMode()) {
      // Guests get zeroed stats — no local storage reads/writes
      return {
        success: true,
        data: {
          summary: { totalAttempts: 0, totalScore: 0, averagePercentage: 0, bestPercentage: 0, averageTimeTakenSeconds: 0 },
          recentAttempts: []
        }
      };
    }
    return request("/stats/me");
  },

  /**
   * Fetch global leaderboard players list
   */
  async getLeaderboard(limit = 10) {
    if (isGuestMode()) {
      // Generate some default podium listings
      return {
        success: true,
        data: [
          { rank: 1, name: "Sophia Wright", totalScore: 4850, totalAttempts: 42, averagePercentage: 97 },
          { rank: 2, name: "Marcus Osei", totalScore: 4620, totalAttempts: 39, averagePercentage: 94 },
          { rank: 3, name: "Priya Nair", totalScore: 4490, totalAttempts: 38, averagePercentage: 92 },
          { rank: 4, name: "Guest Explorer (You)", totalScore: 0, totalAttempts: 0, averagePercentage: 0 }
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
   * Get user's own quiz attempts history log
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
    return request(`/attempts/${id}`);
  },

  /**
   * Generate a dynamic quiz from OpenAI or Open Trivia APIs
   */
  async generateQuiz({ category, difficulty, triviaCategoryId }) {
    if (isGuestMode()) {
      // Offline fallback: load local quiz immediately
      throw new Error("Guest mode is offline-first fallback");
    }
    return request("/quizzes/generate", {
      method: "POST",
      body: JSON.stringify({ category, difficulty, triviaCategoryId })
    });
  }
};
