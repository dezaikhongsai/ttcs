import Shift from '../models/shift.model.js';
import Employee from '../models/employee.model.js';

export const getShifts = async () => {
  const shifts = await Shift.find()
    .populate({
      path: 'employees', 
      select: 'name position', 
    });
  return shifts;
};

export const createShift = async (shiftData) => {
  const { shiftName, day, employees } = shiftData;

  // Kiểm tra danh sách nhân viên có hợp lệ không
  const validEmployees = await Employee.find({ _id: { $in: employees } });
  if (validEmployees.length !== employees.length) {
    throw new Error('Một hoặc nhiều nhân viên không tồn tại.');
  }

  const newShift = new Shift({
    shiftName,
    day,
    employees, 
  });

  await newShift.save();
  return await newShift.populate({
    path: 'employees',
    select: 'name position',
  });
};

export const addEmployeesToShift = async (shiftId, employeeIds) => {
  const shift = await Shift.findById(shiftId);
  if (!shift) {
    throw new Error('Ca làm không tồn tại.');
  }

  const validEmployees = await Employee.find({ _id: { $in: employeeIds } });
  if (validEmployees.length !== employeeIds.length) {
    throw new Error('Một hoặc nhiều nhân viên không tồn tại.');
  }

  const newEmployees = validEmployees.map((emp) => emp._id);

  shift.employees = [...new Set([...shift.employees, ...newEmployees])];

  await shift.save();

  return await shift.populate({
    path: 'employees',
    select: 'name position', 
  });
};

export const getShiftsByMonthYear = async (month, year) => {
  const startDate = new Date(year, month - 1, 1); 
  const endDate = new Date(year, month, 0);
  const shifts = await Shift.find({
    day: { $gte: startDate, $lte: endDate },
  }).populate({
    path: 'employees',
    select: 'name position', 
  });

  return shifts;
};