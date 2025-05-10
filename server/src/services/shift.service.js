import Shift from '../models/shift.model.js';
import mongoose from 'mongoose';

export const getShifts = async () => {
  const shifts = await Shift.find()
    .populate({
      path: 'shifts.workSchedule',
      select: 'key workSchedule timeStart timeEnd'
    })
    .populate({
      path: 'shifts.employees',
      select: 'name position'
    });
  return shifts;
};

export const createShift = async (shiftData) => {
  const { day, workScheduleId, employeeIds } = shiftData;
  
  // Validate workScheduleId
  if (!mongoose.Types.ObjectId.isValid(workScheduleId)) {
    throw new Error('ID của ca làm việc không hợp lệ');
  }

  // Validate employeeIds
  if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
    throw new Error('Danh sách nhân viên không hợp lệ');
  }

  // Validate each employee ID
  const validEmployeeIds = employeeIds.filter(id => mongoose.Types.ObjectId.isValid(id));
  if (validEmployeeIds.length !== employeeIds.length) {
    throw new Error('Một hoặc nhiều ID nhân viên không hợp lệ');
  }

  // Kiểm tra xem đã có ca làm cho ngày này chưa
  let shift = await Shift.findOne({ day });
  
  if (!shift) {
    // Nếu chưa có, tạo mới
    shift = new Shift({
      day,
      shifts: [{
        workSchedule: workScheduleId,
        employees: validEmployeeIds
      }]
    });
  } else {
    // Kiểm tra xem workSchedule đã tồn tại trong ngày chưa
    const existingWorkSchedule = shift.shifts.find(
      s => s.workSchedule.toString() === workScheduleId
    );

    if (existingWorkSchedule) {
      // Kiểm tra nhân viên trùng lặp trong ca làm
      const duplicateEmployees = validEmployeeIds.filter(employeeId => 
        existingWorkSchedule.employees.some(existingId => 
          existingId.toString() === employeeId.toString()
        )
      );

      if (duplicateEmployees.length > 0) {
        throw new Error('Một hoặc nhiều nhân viên đã được phân công vào ca làm này');
      }

      // Nếu ca làm đã tồn tại và không có nhân viên trùng, thêm nhân viên mới vào
      existingWorkSchedule.employees = [...existingWorkSchedule.employees, ...validEmployeeIds];
    } else {
      // Nếu ca làm chưa tồn tại, thêm ca làm mới
      shift.shifts.push({
        workSchedule: workScheduleId,
        employees: validEmployeeIds
      });
    }
  }

  await shift.save();
  
  return await Shift.findById(shift._id)
    .populate({
      path: 'shifts.workSchedule',
      select: 'key workSchedule timeStart timeEnd'
    })
    .populate({
      path: 'shifts.employees',
      select: 'name position'
    });
};

export const getShiftsByMonthYear = async (month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  const shifts = await Shift.find({
    day: { $gte: startDate, $lte: endDate }
  })
  .populate({
    path: 'shifts.workSchedule',
    select: 'key workSchedule timeStart timeEnd'
  })
  .populate({
    path: 'shifts.employees',
    select: 'name position'
  });

  return shifts;
};

export const addEmployeesToShift = async (day, workScheduleId, employeeIds) => {
  // Validate workScheduleId
  if (!mongoose.Types.ObjectId.isValid(workScheduleId)) {
    throw new Error('ID của ca làm việc không hợp lệ');
  }

  // Validate employeeIds
  if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
    throw new Error('Danh sách nhân viên không hợp lệ');
  }

  // Validate each employee ID
  const validEmployeeIds = employeeIds.filter(id => mongoose.Types.ObjectId.isValid(id));
  if (validEmployeeIds.length !== employeeIds.length) {
    throw new Error('Một hoặc nhiều ID nhân viên không hợp lệ');
  }

  // Tìm ca làm theo ngày
  const shift = await Shift.findOne({ day });
  if (!shift) {
    throw new Error('Không tìm thấy ca làm cho ngày này');
  }

  // Tìm ca làm cụ thể theo workScheduleId
  const workShift = shift.shifts.find(
    s => s.workSchedule.toString() === workScheduleId
  );
  if (!workShift) {
    throw new Error('Không tìm thấy ca làm việc này trong ngày');
  }

  // Thêm nhân viên mới vào ca làm, sử dụng Set để tránh trùng lặp
  workShift.employees = [...new Set([...workShift.employees, ...validEmployeeIds])];
  
  await shift.save();
  
  return await Shift.findById(shift._id)
    .populate({
      path: 'shifts.workSchedule',
      select: 'key workSchedule timeStart timeEnd'
    })
    .populate({
      path: 'shifts.employees',
      select: 'name position'
    });
};

export const deleteShift = async (shiftId) => {
  const shift = await Shift.findById(shiftId);
  if (!shift) {
    throw new Error('Không tìm thấy ca làm');
  }
  await shift.deleteOne();
};

  