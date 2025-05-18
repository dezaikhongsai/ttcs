import axios from 'axios';
import Cookies from 'js-cookie';
// Tạo instance của axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api', 
  headers: {
    'Content-Type': 'application/json',
    },
    withCredentials: true, 
});
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    console.log('Token:', token); // Log token để kiểm tra
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh token
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/token`, 
          {}, 
          { withCredentials: true }
        );
        
        // Update request header with new token
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        console.error('Token refresh failed:', refreshError);
        Cookies.remove('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden - Permission denied
    if (error.response?.status === 403) {
      console.error('Permission denied');
      window.location.href = '/dashboard';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;