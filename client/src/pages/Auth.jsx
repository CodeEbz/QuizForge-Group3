import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "../components/Logo"
import { api } from "../services/api"
import "../styles/Auth.css"

export default function AuthPage() {
  const [mode, setMode] = useState("login") // login, signup, forgot
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLoginSubmit = async (email, password) => {
    setError("")
    setLoading(true)
    try {
      const res = await api.login(email, password)
      localStorage.setItem("quizforge_token", res.data.token)
      localStorage.setItem("quizforge_user", JSON.stringify(res.data.user))
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (name, email, password, confirmPassword) => {
    setError("")
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      const res = await api.register(name, email, password)
      localStorage.setItem("quizforge_token", res.data.token)
      localStorage.setItem("quizforge_user", JSON.stringify(res.data.user))
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Failed to create account.")
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = () => {
    localStorage.setItem("quizforge_token", "guest")
    localStorage.setItem("quizforge_user", JSON.stringify({ name: "Guest User", role: "guest" }))
    navigate("/dashboard")
  }

  const handleForgotPasswordSubmit = async (email) => {
    setError("")
    setLoading(true)
    try {
      const res = await api.forgotPassword(email)
      alert(res.message || "Simulated password reset instructions sent.")
      setMode("login")
    } catch (err) {
      setError(err.message || "Failed to request password reset.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow--green" />
      <div className="auth-glow auth-glow--blue" />
      <div className="auth-glow auth-glow--orange" />

      <div className="auth-inner">
        <div className="auth-logo-wrap">
          <Logo width={200} className="auth-logo-img" />
        </div>
        <p className="auth-tagline">Forge your knowledge, Conquer every quiz</p>

        <div className="auth-card">
          {mode === "forgot" ? (
            <div className="auth-tabs">
              <button className="auth-tab active" style={{ cursor: "default" }}>
                Reset Password
              </button>
            </div>
          ) : (
            <div className="auth-tabs">
              <button
                className={`auth-tab${mode === "login" ? " active" : ""}`}
                onClick={() => { setMode("login"); setError(""); }}
              >
                Log In
              </button>
              <button
                className={`auth-tab${mode === "signup" ? " active" : ""}`}
                onClick={() => { setMode("signup"); setError(""); }}
              >
                Sign Up
              </button>
            </div>
          )}

          {error && (
            <div className="auth-error-msg">
              <span style={{ fontSize: "1.1rem" }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="auth-form-wrap">
            {mode === "login" ? (
              <LoginForm 
                onSubmit={handleLoginSubmit} 
                onGuest={handleGuestLogin} 
                onForgotTrigger={() => { setMode("forgot"); setError(""); }}
                loading={loading}
              />
            ) : mode === "signup" ? (
              <SignupForm 
                onSubmit={handleSignupSubmit} 
                loading={loading}
              />
            ) : (
              <ForgotPasswordForm 
                onSubmit={handleForgotPasswordSubmit}
                onBack={() => { setMode("login"); setError(""); }}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, type, placeholder, value, onChange, required = true }) {
  const [show, setShow] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword ? (show ? "text" : "password") : type

  return (
    <div className="field-wrap">
      <label className="field-label">{label}</label>
      <div className="field-input-wrap">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`field-input${isPassword ? " has-toggle" : ""}`}
        />
        {isPassword && (
          <button type="button" className="field-eye-btn" onClick={() => setShow(v => !v)}>
            {show ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

function LoginForm({ onSubmit, onGuest, onForgotTrigger, loading }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field 
        label="Email" 
        type="email" 
        placeholder="you@example.com" 
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Field 
        label="Password" 
        type="password" 
        placeholder="••••••••" 
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <div className="forgot-password-link-wrap">
        <button type="button" className="forgot-password-link" onClick={onForgotTrigger}>
          Forgot Password?
        </button>
      </div>
      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? "Logging In..." : "Log In to QuizForge"}
      </button>
      <button type="button" className="btn-guest" onClick={onGuest} disabled={loading}>
        Continue as Guest
      </button>
    </form>
  )
}

function SignupForm({ onSubmit, loading }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(name, email, password, confirmPassword)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field 
        label="Display Name" 
        type="text" 
        placeholder="Your name" 
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Field 
        label="Email" 
        type="email" 
        placeholder="you@example.com" 
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Field 
        label="Password" 
        type="password" 
        placeholder="Min. 8 characters" 
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Field 
        label="Confirm Password" 
        type="password" 
        placeholder="Repeat your password" 
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />
      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? "Creating Account..." : "Create My Account"}
      </button>
    </form>
  )
}

function ForgotPasswordForm({ onSubmit, onBack, loading }) {
  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(email)
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "16px", lineHeight: "1.4" }}>
        Enter your email address below and we'll send you instructions to reset your password.
      </p>
      <Field 
        label="Email Address" 
        type="email" 
        placeholder="you@example.com" 
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
      <button type="button" className="btn-back-login" onClick={onBack} disabled={loading}>
        Back to Log In
      </button>
    </form>
  )
}