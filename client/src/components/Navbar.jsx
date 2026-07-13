import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import "../styles/Navbar.css";

const navLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Quizzes", path: "/quiz-menu" },
  { label: "History", path: "/history" },
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Statistics", path: "/statistics" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({ name: "Explorer", email: "" });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("quizforge_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Close dropdown on clicking outside
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
      {/* Sticky Top Header Navbar */}
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
                  {/* Mobile links shown inside dropdown */}
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