import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "../styles/ScorePage.css"

const fallbackState = {
  score: 4, total: 5, subject: "JavaScript", difficulty: "Easy",
  answers: [2, 0, 2, 2, 1],
  questions: [
    { question: "Which keyword declares a variable that cannot be reassigned?", options: ["var", "let", "const", "static"], correct: 2 },
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Transfer Markup Language", "Hyper Text Machine Language"], correct: 0 },
    { question: "Which React hook manages component state?", options: ["useEffect", "useRef", "useState", "useContext"], correct: 2 },
    { question: "Which CSS property controls spacing inside an element?", options: ["margin", "spacing", "padding", "border"], correct: 2 },
    { question: "Which data structure uses LIFO order?", options: ["Queue", "Stack", "Tree", "Heap"], correct: 1 },
  ],
  isOffline: false
}

function getGrade(pct) {
  if (pct >= 90) return { label: "Excellent!", color: "var(--green)" }
  if (pct >= 70) return { label: "Good Job!",  color: "var(--primary)"  }
  if (pct >= 50) return { label: "Keep Trying!", color: "var(--orange)" }
  return { label: "Need More Practice", color: "var(--red)" }
}

export default function ScorePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state || fallbackState

  const [showAnswers, setShowAnswers] = useState(false)
  const pct   = Math.round((state.score / (state.totalPossible || state.total)) * 100)
  const grade = getGrade(pct)

  return (
    <div className="score-page">
      <div className="score-inner">

        {/* Offline sync message */}
        {state.isOffline && (
          <div className="offline-sync-card">
            <span className="offline-sync-icon">💾</span>
            <div className="offline-sync-info">
              <h4 className="offline-sync-title">Quiz Saved Offline</h4>
              <p className="offline-sync-desc">
                Your score was graded locally. It will auto-sync with the global leaderboard once your internet connection is restored.
              </p>
            </div>
          </div>
        )}

        {/* Score card */}
        <div className="score-card">
          <div className="score-card-stripe" />
          <div className="score-card-body">
            <p className="score-meta">{state.subject} · {state.difficulty}</p>
            <h2 className="score-pct" style={{ color: grade.color }}>{pct}%</h2>
            <p className="score-grade" style={{ color: grade.color }}>{grade.label}</p>

            <div className="score-tally">
              <div className="score-tally-item">
                <div className="score-tally-num" style={{ color: "var(--green)" }}>{state.score}</div>
                <div className="score-tally-label">Correct</div>
              </div>
              <div className="score-tally-divider" />
              <div className="score-tally-item">
                <div className="score-tally-num" style={{ color: "var(--red)" }}>{state.total - state.score}</div>
                <div className="score-tally-label">Wrong</div>
              </div>
              <div className="score-tally-divider" />
              <div className="score-tally-item">
                <div className="score-tally-num" style={{ color: "var(--text-muted)" }}>{state.total}</div>
                <div className="score-tally-label">Total</div>
              </div>
            </div>

            <div className="score-actions">
              <button className="btn-see-answers" onClick={() => setShowAnswers(v => !v)}>
                {showAnswers ? "Hide Answers" : "See Answers"}
              </button>
              <button className="btn-finish" onClick={() => navigate("/dashboard")}>
                Finish
              </button>
            </div>
          </div>
        </div>

        {/* Answer review */}
        {showAnswers && (
          <div className="answers-card">
            <h3 className="answers-title">Answer Review</h3>
            {state.questions.map((q, i) => {
              const userAns   = state.answers[i]
              const isCorrect = userAns === q.correct
              return (
                <div key={i} className={`answer-item ${isCorrect ? "correct" : "wrong"}`}>
                  <div className="answer-q-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <p className="answer-q-num" style={{ marginBottom: 0 }}>Q{i + 1}</p>
                    {state.tagged && state.tagged[i] && (
                      <span className="review-flag-badge" style={{ fontSize: '0.75rem', background: 'var(--orange-bg)', color: 'var(--orange)', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', border: '1px solid var(--orange-border)' }}>
                        🚩 Flagged
                      </span>
                    )}
                  </div>
                  <p className="answer-q-text">{q.question}</p>
                  {q.options.map((opt, j) => (
                    <div key={j} className="answer-option">
                      <span className="answer-marker" style={{ color: j === q.correct ? "var(--green)" : j === userAns && !isCorrect ? "var(--red)" : "var(--text-faint)" }}>
                        {j === q.correct ? "✓" : j === userAns && !isCorrect ? "✗" : "·"}
                      </span>
                      <span style={{ color: j === q.correct ? "var(--green)" : j === userAns && !isCorrect ? "var(--red)" : "var(--text-muted)", fontWeight: j === q.correct || j === userAns ? 700 : 400 }}>
                        {opt}
                      </span>
                    </div>
                  ))}

                  {/* AI Explanation block */}
                  <div className="answer-explanation" style={{ marginTop: '12px', padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', borderLeft: '3px solid var(--primary)', textAlign: 'left' }}>
                    <p style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                      <span>💡</span> Quick AI Explanation
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.45', margin: '4px 0 0 0' }}>{q.explanation || "This answer is correct based on industry standard specifications."}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
