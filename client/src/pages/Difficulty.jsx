import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
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

function formatSubject(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Difficulty() {
  const navigate = useNavigate();
  const { subject = "" } = useParams();

  const subjectName = formatSubject(subject);

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

          {difficulties.map((difficulty) => (

            <button
              key={difficulty.level}
              className="difficulty-card"
              style={{
                background: difficulty.bg,
                borderColor: difficulty.border,
              }}
              onClick={() =>
                navigate(`/quiz/${subject}/${difficulty.level}`)
              }
            >

              <div
                className="difficulty-card-bar"
                style={{
                  background: difficulty.color,
                }}
              />

              <div className="difficulty-card-body">

                <div className="difficulty-card-head">

                  <span className="difficulty-card-icon">
                    {difficulty.icon}
                  </span>

                  <span
                    className="difficulty-card-label"
                    style={{
                      color: difficulty.color,
                    }}
                  >
                    {difficulty.label}
                  </span>

                </div>

                <p className="difficulty-card-desc">
                  {difficulty.description}
                </p>

                <div className="difficulty-info-grid">

                  <div
                    className="difficulty-info-box"
                    style={{
                      borderColor: difficulty.border,
                    }}
                  >

                    <div
                      className="difficulty-info-value"
                      style={{
                        color: difficulty.color,
                      }}
                    >
                      {difficulty.questions}
                    </div>

                    <div className="difficulty-info-label">
                      Questions
                    </div>

                  </div>

                  <div
                    className="difficulty-info-box"
                    style={{
                      borderColor: difficulty.border,
                    }}
                  >

                    <div
                      className="difficulty-info-value"
                      style={{
                        color: difficulty.color,
                      }}
                    >
                      {difficulty.time}
                    </div>

                    <div className="difficulty-info-label">
                      Minutes
                    </div>

                  </div>

                </div>

                <div
                  className="difficulty-start-btn"
                  style={{
                    background: difficulty.color,
                  }}
                >
                  Start {difficulty.label} Quiz →
                </div>

              </div>

            </button>

          ))}

        </div>

      </main>

    </div>
  );
}