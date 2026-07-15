import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import { api, isGuestMode } from "../services/api"
import "../styles/Dashboard.css"

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState({ name: "Explorer" })
  const [statsData, setStatsData] = useState({
    totalAttempts: 0,
    totalScore: 0,
    averagePercentage: 0,
    bestPercentage: 0,
    averageTimeTakenSeconds: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [topPlayers, setTopPlayers] = useState([])
  const [apiError, setApiError] = useState("")

  const formatPercentage = (value) => {
    if (value === undefined || value === null) return 0
    return Math.round(value)
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("quizforge_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const fetchDashboardData = async () => {
      setApiError("")
      try {
        const meRes = await api.getMe()
        if (meRes.success) {
          setUser(meRes.data)
          localStorage.setItem("quizforge_user", JSON.stringify(meRes.data))
        }

        const statsRes = await api.getStats()
        if (statsRes.success) {
          const s = statsRes.data.summary
          setStatsData({
            totalAttempts: s.totalAttempts || 0,
            totalScore: s.totalScore || 0,
            averagePercentage: Math.round(s.averagePercentage || 0),
            bestPercentage: Math.round(s.bestPercentage || 0),
            averageTimeTakenSeconds: s.averageTimeTakenSeconds || 0
          })
          setRecentActivity((statsRes.data.recentAttempts || []).slice(0, 5))
        }

        const lbRes = await api.getLeaderboard(5)
        if (lbRes.success) {
          setTopPlayers(lbRes.data)
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err)
        setApiError("Could not reach the server. Check your connection or ensure the backend is running.")
      }
    }

    fetchDashboardData()
  }, [location.pathname])

  function scoreColor(pct) {
    if (pct >= 90) return "var(--green)";
    if (pct >= 71) return "var(--blue)";
    if (pct >= 50) return "var(--orange)";
    return "var(--red)";
  }

  const statsList = [
    { label: "Quizzes Taken", value: statsData.totalAttempts, color: "var(--blue)", bg: "var(--blue-bg)", border: "var(--blue-border)", icon: "✦" },
    { label: "Average Score", value: `${statsData.averagePercentage}%`, color: "var(--blue)", bg: "var(--blue-bg)", border: "var(--blue-border)", icon: "◈" },
    { label: "Best Score", value: `${statsData.bestPercentage}%`, color: "var(--blue)", bg: "var(--blue-bg)", border: "var(--blue-border)", icon: "⟐" },
  ]

  const isGuest = isGuestMode()

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-main">
        {apiError && (
          <div className="offline-banner" style={{ background: '#1e0808', borderColor: '#dc2626' }}>
            ⚠️ {apiError}
          </div>
        )}

        {/* Guest banner */}
        {isGuest && (
          <div className="guest-banner" style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--orange-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🧑‍🤝‍🧑</span>
              <span style={{ fontWeight: 600 }}>You are in Guest Mode</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>
                – take quizzes, but results won't be saved.
              </span>
            </div>
            <Link to="/auth" className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.9rem' }}>
              Sign Up for Free
            </Link>
          </div>
        )}

        {/* Welcome banner */}
        <div className="dashboard-banner">
          <div>
            <p className="dashboard-banner-sub">Welcome back,</p>
            <h1 className="dashboard-banner-name">{user.name || "Explorer"} 👋</h1>
            <p className="dashboard-banner-hint">Ready to forge some knowledge today?</p>
          </div>
          <Link to="/quiz-menu" className="btn-start-quiz">
            Start a Quiz →
          </Link>
        </div>

        {/* Stat cards – show 0 for guests but still visually clean */}
        <div className="stats-grid">
          {statsList.map(s => (
            <div
              key={s.label}
              className="stat-card"
              style={{ background: s.bg, borderColor: s.border }}
            >
              <div className="stat-card-icon">{s.icon}</div>
              <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="dashboard-lower">

          {/* Recent activity – show sign‑up prompt for guests */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <span className="dashboard-card-title">Recent Activity</span>
              {!isGuest && (
                <Link to="/history" className="link-btn">View History →</Link>
              )}
            </div>
            <div className="activity-list">
              {isGuest ? (
                <div className="guest-cta" style={{ padding: '20px', textAlign: 'center' }}>
                  <p className="no-activity" style={{ marginBottom: '12px' }}>
                    🧑‍🤝‍🧑 Sign up to save your quiz history and track progress!
                  </p>
                  <Link to="/auth" className="btn-primary">
                    Create Free Account
                  </Link>
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="no-activity">No quizzes taken yet. Click 'Start a Quiz' to begin!</p>
              ) : (
                recentActivity.map((a, i) => {
                  const roundedPct = formatPercentage(a.percentage)
                  return (
                    <div key={i} className="activity-row">
                      <div>
                        <div className="activity-subject">{a.quiz ? a.quiz.title : (a.subject ? `${a.subject} Quiz` : "Quiz")}</div>
                        <div className="activity-meta">
                          {a.quiz
                            ? `${a.quiz.subject || a.quiz.category || "General"} · ${a.quiz.difficulty}`
                            : `${a.subject || "Other"} · ${a.difficulty || "Easy"}`
                          } · {new Date(a.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="activity-score" style={{ color: scoreColor(roundedPct) }}>{roundedPct}%</div>
                        <div className="activity-score-raw">{a.score}/{a.totalPossible}</div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Mini leaderboard – show sign‑up prompt for guests */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <span className="dashboard-card-title">Top Players</span>
              {!isGuest && (
                <Link to="/leaderboard" className="link-btn">Full Standings →</Link>
              )}
            </div>
            <div className="mini-lb-list">
              {isGuest ? (
                <div className="guest-cta" style={{ padding: '20px', textAlign: 'center' }}>
                  <p className="no-activity" style={{ marginBottom: '12px' }}>
                    🏆 Create an account to compete on the global leaderboard!
                  </p>
                  <Link to="/auth" className="btn-primary">
                    Join the Competition
                  </Link>
                </div>
              ) : topPlayers.length === 0 ? (
                <p className="no-activity">Standings are loading...</p>
              ) : (
                topPlayers.slice(0, 5).map((p, idx) => {
                  const isYou = user.name === p.name;
                  return (
                    <div key={idx} className={`mini-lb-row${isYou ? " is-you" : ""}`}>
                      <span className="mini-lb-badge">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : (
                          <span className="mini-lb-rank">{idx + 1}</span>
                        )}
                      </span>
                      <div>
                        <div className="mini-lb-name">{p.name} {isYou && "(you)"}</div>
                        <div className="mini-lb-pts">{p.totalScore.toLocaleString()} pts</div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}