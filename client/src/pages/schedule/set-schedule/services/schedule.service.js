import apiClient from '../../../../common/api/apiClient';

const assignmentApi = '/assignment';
const shiftApi = '/shifts';

export const getAssignments = async () => {
    try {
        const respone = await apiClient.get(assignmentApi);
        return respone.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi không xác định!');
    }
}

export const updateAssignment = async (id, data) => {
    try {
        const respone = await apiClient.put(`${assignmentApi}/${id}`, data);
        return respone.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi không xác định!');
    }
}