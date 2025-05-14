import axios from 'axios';

// API URL for backend authentication endpoints
const API_URL = 'http://localhost:8000/api/auth';

// Configure axios for development
axios.defaults.baseURL = 'http://localhost:8000/api/auth';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Register user
export const register = async (userData) => {
  try {
    console.log('Registering user:', userData);
    const response = await axios.post(`${API_URL}/register/`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error.response?.data || { error: 'Registration failed', details: error.message };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    // Ensure credentials are in the correct format
    const loginData = {
      username: credentials.username || credentials.email,
      password: credentials.password
    };

    console.log('Attempting login with:', loginData);
    const response = await axios.post(`${API_URL}/login/`, loginData, { 
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    // Store user data in localStorage
    if (response.data) {
      console.log('Login successful:', response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error details:', {
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      message: error.message,
      config: error.config
    });
    
    // Provide more specific error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw {
        error: error.response.data.error || 'Login failed',
        status: error.response.status,
        details: error.response.data
      };
    } else if (error.request) {
      // The request was made but no response was received
      throw {
        error: 'No response from server',
        details: error.request
      };
    } else {
      // Something happened in setting up the request
      throw {
        error: 'Error setting up login request',
        details: error.message
      };
    }
  }
};

// Logout user
export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout/`, {}, { withCredentials: true });
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getCurrentUser();
};

// Get user details
export const getUserDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to get user details' };
  }
}; 

// Check user activation status
export const checkUserActivation = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/activation/`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to check user activation' };
  }
};