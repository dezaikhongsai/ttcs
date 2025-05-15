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
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const { data } = await axios.post('/api/auth/token', {}, { withCredentials: true });
        Cookies.set('token', data.token); // Lưu token mới
        error.config.headers.Authorization = `Bearer ${data.token}`;
        return apiClient(error.config);
      } catch (err) {
        console.error('Failed to refresh token:', err);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;