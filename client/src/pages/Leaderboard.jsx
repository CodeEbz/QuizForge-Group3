import Navbar from "../components/Navbar";
import "../styles/Leaderboard.css";

const players = [
  { rank: 1, name: "Sophia Wright", score: 4850, quizzes: 42, avg: 97, badge: "🥇" },
  { rank: 2, name: "Marcus Osei", score: 4620, quizzes: 39, avg: 94, badge: "🥈" },
  { rank: 3, name: "Priya Nair", score: 4490, quizzes: 38, avg: 92, badge: "🥉" },
  { rank: 4, name: "Alex Thunder", score: 1840, quizzes: 24, avg: 88, badge: null },
  { rank: 5, name: "Leila Hassan", score: 1740, quizzes: 22, avg: 85, badge: null },
  { rank: 6, name: "James Kimura", score: 1600, quizzes: 20, avg: 83, badge: null },
  { rank: 7, name: "Elena Vasquez", score: 1520, quizzes: 18, avg: 80, badge: null },
  { rank: 8, name: "Noah Adebayo", score: 1380, quizzes: 16, avg: 78, badge: null },
  { rank: 9, name: "Yuki Tanaka", score: 1250, quizzes: 14, avg: 75, badge: null },
  { rank: 10, name: "Amir Khalil", score: 1100, quizzes: 12, avg: 72, badge: null },
];

const podiumOrder = [
  {
    rank: 2,
    height: "120px",
    bg: "linear-gradient(135deg,#374151,#6b7280)",
    border: "#4b5563",
  },
  {
    rank: 1,
    height: "160px",
    bg: "linear-gradient(135deg,#92400e,#d97706)",
    border: "#b45309",
  },
  {
    rank: 3,
    height: "90px",
    bg: "linear-gradient(135deg,#7c3f1a,#b45309)",
    border: "#92400e",
  },
];

export default function Leaderboard() {
  return (
    <div className="leaderboard-page">
      <Navbar />

      <main className="leaderboard-main">
        <h1 className="leaderboard-title">
          Leaderboard
        </h1>

        {/* Podium */}

        <div className="podium-wrap">
          {podiumOrder.map(({ rank, height, bg, border }) => {
            const player = players.find(
              (p) => p.rank === rank
            );

            return (
              <div
                key={rank}
                className="podium-player"
              >
                <span className="podium-badge">
                  {player.badge}
                </span>

                <span className="podium-name">
                  {player.name.split(" ")[0]}
                </span>

                <span className="podium-pts">
                  {player.score.toLocaleString()} pts
                </span>

                <div
                  className="podium-block"
                  style={{
                    height,
                    background: bg,
                    borderColor: border,
                  }}
                >
                  <span className="podium-rank-num">
                    {rank}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leaderboard Table */}

        <div className="lb-table">

          <div className="lb-table-head">
            <span>#</span>

            <span style={{ textAlign: "left" }}>
              Player
            </span>

            <span>Score</span>
            <span>Quizzes</span>
            <span>Avg %</span>
          </div>

          {players.map((player) => {
            const isYou =
              player.name === "Alex Thunder";

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

                  {isYou && (
                    <span className="lb-you-tag">
                      (you)
                    </span>
                  )}
                </span>

                <span className="lb-row-score">
                  {player.score.toLocaleString()}
                </span>

                <span className="lb-row-quizzes">
                  {player.quizzes}
                </span>

                <span className="lb-row-avg">
                  {player.avg}%
                </span>
              </div>
            );
          })}

        </div>

      </main>
    </div>
  );
}