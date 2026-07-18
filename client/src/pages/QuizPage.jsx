import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, isGuestMode } from "../services/api";
import { guestQuizzes } from "../data/guestQuizzes";
import "../styles/QuizPage.css";

const difficultyConfig = {
  easy:   { questions: 20, time: 20 * 60, label: "Easy",   color: "var(--green)"  },
  medium: { questions: 30, time: 45 * 60, label: "Medium", color: "var(--blue)"   },
  hard:   { questions: 50, time: 60 * 60, label: "Hard",   color: "var(--orange)" },
};

function formatSubject(slug) {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function formatTime(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return '00:00';
  }
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function QuizPage() {
  const navigate = useNavigate();
  const { subject = "", difficulty = "easy" } = useParams();
  const config = difficultyConfig[difficulty] || difficultyConfig.easy;
  const subjectName = formatSubject(subject);

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [showPreSubmitReview, setShowPreSubmitReview] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(config.time);
  const [showCancel, setShowCancel] = useState(false);
  const [taggedQuestions, setTaggedQuestions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  // Guard to prevent duplicate loads
  const loadedRef = useRef({ subject: null, difficulty: null });

  // Load quiz on mount
  useEffect(() => {
    const loadQuiz = async () => {
      // Prevent duplicate load
      if (loadedRef.current.subject === subject && loadedRef.current.difficulty === difficulty) {
        return;
      }
      loadedRef.current.subject = subject;
      loadedRef.current.difficulty = difficulty;

      setLoading(true);
      setError(null);

      // Guest mode
      if (isGuestMode()) {
        const guestQuiz = guestQuizzes[subject.toLowerCase()];
        if (!guestQuiz) {
          alert(
            "This subject is not available in Guest Mode. Please log in to access AI-generated quizzes."
          );
          navigate("/quiz-menu");
          return;
        }
        setQuizId("guest");
        setQuestions(guestQuiz);
        setAnswers(Array(guestQuiz.length).fill(null));
        setTaggedQuestions(Array(guestQuiz.length).fill(false));
        setTimeLeft(config.time);
        setLoading(false);
        return;
      }

      // Online generation (registered users)
      try {
        const genRes = await api.generateQuiz({
          subject: subject.toLowerCase(),
          difficulty: difficulty.toLowerCase(),
          questionCount: config.questions,
        });

        if (genRes.success) {
          let questions = genRes.data.questions;

          //Ensure every option has a unique _id
          questions = questions.map(q => ({
            ...q,
            options: q.options.map((opt, idx) => ({
              ...opt,
              _id: opt._id || `opt-${Math.random().toString(36).substr(2, 9)}-${idx}`,
            })),
          }));

          setQuizId(genRes.data.quizId);
          setQuestions(questions);
          setAnswers(Array(questions.length).fill(null));
          setTaggedQuestions(Array(questions.length).fill(false));
          if (genRes.data.timeLimitSeconds) {
            setTimeLeft(genRes.data.timeLimitSeconds);
          }
        } else {
          setError(genRes.error || "Failed to generate quiz. Please try again.");
        }
      } catch (err) {
        console.error("Quiz generation failed:", err);
        if (err.status === 401) {
          setError("Authentication failed. Please log in again.");
        } else if (err.status === 429) {
          setError("Quota exceeded. Please try later.");
        } else {
          setError("Something went wrong. Please refresh and try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [subject, difficulty, config, navigate]);

  // Handle quiz submission (Guest + Registered)
  const handleSubmit = useCallback(async () => {
    if (submittedRef.current || submitting) return;
    submittedRef.current = true;
    setSubmitting(true);
    setIsGrading(true);
    const timeTakenSeconds = config.time - timeLeft;

    // ---- GUEST MODE ----
    if (isGuestMode()) {
      let localScore = 0;
      const gradedQuestions = questions.map((q, idx) => {
        const userAns = answers[idx];
        const correctIdx = q.options.findIndex(o => o.isCorrect);
        const isCorrect = userAns && userAns.selectedOptionIndex === correctIdx;
        if (isCorrect) localScore++;
        const correctOption = q.options[correctIdx];
        return {
          question: q.questionText,
          options: q.options.map(o => o.text),
          correct: correctIdx,
          correctOptionText: correctOption ? correctOption.text : '', // ✅
          isCorrect: isCorrect,
          explanation: q.explanation || "No explanation provided.",
        };
      });

      navigate("/score", {
        state: {
          score: localScore,
          total: questions.length,
          subject: subjectName,
          difficulty: config.label,
          answers: answers.map(a => (a ? a.selectedOptionIndex : -1)),
          questions: gradedQuestions,
          isOffline: false,
          tagged: taggedQuestions,
        },
      });
      setIsGrading(false);
      setSubmitting(false);
      return;
    }

    // ---- REGISTERED USER ----
    try {
      const formattedAnswers = answers.map((ans, idx) => ({
        questionId: questions[idx]._id,
        selectedOptionId: ans ? ans.selectedOptionId : null,
      }));

      const submitRes = await api.submitAttempt({
        quizId,
        answers: formattedAnswers,
        timeTakenSeconds,
      });

      if (submitRes.success) {
        let localScore = 0;
        const gradedQuestions = questions.map((q, idx) => {
          const userAns = answers[idx];
          const isCorrect = userAns && userAns.selectedOptionId === q.correctOptionId;
          if (isCorrect) localScore++;
          const correctOption = q.options.find(o => o._id === q.correctOptionId);
          return {
            question: q.questionText,
            options: q.options.map(o => o.text),
            correctOptionId: q.correctOptionId,
            correctOptionText: correctOption ? correctOption.text : '', // ✅
            isCorrect: isCorrect,
            explanation: q.explanation || "No explanation provided.",
          };
        });

        navigate("/score", {
          state: {
            score: submitRes.data.score ?? localScore,
            total: submitRes.data.totalQuestions ?? questions.length,
            subject: subjectName || "Unknown",
            difficulty: config.label || "Easy",
            answers: answers.map(a => (a ? a.selectedOptionIndex : -1)),
            questions: gradedQuestions,
            isOffline: false,
            tagged: taggedQuestions || [],
          },
        });
      } else {
        setError(submitRes.error || "Submission failed. Please try again.");
        submittedRef.current = false;
      }
    } catch (err) {
      console.error("Submit failed:", err);
      if (err.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Failed to submit quiz. Please check your connection.");
      }
      submittedRef.current = false;
    } finally {
      setIsGrading(false);
      setSubmitting(false);
    }
  }, [answers, questions, quizId, timeLeft, config, subjectName, navigate, taggedQuestions, submitting]);

  // Timer auto-submit
  useEffect(() => {
    if (loading) return;
    if (submittedRef.current) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, handleSubmit, loading]);

  // ---- Render logic ----
  if (loading) {
    const subjectLower = (subject || "").toLowerCase();
    let icon = "✦";
    if (subjectLower.includes("javascript")) icon = "⚡";
    else if (subjectLower.includes("react")) icon = "⚛";
    else if (subjectLower.includes("html")) icon = "🌐";
    else if (subjectLower.includes("css")) icon = "🎨";
    else if (subjectLower.includes("mongodb")) icon = "🍃";
    else if (subjectLower.includes("node")) icon = "🟢";
    else if (subjectLower.includes("python")) icon = "🐍";
    else if (subjectLower.includes("java")) icon = "☕";
    else if (subjectLower.includes("cpp") || subjectLower.includes("c++")) icon = "⚙";
    else if (subjectLower.includes("algorithms")) icon = "🔄";
    else if (subjectLower.includes("database") || subjectLower.includes("sql")) icon = "🗄";

    const loaderTitle = isGrading ? "Analyzing Your Performance" : "Preparing Your Quiz Environment";
    const loaderText = isGrading
      ? "Grading your answers and generating AI explanations..."
      : `Fetching high-quality questions on ${subjectName || subject}...`;

    return (
      <div className="quiz-page" style={{ justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div className="quiz-loader-card">
          <div className="quiz-loader-icon-wrap">
            <span className="quiz-loader-icon">{icon}</span>
          </div>
          <h3 className="quiz-loader-title">{loaderTitle}</h3>
          <p className="quiz-loader-text">{loaderText}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page" style={{ justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div className="quiz-loader-card" style={{ border: "2px solid var(--red)" }}>
          <h3 style={{ color: "var(--red)" }}>⚠️ Error</h3>
          <p>{error}</p>
          <button className="btn-quiz-prev" onClick={() => navigate("/quiz-menu")} style={{ marginTop: "20px" }}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-page" style={{ justifyContent: "center", alignItems: "center" }}>
        <p className="no-activity">No questions available for this quiz. Please go back.</p>
        <button className="btn-quiz-prev" onClick={() => navigate("/quiz-menu")} style={{ marginTop: "20px" }}>
          Back to Menu
        </button>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const timePercent = (timeLeft / config.time) * 100;
  const timerColor = timePercent > 50 ? "var(--green)" : timePercent > 20 ? "var(--orange)" : "var(--red)";

  const handleOption = (optId, optIdx) => {
    setSelectedOptId(optId);
    const nextAnswers = [...answers];
    nextAnswers[current] = {
      questionId: q._id,
      selectedOptionId: optId,
      selectedOptionIndex: optIdx,
    };
    setAnswers(nextAnswers);
  };

  const goNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      const nextAns = answers[current + 1];
      setSelectedOptId(nextAns ? nextAns.selectedOptionId : null);
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setCurrent(c => c - 1);
      const prevAns = answers[current - 1];
      setSelectedOptId(prevAns ? prevAns.selectedOptionId : null);
    }
  };

  const toggleTag = () => {
    const nextTags = [...taggedQuestions];
    nextTags[current] = !nextTags[current];
    setTaggedQuestions(nextTags);
  };

  // Pre-submit review screen
  if (showPreSubmitReview) {
    return (
      <div className="quiz-page">
        <div className="quiz-topbar">
          <div className="quiz-topbar-info">
            <div className="quiz-topbar-sub">{subjectName} Quiz Review</div>
            <div className="quiz-topbar-label" style={{ color: config.color }}>{config.label}</div>
          </div>
          <button className="btn-cancel-quiz" onClick={() => setShowCancel(true)}>Cancel</button>
        </div>

        <div className="quiz-body" style={{ alignItems: "center" }}>
          <div className="quiz-content" style={{ maxWidth: "600px" }}>
            <div className="review-dashboard-card">
              <h2 className="review-title">Review Your Answers</h2>
              <p className="review-subtitle">Click on any question to return and edit your answer before submitting.</p>

              <div className="review-grid">
                {questions.map((q, idx) => {
                  const ans = answers[idx];
                  const tagged = taggedQuestions[idx];
                  let stateClass = "unanswered";
                  let stateLabel = "Unanswered";

                  if (tagged) {
                    stateClass = "flagged";
                    stateLabel = "Flagged";
                  } else if (ans) {
                    stateClass = "answered";
                    stateLabel = "Answered";
                  }

                  return (
                    <button
                      key={idx}
                      className={`review-grid-cell ${stateClass}`}
                      onClick={() => { setShowPreSubmitReview(false); setCurrent(idx); }}
                    >
                      <span className="review-cell-num">{idx + 1}</span>
                      <span className="review-cell-state">{tagged ? "🚩" : stateLabel}</span>
                    </button>
                  );
                })}
              </div>

              <div className="review-legend">
                <div className="legend-item"><span className="legend-dot answered"></span> Answered</div>
                <div className="legend-item"><span className="legend-dot flagged">🚩</span> Flagged</div>
                <div className="legend-item"><span className="legend-dot unanswered"></span> Unanswered</div>
              </div>

              <div className="review-actions">
                <button className="btn-back-to-quiz" onClick={() => setShowPreSubmitReview(false)}>
                  ← Back to Quiz
                </button>
                <button className="btn-confirm-submit" onClick={handleSubmit}>
                  Submit Quiz for Grading
                </button>
              </div>
            </div>
          </div>
        </div>

        {showCancel && (
          <div className="cancel-overlay">
            <div className="cancel-modal">
              <h3 className="cancel-modal-title">Cancel Quiz?</h3>
              <p className="cancel-modal-text">Your progress will be lost. This cannot be undone.</p>
              <div className="cancel-modal-actions">
                <button className="btn-keep-going" onClick={() => setShowCancel(false)}>Keep Going</button>
                <button className="btn-yes-cancel" onClick={() => navigate("/quiz-menu")}>Yes, Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main quiz view
  return (
    <div className="quiz-page">
      <div className="quiz-topbar">
        <div className="quiz-topbar-info">
          <div className="quiz-topbar-sub">
            {subjectName}
          </div>
          <div className="quiz-topbar-label" style={{ color: config.color }}>
            {config.label} · Q {current + 1} / {questions.length}
          </div>
        </div>

        <div className="quiz-timer">
          <div className="quiz-timer-value" style={{ color: timerColor }}>{formatTime(timeLeft)}</div>
          <div className="quiz-timer-bar-wrap">
            <div className="quiz-timer-bar" style={{ width: `${timePercent}%`, background: timerColor }} />
          </div>
        </div>

        <div className="quiz-topbar-actions">
          <button className="btn-cancel-quiz" onClick={() => setShowCancel(true)}>Cancel</button>
        </div>
      </div>

      <div className="quiz-progress-bar-wrap">
        <div className="quiz-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-body">
        <div className="quiz-content">
          <div className="quiz-question-card">
            <div className="quiz-q-header">
              <span className="quiz-q-label">Question {current + 1} of {questions.length}</span>
              <button
                className={`btn-tag-question${taggedQuestions[current] ? " active" : ""}`}
                onClick={toggleTag}
              >
                {taggedQuestions[current] ? "🚩 Flagged" : "🏳️ Flag for Review"}
              </button>
            </div>
            <h2 className="quiz-q-text">{q.questionText}</h2>
          </div>

          <div className="quiz-options">
            {q.options.map((opt, i) => (
              <button
                key={opt._id || i}
                className={`quiz-option${selectedOptId === opt._id ? " selected" : ""}`}
                onClick={() => handleOption(opt._id, i)}
              >
                <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
                {opt.text}
              </button>
            ))}
          </div>

          <div className="quiz-nav">
            <button className="btn-quiz-prev" onClick={goPrev} disabled={current === 0}>← Previous</button>
            <button className="btn-quiz-next" onClick={goNext} disabled={current === questions.length - 1}>Next →</button>
            <button className="btn-quiz-submit-action" onClick={() => setShowPreSubmitReview(true)}>Submit Quiz</button>
          </div>
        </div>
      </div>

      {showCancel && (
        <div className="cancel-overlay">
          <div className="cancel-modal">
            <h3 className="cancel-modal-title">Cancel Quiz?</h3>
            <p className="cancel-modal-text">Your progress will be lost. This cannot be undone.</p>
            <div className="cancel-modal-actions">
              <button className="btn-keep-going" onClick={() => setShowCancel(false)}>Keep Going</button>
              <button className="btn-yes-cancel" onClick={() => navigate("/quiz-menu")}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}