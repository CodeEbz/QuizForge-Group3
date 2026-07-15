import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function GuestLock({ feature, message, icon = "🔒" }) {
  const navigate = useNavigate();

  // Set default messages based on feature if not provided
  const title = feature ? `${feature} Locked` : "Feature Locked";
  const desc = message || `Sign up or log in to access this feature!`;

  return (
    <div className="guest-lock-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main
        className="guest-lock-main"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          padding: "100px 20px",
          flex: 1,
        }}
      >

        <div className="guest-lock-card">
          <span className="guest-lock-icon" style={{ fontSize: "4rem", display: "block", marginBottom: "16px" }}>
            {icon}
          </span>
          <h2 className="guest-lock-title" style={{ marginBottom: "8px" }}>
            {title}
          </h2>
          <p className="guest-lock-desc" style={{ color: "var(--text-muted)", maxWidth: "400px", marginBottom: "24px" }}>
            {desc}
          </p>
          <button className="btn-guest-register" onClick={() => navigate("/auth")}>
            Sign Up / Log In
          </button>
        </div>
      </main>
    </div>
  );
}