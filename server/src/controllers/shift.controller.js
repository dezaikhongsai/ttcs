import { getShifts, createShift, addEmployeesToShift, getShiftsByMonthYear} from '../services/shift.service.js';

/**
 * Lấy danh sách ca làm
 * @param {Object} req - Yêu cầu từ client
 * @param {Object} res - Phản hồi tới client
 */
export const getShiftsController = async (req, res) => {
  try {
    const shifts = await getShifts();
    res.status(200).json({
      message: 'Lấy danh sách ca làm thành công!',
      data: shifts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Không thể lấy danh sách ca làm!',
    });
  }
};

/**
 * Tạo ca làm mới
 * @param {Object} req - Yêu cầu từ client
 * @param {Object} res - Phản hồi tới client
 */
export const createShiftController = async (req, res) => {
  try {
    const shiftData = req.body; // Lấy dữ liệu ca làm từ body
    const newShift = await createShift(shiftData); // Gọi service để tạo ca làm
    res.status(201).json({
      message: 'Tạo ca làm mới thành công!',
      data: newShift,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Không thể tạo ca làm!',
    });
  }
};

export const addEmployeesToShiftController = async (req, res) => {
  try {
    const { shiftId } = req.params; // Lấy shiftId từ params
    const { employeeIds } = req.body; // Lấy danh sách employeeIds từ body

    // Gọi service để thêm nhân viên vào ca làm
    const updatedShift = await addEmployeesToShift(shiftId, employeeIds);

    res.status(200).json({
      message: 'Thêm nhân viên vào ca làm thành công!',
      data: updatedShift,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Không thể thêm nhân viên vào ca làm!',
    });
  }
};

/**
 * Lấy danh sách ca làm theo tháng và năm
 * @param {Object} req - Yêu cầu từ client
 * @param {Object} res - Phản hồi tới client
 */
export const getShiftsByMonthYearController = async (req, res) => {
  try {
    const { month, year } = req.query; // Lấy tháng và năm từ query params

    // Kiểm tra đầu vào
    if (!month || !year) {
      return res.status(400).json({
        message: 'Vui lòng cung cấp đầy đủ tháng và năm (mm/yyyy).',
      });
    }

    // Lấy danh sách ca làm
    const shifts = await getShiftsByMonthYear(parseInt(month), parseInt(year));

    res.status(200).json({
      message: 'Lấy danh sách ca làm thành công!',
      data: shifts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Không thể lấy danh sách ca làm!',
    });
  }
};