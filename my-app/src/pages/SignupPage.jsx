import { Link } from "react-router-dom"
import "./SignupPage.css"

function SignupPage() {
  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="signup-left-content">
          <h2 className="signup-left-title">Sign Up to</h2>
          <h3 className="signup-left-subtitle">Elara is simply</h3>
          <p className="signup-left-description">
            This is an agent that helps you understand the field of clean energy.
          </p>
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-right-header">
          <div className="signup-welcome">
            Welcome to <span className="signup-elara-text">Elara</span>
          </div>
          <div className="signup-have-account">
            Have an Account?{" "}
            <Link to="/login" className="signup-login-link">
              Login
            </Link>
          </div>
        </div>

        <h1 className="signup-title">Sign up</h1>

        <div className="signup-form">
          <div className="signup-form-group">
            <label className="signup-label">Enter your username or email address</label>
            <input type="text" className="signup-input" placeholder="Username or email address" />
          </div>

          <div className="signup-form-row">
            <div className="signup-form-group">
              <label className="signup-label">User name</label>
              <input type="text" className="signup-input" placeholder="User name" />
            </div>

            <div className="signup-form-group">
              <label className="signup-label">Contact Number</label>
              <input type="tel" className="signup-input" placeholder="Contact Number" />
            </div>
          </div>

          <div className="signup-form-group">
            <label className="signup-label">Enter your Password</label>
            <input type="password" className="signup-input" placeholder="Password" />
          </div>

          <button className="signup-button">Sign up</button>
        </div>
      </div>
    </div>
  )
}

export default SignupPage

