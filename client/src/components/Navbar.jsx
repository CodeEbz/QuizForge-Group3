import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useTheme } from "../hooks/ThemeContext";   // ✅ fixed import
import "../styles/Navbar.css";

const navLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Quizzes", path: "/quiz-menu" },
  { label: "History", path: "/history" },
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Statistics", path: "/statistics" },
];

// Sun icon (shown in dark mode → click to go light)
function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1"  y1="12" x2="3"  y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

// Moon icon (shown in light mode → click to go dark)
function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();   // ✅ uncommented and working
  const [showLogout, setShowLogout] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({ name: "Explorer", email: "" });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("quizforge_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const initials = (user.name || "E").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <header className="navbar-header">
        <div className="navbar-container">

          <div className="navbar-brand" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
            <Logo width={140} className="navbar-brand-logo" />
          </div>

          <nav className="navbar-desktop-nav">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  className={`navbar-desktop-link${active ? " active" : ""}`}
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

            {/* ── Theme toggle ── */}
            <button
              className="navbar-theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* ── User dropdown ── */}
            <div className="navbar-right" ref={dropdownRef}>
              <button
                className="navbar-user-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="navbar-user-name">{user.name}</span>
                <div className="navbar-user-avatar">{initials}</div>
                <span className="navbar-chevron">▼</span>
              </button>

              {dropdownOpen && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown-header">
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-email">{user.email || (user.role === "guest" ? "Guest explorer" : "")}</p>
                  </div>

                  <div className="navbar-dropdown-links">
                    {/* Mobile-only nav links */}
                    <div className="navbar-mobile-only-links">
                      {navLinks.map((link) => (
                        <button
                          key={link.path}
                          className={`dropdown-link-btn${location.pathname === link.path ? " active" : ""}`}
                          onClick={() => { navigate(link.path); setDropdownOpen(false); }}
                        >
                          {link.label}
                        </button>
                      ))}
                      <div className="dropdown-divider" />
                    </div>

                    <button
                      className={`dropdown-link-btn${location.pathname === "/profile" ? " active" : ""}`}
                      onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                    >
                      View Profile
                    </button>

                    {/* Theme toggle inside dropdown (mobile-friendly label) */}
                    <button
                      className="dropdown-link-btn"
                      onClick={() => { toggleTheme(); setDropdownOpen(false); }}
                    >
                      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
                    </button>

                    <div className="dropdown-divider" />

                    <button
                      className="dropdown-link-btn logout-trigger"
                      onClick={() => { setShowLogout(true); setDropdownOpen(false); }}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

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
            <h3 className="logout-title">Log Out?</h3>
            <p className="logout-subtitle">Are you sure you want to log out of QuizForge?</p>
            <div className="logout-actions">
              <button className="btn-stay" onClick={() => setShowLogout(false)}>Stay</button>
              <button
                className="btn-logout-confirm"
                onClick={() => {
                  localStorage.removeItem("quizforge_token");
                  localStorage.removeItem("quizforge_user");
                  navigate("/auth");
                }}
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