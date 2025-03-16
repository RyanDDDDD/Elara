"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { getCurrentUser, login, signup, logout, loginAsGuest } from "../services/authService"

// Create auth context
const AuthContext = createContext()

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        console.error("Auth check error:", err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const handleLogin = async (identifier, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await login(identifier, password)

      if (response.success) {
        setUser(response.user)
        return { success: true, user: response.user }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred during login"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Signup function
  const handleSignup = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await signup(userData)

      if (response.success) {
        setUser(response.user)
        return { success: true, user: response.user }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred during signup"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const handleLogout = async () => {
    setLoading(true)

    try {
      await logout()
      setUser(null)
      return { success: true }
    } catch (err) {
      console.error("Logout error:", err)
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Guest login function
  const handleGuestLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await loginAsGuest()
      setUser(response.user)
      return { success: true, user: response.user }
    } catch (err) {
      const errorMessage = err.message || "An error occurred during guest login"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Context value
  const value = {
    user,
    loading,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    loginAsGuest: handleGuestLogin,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

