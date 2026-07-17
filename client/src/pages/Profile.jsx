import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import GuestLock from "../components/GuestLock";
import { api, isGuestMode } from "../services/api";
import "../styles/Profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Guest lock – placed at the top to prevent blink
  if (isGuestMode()) {
    return (
      <GuestLock
        feature="Profile"
        message="Customize your profile by creating a free account!"
        icon="🔒"
      />
    );
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // ✅ Use api.getMe() – it returns user data including email
        const response = await api.getMe();
        if (response.success) {
          setUser({
            name: response.data.name || "Explorer",
            email: response.data.email || "No email set",
          });
        } else {
          setError("Failed to load profile.");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Could not load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const avatarLetter = (user.name || "A").charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <main className="profile-main">
          <div className="profile-card" style={{ textAlign: "center", padding: "40px" }}>
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <Navbar />
        <main className="profile-main">
          <div className="profile-card" style={{ textAlign: "center", padding: "40px", color: "var(--red)" }}>
            <p>{error}</p>
            <button className="btn-edit-profile" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-main">
        <button 
          className="btn-back" 
          onClick={() => navigate("/dashboard")}
          style={{ alignSelf: "flex-start", maxWidth: "480px", width: "100%", margin: "0 auto 16px" }}
        >
          ← Back to Dashboard
        </button>

        <h1 className="profile-title">Profile</h1>

        <div className="profile-card">
          <div className="profile-card-banner" />
          <div className="profile-card-body">
            <div className="profile-avatar">
              <span className="profile-avatar-letter">{avatarLetter}</span>
            </div>

            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-member-tag">QuizForge Member</p>

            <div className="profile-fields">
              <div>
                <label className="profile-field-label">Display Name</label>
                <div className="profile-field-display">{user.name}</div>
              </div>
              <div style={{ marginTop: "16px" }}>
                <label className="profile-field-label">Email Address</label>
                <div className="profile-field-display">{user.email}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}