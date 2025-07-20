import axios from 'axios';

// Get credentials setting from config
const getCredentialsConfig = () => {
  try {
    const config = require("../assets/FetchServices/withCredentials.json");
    return config.withCredentials;
  } catch (error) {
    console.log('Could not load credentials config, defaulting to false');
    return false;
  }
};

const shouldUseCredentials = getCredentialsConfig();

// Set up axios defaults for session handling
if (shouldUseCredentials) {
  axios.defaults.withCredentials = true;
}

// Request interceptor to ensure credentials are sent
axios.interceptors.request.use(
  (config) => {
    // Only set withCredentials if enabled in config
    if (shouldUseCredentials) {
      config.withCredentials = true;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session expiry
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 (Unauthorized) responses only if using credentials
    if (shouldUseCredentials && error.response && error.response.status === 401) {
      console.log('Session expired, clearing stored session');
      
      // Clear stored session
      try {
        const SessionManager = require("./sessionManager").default;
        SessionManager.clearSession();
      } catch (sessionError) {
        console.error('Error clearing session:', sessionError);
      }
      
      // Redirect to login page
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios;
