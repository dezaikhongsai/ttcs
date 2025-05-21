import apiClient from '../../../common/api/apiClient';
const shiftApi = '/shifts';

export const getWorkSchedule = async () => {
    try {
      const response = await apiClient.get('/workSchedule'); // Đảm bảo endpoint đúng
      return response.data.data; // Trả về mảng từ API
    } catch (error) {
      console.error('Lỗi khi gọi API getWorkSchedule:', error);
      throw error;
    }
};

export const getShifts = async () => {
    try {
        const response = await apiClient.get(shiftApi);
        return response.data.data; // Return the data array from the response
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi không xác định!');
    }
};
