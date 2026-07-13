import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../services/api"
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
  const [quizId, setQuizId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selectedOptId, setSelectedOptId] = useState(null)
  const [answers, setAnswers] = useState([]) // Stores: { questionId, selectedOptionId, selectedOptionIndex }
  const [timeLeft, setTimeLeft] = useState(config.time)
  const [showCancel, setShowCancel] = useState(false)
  const [isOfflineAttempt, setIsOfflineAttempt] = useState(!navigator.onLine)

  // 1. Fetch Quiz on Mount
  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true)
      
      // If offline, use local offline fallback quizzes immediately
      if (!navigator.onLine) {
        loadLocalFallback()
        return
      }

      try {
        // Query quiz matching category and difficulty from DB
        const quizzesRes = await api.getQuizzes({ 
          category: subject.toLowerCase(), 
          difficulty: difficulty.toLowerCase() 
        })

        if (quizzesRes.success && quizzesRes.data.length > 0) {
          const quizMeta = quizzesRes.data[0]
          setQuizId(quizMeta._id)
          
          // Get questions (excluding answer keys)
          const playRes = await api.getQuizForPlay(quizMeta._id)
          if (playRes.success) {
            setQuestions(playRes.data.questions)
            setAnswers(Array(playRes.data.questions.length).fill(null))
            if (playRes.data.timeLimitSeconds) {
              setTimeLeft(playRes.data.timeLimitSeconds)
            }
          }
        } else {
          // No matching quiz found in DB, fallback to local quiz questions
          console.warn("No quiz found in DB, loading local offline fallback.")
          loadLocalFallback()
        }
      } catch (err) {
        console.error("Failed to load quiz from API, loading local fallback.", err)
        loadLocalFallback()
      } finally {
        setLoading(false)
      }
    }

    const loadLocalFallback = () => {
      const offlineQuiz = getOfflineQuiz(subject, difficulty)
      setQuizId(offlineQuiz._id || "offline-id")
      setQuestions(offlineQuiz.questions)
      setAnswers(Array(offlineQuiz.questions.length).fill(null))
      setIsOfflineAttempt(true)
      setLoading(false)
    }

    loadQuiz()
  }, [subject, difficulty])

  // 2. Submit Attempt Handler
  const handleSubmit = useCallback(async () => {
    setLoading(true)
    const timeTakenSeconds = config.time - timeLeft

    if (!isOfflineAttempt) {
      try {
        // Prepare submission payload for backend
        const formattedAnswers = answers.map((ans, idx) => {
          const q = questions[idx]
          return {
            questionId: q._id,
            selectedOptionId: ans ? ans.selectedOptionId : q.options[0]._id // fallback to first option if skipped
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
            const correctOpt = reviewRes.data.questions[idx].options.find(o => o.isCorrect)
            const correctIdx = reviewRes.data.questions[idx].options.findIndex(o => o.isCorrect)
            
            return {
              question: q.questionText,
              options: q.options.map(o => o.text),
              correct: correctIdx >= 0 ? correctIdx : 0
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
              isOffline: false
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
  }, [answers, questions, quizId, isOfflineAttempt, timeLeft, config, subjectName, navigate])

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
        correct: correctIdx
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
        selectedOptionId: ans ? ans.selectedOptionId : questions[idx].options[0]._id,
        selectedOptionIndex: ans ? ans.selectedOptionIndex : -1
      })),
      createdAt: new Date().toISOString()
    }

    queueOfflineAttempt(attemptPayload)

    navigate("/score", {
      state: {
        score: localScore,
        total: questions.length,
        subject: subjectName,
        difficulty: config.label,
        answers: answers.map(a => a ? a.selectedOptionIndex : -1),
        questions: gradedQuestions,
        isOffline: true
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
    return (
      <div className="quiz-page" style={{ justifyContent: "center", alignItems: "center" }}>
        <p className="no-activity">Preparing your quiz environment...</p>
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
          <button className="btn-submit-quiz" onClick={handleSubmit}>Submit</button>
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
            <p className="quiz-q-label">Question {current + 1}</p>
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
            {current < questions.length - 1
              ? <button className="btn-quiz-next" onClick={goNext}>Next →</button>
              : <button className="btn-quiz-final" onClick={handleSubmit}>Submit Quiz</button>
            }
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