import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api, isGuestMode } from "../services/api"
import { getOfflineQuiz } from "../data/offlineQuizzes"
import { queueOfflineAttempt } from "../services/offlineSync"
import "../styles/QuizPage.css"

const difficultyConfig = {
  easy:   { questions: 20, time: 20 * 60, label: "Easy",   color: "var(--green)"  },
  medium: { questions: 30, time: 45 * 60, label: "Medium", color: "var(--blue)"   },
  hard:   { questions: 50, time: 60 * 60, label: "Hard",   color: "var(--orange)" },
}

function formatSubject(slug) {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export default function QuizPage() {
  const navigate = useNavigate()
  const { subject = "", difficulty = "easy" } = useParams()
  const config = difficultyConfig[difficulty] || difficultyConfig.easy
  const subjectName = formatSubject(subject)

  const [loading, setLoading] = useState(true)
  const [isGrading, setIsGrading] = useState(false)
  const [showPreSubmitReview, setShowPreSubmitReview] = useState(false)
  const [quizId, setQuizId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selectedOptId, setSelectedOptId] = useState(null)
  const [answers, setAnswers] = useState([]) // Stores: { questionId, selectedOptionId, selectedOptionIndex }
  const [timeLeft, setTimeLeft] = useState(config.time)
  const [showCancel, setShowCancel] = useState(false)
  const [isOfflineAttempt, setIsOfflineAttempt] = useState(!navigator.onLine)
  const [taggedQuestions, setTaggedQuestions] = useState([])

  // 1. Fetch Quiz on Mount
  useEffect(() => {
    const loadLocalFallback = () => {
      const offlineQuiz = getOfflineQuiz(subject, difficulty)
      setQuizId(offlineQuiz._id || "offline-id")
      
      let loadedQuestions = offlineQuiz.questions;
      const isGuest = isGuestMode();
      if (isGuest) {
        loadedQuestions = loadedQuestions.slice(0, 5);
      }

      setQuestions(loadedQuestions)
      setAnswers(Array(loadedQuestions.length).fill(null))
      setTaggedQuestions(Array(loadedQuestions.length).fill(false))
      // Only mark as offline if actually offline; guests online are NOT offline attempts
      setIsOfflineAttempt(!navigator.onLine)
      setLoading(false)
    }

    const loadQuiz = async () => {
      setLoading(true)
      
      // Guests always use local static questions — no API call
      if (isGuestMode()) {
        loadLocalFallback()
        return
      }

      // If offline, use local offline fallback quizzes immediately
      if (!navigator.onLine) {
        loadLocalFallback()
        return
      }

      try {
        let playRes = null;
        let activeQuizId = null;

        // If the subject is 'other' or maps to a dynamic type, we use api.generateQuiz
        // Wait, does it check if it is other or custom? Yes, if it is not in the predefined list, or if the user is online,
        // we can generate it dynamically to ensure correct question counts (20, 30, 50)!
        const isStandardPreseeded = ["javascript", "react", "html", "css"].includes(subject.toLowerCase());
        
        // If we are online, generate a dynamic quiz of exact counts!
        let queryCategory = subject.toLowerCase();
        let triviaId = null;
        if (queryCategory.startsWith("other-")) {
          const parts = queryCategory.split("-");
          queryCategory = "other";
          triviaId = parseInt(parts[1], 10);
        }

        const genRes = await api.generateQuiz({
          category: queryCategory,
          difficulty: difficulty.toLowerCase(),
          triviaCategoryId: triviaId
        });

        if (genRes.success) {
          activeQuizId = genRes.data._id;
          playRes = { success: true, data: genRes.data };
        }

        if (playRes && playRes.success) {
          setQuizId(activeQuizId)
          
          let loadedQuestions = playRes.data.questions;
          if (isGuestMode()) {
            loadedQuestions = loadedQuestions.slice(0, 5);
          }

          setQuestions(loadedQuestions)
          setAnswers(Array(loadedQuestions.length).fill(null))
          setTaggedQuestions(Array(loadedQuestions.length).fill(false))
          if (playRes.data.timeLimitSeconds) {
            setTimeLeft(playRes.data.timeLimitSeconds)
          }
        } else {
          loadLocalFallback()
        }
      } catch (err) {
        console.error("Failed to load quiz from API, loading local fallback.", err)
        loadLocalFallback()
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [subject, difficulty])

  // 2. Submit Attempt Handler
  const handleSubmit = useCallback(async () => {
    setLoading(true)
    setIsGrading(true)
    const timeTakenSeconds = config.time - timeLeft

    if (!isOfflineAttempt) {
      try {
        // Prepare submission payload for backend
        const formattedAnswers = answers.map((ans, idx) => {
          const q = questions[idx]
          return {
            questionId: q._id,
            selectedOptionId: ans ? ans.selectedOptionId : null // submit null for skipped/unanswered questions
          }
        })

        const submitRes = await api.submitAttempt({
          quizId,
          answers: formattedAnswers,
          timeTakenSeconds
        })

        if (submitRes.success) {
          const attemptResult = submitRes.data
          
          // Fetch full quiz with correct answers to show in review
          const reviewRes = await api.getQuizForReview(quizId)
          let reviewQuestions = questions.map((q, idx) => {
            const correctIdx = reviewRes.data.questions[idx].options.findIndex(o => o.isCorrect)
            return {
              question: q.questionText,
              options: q.options.map(o => o.text),
              correct: correctIdx >= 0 ? correctIdx : 0,
              // Use explanation from play response (already included), fallback to review response
              explanation: q.explanation || reviewRes.data.questions[idx].explanation || "No explanation provided."
            }
          })

          navigate("/score", {
            state: {
              score: attemptResult.score,
              total: attemptResult.totalQuestions,
              subject: subjectName,
              difficulty: config.label,
              answers: answers.map(a => a ? a.selectedOptionIndex : -1),
              questions: reviewQuestions,
              isOffline: false,
              tagged: taggedQuestions
            }
          })
        }
      } catch (err) {
        console.error("Failed to submit online attempt. Saving locally...", err)
        submitOfflineLocal(timeTakenSeconds)
      }
    } else {
      // Local grading for offline attempt
      submitOfflineLocal(timeTakenSeconds)
    }
  }, [answers, questions, quizId, isOfflineAttempt, timeLeft, config, subjectName, navigate, taggedQuestions])

  const submitOfflineLocal = (timeTakenSeconds) => {
    // Grade locally
    const offlineQuizData = getOfflineQuiz(subject, difficulty)
    let localScore = 0

    const gradedQuestions = questions.map((q, idx) => {
      // Get correct index from our offline fallback quiz data structure
      const correctIdx = offlineQuizData.questions[idx] 
        ? offlineQuizData.questions[idx].correctOptionIndex 
        : 0

      const userAns = answers[idx]
      const isCorrect = userAns && userAns.selectedOptionIndex === correctIdx
      if (isCorrect) localScore++

      return {
        question: q.questionText,
        options: q.options.map(o => o.text),
        correct: correctIdx,
        explanation: (offlineQuizData.questions[idx] && offlineQuizData.questions[idx].explanation) || "Verified locally by the offline database."
      }
    })

    // Store in offline sync queue
    const attemptPayload = {
      quizId,
      subject: subjectName,
      difficulty: config.label,
      score: localScore,
      totalPossible: questions.length,
      timeTakenSeconds,
      answers: answers.map((ans, idx) => ({
        questionId: questions[idx]._id,
        selectedOptionId: ans ? ans.selectedOptionId : null,
        selectedOptionIndex: ans ? ans.selectedOptionIndex : -1
      })),
      createdAt: new Date().toISOString()
    }

    // Only queue offline sync for registered users who are actually offline
    if (!isGuestMode() && isOfflineAttempt) {
      queueOfflineAttempt(attemptPayload)
    }

    navigate("/score", {
      state: {
        score: localScore,
        total: questions.length,
        subject: subjectName,
        difficulty: config.label,
        answers: answers.map(a => a ? a.selectedOptionIndex : -1),
        questions: gradedQuestions,
        isOffline: !isGuestMode() && isOfflineAttempt,
        tagged: taggedQuestions
      }
    })
  }

  // 3. Timer Effect
  useEffect(() => {
    if (loading) return
    if (timeLeft <= 0) { handleSubmit(); return }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [timeLeft, handleSubmit, loading])

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
    )
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-page" style={{ justifyContent: "center", alignItems: "center" }}>
        <p className="no-activity">No questions available for this quiz. Please go back.</p>
        <button className="btn-quiz-prev" onClick={() => navigate("/quiz-menu")} style={{ marginTop: "20px" }}>Back to Menu</button>
      </div>
    )
  }

  const q           = questions[current]
  const progress    = ((current + 1) / questions.length) * 100
  const timePercent = (timeLeft / config.time) * 100
  const timerColor  = timePercent > 50 ? "var(--green)" : timePercent > 20 ? "var(--orange)" : "var(--red)"

  function handleOption(optId, optIdx) {
    setSelectedOptId(optId)
    const nextAnswers = [...answers]
    nextAnswers[current] = {
      questionId: q._id,
      selectedOptionId: optId,
      selectedOptionIndex: optIdx
    }
    setAnswers(nextAnswers)
  }

  function goNext() {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      const nextAns = answers[current + 1]
      setSelectedOptId(nextAns ? nextAns.selectedOptionId : null)
    }
  }

  function goPrev() {
    if (current > 0) {
      setCurrent(c => c - 1)
      const prevAns = answers[current - 1]
      setSelectedOptId(prevAns ? prevAns.selectedOptionId : null)
    }
  }

  function toggleTag() {
    const nextTags = [...taggedQuestions]
    nextTags[current] = !nextTags[current]
    setTaggedQuestions(nextTags)
  }

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
                  const ans = answers[idx]
                  const tagged = taggedQuestions[idx]
                  let stateClass = "unanswered"
                  let stateLabel = "Unanswered"
                  
                  if (tagged) {
                    stateClass = "flagged"
                    stateLabel = "Flagged"
                  } else if (ans) {
                    stateClass = "answered"
                    stateLabel = "Answered"
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
                  )
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

        {/* Cancel modal */}
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
    )
  }

  return (
    <div className="quiz-page">

      {/* Top bar */}
      <div className="quiz-topbar">
        <div className="quiz-topbar-info">
          <div className="quiz-topbar-sub">
            {subjectName} {isOfflineAttempt && <span className="offline-pill">Offline Play</span>}
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

      {/* Progress bar */}
      <div className="quiz-progress-bar-wrap">
        <div className="quiz-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Question area */}
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
                key={opt._id}
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

      {/* Cancel modal */}
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
  )
}