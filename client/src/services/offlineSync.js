import { api } from "./api";

const ATTEMPTS_KEY = "quizforge_offline_attempts";
const STATS_KEY = "quizforge_offline_stats";

/**
 * Saves a completed quiz attempt locally in browser localStorage
 */
export function queueOfflineAttempt(attempt) {
  const attempts = JSON.parse(localStorage.getItem(ATTEMPTS_KEY)) || [];
  attempts.push(attempt);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));

  // Update local statistics so they are immediately reflected on the user's dashboard
  updateLocalStats(attempt);
}

/**
 * Helper to update offline dashboard statistics locally
 */
function updateLocalStats(attempt) {
  const stats = JSON.parse(localStorage.getItem(STATS_KEY)) || {
    summary: { totalAttempts: 0, totalScore: 0, averagePercentage: 0, bestPercentage: 0, averageTimeTakenSeconds: 0 },
    recentAttempts: []
  };

  const scorePct = Math.round((attempt.score / attempt.totalPossible) * 100);

  // Update summary metrics
  stats.summary.totalAttempts += 1;
  stats.summary.totalScore += attempt.score;
  stats.summary.bestPercentage = Math.max(stats.summary.bestPercentage, scorePct);
  stats.summary.averagePercentage = Math.round(
    ((stats.summary.averagePercentage * (stats.summary.totalAttempts - 1)) + scorePct) / stats.summary.totalAttempts
  );
  stats.summary.averageTimeTakenSeconds = Math.round(
    ((stats.summary.averageTimeTakenSeconds * (stats.summary.totalAttempts - 1)) + (attempt.timeTakenSeconds || 0)) / stats.summary.totalAttempts
  );

  // Add to recent activity list
  stats.recentAttempts.unshift({
    quiz: {
      title: attempt.subject + " (Offline)",
      category: attempt.subject,
      difficulty: attempt.difficulty
    },
    score: attempt.score,
    totalPossible: attempt.totalPossible,
    percentage: scorePct,
    createdAt: new Date().toISOString()
  });

  // Keep only the 5 most recent attempts
  stats.recentAttempts = stats.recentAttempts.slice(0, 5);

  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

/**
 * Attempts to sync all locally cached attempts with the backend API
 */
export async function syncOfflineAttempts() {
  if (!navigator.onLine) return { synced: 0, errors: 0 };
  
  const token = localStorage.getItem("quizforge_token");
  if (!token || token === "guest") {
    // Cannot sync if logged out or if logged in as temporary guest
    return { synced: 0, errors: 0 };
  }

  const attempts = JSON.parse(localStorage.getItem(ATTEMPTS_KEY)) || [];
  if (attempts.length === 0) return { synced: 0, errors: 0 };

  console.log(`Found ${attempts.length} offline attempts to synchronize...`);

  let synced = 0;
  let errors = 0;
  const remaining = [];

  for (const attempt of attempts) {
    try {
      // Offline attempts use static/cached IDs. We must match them with actual DB quiz IDs if possible.
      // If we don't have a real quizId in the attempt (e.g. they played an offline fallback quiz),
      // we first query the DB to find an active quiz in that category + difficulty,
      // or we can just send it to a general quiz or create one.
      // Let's see: we can query the backend:
      let quizId = attempt.quizId;
      
      if (!quizId || quizId.startsWith("off-")) {
        // Query database to find a matching quiz for this category and difficulty
        const quizzesRes = await api.getQuizzes({
          category: attempt.subject.toLowerCase(),
          difficulty: attempt.difficulty.toLowerCase()
        });

        if (quizzesRes.success && quizzesRes.data.length > 0) {
          quizId = quizzesRes.data[0]._id;
        } else {
          // If no matching quiz exists, we can't submit it to a real quiz,
          // so we skip or map to a general default quiz (if one exists).
          // We can skip and flag as error.
          throw new Error(`No database quiz matching category "${attempt.subject}" and difficulty "${attempt.difficulty}" found to sync`);
        }
      }

      // Map answers to the format expected by the backend: [{ questionId, selectedOptionId }]
      const formattedAnswers = attempt.answers.map((answer, index) => {
        // Find corresponding question in DB quiz if possible, or use standard indexing
        return {
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId
        };
      });

      await api.submitAttempt({
        quizId,
        answers: formattedAnswers,
        timeTakenSeconds: attempt.timeTakenSeconds || 0
      });

      synced += 1;
    } catch (err) {
      console.error("Failed to sync attempt:", err);
      errors += 1;
      remaining.push(attempt); // Keep failed syncs to retry later
    }
  }

  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(remaining));

  return { synced, errors };
}

/**
 * Registers listeners for online status to trigger automatic syncs
 */
export function registerOnlineSync(onSyncSuccess) {
  const triggerSync = async () => {
    if (navigator.onLine) {
      const result = await syncOfflineAttempts();
      if (result.synced > 0 && onSyncSuccess) {
        onSyncSuccess(result);
      }
    }
  };

  window.addEventListener("online", triggerSync);
  
  // Trigger immediately in case we are already online
  triggerSync();

  return () => {
    window.removeEventListener("online", triggerSync);
  };
}
