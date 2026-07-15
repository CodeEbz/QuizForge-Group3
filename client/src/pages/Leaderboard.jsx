import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api, isGuestMode } from "../services/api";
import "../styles/Leaderboard.css";

const podiumOrder = [
  {
    rank: 2,
    height: "120px",
    bg: "linear-gradient(135deg,#374151,#6b7280)",
    border: "#4b5563",
    badge: "🥈"
  },
  {
    rank: 1,
    height: "160px",
    bg: "linear-gradient(135deg,#92400e,#d97706)",
    border: "#b45309",
    badge: "🥇"
  },
  {
    rank: 3,
    height: "90px",
    bg: "linear-gradient(135deg,#7c3f1a,#b45309)",
    border: "#92400e",
    badge: "🥉"
  },
];

export default function Leaderboard() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  if (isGuestMode()) {
    return (
      <div className="leaderboard-page">
        <Navbar />
        <main className="leaderboard-main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '100px 20px' }}>
          <button className="btn-back" onClick={() => navigate("/dashboard")} style={{ alignSelf: 'flex-start', marginBottom: '24px' }}>← Back to Dashboard</button>
          <div className="guest-lock-card">
            <span className="guest-lock-icon">🔒</span>
            <h2 className="guest-lock-title">Leaderboard Locked</h2>
            <p className="guest-lock-desc">
              Leaderboard standings are only available to registered QuizForge players. Create an account to compete globally and see where you stand!
            </p>
            <button className="btn-guest-register" onClick={() => navigate("/auth")}>
              Sign Up / Log In
            </button>
          </div>
        </main>
      </div>
    );
  }

  useEffect(() => {
    // Load current user
    const storedUser = localStorage.getItem("quizforge_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchLeaderboard = async () => {
      try {
        const res = await api.getLeaderboard(50); // get top 50
        if (res.success) {
          // Set badge properties for the top 3
          const formatted = res.data.map(p => ({
            ...p,
            badge: p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : p.rank === 3 ? "🥉" : null
          }));
          setPlayers(formatted);
        }
      } catch (err) {
        console.error("Error loading leaderboard:", err);
        // Offline / error fallback
        setPlayers([
          { rank: 1, name: "Sophia Wright", totalScore: 4850, totalAttempts: 42, averagePercentage: 97, badge: "🥇" },
          { rank: 2, name: "Marcus Osei", totalScore: 4620, totalAttempts: 39, averagePercentage: 94, badge: "🥈" },
          { rank: 3, name: "Priya Nair", totalScore: 4490, totalAttempts: 38, averagePercentage: 92, badge: "🥉" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-page">
      <Navbar />

      <main className="leaderboard-main">
        <button className="btn-back" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
        <h1 className="leaderboard-title">Leaderboard</h1>

        {loading ? (
          <p className="no-activity" style={{ marginTop: "40px" }}>Loading global standings...</p>
        ) : (
          <>
            {/* Podium for top 3 */}
            <div className="podium-wrap">
              {podiumOrder.map(({ rank, height, bg, border, badge }) => {
                const player = players.find(p => p.rank === rank) || {
                  name: `Player ${rank}`,
                  totalScore: 0,
                  badge
                };

                return (
                  <div key={rank} className="podium-player">
                    <span className="podium-badge">{player.badge}</span>
                    <span className="podium-name">
                      {player.name.split(" ")[0]}
                    </span>
                    <span className="podium-pts">
                      {(player.totalScore || 0).toLocaleString()} pts
                    </span>

                    <div
                      className="podium-block"
                      style={{
                        height,
                        background: bg,
                        borderColor: border,
                      }}
                    >
                      <span className="podium-rank-num">{rank}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Leaderboard Table */}
            <div className="lb-table">
              <div className="lb-table-head">
                <span>#</span>
                <span style={{ textAlign: "left" }}>Player</span>
                <span>Score</span>
                <span>Quizzes</span>
                <span>Avg %</span>
              </div>

              {players.map((player) => {
                const isYou = user && player.name === user.name;

                return (
                  <div
                    key={player.rank}
                    className={`lb-row${isYou ? " is-you" : ""}`}
                  >
                    <span className="lb-row-rank">
                      {player.badge || player.rank}
                    </span>

                    <span className="lb-row-name">
                      {player.name}
                      {isYou && <span className="lb-you-tag">(you)</span>}
                    </span>

                    <span className="lb-row-score">
                      {(player.totalScore || 0).toLocaleString()}
                    </span>

                    <span className="lb-row-quizzes">
                      {player.totalAttempts || 0}
                    </span>

                    <span className="lb-row-avg">
                      {player.averagePercentage || 0}%
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}