"use client"
import { Link, useNavigate } from "react-router-dom"
import "./LoginPage.css"

function LoginPage() {
  const navigate = useNavigate()

  const handleGuestLogin = () => {
    navigate("/dashboard")
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-left-content">
          <h2 className="login-left-title">Sign in to</h2>
          <h3 className="login-left-subtitle">Elara is simply</h3>
          <p className="login-left-description">
            This is an agent that helps you understand the field of clean energy.
          </p>

          <div className="login-illustration">
            <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Simplified rocket illustration */}
              <ellipse cx="150" cy="150" rx="60" ry="30" fill="#ffffff" fillOpacity="0.6" />
              <ellipse cx="100" cy="100" rx="40" ry="20" fill="#ffffff" fillOpacity="0.6" />
              <ellipse cx="200" cy="180" rx="30" ry="15" fill="#ffffff" fillOpacity="0.6" />

              {/* Rocket */}
              <path d="M150 180 L170 240 L130 240 Z" fill="#EB4335" />
              <ellipse cx="150" cy="180" rx="20" ry="40" fill="#FBBC05" />
              <rect x="140" y="140" width="20" height="40" fill="#FBBC05" />

              {/* Person */}
              <circle cx="150" cy="130" r="15" fill="#8D8D8D" />
              <rect x="140" y="145" width="20" height="30" fill="#4CAF4F" />
              <rect x="135" y="155" width="10" height="20" fill="#4CAF4F" transform="rotate(-20 135 155)" />
              <rect x="155" y="155" width="10" height="20" fill="#4CAF4F" transform="rotate(20 155 155)" />
            </svg>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-right-header">
          <div className="login-welcome">
            Welcome to <span className="login-elara-text">Elara</span>
          </div>
          <div className="login-no-account">
            No Account?{" "}
            <Link to="/signup" className="login-signup-link">
              Sign up
            </Link>
          </div>
        </div>

        <h1 className="login-title">Login</h1>

        <div className="login-social-buttons">
          <button className="login-social-button login-google">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19.8055 10.2275C19.8055 9.51764 19.7516 8.83889 19.6347 8.18127H10.2002V11.9652H15.6016C15.3768 13.1693 14.6573 14.1934 13.5992 14.8508V17.2802H16.7829C18.6526 15.5652 19.8055 13.1152 19.8055 10.2275Z"
                fill="#4285F4"
              />
              <path
                d="M10.2002 20.0001C12.897 20.0001 15.1715 19.1142 16.7829 17.2801L13.5992 14.8508C12.7182 15.4508 11.5653 15.7958 10.2002 15.7958C7.5943 15.7958 5.38759 14.0716 4.58577 11.7001H1.30322V14.2001C2.90516 17.6001 6.29218 20.0001 10.2002 20.0001Z"
                fill="#34A853"
              />
              <path
                d="M4.58578 11.7002C4.38935 11.1002 4.28328 10.4619 4.28328 9.80021C4.28328 9.13855 4.38935 8.50021 4.58578 7.90021V5.40021H1.30322C0.619037 6.73855 0.200195 8.22688 0.200195 9.80021C0.200195 11.3735 0.619037 12.8619 1.30322 14.2002L4.58578 11.7002Z"
                fill="#FBBC05"
              />
              <path
                d="M10.2002 3.80479C11.6823 3.80479 13.0035 4.33646 14.0436 5.33646L16.8942 2.48562C15.1715 0.891456 12.897 0.000122071 10.2002 0.000122071C6.29218 0.000122071 2.90516 2.40012 1.30322 5.80012L4.58577 8.30012C5.38759 5.92862 7.5943 4.20479 10.2002 4.20479V3.80479Z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="login-social-icons">
            <button className="login-social-icon login-facebook">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 10C20 4.48 15.52 0 10 0C4.48 0 0 4.48 0 10C0 14.84 3.44 18.87 8 19.8V13H6V10H8V7.5C8 5.57 9.57 4 11.5 4H14V7H12C11.45 7 11 7.45 11 8V10H14V13H11V19.95C16.05 19.45 20 15.19 20 10Z"
                  fill="#1877F2"
                />
              </svg>
            </button>

            <button className="login-social-icon login-apple">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14.5 0H5.5C2.46 0 0 2.46 0 5.5V14.5C0 17.54 2.46 20 5.5 20H14.5C17.54 20 20 17.54 20 14.5V5.5C20 2.46 17.54 0 14.5 0ZM15.68 14.14C15.58 14.41 15.45 14.65 15.29 14.88C15.05 15.21 14.84 15.45 14.66 15.58C14.39 15.79 14.1 15.9 13.79 15.91C13.58 15.91 13.32 15.84 13.02 15.7C12.71 15.56 12.43 15.49 12.17 15.49C11.9 15.49 11.61 15.56 11.3 15.7C10.99 15.84 10.75 15.91 10.57 15.92C10.27 15.93 9.97 15.82 9.67 15.58C9.47 15.44 9.24 15.19 8.99 14.84C8.72 14.47 8.5 14.03 8.33 13.53C8.14 12.98 8.05 12.45 8.05 11.93C8.05 11.33 8.18 10.82 8.44 10.39C8.64 10.05 8.91 9.78 9.25 9.59C9.59 9.4 9.95 9.3 10.34 9.3C10.57 9.3 10.86 9.38 11.22 9.53C11.57 9.68 11.8 9.76 11.91 9.76C11.99 9.76 12.25 9.67 12.64 9.49C13.01 9.33 13.33 9.26 13.61 9.28C14.33 9.34 14.87 9.62 15.23 10.14C14.59 10.54 14.28 11.1 14.28 11.8C14.28 12.38 14.5 12.87 14.93 13.26C15.13 13.44 15.36 13.58 15.61 13.68C15.64 13.84 15.66 13.99 15.68 14.14ZM13.53 4.8C13.53 5.25 13.36 5.67 13.02 6.07C12.61 6.54 12.12 6.82 11.58 6.77C11.57 6.72 11.56 6.66 11.56 6.57C11.56 6.15 11.76 5.7 12.11 5.31C12.28 5.11 12.51 4.94 12.78 4.81C13.05 4.68 13.3 4.62 13.53 4.61V4.8Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="login-form">
          <div className="login-form-group">
            <label className="login-label">Enter your username or email address</label>
            <input type="text" className="login-input" placeholder="Username or email address" />
          </div>

          <div className="login-form-group">
            <label className="login-label">Enter your Password</label>
            <input type="password" className="login-input" placeholder="Password" />
            <div className="login-forgot-password">
              <a href="#" className="login-forgot-link">
                Forgot Password
              </a>
            </div>
          </div>

          <button className="login-button">Login</button>

          <div className="login-guest-section">
            <div className="login-guest-divider">
              <span>or</span>
            </div>
            <button className="login-guest-button" onClick={handleGuestLogin}>
              Continue as Guest
            </button>
          </div>
        </div>

        <div className="login-as-section">
          <h3 className="login-as-title">Login as</h3>
          <div className="login-profiles">
            <div className="login-profile" onClick={handleGuestLogin}>
              <div className="login-profile-image">
                <img src="/placeholder.svg?height=60&width=60" alt="Ryan" className="login-avatar" />
              </div>
              <div className="login-profile-info">
                <div className="login-profile-name">Ryan</div>
                <div className="login-profile-status">Active 1 days ago</div>
              </div>
            </div>

            <div className="login-profile" onClick={handleGuestLogin}>
              <div className="login-profile-image">
                <img src="/placeholder.svg?height=60&width=60" alt="Michael" className="login-avatar" />
              </div>
              <div className="login-profile-info">
                <div className="login-profile-name">Michael</div>
                <div className="login-profile-status">Active 4 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

