// 真实后端API认证服务

// 定义API基础URL
const API_BASE_URL = 'https://your-api-domain.com/api'; // 

/**
 * 处理API响应
 * @param {Response} response - fetch API响应对象
 * @returns {Promise} - 解析后的响应数据
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // 如果响应状态码不是2xx，抛出错误
    const error = (data && data.message) || response.statusText;
    return Promise.reject({ message: error, status: response.status });
  }
  
  return data;
};

/**
 * 设置认证令牌
 * @param {string} token - JWT令牌
 * @param {Object} userData - 用户数据
 */
const setAuthData = (token, userData) => {
  localStorage.setItem('elara_auth_token', token);
  localStorage.setItem('elara_user', JSON.stringify(userData));
};

/**
 * 清除认证令牌
 */
const clearAuthData = () => {
  localStorage.removeItem('elara_auth_token');
  localStorage.removeItem('elara_user');
};

/**
 * 获取认证头信息
 * @returns {Object} - 包含Authorization头的对象
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('elara_auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

/**
 * 登录API
 * @param {string} identifier - 用户名或邮箱
 * @param {string} password - 用户密码
 * @returns {Promise} - 解析为用户数据或错误的Promise
 */
export const login = async (identifier, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    
    const data = await handleResponse(response);
    
    if (data.token && data.user) {
      setAuthData(data.token, data.user);
      return {
        success: true,
        message: data.message || 'Login successful',
        user: data.user,
        token: data.token
      };
    } else {
      return {
        success: false,
        message: data.message || 'Login failed. Invalid response from server.'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during login'
    };
  }
};

/**
 * 注册API
 * @param {Object} userData - 用户注册数据
 * @returns {Promise} - 解析为用户数据或错误的Promise
 */
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const data = await handleResponse(response);
    
    if (data.token && data.user) {
      setAuthData(data.token, data.user);
      return {
        success: true,
        message: data.message || 'Registration successful',
        user: data.user,
        token: data.token
      };
    } else {
      return {
        success: false,
        message: data.message || 'Registration failed. Invalid response from server.'
      };
    }
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during registration'
    };
  }
};

/**
 * 登出API
 * @returns {Promise} - 解析为成功消息的Promise
 */
export const logout = async () => {
  try {
    // 如果后端需要登出请求，取消注释以下代码
    // await fetch(`${API_BASE_URL}/auth/logout`, {
    //   method: 'POST',
    //   headers: getAuthHeaders()
    // });
    
    // 清除本地存储的认证数据
    clearAuthData();
    
    return {
      success: true,
      message: 'Logout successful'
    };
  } catch (error) {
    console.error('Logout error:', error);
    // 即使API调用失败，也清除本地认证数据
    clearAuthData();
    return {
      success: true,
      message: 'Logged out'
    };
  }
};

/**
 * 检查用户是否已认证
 * @returns {Object|null} - 已认证则返回用户数据，否则返回null
 */
export const getCurrentUser = () => {
  const token = localStorage.getItem('elara_auth_token');
  const user = localStorage.getItem('elara_user');
  
  if (token && user) {
    return JSON.parse(user);
  }
  
  return null;
};

/**
 * 验证令牌是否有效
 * @returns {Promise} - 解析为验证结果的Promise
 */
export const verifyToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const data = await handleResponse(response);
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Token verification error:', error);
    // 如果令牌无效，清除认证数据
    if (error.status === 401) {
      clearAuthData();
    }
    return { success: false };
  }
};

/**
 * 访客登录
 * @returns {Promise} - 解析为访客用户数据的Promise
 */
export const loginAsGuest = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await handleResponse(response);
    
    if (data.token && data.user) {
      setAuthData(data.token, data.user);
      return {
        success: true,
        message: data.message || 'Guest login successful',
        user: data.user,
        token: data.token
      };
    } else {
      return {
        success: false,
        message: data.message || 'Guest login failed. Invalid response from server.'
      };
    }
  } catch (error) {
    console.error('Guest login error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during guest login'
    };
  }
};

/**
 * 更新用户资料
 * @param {Object} userData - 要更新的用户数据
 * @returns {Promise} - 解析为更新后的用户数据的Promise
 */
export const updateProfile = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    
    const data = await handleResponse(response);
    
    // 更新本地存储的用户数据
    if (data.user) {
      const currentUser = getCurrentUser();
      const updatedUser = { ...currentUser, ...data.user };
      localStorage.setItem('elara_user', JSON.stringify(updatedUser));
    }
    
    return {
      success: true,
      message: data.message || 'Profile updated successfully',
      user: data.user
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while updating profile'
    };
  }
};