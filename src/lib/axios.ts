
import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Important for cookies and CSRF tokens
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const csrfToken = Cookies.get('csrfToken'); // Read CSRF token from cookies

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken; // Add CSRF token to the request headers
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 error and token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refreshToken'); // Use refresh token from cookies
      console.log('refreshToken', refreshToken);
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh-token', {
            refreshToken,
          });
          console.log('response', response);
          const { accessToken, csrfToken } = response.data;

          // Store the new access token and CSRF token
          localStorage.setItem('accessToken', accessToken);
          Cookies.set('csrfToken', csrfToken, {
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
          });

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear session and redirect to login
          localStorage.clear();
          Cookies.remove('csrfToken');
          Cookies.remove('refreshToken');
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);
