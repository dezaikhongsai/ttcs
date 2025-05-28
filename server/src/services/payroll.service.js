import Payroll from '../models/payroll.model.js';

export const createPayroll = async (payrollData) => {
    try {
        const { employeeId, name, term, baseSalary, totalSalary, status } = payrollData;
        
        // Kiểm tra xem đã tồn tại bảng lương cho nhân viên trong kỳ lương này chưa
        const existingPayroll = await Payroll.findOne({ employeeId, term });
        if (existingPayroll) {
            throw new Error('Đã tồn tại bảng lương cho nhân viên này trong kỳ lương đã chọn');
        }

        // Tạo bảng lương mới
        const payroll = await Payroll.create({
            employeeId,
            name,
            term,
            baseSalary,
            totalSalary,
            status: "Đã thanh toán"
        });
        
        return payroll;
    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error
            throw new Error('Đã tồn tại bảng lương đã thanh toán cho nhân viên này trong kỳ lương đã chọn');
        }
        throw error;
    }
}

export const getAllPayrollInTerm = async (term) => {
    try {
        const payroll = await Payroll.find({ term });
        return payroll;
    } catch (error) {
        throw error;
    }
}

export const deletePayroll = async (payrollId) => {
    try {
        const payroll = await Payroll.findByIdAndDelete(payrollId);
        return payroll;
    } catch (error) {
        throw error;
    }
}