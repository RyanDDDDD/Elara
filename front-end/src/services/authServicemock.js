// 真实后端API认证服务

// 修改 API_BASE_URL 常量，确保它指向正确的后端地址
// 定义API基础URL - 根据你的Flask应用运行地址调整
const API_BASE_URL = "http://127.0.0.1:5000" // 修改为你的Flask后端地址

/**
 * 处理API响应
 * @param {Response} response - fetch API响应对象
 * @returns {Promise} - 解析后的响应数据
 */
const handleResponse = async (response) => {
  // 尝试解析JSON响应
  let data
  try {
    data = await response.json()
  } catch (e) {
    data = { message: response.statusText }
  }

  if (!response.ok) {
    // 如果响应状态码不是2xx，抛出错误
    const error = (data && data.message) || response.statusText
    return Promise.reject({ message: error, status: response.status })
  }

  return data
}

/**
 * 设置认证信息到本地存储
 * @param {Object} userData - 用户数据
 */
const setAuthData = (userData) => {
  localStorage.setItem("elara_user", JSON.stringify(userData))
  // 存储用户名，用于后续API调用
  localStorage.setItem("elara_username", userData.username)
}

/**
 * 清除认证信息
 */
const clearAuthData = () => {
  localStorage.removeItem("elara_user")
  localStorage.removeItem("elara_username")
}

/**
 * 注册API
 * @param {Object} userData - 用户注册数据
 * @returns {Promise} - 解析为用户数据或错误的Promise
 */
export const signup = async (userData) => {
  try {
    console.log("Attempting to connect to:", `${API_BASE_URL}/register`)
    console.log(
      "With data:",
      JSON.stringify({
        username: userData.username,
        password: userData.password,
        email: userData.email,
      }),
    )

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 添加CORS相关头部
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        username: userData.username,
        password: userData.password,
        email: userData.email,
      }),
      // 添加CORS模式
      mode: "cors",
      credentials: "same-origin",
    })

    // 尝试解析响应
    let data
    try {
      data = await response.json()
    } catch (e) {
      data = { message: response.statusText }
    }

    // 检查响应状态
    if (response.status === 201) {
      // 注册成功，创建用户对象
      const user = {
        username: userData.username,
        email: userData.email,
        name: userData.name || userData.username,
        role: userData.role || "Student from uni",
      }

      // 存储用户信息
      setAuthData(user)

      return {
        success: true,
        message: data.message || "Registration successful",
        user: user,
      }
    } else {
      // 注册失败
      return {
        success: false,
        message: data.message || "Registration failed",
      }
    }
  } catch (error) {
    console.error("Detailed signup error:", error)
    return {
      success: false,
      message: `Connection error: ${error.message}. Please check if the backend server is running at ${API_BASE_URL}.`,
    }
  }
}

/**
 * 登录API
 * @param {string} identifier - 用户名
 * @param {string} password - 用户密码
 * @returns {Promise} - 解析为用户数据或错误的Promise
 */
