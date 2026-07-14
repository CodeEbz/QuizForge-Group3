import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { api, isGuestMode } from "../services/api"
import "../styles/History.css"

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export default function HistoryPage() {
  const navigate = useNavigate()
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewLoading, setReviewLoading] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const res = await api.getMyAttempts(1, 100) // fetch up to 100 attempts
        if (res.success) {
          setAttempts(res.data || [])
        } else {
          setError("Failed to load history.")
        }
      } catch (err) {
        console.error("Error loading attempt history:", err)
        setError("Error connecting to server. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const handleReview = async (attemptId, quizId, subjectName, difficultyLabel) => {
    if (!quizId || quizId.startsWith("offline-")) {
      alert("Offline quizzes cannot be reviewed unless synced online.")
      return
    }
    setReviewLoading(attemptId)
    try {
      const attemptRes = await api.getAttemptById(attemptId)
      const quizRes = await api.getQuizForReview(quizId)

      if (attemptRes.success && quizRes.success) {
        const attempt = attemptRes.data
        const quiz = quizRes.data

        if (!quiz || !quiz.questions) {
          alert("This quiz structure is no longer available for review.")
          return
        }

        const reviewQuestions = quiz.questions.map((q) => {
          const correctIdx = q.options.findIndex(o => o.isCorrect)
          return {
            question: q.questionText,
            options: q.options.map(o => o.text),
            correct: correctIdx >= 0 ? correctIdx : 0,
            explanation: q.explanation || "No explanation provided for this question."
          }
        })

        const userAnswersIndices = quiz.questions.map((q) => {
          const userAns = attempt.answers.find(
            a => a.question.toString() === q._id.toString()
          )
          if (!userAns || !userAns.selectedOption) return -1

          return q.options.findIndex(
            o => o._id.toString() === userAns.selectedOption.toString()
          )
        })

        navigate("/score", {
          state: {
            score: attempt.score,
            total: attempt.totalPossible,
            subject: subjectName,
            difficulty: difficultyLabel,
            answers: userAnswersIndices,
            questions: reviewQuestions,
            isOffline: false
          }
        })
      } else {
        alert("Failed to fetch detailed review data.")
      }
    } catch (err) {
      console.error("Review loading error:", err)
      alert("Error loading attempt review detail.")
    } finally {
      setReviewLoading(null)
    }
  }

  function scoreColor(pct) {
    if (pct >= 80) return "var(--green)"
    if (pct >= 60) return "var(--orange)"
    return "var(--red)"
  }

  return (
    <div className="history-page">
      <Navbar />
      <main className="history-main">
        <button className="btn-back" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
        <h1 className="history-title">Quiz History</h1>
        <p className="history-sub">Track your learning journey and review past answers</p>

        {loading ? (
          <div className="history-loading-wrap">
            <p className="no-activity">Loading history data...</p>
          </div>
        ) : error ? (
          <div className="history-error-card">
            <p className="history-error-msg">{error}</p>
          </div>
        ) : attempts.length === 0 ? (
          <div className="history-empty-card">
            <p className="no-activity">You haven't completed any quizzes yet.</p>
            <button className="btn-start-quiz" onClick={() => navigate("/quiz-menu")} style={{ marginTop: "16px" }}>
              Start a Quiz
            </button>
          </div>
        ) : (
          <div className="history-card">
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Quiz Title</th>
                    <th>Category & Difficulty</th>
                    <th>Date Taken</th>
                    <th>Time Spent</th>
                    <th>Score</th>
                    <th className="history-action-header">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a, i) => {
                    const title = a.quiz ? a.quiz.title : (a.subject ? `${a.subject} Fallback` : "Custom Quiz")
                    const cat = a.quiz ? a.quiz.category : (a.subject || "General")
                    const diff = a.quiz ? a.quiz.difficulty : (a.difficulty || "medium")
                    const diffLabel = diff.charAt(0).toUpperCase() + diff.slice(1)
                    const pct = a.percentage !== undefined ? a.percentage : Math.round((a.score / a.totalPossible) * 100)
                    const quizId = a.quiz ? a.quiz._id : a.quizId
                    const dateStr = new Date(a.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })

                    return (
                      <tr key={a._id || i}>
                        <td>
                          <span className="history-table-title">{title}</span>
                        </td>
                        <td>
                          <div className="history-table-meta">
                            <span className="history-cat-badge">{cat}</span>
                            <span className={`history-diff-badge ${diff}`}>{diff}</span>
                          </div>
                        </td>
                        <td>{dateStr}</td>
                        <td>{formatTime(a.timeTakenSeconds || 0)}</td>
                        <td>
                          <div className="history-score-cell">
                            <span className="history-score-pct" style={{ color: scoreColor(pct) }}>{pct}%</span>
                            <span className="history-score-raw">{a.score} / {a.totalPossible}</span>
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn-history-review"
                            disabled={reviewLoading !== null || isGuestMode() || !quizId || quizId.startsWith("offline-")}
                            onClick={() => handleReview(a._id, quizId, title, diffLabel)}
                          >
                            {reviewLoading === a._id ? "Loading..." : "Review"}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
