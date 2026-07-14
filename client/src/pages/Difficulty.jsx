import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { isGuestMode } from "../services/api";
import "../styles/Difficulty.css";

const difficulties = [
  {
    level: "easy",
    label: "Easy",
    questions: 20,
    time: 20,
    description: "Great for beginners. Build your confidence.",
    color: "var(--green)",
    bg: "var(--green-bg)",
    border: "var(--green-border)",
    icon: "🟢",
  },
  {
    level: "medium",
    label: "Medium",
    questions: 30,
    time: 45,
    description: "A balanced challenge for the prepared mind.",
    color: "var(--primary)",
    bg: "var(--blue-bg)",
    border: "var(--blue-border)",
    icon: "🔵",
  },
  {
    level: "hard",
    label: "Hard",
    questions: 50,
    time: 60,
    description: "Only for the bold. Prove your mastery.",
    color: "var(--orange)",
    bg: "var(--orange-bg)",
    border: "var(--orange-border)",
    icon: "🔴",
  },
];

const subjectNames = {
  "javascript": "JavaScript",
  "react": "React",
  "html": "HTML",
  "css": "CSS",
  "mongodb": "MongoDB",
  "nodejs": "Node.js",
  "expressjs": "Express.js",
  "python": "Python",
  "java": "Java",
  "c": "C++",
  "c-1": "C#",
  "sql": "SQL",
  "data-structures": "Data Structures",
  "algorithms": "Algorithms",
  "other": "Other",
}

function formatSubject(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Difficulty() {
  const navigate = useNavigate();
  const { subject = "" } = useParams();
  const isGuest = isGuestMode();

  const subjectName = subjectNames[subject] || formatSubject(subject);

  return (
    <div className="difficulty-page">
      <Navbar />

      <main className="difficulty-main">

        <button
          className="btn-back"
          onClick={() => navigate("/quiz-menu")}
        >
          ← Back to Subjects
        </button>

        <p className="difficulty-sub-label">
          Selecting difficulty for
        </p>

        <h1 className="difficulty-title">
          {subjectName}
        </h1>

        <div className="difficulty-grid">

          {difficulties.map((diff) => {
            const locked = isGuest && diff.level !== "easy";

            return (
              <button
                key={diff.level}
                className={`difficulty-card${locked ? " locked" : ""}`}
                style={{
                  background: diff.bg,
                  borderColor: diff.border,
                  opacity: locked ? 0.55 : 1,
                  cursor: locked ? "not-allowed" : "pointer",
                }}
                disabled={locked}
                onClick={() =>
                  !locked && navigate(`/quiz/${subject}/${diff.level}`)
                }
              >

                <div
                  className="difficulty-card-bar"
                  style={{ background: diff.color }}
                />

                <div className="difficulty-card-body">

                  <div className="difficulty-card-head">
                    <span className="difficulty-card-icon">
                      {locked ? "🔒" : diff.icon}
                    </span>
                    <span
                      className="difficulty-card-label"
                      style={{ color: diff.color }}
                    >
                      {diff.label}
                    </span>
                  </div>

                  <p className="difficulty-card-desc">
                    {locked ? "Registered accounts only. Sign up to unlock." : diff.description}
                  </p>

                  <div className="difficulty-info-grid">
                    <div className="difficulty-info-box" style={{ borderColor: diff.border }}>
                      <div className="difficulty-info-value" style={{ color: diff.color }}>
                        {diff.questions}
                      </div>
                      <div className="difficulty-info-label">Questions</div>
                    </div>
                    <div className="difficulty-info-box" style={{ borderColor: diff.border }}>
                      <div className="difficulty-info-value" style={{ color: diff.color }}>
                        {diff.time}
                      </div>
                      <div className="difficulty-info-label">Minutes</div>
                    </div>
                  </div>

                  <div
                    className="difficulty-start-btn"
                    style={{ background: locked ? "var(--border)" : diff.color }}
                  >
                    {locked ? "🔒 Locked" : `Start ${diff.label} Quiz →`}
                  </div>

                </div>
              </button>
            );
          })}

        </div>

      </main>

    </div>
  );
}