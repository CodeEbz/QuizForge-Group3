import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { isGuestMode } from "../services/api"
import "../styles/QuizMenu.css"

const subjects = [
  { name: "JavaScript",      icon: "⚡", color: "var(--yellow)",  bg: "var(--yellow-bg)",  border: "var(--yellow-border)" },
  { name: "React",           icon: "⚛",  color: "var(--cyan)",   bg: "var(--cyan-bg)",   border: "var(--cyan-border)",   iconColor: "#ffffff" },
  { name: "HTML",            icon: "🌐", color: "var(--orange)", bg: "var(--orange-bg)", border: "var(--orange-border)" },
  { name: "CSS",             icon: "🎨", color: "var(--blue)",   bg: "var(--blue-bg)",   border: "var(--blue-border)" },
  { name: "MongoDB",         icon: "🍃", color: "var(--green)",  bg: "var(--green-bg)",  border: "var(--green-border)" },
  { name: "Node.js",         icon: "🟢", color: "var(--green)",  bg: "var(--green-bg)",  border: "var(--green-border)" },
  { name: "Express.js",      icon: "🚂", color: "var(--text-muted)", bg: "var(--surface)", border: "var(--border)" },
  { name: "Python",          icon: "🐍", color: "var(--blue)",   bg: "var(--blue-bg)",   border: "var(--blue-border)" },
  { name: "Java",            icon: "☕", color: "var(--orange)", bg: "var(--orange-bg)", border: "var(--orange-border)" },
  { name: "C++",             icon: "⚙",  color: "var(--purple)", bg: "var(--purple-bg)", border: "var(--purple-border)", iconColor: "#ffffff" },
  { name: "C#",              icon: "♯",  color: "var(--purple)", bg: "var(--purple-bg)", border: "var(--purple-border)", iconColor: "#ffffff" },
  { name: "SQL",             icon: "🗄",  color: "var(--cyan)",   bg: "var(--cyan-bg)",   border: "var(--cyan-border)",   iconColor: "#ffffff" },
  { name: "Data Structures", icon: "🔗", color: "var(--yellow)", bg: "var(--yellow-bg)", border: "var(--yellow-border)" },
  { name: "Algorithms",      icon: "🔄", color: "var(--pink)",   bg: "var(--pink-bg)",   border: "var(--pink-border)" },
]

const triviaCategories = [
  { id: "", name: "-- Select a Trivia Category --" },
  { id: "9",  name: "General Knowledge" },
  { id: "18", name: "Science: Computers" },
  { id: "19", name: "Science: Mathematics" },
  { id: "22", name: "Geography" },
  { id: "23", name: "History" },
  { id: "21", name: "Sports" },
  { id: "11", name: "Entertainment: Film" },
  { id: "12", name: "Entertainment: Music" },
  { id: "17", name: "Science & Nature" },
  { id: "20", name: "Mythology" },
  { id: "14", name: "Television" },
  { id: "15", name: "Video Games" },
]

