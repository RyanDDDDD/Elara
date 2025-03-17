"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getUserInfo, updateUserInfo } from "../services/authService"
import "./ProfilePage.css"

function ProfilePage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  // 加载用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isAuthenticated || !user) {
        navigate("/login")
        return
      }

      setIsLoading(true)
      try {
        const username = localStorage.getItem("elara_username")
        if (!username) {
          throw new Error("Username not found")
        }

        const result = await getUserInfo(username)
        if (result.success) {
          setFormData({
            username: result.user.username,
            email: result.user.email,
            password: "",
            confirmPassword: "",
          })
        } else {
          // 处理系统错误，不显示给用户
          console.error("Error fetching user info:", result.message)
          setError("System error. Please contact administrator.")
        }
      } catch (err) {
        console.error("Profile error:", err)
        setError("System error. Please contact administrator.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserInfo()
  }, [isAuthenticated, user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 验证密码
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      const username = localStorage.getItem("elara_username")
      if (!username) {
        throw new Error("Username not found")
      }

      const updateData = {
        email: formData.email,
        password: formData.password || undefined, // 如果没有输入密码，则不更新密码
      }

      const result = await updateUserInfo(username, updateData)
      if (result.success) {
        setSuccessMessage("Profile updated successfully")
      } else {
        // 处理系统错误，不显示给用户
        console.error("Error updating user info:", result.message)
        setError("System error. Please contact administrator.")
      }
    } catch (err) {
      console.error("Profile update error:", err)
      setError("System error. Please contact administrator.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate("/dashboard")
  }

  if (isLoading && !formData.username) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="profile-back-button" onClick={handleBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="profile-title">User Profile</h1>
      </div>

      {error && <div className="profile-error-message">{error}</div>}
      {successMessage && <div className="profile-success-message">{successMessage}</div>}

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-form-group">
          <label className="profile-label">Username</label>
          <input
            type="text"
            name="username"
            className="profile-input"
            value={formData.username}
            disabled={true} // 用户名不可修改
          />
        </div>

        <div className="profile-form-group">
          <label className="profile-label">Email</label>
          <input
            type="email"
            name="email"
            className="profile-input"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="profile-form-group">
          <label className="profile-label">New Password (leave blank to keep current)</label>
          <input
            type="password"
            name="password"
            className="profile-input"
            placeholder="New password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="profile-form-group">
          <label className="profile-label">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="profile-input"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="profile-buttons">
          <button type="button" className="profile-cancel-button" onClick={handleBack} disabled={isLoading}>
            Cancel
          </button>
          <button type="submit" className="profile-save-button" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfilePage

