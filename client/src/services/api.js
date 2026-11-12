import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // Send httpOnly cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept response to normalize error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data?.error;
    const message =
      errorData?.message ||
      error.message ||
      'An unexpected network error occurred. Please check your connection.';
    const code = errorData?.code || 'UNKNOWN_ERROR';
    const details = errorData?.details || [];

    const enhancedError = new Error(message);
    enhancedError.code = code;
    enhancedError.details = details;
    enhancedError.status = error.response?.status;
    return Promise.reject(enhancedError);
  }
);

export default api;
