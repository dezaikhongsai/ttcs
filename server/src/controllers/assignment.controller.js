import { createAssignment, getAllAssignments, updateAssignmentStatus } from '../services/assignment.service.js';

export const createAssignmentController = async (req, res) => {
  try {
    const assignmentData = req.body;
    const newAssignment = await createAssignment(assignmentData);
    res.status(201).json({
      message: 'Tạo đăng ký ca làm thành công!',
      data: newAssignment,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Không thể tạo đăng ký ca làm!',
    });
  }
};

export const getAllAssignmentsController = async (req, res) => {
  try {
    const assignments = await getAllAssignments();
    res.status(200).json({
      message: 'Lấy danh sách đăng ký ca làm thành công!',
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Không thể lấy danh sách đăng ký ca làm!',
    });
  }
};

export const updateAssignmentStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedAssignment = await updateAssignmentStatus(id, status);
    res.status(200).json({
      message: 'Cập nhật trạng thái đăng ký ca làm thành công!',
      data: updatedAssignment,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Không thể cập nhật trạng thái đăng ký ca làm!',
    });
  }
};