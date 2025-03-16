// Mock authentication service to simulate backend API calls

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock user database
const mockUsers = [
  {
    id: "1",
    username: "demo",
    email: "demo@example.com",
    password: "password123",
    name: "Demo User",
    role: "Student from uni",
  },
  {
    id: "2",
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "Experienced professional",
  },
]

// Get users from localStorage or use default mock users
const getUsers = () => {
  const storedUsers = localStorage.getItem("elara_users")
  return storedUsers ? JSON.parse(storedUsers) : mockUsers
}

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem("elara_users", JSON.stringify(users))
}

// Initialize mock database
if (!localStorage.getItem("elara_users")) {
  saveUsers(mockUsers)
}

/**
 * Mock login API
 * @param {string} identifier - Username or email
 * @param {string} password - User password
 * @returns {Promise} - Promise resolving to user data or error
 */
export const login = async (identifier, password) => {
  // Simulate API delay
  await delay(800)

  const users = getUsers()

  // Find user by username or email
  const user = users.find((u) => u.username === identifier || u.email === identifier)

  // Check if user exists and password matches
  if (!user) {
    return {
      success: false,
      message: "User not found. Please check your username or email.",
    }
  }

  if (user.password !== password) {
    return {
      success: false,
      message: "Incorrect password. Please try again.",
    }
  }

  // Create user data without sensitive information
  const userData = {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
  }

  // Store auth token in localStorage
  localStorage.setItem("elara_auth_token", `mock-jwt-token-${user.id}`)
  localStorage.setItem("elara_user", JSON.stringify(userData))

  return {
    success: true,
    message: "Login successful",
    user: userData,
    token: `mock-jwt-token-${user.id}`,
  }
}

/**
 * Mock signup API
 * @param {Object} userData - User registration data
 * @returns {Promise} - Promise resolving to user data or error
 */
export const signup = async (userData) => {
  // Simulate API delay
  await delay(1000)

  const users = getUsers()

  // Check if username or email already exists
  const existingUser = users.find((u) => u.username === userData.username || u.email === userData.email)

  if (existingUser) {
    return {
      success: false,
      message: "Username or email already exists",
    }
  }

  // Create new user
  const newUser = {
    id: `${users.length + 1}`,
    username: userData.username,
    email: userData.email,
    password: userData.password,
    name: userData.name || userData.username,
    role: userData.role || "Student from uni",
  }

  // Add to mock database
  const updatedUsers = [...users, newUser]
  saveUsers(updatedUsers)

  // Create user data without sensitive information
  const newUserData = {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  }

  // Store auth token in localStorage
  localStorage.setItem("elara_auth_token", `mock-jwt-token-${newUser.id}`)
  localStorage.setItem("elara_user", JSON.stringify(newUserData))

  return {
    success: true,
    message: "Registration successful",
    user: newUserData,
    token: `mock-jwt-token-${newUser.id}`,
  }
}

/**
 * Mock logout API
 * @returns {Promise} - Promise resolving to success message
 */
export const logout = async () => {
  // Simulate API delay
  await delay(300)

  // Clear auth data from localStorage
  localStorage.removeItem("elara_auth_token")
  localStorage.removeItem("elara_user")

  return {
    success: true,
    message: "Logout successful",
  }
}

/**
 * Check if user is authenticated
 * @returns {Object|null} - User data if authenticated, null otherwise
 */
export const getCurrentUser = () => {
  const token = localStorage.getItem("elara_auth_token")
  const user = localStorage.getItem("elara_user")

  if (token && user) {
    return JSON.parse(user)
  }

  return null
}

/**
 * Mock guest login
 * @returns {Promise} - Promise resolving to guest user data
 */
export const loginAsGuest = async () => {
  // Simulate API delay
  await delay(500)

  const guestUser = {
    id: "guest",
    username: "guest",
    email: "guest@example.com",
    name: "Guest User",
    role: "Student from uni",
  }

  // Store guest auth in localStorage
  localStorage.setItem("elara_auth_token", "mock-jwt-token-guest")
  localStorage.setItem("elara_user", JSON.stringify(guestUser))

  return {
    success: true,
    message: "Guest login successful",
    user: guestUser,
    token: "mock-jwt-token-guest",
  }
}

