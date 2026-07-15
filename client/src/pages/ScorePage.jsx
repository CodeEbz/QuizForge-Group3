import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isGuestMode } from "../services/api";
import "../styles/ScorePage.css";

function getGrade(pct) {
  if (pct >= 90) return { label: "Excellent!", color: "var(--green)" };
  if (pct >= 71) return { label: "Good Job!", color: "var(--blue)" };
  if (pct >= 50) return { label: "Keep Trying!", color: "var(--orange)" };
  return { label: "Need More Practice", color: "var(--red)" };
}

export default function ScorePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const [showAnswers, setShowAnswers] = useState(false);

  const score = state.score ?? 0;
  const total = state.total ?? state.totalPossible ?? 0;
  const subject = state.subject || "Unknown";
  const difficulty = state.difficulty || "Easy";
  const answers = state.answers || [];
  const questions = state.questions || [];
  const tagged = state.tagged || [];

  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const grade = getGrade(pct);
  const wrong = total - score;
  const isGuest = isGuestMode();

  return (
    <div className="score-page">
      <div className="score-inner">
        <div className="score-card">
          <div className="score-card-stripe" />
          <div className="score-card-body">
            <p className="score-meta">{subject} · {difficulty}</p>
            <h2 className="score-pct" style={{ color: grade.color }}>{pct}%</h2>
            <p className="score-grade" style={{ color: grade.color }}>{grade.label}</p>

            <div className="score-tally">
              <div className="score-tally-item">
                <div className="score-tally-num" style={{ color: "var(--green)" }}>{score}</div>
                <div className="score-tally-label">Correct</div>
              </div>
              <div className="score-tally-divider" />
              <div className="score-tally-item">
                <div className="score-tally-num" style={{ color: "var(--red)" }}>{wrong}</div>
                <div className="score-tally-label">Wrong</div>
              </div>
              <div className="score-tally-divider" />
              <div className="score-tally-item">
                <div className="score-tally-num" style={{ color: "var(--text-muted)" }}>{total}</div>
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

        {showAnswers && (
          <div className="answers-card">
            <h3 className="answers-title">Answer Review</h3>
            {questions.length > 0 ? (
              questions.map((q, i) => {
                const userAns = answers[i] ?? -1;
                const correct = q.correct ?? 0;
                const isCorrect = userAns === correct;
                const isFlagged = tagged[i] || false;

                return (
                  <div key={i} className={`answer-item ${isCorrect ? "correct" : "wrong"}`}>
                    {/* ✅ Header: only question number and flagged badge (no Correct/Incorrect label) */}
                    <div className="answer-q-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <p className="answer-q-num" style={{ marginBottom: 0, fontWeight: 'bold' }}>
                        Q{i + 1} {isFlagged && <span style={{ color: 'var(--orange)', marginLeft: '8px' }}>🚩 Flagged</span>}
                      </p>
                      {/* ✅ Removed the "✓ Correct / ✗ Incorrect" badge */}
                    </div>

                    <p className="answer-q-text">{q.question || q.questionText || "Question text missing"}</p>

                    {q.options && q.options.map((opt, j) => {
                      const isCorrectOption = j === correct;
                      const isUserOption = j === userAns;
                      let style = { color: "var(--text-muted)" };
                      if (isCorrectOption) style = { color: "var(--green)", fontWeight: 700 };
                      else if (isUserOption && !isCorrect) style = { color: "var(--red)", fontWeight: 700 };

                      return (
                        <div key={j} className="answer-option">
                          <span className="answer-marker" style={style}>
                            {isCorrectOption ? "✓" : isUserOption && !isCorrect ? "✗" : "·"}
                          </span>
                          <span style={style}>
                            {typeof opt === 'string' ? opt : opt.text || `Option ${j+1}`}
                          </span>
                        </div>
                      );
                    })}

                    <div className="answer-explanation" style={{ marginTop: '12px', padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', borderLeft: '3px solid var(--primary)', textAlign: 'left' }}>
                      <p style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                        <span>💡</span> {isGuest ? 'Quick Explanation' : 'Quick AI Explanation'}
                      </p>
                      <p style={{ color: 'var(--text-muted)', lineHeight: '1.45', margin: '4px 0 0 0' }}>
                        {q.explanation || "No explanation provided for this question."}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No questions to review.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}