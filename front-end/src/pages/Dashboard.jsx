"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Dashboard.css"

function Dashboard() {
  const [message, setMessage] = useState("")
  const [showRolesDropdown, setShowRolesDropdown] = useState(false)
  const [selectedRole, setSelectedRole] = useState("Roles select")
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Set the selected role from user data if available
  useEffect(() => {
    if (user && user.role) {
      setSelectedRole(user.role)
    }
  }, [user])
  
  const handleSendMessage = (e) => {
    e.preventDefault()
    // Here you would handle sending the message
    console.log("Message sent:", message)
    setMessage("")
  }

  const selectRole = (role) => {
    setSelectedRole(role)
    setShowRolesDropdown(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  return (
    <div className="dashboard">
      {/* Left Sidebar */}
      <div className="dashboard-sidebar dashboard-sidebar-left">
        <div className="sidebar-icon">
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo">
              <path d="M12 2L2 19.5H22L12 2Z" fill="#4CAF4F" />
            </svg>
            <h1 className="logo-text">Elara</h1>
          </div>

          <div className="dashboard-roles-dropdown">
            <button className="roles-dropdown-button" onClick={() => setShowRolesDropdown(!showRolesDropdown)}>
              {selectedRole}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {showRolesDropdown && (
              <div className="roles-dropdown-menu">
                <div className="roles-dropdown-item" onClick={() => selectRole("Student from uni")}>
                  Student from uni
                </div>
                <div className="roles-dropdown-item" onClick={() => selectRole("K12 student")}>
                  K12 student
                </div>
                <div className="roles-dropdown-item" onClick={() => selectRole("Experienced professional")}>
                  Experienced professional
                </div>
              </div>
            )}
          </div>

          <div className="dashboard-profile">
            <button className="profile-button" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
              <div className="profile-avatar">
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </button>

            {showProfileDropdown && (
              <div className="profile-dropdown-menu">
                <div className="profile-dropdown-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile
                </div>
                <div className="profile-dropdown-item" onClick={handleLogout}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="dashboard-content">
          <h1 className="dashboard-title">Ask what you want!</h1>

          {/* Chat Input */}
          <div className="dashboard-chat-input">
            <div className="chat-input-avatar">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo">
                <path d="M12 2L2 19.5H22L12 2Z" fill="#4CAF4F" />
              </svg>
            </div>
            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message to Elara..."
                className="chat-input"
              />
              <button type="button" className="chat-mic-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </button>
              <button type="submit" className="chat-send-button">
                Send
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="dashboard-sidebar dashboard-sidebar-right">
        <div className="sidebar-icon">
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

