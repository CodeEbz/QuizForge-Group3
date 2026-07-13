import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import "../styles/Profile.css"

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: "Explorer" })
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("quizforge_user")
    if (storedUser) {
      const u = JSON.parse(storedUser)
      setUser(u)
      setNameInput(u.name || "")
    }
  }, [])

  const handleSave = () => {
    if (editing) {
      const updatedUser = { ...user, name: nameInput }
      setUser(updatedUser)
      localStorage.setItem("quizforge_user", JSON.stringify(updatedUser))
    }
    setEditing(!editing)
  }

  const avatarLetter = (user.name || "A").charAt(0).toUpperCase()

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
            <p className="profile-member-tag">
              {user.role === "guest" ? "Guest Member (Offline Mode)" : "QuizForge Member"}
            </p>

            <div className="profile-fields">
              <div>
                <label className="profile-field-label">Display Name</label>
                {editing ? (
                  <input
                    className="profile-field-input"
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                  />
                ) : (
                  <div className="profile-field-display">{user.name}</div>
                )}
              </div>
            </div>

            <button
              className="btn-edit-profile"
              style={{ background: editing ? "var(--green)" : "var(--primary)" }}
              onClick={handleSave}
            >
              {editing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}