import Assignment from '../models/assignment.model.js';
import Employee from '../models/employee.model.js';
import WorkSchedule from '../models/workShcedule.js';
export const createAssignment = async (assignmentData) => {
  const { employee, workSchedule , status , day } = assignmentData;
  const employeeData = await Employee.findById(employee._id, 'name position');
  const workScheduleData = await WorkSchedule.findById (workSchedule._id)
  if (!employeeData || !workScheduleData) {
    throw new Error('Nhân viên, Ca làm không tồn tại !');
  }
  const newAssignment = new Assignment({
    day,
    employee: {
      _id: employee._id,
      name: employeeData.name,
      position: employeeData.position,
    },
    workSchedule: {
      _id: workScheduleData._id,
      key: workScheduleData.key,
      workSchedule: workScheduleData.workSchedule,
      timeStart: workScheduleData.timeStart,
      timeEnd: workScheduleData.timeEnd
    },
    status
  });

  await newAssignment.save();
  return newAssignment;
};


export const getAllAssignments = async () => {
  return await Assignment.find();
};

export const updateAssignmentStatus = async (id, status) => {
  const assignment = await Assignment.findById(id);
  if (!assignment) {
    throw new Error('Đăng ký ca làm không tồn tại.');
  }
  assignment.status = status;
  await assignment.save();
  return assignment;
};

export const getAssignmentsByEmployeeId = async (employeeId) => {
  const assignments = await Assignment.find({ 'employee._id': employeeId });
  return assignments;
}

export const deleteAssignment = async (id) => {
  const assignment = await Assignment.findByIdAndDelete(id);
  if (!assignment) {
    throw new Error('Đăng ký ca làm không tồn tại.');
  }
  return assignment;
}