export const login = async (identifier, password) => {
  try {
    console.log("Attempting to connect to:", `${API_BASE_URL}/login`)
    console.log(
      "With data:",
      JSON.stringify({
        username: identifier,
        password: password,
      }),
    )

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 添加CORS相关头部
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        username: identifier,
        password: password,
      }),
      // 添加CORS模式
      mode: "cors",
      credentials: "same-origin",
    })

    // 尝试解析响应
    let data
    try {
      data = await response.json()
    } catch (e) {
      data = { message: response.statusText }
    }

    // 检查响应状态
    if (response.status === 200) {
      // 登录成功，获取用户信息
      const userResponse = await fetch(`${API_BASE_URL}/user/${identifier}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 添加CORS相关头部
          "Access-Control-Allow-Origin": "*",
        },
        // 添加CORS模式
        mode: "cors",
        credentials: "same-origin",
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()

        // 创建用户对象
        const user = {
          username: userData.username,
          email: userData.email,
          name: userData.username, // 使用用户名作为名称
          role: userData.user_info?.identity || "Student from uni", // 使用用户身份或默认值
        }

        // 存储用户信息
        setAuthData(user)

        return {
          success: true,
          message: data.message || "Login successful",
          user: user,
        }
      } else {
        // 获取用户信息失败
        return {
          success: false,
          message: "Failed to retrieve user information",
        }
      }
    } else {
      // 登录失败
      return {
        success: false,
        message: data.message || "Login failed",
      }
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: `Connection error: ${error.message}. Please check if the backend server is running at ${API_BASE_URL}.`,
    }
  }
}

/**
 * 登出API - 本地处理，不需要后端API
 * @returns {Promise} - 解析为成功消息的Promise
 */
export const logout = async () => {
  try {
    // 清除本地存储的认证数据
    clearAuthData()

    return {
      success: true,
      message: "Logout successful",
    }
  } catch (error) {
    console.error("Logout error:", error)
    // 即使出错，也清除本地认证数据
    clearAuthData()
    return {
      success: true,
      message: "Logged out",
    }
  }
}

/**
 * 检查用户是否已认证
 * @returns {Object|null} - 已认证则返回用户数据，否则返回null
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem("elara_user")

  if (user) {
    return JSON.parse(user)
  }

  return null
}

/**
 * 获取用户信息
 * @param {string} username - 用户名
 * @returns {Promise} - 解析为用户数据的Promise
 */
export const getUserInfo = async (username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 添加CORS相关头部
        "Access-Control-Allow-Origin": "*",
      },
      // 添加CORS模式
      mode: "cors",
      credentials: "same-origin",
    })

    if (response.ok) {
      const userData = await response.json()
      return {
        success: true,
        user: userData,
      }
    } else {
      // 获取用户信息失败
      const data = await response.json()
      return {
        success: false,
        message: data.message || "Failed to retrieve user information",
      }
    }
  } catch (error) {
    console.error("Get user info error:", error)
    return {
      success: false,
      message: error.message || "An error occurred while retrieving user information",
    }
  }
}

/**
 * 更新用户信息
 * @param {string} username - 用户名
 * @param {Object} userData - 要更新的用户数据
 * @returns {Promise} - 解析为更新后的用户数据的Promise
 */
export const updateUserInfo = async (username, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 添加CORS相关头部
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        password: userData.password,
        email: userData.email,
      }),
      // 添加CORS模式
      mode: "cors",
      credentials: "same-origin",
    })

    if (response.ok) {
      const data = await response.json()

      // 更新本地存储的用户数据
      const currentUser = getCurrentUser()
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          email: userData.email,
        }
        localStorage.setItem("elara_user", JSON.stringify(updatedUser))
      }

      return {
        success: true,
        message: data.message || "User information updated successfully",
      }
    } else {
      // 更新用户信息失败
      const data = await response.json()
      return {
        success: false,
        message: data.message || "Failed to update user information",
      }
    }
  } catch (error) {
    console.error("Update user info error:", error)
    return {
      success: false,
      message: error.message || "An error occurred while updating user information",
    }
  }
}

/**
 * 访客登录 - 本地处理，不需要后端API
 * @returns {Promise} - 解析为访客用户数据的Promise
 */
export const loginAsGuest = async () => {
  // 创建访客用户对象
  const guestUser = {
    id: "guest",
    username: "guest",
    email: "guest@example.com",
    name: "Guest User",
    role: "Student from uni",
  }

  // 存储访客用户信息
  localStorage.setItem("elara_user", JSON.stringify(guestUser))
  localStorage.setItem("elara_username", "guest")

  return {
    success: true,
    message: "Guest login successful",
    user: guestUser,
  }
}

/**
 * 获取用户历史对话列表
 * @param {string} username - 用户名
 * @returns {Promise} - 解析为历史对话列表的Promise
 */
export const getUserHistory = async (username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${username}/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 添加CORS相关头部
        "Access-Control-Allow-Origin": "*",
      },
      // 添加CORS模式
      mode: "cors",
      credentials: "same-origin",
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        history: data.history || [],
      }
    } else {
      // 获取历史对话列表失败
      const data = await response.json()
      return {
        success: false,
        message: data.message || "Failed to retrieve conversation history",
      }
    }
  } catch (error) {
    console.error("Get user history error:", error)
    return {
      success: false,
      message: error.message || "An error occurred while retrieving conversation history",
    }
  }
}

/**
 * 获取特定历史对话详情
 * @param {string} historyId - 历史对话ID
 * @returns {Promise} - 解析为历史对话详情的Promise
 */
export const getHistoryDetail = async (historyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/history/${historyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 添加CORS相关头部
        "Access-Control-Allow-Origin": "*",
      },
      // 添加CORS模式
      mode: "cors",
      credentials: "same-origin",
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        messages: data,
      }
    } else {
      // 获取历史对话详情失败
      const data = await response.json()
      return {
        success: false,
        message: data.message || "Failed to retrieve conversation details",
      }
    }
  } catch (error) {
    console.error("Get history detail error:", error)
    return {
      success: false,
      message: error.message || "An error occurred while retrieving conversation details",
    }
  }
}

/**
 * 保存对话消息
 * @param {string} username - 用户名
 * @param {string} historyId - 历史对话ID，如果是新对话则传入"new"
 * @param {string} title - 对话标题
 * @param {Object} message - 消息内容
 * @returns {Promise} - 解析为保存结果的Promise
 */
export const saveConversation = async (username, historyId, title, message) => {
  try {
    const encodedTitle = encodeURIComponent(title)
    const response = await fetch(`${API_BASE_URL}/user/${username}/history/${historyId}/${encodedTitle}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 添加CORS相关头部
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: message,
      }),
      // 添加CORS模式
      mode: "cors",
      credentials: "same-origin",
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        historyId: data.history_id,
        isNew: data.is_new,
      }
    } else {
      // 保存对话失败
      const data = await response.json()
      return {
        success: false,
        message: data.message || "Failed to save conversation",
      }
    }
  } catch (error) {
    console.error("Save conversation error:", error)
    return {
      success: false,
      message: error.message || "An error occurred while saving conversation",
    }
  }
}

/**
 * 删除历史对话
 * @param {string} historyId - 历史对话ID
 * @returns {Promise} - 解析为删除结果的Promise
 */
export const deleteHistory = async (historyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/history/${historyId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // 添加CORS相关头部
        "Access-Control-Allow-Origin": "*",
      },
      // 添加CORS模式
      mode: "cors",
      credentials: "same-origin",
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        message: data.message || "Conversation deleted successfully",
      }
    } else {
      // 删除历史对话失败
      const data = await response.json()
      return {
        success: false,
        message: data.message || "Failed to delete conversation",
      }
    }
  } catch (error) {
    console.error("Delete history error:", error)
    return {
      success: false,
      message: error.message || "An error occurred while deleting conversation",
    }
  }
}

