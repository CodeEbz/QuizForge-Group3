import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import "../styles/Navbar.css";

const navLinks = [
  { label: "Dashboard", path: "/dashboard", icon: "⊞" },
  { label: "Quizzes", path: "/quiz-menu", icon: "✦" },
  { label: "Leaderboard", path: "/leaderboard", icon: "⟐" },
  { label: "Statistics", path: "/statistics", icon: "◈" },
  { label: "Profile", path: "/profile", icon: "◉" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="navbar-sidebar">

        <div className="navbar-logo-wrap">
          <Logo width={165} className="navbar-logo" />
        </div>

        <nav className="navbar-nav">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;

            return (
              <button
                key={link.path}
                className={`navbar-link${active ? " active" : ""}`}
                onClick={() => navigate(link.path)}
              >
                <span className="navbar-link-icon">
                  {link.icon}
                </span>

                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="navbar-footer">
          <button
            className="navbar-logout-btn"
            onClick={() => setShowLogout(true)}
          >
            Log Out
          </button>
        </div>

      </aside>

      {/* Mobile Bottom Navigation */}

      <nav className="navbar-mobile">
        {navLinks.map((link) => {
          const active = location.pathname === link.path;

          return (
            <button
              key={link.path}
              className={`navbar-mobile-link${active ? " active" : ""}`}
              onClick={() => navigate(link.path)}
            >
              <span className="navbar-mobile-icon">
                {link.icon}
              </span>

              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Logout Modal */}

      {showLogout && (
        <div className="logout-overlay">

          <div className="logout-modal">

            <div className="logout-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>

            <h3 className="logout-title">
              Log Out?
            </h3>

            <p className="logout-subtitle">
              Are you sure you want to log out of QuizForge?
            </p>

            <div className="logout-actions">

              <button
                className="btn-stay"
                onClick={() => setShowLogout(false)}
              >
                Stay
              </button>

              <button
                className="btn-logout-confirm"
                onClick={() => navigate("/auth")}
              >
                Yes, Log Out
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}