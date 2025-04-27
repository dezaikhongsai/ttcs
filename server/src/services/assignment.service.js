import Assignment from '../models/assignment.model.js';

export const createAssignment = async (assignmentData) => {
  const newAssignment = new Assignment(assignmentData);
  await newAssignment.save();
  return newAssignment;
};


export const getAllAssignments = async () => {
  return await Assignment.find()
    .populate('shift', 'shiftName day') 
    .populate('employee._id', 'name position'); 
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