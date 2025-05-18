import axios from 'axios';
import Cookies from 'js-cookie';

const setupAxiosInterceptors = () => {
  // Thêm interceptor cho request
  axios.interceptors.request.use(
    (config) => {
      const token = Cookies.get('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor cho response
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Token hết hạn hoặc không hợp lệ
        if (error.response.status === 401) {
          // Xóa token từ cookie
          Cookies.remove('token');
          Cookies.remove('user');
          
          // Chuyển hướng về trang login
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors; 