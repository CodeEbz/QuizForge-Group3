import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import GuestLock from "../components/GuestLock"
import { api, isGuestMode } from "../services/api"
import "../styles/Statistics.css"


const subjectColors = {
  "JavaScript": "#d4a017",
  "React": "#5bc0eb",
  "HTML": "#e86f4c",
  "CSS": "#4a7db5",
  "MongoDB": "#5b8c5a",
  "Node.js": "#6b8c6b",
  "Express": "#6b6b6b",
  "Python": "#4f7aab",
  "Java": "#6d8ba0",
  "C++": "#5a6c7a",
  "C#": "#7a5c8a",
  "SQL": "#4a7a8a",
  "Data Structures": "#8a6e9b",
  "Algorithms": "#c07a4a",
  "Other": "#8a9ba8",
};

const getSubjectColor = (subject) => {
  if (subjectColors[subject]) return subjectColors[subject];
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 40%, 60%)`;
};

export default function Statistics() {
  const navigate = useNavigate()
  const [statsData, setStatsData] = useState({
    totalAttempts: 0,
    totalScore: 0,
    averagePercentage: 0,
    bestPercentage: 0,
    averageTimeTakenSeconds: 0
  })
  const [recentAttempts, setRecentAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  if (isGuestMode()) {
    return (
      <GuestLock
        feature="Statistics"
        message="Track your quiz history, average score, success trends, and analytics by creating a free account."
        icon="🔒"
      />
    );
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getStats()
        if (res.success) {
          setStatsData(res.data.summary)
          setRecentAttempts(res.data.recentAttempts || [])
        }
      } catch (err) {
        console.error("Error fetching statistics:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const categoryMap = {}
  let favCategory = "N/A"   // most attempted
  let bestCategory = "N/A"  // highest average score
  let maxCatCount = 0

  const difficultyMap = { easy: 0, medium: 0, hard: 0 }
  let favDifficulty = "Medium"

  recentAttempts.forEach(attempt => {
    const category = attempt.subject || "General"
    if (category === 'General' || category === 'general') return;

    const difficulty = attempt.difficulty || "medium"
    const difficultyLower = difficulty.toLowerCase()

    if (!categoryMap[category]) {
      categoryMap[category] = { count: 0, totalPct: 0 }
    }
    categoryMap[category].count += 1
    categoryMap[category].totalPct += attempt.percentage || 0

    // Fav. Subject = most attempted
    if (categoryMap[category].count > maxCatCount) {
      maxCatCount = categoryMap[category].count
      favCategory = category.charAt(0).toUpperCase() + category.slice(1)
    }

    if (difficultyMap[difficultyLower] !== undefined) {
      difficultyMap[difficultyLower] += 1
    }
  })

  // Best Subject = highest average score (min 1 attempt)
  let bestAvg = -1
  Object.keys(categoryMap).forEach(cat => {
    const avg = categoryMap[cat].totalPct / categoryMap[cat].count
    if (avg > bestAvg) {
      bestAvg = avg
      bestCategory = cat.charAt(0).toUpperCase() + cat.slice(1)
    }
  })

  let maxDiffCount = -1
  Object.keys(difficultyMap).forEach(d => {
    if (difficultyMap[d] > maxDiffCount) {
      maxDiffCount = difficultyMap[d]
      favDifficulty = d.charAt(0).toUpperCase() + d.slice(1)
    }
  })

  if (recentAttempts.length === 0) {
    favCategory = "None"
    bestCategory = "None"
    favDifficulty = "None"
  }

  const categoryStatsList = Object.keys(categoryMap)
    .filter(cat => cat !== 'General' && cat !== 'general')
    .map(cat => ({
      subject: cat.charAt(0).toUpperCase() + cat.slice(1),
      taken: categoryMap[cat].count,
      avg: Math.round(categoryMap[cat].totalPct / categoryMap[cat].count),
      color: getSubjectColor(cat),
    }))
    .sort((a, b) => b.avg - a.avg)

  const topStats = [
    { label: "Total Quizzes",   value: statsData.totalAttempts,           icon: "✦" },
    { label: "Total Score",     value: `${statsData.totalScore} pts`,     icon: "◈" },
    { label: "Best Subject",    value: bestCategory,                      icon: "⭐" },
    { label: "Fav. Subject",    value: favCategory,                       icon: "🔥" },
    { label: "Average Score",   value: `${statsData.averagePercentage}%`, icon: "◉" },
    { label: "Fav. Difficulty", value: favDifficulty,                     icon: "⚡" },
  ]

  const difficultyBreakdown = [
    { label: "Easy",   count: difficultyMap.easy,   color: "var(--green)",  bg: "var(--green-bg)",  border: "var(--green-border)"  },
    { label: "Medium", count: difficultyMap.medium, color: "var(--blue)",   bg: "var(--blue-bg)",   border: "var(--blue-border)"   },
    { label: "Hard",   count: difficultyMap.hard,   color: "var(--orange)", bg: "var(--orange-bg)", border: "var(--orange-border)" },
  ]

  return (
    <div className="statistics-page">
      <Navbar />
      <main className="statistics-main">
        <button className="btn-back" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
        <h1 className="statistics-title">Statistics</h1>

        {loading ? (
          <p className="no-activity" style={{ marginTop: "40px" }}>Loading statistics...</p>
        ) : (
          <>
            <div className="stat-cards-row">
              {topStats.map(s => (
                <div key={s.label} className="stat-mini-card">
                  <div className="stat-mini-icon">{s.icon}</div>
                  <div className="stat-mini-value">{s.value}</div>
                  <div className="stat-mini-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="subject-bars-card">
              <h2 className="subject-bars-title">Performance by Subject</h2>
              {categoryStatsList.length === 0 ? (
                <p className="no-activity" style={{ padding: "20px 0" }}>Take some quizzes to view subject breakdowns!</p>
              ) : (
                categoryStatsList.map(s => (
                  <div key={s.subject} className="subject-bar-row">
                    <div className="subject-bar-meta">
                      <span className="subject-bar-name" style={{ color: s.color }}>{s.subject}</span>
                      <div className="subject-bar-info">
                        <span>{s.taken} {s.taken === 1 ? 'quiz' : 'quizzes'}</span>
                        <span className="subject-bar-avg" style={{ color: s.color }}>Avg {s.avg}%</span>
                      </div>
                    </div>
                    <div className="subject-bar-track">
                      <div className="subject-bar-fill" style={{ width: `${s.avg}%`, background: s.color }} />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="difficulty-breakdown-card">
              <h2 className="difficulty-breakdown-title">Quizzes by Difficulty</h2>
              <div className="difficulty-breakdown-grid">
                {difficultyBreakdown.map(d => (
                  <div key={d.label} className="diff-breakdown-box" style={{ background: d.bg, borderColor: d.border }}>
                    <div className="diff-breakdown-count" style={{ color: d.color }}>{d.count}</div>
                    <div className="diff-breakdown-label" style={{ color: d.color }}>{d.label}</div>
                    <div className="diff-breakdown-sub">{d.count === 1 ? 'quiz' : 'quizzes'}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}