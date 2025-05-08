import apiClient from '../../../../common/api/apiClient'; 
const API_URL = '/assignment'; 

export const getAssignmentsById = async (employeeId) => {
    try {
        const response = await apiClient.get(`${API_URL}/${employeeId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi không xác định!');
    }
}

export const getWorkSchedule = async () => {
  try {
    const response = await apiClient.get('/workSchedule'); // Đảm bảo endpoint đúng
    return response.data.data; // Trả về mảng từ API
  } catch (error) {
    console.error('Lỗi khi gọi API getWorkSchedule:', error);
    throw error;
  }
};

export const addAssignment = async (assignmentData) => {
  try {
    const respone = await apiClient.post(API_URL, assignmentData);
    return respone.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể thêm đăng ký ca làm');
  }
}

export const getAssignmentInRole = async (role, id) => {
  try {
    console.log('🔍 Gọi API getAssignmentInRole với:', role, id);
    const response = role === 'Admin'
      ? await apiClient.get(API_URL)
      : await apiClient.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Lỗi khi gọi getAssignmentInRole:', error);
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách phân công');
  }
};
export const deleteAssignment = async (id) => {
  try {
    const response = await apiClient.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi xóa phân công');
  }
}