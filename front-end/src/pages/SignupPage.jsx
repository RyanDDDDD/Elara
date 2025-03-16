"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./SignupPage.css"

function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    contactNumber: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const navigate = useNavigate()
  const { signup, isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await signup(formData)

      if (result.success) {
        setSuccessMessage("Registration successful! Redirecting...")
        setTimeout(() => {
          navigate("/dashboard")
        }, 1000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again.")
      console.error("Signup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

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

        {error && <div className="signup-error-message">{error}</div>}
        {successMessage && <div className="signup-success-message">{successMessage}</div>}

        <form className="signup-form" onSubmit={handleSubmit}>

          <div className="signup-form-row">
            <div className="signup-form-group">
              <label className="signup-label">User name</label>
              <input
                type="text"
                name="username"
                className="signup-input"
                placeholder="User name"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="signup-form-group">
            <label className="signup-label">Enter your Password</label>
            <input
              type="password"
              name="password"
              className="signup-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="signup-form-group">
            <label className="signup-label">Enter your username or email address</label>
            <input
              type="text"
              name="email"
              className="signup-input"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignupPage

