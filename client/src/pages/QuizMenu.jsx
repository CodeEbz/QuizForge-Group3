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
  { name: "Other",           icon: "✦",  color: "var(--green)",  bg: "var(--green-bg)",  border: "var(--green-border)" },
]

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export default function QuizMenuPage() {
  const navigate = useNavigate()

  return (
    <div className="quiz-menu-page">
      <Navbar />
      <main className="quiz-menu-main">
        <h1 className="quiz-menu-title">Choose a Subject</h1>
        <p className="quiz-menu-sub">15 subjects available · Select one to start your quiz</p>

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
      </main>
    </div>
  )
}