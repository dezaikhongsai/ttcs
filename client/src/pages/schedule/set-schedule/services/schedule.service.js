import axios from 'axios';
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
        const respone = await apiClient.put(`${assignmentApi}/status/${id}`, data);
        return respone.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi không xác định!');
    }
}

export const createShift = async(data) => {
    try {
        const respone = await apiClient.post(shiftApi, data);
        return respone.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi không xác định!');
    }
}
export const deleteAssignment = async(id) => {
    try {
        const respone = await apiClient.delete(`${assignmentApi}/${id}`);
        return respone.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi không xác định!');
    }
}
export const getShifts = async () => {
    try {
        const response = await apiClient.get(shiftApi);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi không xác định!');
    }
}