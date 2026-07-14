import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import { api, isGuestMode } from "../services/api"
import { registerOnlineSync, syncOfflineAttempts } from "../services/offlineSync"
import "../styles/Dashboard.css"

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState({ name: "Alex" })
  const [statsData, setStatsData] = useState({
    totalAttempts: 0,
    totalScore: 0,
    averagePercentage: 0,
    bestPercentage: 0,
    averageTimeTakenSeconds: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [topPlayers, setTopPlayers] = useState([])
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncStatus, setSyncStatus] = useState("")
  const [apiError, setApiError] = useState("")

  // Re-fetch every time we navigate back to dashboard (e.g. after finishing a quiz)
  useEffect(() => {
    // 1. Load user from local storage
    const storedUser = localStorage.getItem("quizforge_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // 2. Fetch data function
    const fetchDashboardData = async () => {
      setApiError("")
      try {
        // Fetch User profile (ensures fresh name)
        const meRes = await api.getMe()
        if (meRes.success) {
          setUser(meRes.data)
          localStorage.setItem("quizforge_user", JSON.stringify(meRes.data))
        }

        // Fetch User Statistics
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

        // Fetch Leaderboard top players
        const lbRes = await api.getLeaderboard(3)
        if (lbRes.success) {
          setTopPlayers(lbRes.data)
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err)
        setApiError("Could not reach the server. Check your connection or ensure the backend is running.")
      }
    }

    // 3. Register online status listeners
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine)
    }
    window.addEventListener("online", handleStatusChange)
    window.addEventListener("offline", handleStatusChange)

    // 4. Auto sync offline attempts on mount / reconnect (only for registered users)
    const unregisterSync = !isGuestMode() ? registerOnlineSync(async (syncResult) => {
      setSyncStatus(`Synced ${syncResult.synced} offline quizzes successfully!`)
      setTimeout(() => setSyncStatus(""), 5000)
      await fetchDashboardData()
    }) : () => {}

    // Sync immediately on mount if online and registered
    if (navigator.onLine && !isGuestMode()) {
      syncOfflineAttempts().then((syncResult) => {
        if (syncResult && syncResult.synced > 0) {
          setSyncStatus(`Synced ${syncResult.synced} offline quizzes successfully!`)
          setTimeout(() => setSyncStatus(""), 5000)
          fetchDashboardData()
        }
      }).catch(err => console.error("Error syncing offline attempts on mount:", err))
    }

    fetchDashboardData()

    return () => {
      window.removeEventListener("online", handleStatusChange)
      window.removeEventListener("offline", handleStatusChange)
      unregisterSync()
    }
  }, [location.pathname])

  function scoreColor(pct) {
    if (pct >= 80) return "var(--green)"
    if (pct >= 60) return "var(--orange)"
    return "var(--red)"
  }

  // Map database statistics to dashboard stats cards layout
  const statsList = [
    { label: "Quizzes Taken", value: statsData.totalAttempts, color: "var(--blue)", bg: "var(--blue-bg)", border: "var(--blue-border)", icon: "✦" },
    { label: "Average Score", value: `${statsData.averagePercentage}%`, color: "var(--blue)", bg: "var(--blue-bg)", border: "var(--blue-border)", icon: "◈" },
    { label: "Best Score", value: `${statsData.bestPercentage}%`, color: "var(--blue)", bg: "var(--blue-bg)", border: "var(--blue-border)", icon: "⟐" },
  ]

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-main">

        {/* Offline & Sync Banners */}
        {!isOnline && (
          <div className="offline-banner">
            ⚠️ You are running offline. Quizzes can be played and progress will sync once reconnected.
          </div>
        )}
        {apiError && isOnline && (
          <div className="offline-banner" style={{ background: '#1e0808', borderColor: '#dc2626' }}>
            ⚠️ {apiError}
          </div>
        )}
        {syncStatus && (
          <div className="sync-banner">
            ✨ {syncStatus}
          </div>
        )}

        {/* Welcome banner */}
        <div className="dashboard-banner">
          <div>
            <p className="dashboard-banner-sub">Welcome back,</p>
            <h1 className="dashboard-banner-name">{user.name || "Explorer"} 👋</h1>
            <p className="dashboard-banner-hint">Ready to forge some knowledge today?</p>
          </div>
          <button className="btn-start-quiz" onClick={() => navigate("/quiz-menu")}>
            Start a Quiz →
          </button>
        </div>

        {/* Stat cards */}
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

        {/* Lower grid */}
        <div className="dashboard-lower">

          {/* Recent activity */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <span className="dashboard-card-title">Recent Activity</span>
              <button className="link-btn" onClick={() => navigate("/statistics")}>View all →</button>
            </div>
            <div className="activity-list">
              {recentActivity.length === 0 ? (
                <p className="no-activity">No quizzes taken yet. Click 'Start a Quiz' to begin!</p>
              ) : (
                recentActivity.map((a, i) => (
                  <div key={i} className="activity-row">
                    <div>
                      <div className="activity-subject">{a.quiz ? a.quiz.title : (a.subject ? `${a.subject} Quiz` : "Quiz")}</div>
                      <div className="activity-meta">
                        {a.quiz ? `${a.quiz.category} · ${a.quiz.difficulty}` : `${a.subject || "General"} · ${a.difficulty || "easy"}`} · {new Date(a.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="activity-score" style={{ color: scoreColor(a.percentage) }}>{a.percentage}%</div>
                      <div className="activity-score-raw">{a.score}/{a.totalPossible}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mini leaderboard */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <span className="dashboard-card-title">Top Players</span>
              <button className="link-btn" onClick={() => navigate("/leaderboard")}>Full →</button>
            </div>
            <div className="mini-lb-list">
              {topPlayers.length === 0 ? (
                <p className="no-activity">Standings are loading...</p>
              ) : (
                topPlayers.slice(0, 3).map((p, idx) => {
                  const isYou = user.name === p.name;
                  return (
                    <div key={idx} className={`mini-lb-row${isYou ? " is-you" : ""}`}>
                      <span className="mini-lb-badge">
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
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
            <button className="btn-play-now" onClick={() => navigate("/leaderboard")}>
              View Full Standings
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}