import Shift from '../models/shift.model.js';
import mongoose from 'mongoose';

export const getShifts = async () => {
  const shifts = await Shift.find()
    .populate({
      path: 'shifts.workSchedule',
      select: 'key workSchedule timeStart timeEnd'
    })
    .populate({
      path: 'shifts.employees.employee',
      model: 'Employee',
      select: 'name'
    });
  return shifts;
};
export const createShift = async (shiftData) => {
  const { day, workScheduleId, employees } = shiftData;

  if (!mongoose.Types.ObjectId.isValid(workScheduleId)) {
    throw new Error('ID của ca làm việc không hợp lệ');
  }

  if (!Array.isArray(employees) || employees.length === 0) {
    throw new Error('Danh sách nhân viên không hợp lệ');
  }

  // Validate từng phần tử trong employees
  const validEmployees = employees.filter(emp =>
    emp &&
    mongoose.Types.ObjectId.isValid(emp.employeeId) &&
    typeof emp.roleInShift === 'string' &&
    emp.roleInShift.trim() !== ''
  );

  if (validEmployees.length !== employees.length) {
    throw new Error('Một hoặc nhiều nhân viên có thông tin không hợp lệ');
  }

  let shift = await Shift.findOne({ day });

  if (!shift) {
    // Nếu chưa có shift, tạo mới
    shift = new Shift({
      day,
      shifts: [{
        workSchedule: workScheduleId,
        employees: validEmployees.map(emp => ({
          employee: emp.employeeId,
          roleInShift: emp.roleInShift
        }))
      }]
    });
  } else {
    const existingWorkSchedule = shift.shifts.find(
      s => s.workSchedule.toString() === workScheduleId
    );

    if (existingWorkSchedule) {
      // Check trùng nhân viên
      const duplicateEmployees = validEmployees.filter(emp =>
        existingWorkSchedule.employees.some(e =>
          e?.employee?.toString() === emp.employeeId.toString()
        )
      );
      if (duplicateEmployees.length > 0) {
        throw new Error('Một hoặc nhiều nhân viên đã được phân công vào ca làm này');
      }

      // Thêm nhân viên mới
      existingWorkSchedule.employees.push(...validEmployees.map(emp => ({
        employee: emp.employeeId,
        roleInShift: emp.roleInShift
      })));
    } else {
      // Thêm ca làm mới
      shift.shifts.push({
        workSchedule: workScheduleId,
        employees: validEmployees.map(emp => ({
          employee: emp.employeeId,
          roleInShift: emp.roleInShift
        }))
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
      path: 'shifts.employees.employee',
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

export const getShiftByWorkSchedule = async (shiftId, workScheduleName) => {
  try {
    console.log('Searching for shift with ID:', shiftId);
    console.log('Looking for workSchedule name:', workScheduleName);

    const shift = await Shift.findById(shiftId)
      .populate({
        path: 'shifts.workSchedule',
        select: 'key workSchedule timeStart timeEnd'
      })
      .populate({
        path: 'shifts.employees.employee',
        select: 'name position'
      });

    if (!shift) {
      console.log('No shift found with ID:', shiftId);
      return null;
    }

    console.log('Found shift:', JSON.stringify(shift, null, 2));
    console.log('Total shifts in day:', shift.shifts.length);

    const filteredShifts = shift.shifts.filter(s => {
      return s.workSchedule && s.workSchedule.workSchedule === workScheduleName;
    });

    console.log('Filtered shifts count:', filteredShifts.length);
    console.log('Filtered shifts:', JSON.stringify(filteredShifts, null, 2));
    const filteredShift = {
      _id: shift._id,
      day: shift.day,
      shifts: filteredShifts
    };

    return filteredShift;
  } catch (error) {
    console.log("Lỗi chi tiết:", error);
    throw error;
  } 
}

export const updateShiftByWorkSchedule = async (workScheduleId, shiftData) => {
  const shift = await Shift.findOne({ 'shifts.workSchedule': workScheduleId });
  if (!shift) {
    throw new Error('Không tìm thấy ca làm');
  }
  
};
  