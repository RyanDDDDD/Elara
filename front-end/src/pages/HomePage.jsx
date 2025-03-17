"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function HomePage() {
  const navigate = useNavigate()
  const { loginAsGuest } = useAuth()

  const handleGetStarted = async () => {
    try {
      const result = await loginAsGuest()
      if (result.success) {
        navigate("/dashboard")
      } else {
        console.error("Guest login failed:", result.message)
        // 如果访客登录失败，则导航到注册页面
        navigate("/signup")
      }
    } catch (err) {
      console.error("Error during guest login:", err)
      navigate("/signup")
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo">
              <path d="M12 2L2 19.5H22L12 2Z" fill="#4CAF4F" />
            </svg>
          </div>
          <h1 className="logo-text">Elara</h1>
        </div>
        <div className="nav-buttons">
          <Link to="/login" className="login-btn">
            Login
          </Link>
          <Link to="/signup" className="signup-btn">
            Sign up
          </Link>
        </div>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">
            Find your future in <span className="highlight">energy</span>
          </h2>
          <p className="hero-subtitle">Where your career start!</p>
          <button className="get-started-btn" onClick={handleGetStarted}>
            Get started
          </button>
        </div>
        <div className="hero-image-container">
          <div className="hero-image-placeholder">
            <svg width="100%" height="100%" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
              <rect x="50" y="50" width="250" height="180" rx="10" fill="#E8F5E9" stroke="#4CAF4F" strokeWidth="2" />
              <rect x="70" y="80" width="210" height="120" rx="5" fill="#C8E6C9" />
              <rect x="90" y="100" width="80" height="10" rx="2" fill="#4CAF4F" />
              <rect x="90" y="120" width="120" height="10" rx="2" fill="#4CAF4F" />
              <rect x="90" y="140" width="100" height="10" rx="2" fill="#4CAF4F" />
              <rect x="90" y="160" width="60" height="10" rx="2" fill="#4CAF4F" />
              <circle cx="350" cy="200" r="80" fill="#F5F7FA" stroke="#4CAF4F" strokeWidth="2" />
              <rect x="320" y="170" width="60" height="60" rx="5" fill="#C8E6C9" />
              <path d="M320 280 L350 240 L380 280 Z" fill="#4CAF4F" />
              <rect x="300" y="280" width="100" height="70" rx="5" fill="#E8F5E9" stroke="#4CAF4F" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage

