import TimeSheet from '../models/timeSheet.model.js';

export const getAllTimeSheets = async () => {
    const timeSheet = await TimeSheet.find();
    if (!timeSheet) {
        const err = new Error('Không tìm thấy bảng chấm công');
        err.status = 404;
        throw err;
    }
    return timeSheet;   
}

export const createTimeSheet = async (timeSheetData) => {
    const newTimeSheet = new TimeSheet(timeSheetData);
    return await newTimeSheet.save();
}

export const udateTimeSheet = async (id , timeSheetData) => {
    try {
        const timeSheet = await TimeSheet.findByIdAndUpdate(id, timeSheetData);
        if(!timeSheet) {
            const err = new Error('Không tìm thấy bảng chấm công');
            err.status = 404;
            throw err;
        }
        return timeSheet;
    } catch (error) {
        const err = new Error('Không tìm thấy bảng chấm công');
        err.status = 404;
        throw err;  
        
    }
};

export const deletaTimeSheet = async (id) => {
    const timeSheet = await TimeSheet.findByIdAndDelete(id);
    if (!timeSheet) {
        const err = new Error('Không tìm thấy bảng chấm công');
        err.status = 404;
        throw err;
    }
    return timeSheet;
}

export const getTimeSheetByEmployeeId = async (employeeId) => {
    try {
        const timeSheet = await TimeSheet.find({ employeeId });
        if (!timeSheet) {
            const err = new Error('Không tìm thấy bảng chấm công');
            err.status = 404;
            throw err;
        }
        return timeSheet;
    } catch (error) {
        const err = new Error('Không tìm thấy bảng chấm công');
        err.status = 404;
        throw err;  
        
    }
}