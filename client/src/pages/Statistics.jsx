import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { api } from "../services/api"
import "../styles/Statistics.css"

export default function Statistics() {
  const [statsData, setStatsData] = useState({
    totalAttempts: 0,
    totalScore: 0,
    averagePercentage: 0,
    bestPercentage: 0,
    averageTimeTakenSeconds: 0
  })
  const [recentAttempts, setRecentAttempts] = useState([])
  const [loading, setLoading] = useState(true)

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
        // Try to load offline statistics
        const offlineStats = JSON.parse(localStorage.getItem("quizforge_offline_stats"))
        if (offlineStats) {
          setStatsData(offlineStats.summary)
          setRecentAttempts(offlineStats.recentAttempts)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Aggregate Category Breakdown from attempts
  const categoryMap = {}
  let favCategory = "N/A"
  let maxCatCount = 0

  // Aggregate Difficulty Breakdown from attempts
  const difficultyMap = { easy: 0, medium: 0, hard: 0 }
  let favDifficulty = "Medium"

  recentAttempts.forEach(attempt => {
    const category = attempt.quiz ? attempt.quiz.category : "general"
    const difficulty = attempt.quiz ? attempt.quiz.difficulty.toLowerCase() : "medium"

    // Category calculation
    if (!categoryMap[category]) {
      categoryMap[category] = { count: 0, totalPct: 0 }
    }
    categoryMap[category].count += 1
    categoryMap[category].totalPct += attempt.percentage

    if (categoryMap[category].count > maxCatCount) {
      maxCatCount = categoryMap[category].count
      favCategory = category.charAt(0).toUpperCase() + category.slice(1)
    }

    // Difficulty calculation
    if (difficultyMap[difficulty] !== undefined) {
      difficultyMap[difficulty] += 1
    }
  })

  // Determine Favorite Difficulty
  let maxDiffCount = -1
  Object.keys(difficultyMap).forEach(d => {
    if (difficultyMap[d] > maxDiffCount) {
      maxDiffCount = difficultyMap[d]
      favDifficulty = d.charAt(0).toUpperCase() + d.slice(1)
    }
  })

  // If no attempts yet, display N/A for favorites
  if (recentAttempts.length === 0) {
    favCategory = "None"
    favDifficulty = "None"
  }

  // Format category stats array for the performance list
  const categoryStatsList = Object.keys(categoryMap).map(cat => ({
    subject: cat.charAt(0).toUpperCase() + cat.slice(1),
    taken: categoryMap[cat].count,
    avg: Math.round(categoryMap[cat].totalPct / categoryMap[cat].count),
    color: cat === "javascript" ? "var(--yellow)" : cat === "react" ? "var(--cyan)" : cat === "html" ? "var(--orange)" : cat === "css" ? "var(--blue)" : "var(--green)"
  })).sort((a, b) => b.avg - a.avg)

  const topStats = [
    { label: "Total Quizzes",   value: statsData.totalAttempts, color: "var(--blue)", bg: "var(--blue-bg)", border: "var(--blue-border)", icon: "✦" },
    { label: "Total Score",     value: `${statsData.totalScore} pts`, color: "var(--blue)", bg: "var(--blue-bg)", border: "var(--blue-border)", icon: "◈" },
    { label: "Best Subject",    value: favCategory, color: "var(--blue)", bg: "var(--blue-bg)", border: "var(--blue-border)", icon: "⭐" },
    { label: "Average Score",   value: `${statsData.averagePercentage}%`, color: "var(--blue)", bg: "var(--blue-bg)", border: "var(--blue-border)", icon: "◉" },
    { label: "Fav. Difficulty", value: favDifficulty, color: "var(--blue)", bg: "var(--blue-bg)", border: "var(--blue-border)", icon: "⚡" },
  ]

  const difficultyBreakdown = [
    { label: "Easy",   count: difficultyMap.easy, color: "var(--green)",  bg: "var(--green-bg)",  border: "var(--green-border)"  },
    { label: "Medium", count: difficultyMap.medium, color: "var(--blue)",   bg: "var(--blue-bg)",   border: "var(--blue-border)"   },
    { label: "Hard",   count: difficultyMap.hard, color: "var(--orange)", bg: "var(--orange-bg)", border: "var(--orange-border)" },
  ]

  return (
    <div className="statistics-page">
      <Navbar />
      <main className="statistics-main">
        <h1 className="statistics-title">Statistics</h1>

        {loading ? (
          <p className="no-activity" style={{ marginTop: "40px" }}>Loading statistics...</p>
        ) : (
          <>
            {/* Top stat cards */}
            <div className="stat-cards-row">
              {topStats.map(s => (
                <div key={s.label} className="stat-mini-card" style={{ background: s.bg, borderColor: s.border }}>
                  <div className="stat-mini-icon">{s.icon}</div>
                  <div className="stat-mini-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-mini-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Subject performance bars */}
            <div className="subject-bars-card">
              <h2 className="subject-bars-title">Performance by Subject</h2>
              {categoryStatsList.length === 0 ? (
                <p className="no-activity" style={{ padding: "20px 0" }}>Take some quizzes to view subject breakdowns!</p>
              ) : (
                categoryStatsList.map(s => (
                  <div key={s.subject} className="subject-bar-row">
                    <div className="subject-bar-meta">
                      <span className="subject-bar-name">{s.subject}</span>
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

            {/* Difficulty breakdown */}
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