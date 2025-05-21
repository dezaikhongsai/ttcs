import {getAllTimeSheets , getTimeSheetByEmployeeId , createTimeSheet , udateTimeSheet , deletaTimeSheet} from '../services/timesheet.service.js';

export const getAllTimeSheetsController = async (req, res) => {
    try {
        const timeSheet = await getAllTimeSheets();
        res.status(200).json({
            message: 'Lấy danh sách bảng chấm công thành công!',
            data: timeSheet,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getTimeSheetByEmployeeIdController = async (req, res) => {
    try {
        const {employeeId} = req.params;
        const timeSheet = await getTimeSheetByEmployeeId(employeeId);
        res.status(200).json({
            message: 'Lấy bảng chấm công theo ID nhân viên thành công!',
            data: timeSheet,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createTimeSheetController = async (req, res) => {ư
    try {
        const timeSheetData = req.body;
        const newTimeSheet = await createTimeSheet(timeSheetData);
        res.status(201).json({
            message: 'Tạo bảng chấm công thành công!',
            data: newTimeSheet,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateTimeSheetController = async (req, res) => {
    try {
        const { id } = req.params;
        const timeSheetData = req.body;
        const updatedTimeSheet = await udateTimeSheet(id, timeSheetData);
        res.status(200).json({
            message: 'Cập nhật bảng chấm công thành công!',
            data: updatedTimeSheet,
        });
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
}

export const deleteTimeSheetController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTimeSheet = await deletaTimeSheet(id);
        res.status(200).json({
            message: 'Xóa bảng chấm công thành công!',
            data: deletedTimeSheet,
        });    
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}