// Curated AI topics that generate accurate, reliable questions
const aiTopics = [
  { value: "", label: "-- Select a Topic --" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Docker", label: "Docker & Containers" },
  { value: "Git and GitHub", label: "Git & GitHub" },
  { value: "Cybersecurity Fundamentals", label: "Cybersecurity" },
  { value: "Web Design Principles", label: "Web Design" },
  { value: "Cloud Computing AWS", label: "Cloud Computing (AWS)" },
  { value: "Linux Command Line", label: "Linux & Command Line" },
  { value: "REST API Design", label: "REST API Design" },
  { value: "GraphQL", label: "GraphQL" },
  { value: "Kubernetes", label: "Kubernetes" },
  { value: "Machine Learning Basics", label: "Machine Learning" },
  { value: "Networking Fundamentals", label: "Networking" },
  { value: "Operating Systems", label: "Operating Systems" },
  { value: "Software Engineering Principles", label: "Software Engineering" },
]

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export default function QuizMenuPage() {
  const navigate = useNavigate()
  const [selectedAiTopic, setSelectedAiTopic] = useState("")
  const [selectedTrivia, setSelectedTrivia] = useState("")
  const [difficulty, setDifficulty] = useState("easy")
  const isGuest = isGuestMode()

  const handleCustomQuiz = (e) => {
    e.preventDefault()
    if (selectedAiTopic) {
      navigate(`/quiz/${slugify(selectedAiTopic)}/${difficulty}`)
    }
  }

  const handleTriviaQuiz = (e) => {
    e.preventDefault()
    if (selectedTrivia) {
      navigate(`/quiz/other-${selectedTrivia}/${difficulty}`)
    }
  }

  return (
    <div className="quiz-menu-page">
      <Navbar />
      <main className="quiz-menu-main">
        <h1 className="quiz-menu-title">Choose a Subject</h1>
        <p className="quiz-menu-sub">14 subjects available · Select one to start your quiz</p>

        <div className="subjects-grid">
          {subjects.map(sub => (
            <button
              key={sub.name}
              className="subject-card"
              style={{ background: sub.bg, borderColor: sub.border }}
              onClick={() => navigate(`/difficulty/${slugify(sub.name)}`)}
            >
              <span className="subject-icon" style={{ color: sub.iconColor || sub.color }}>{sub.icon}</span>
              <span className="subject-name" style={{ color: sub.color }}>{sub.name}</span>
            </button>
          ))}
        </div>

        {/* Custom Quiz generator section */}
        <section className="custom-quiz-section" style={{ position: "relative" }}>
          {isGuest && (
            <div className="custom-quiz-guest-overlay">
              <div className="guest-lock-card" style={{ maxWidth: "360px" }}>
                <span className="guest-lock-icon">🔒</span>
                <h3 className="guest-lock-title">Registered Users Only</h3>
                <p className="guest-lock-desc">Custom quiz generation is available for registered accounts. Sign up to unlock AI-powered and trivia quizzes.</p>
                <button className="btn-guest-register" onClick={() => navigate("/auth")}>Create Free Account</button>
              </div>
            </div>
          )}

          <h2 className="custom-quiz-title">Create a Custom Quiz</h2>
          <p className="custom-quiz-sub">
            Preferred subject not listed? Generate a dynamic quiz customized to your choice!
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "28px", opacity: isGuest ? 0.35 : 1, pointerEvents: isGuest ? "none" : "auto" }}>
            
            {/* Custom AI generated quiz */}
            <form onSubmit={handleCustomQuiz} className="custom-quiz-grid">
              <div className="custom-quiz-field">
                <label className="custom-quiz-label">Custom Topic (AI Generated)</label>
                <select
                  value={selectedAiTopic}
                  onChange={(e) => setSelectedAiTopic(e.target.value)}
                  className="custom-quiz-select"
                  required
                >
                  {aiTopics.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="custom-quiz-field">
                <label className="custom-quiz-label">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="custom-quiz-select"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <button type="submit" className="custom-quiz-btn" disabled={!selectedAiTopic}>
                Generate AI Quiz
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ flex: 1, height: "1px", background: "var(--border-dark)" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase" }}>OR</span>
              <div style={{ flex: 1, height: "1px", background: "var(--border-dark)" }} />
            </div>

            {/* Predefined Trivia API Quiz */}
            <form onSubmit={handleTriviaQuiz} className="custom-quiz-grid">
              <div className="custom-quiz-field">
                <label className="custom-quiz-label">General Trivia Category</label>
                <select
                  value={selectedTrivia}
                  onChange={(e) => setSelectedTrivia(e.target.value)}
                  className="custom-quiz-select"
                  required
                >
                  {triviaCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="custom-quiz-field">
                <label className="custom-quiz-label">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="custom-quiz-select"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <button type="submit" className="custom-quiz-btn" disabled={!selectedTrivia}>
                Start Trivia Quiz
              </button>
            </form>

          </div>
        </section>
      </main>
    </div>
  )
}