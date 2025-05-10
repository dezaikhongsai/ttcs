import { getShifts, createShift, getShiftsByMonthYear, deleteShift } from '../services/shift.service.js';

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

export const createShiftController = async (req, res) => {
  try {
    const { day, workScheduleId, employeeIds } = req.body;

    // Validate dữ liệu đầu vào
    if (!day || !workScheduleId || !employeeIds) {
      return res.status(400).json({
        message: 'Vui lòng cung cấp đầy đủ thông tin: ngày, ca làm việc và danh sách nhân viên'
      });
    }

    // Validate employeeIds phải là mảng
    if (!Array.isArray(employeeIds)) {
      return res.status(400).json({
        message: 'Danh sách nhân viên phải là một mảng'
      });
    }

    const shiftData = { day, workScheduleId, employeeIds };
    const result = await createShift(shiftData);

    res.status(200).json({
      message: 'Cập nhật ca làm thành công!',
      data: result
    });
  } catch (error) {
    if (error.message.includes('không hợp lệ')) {
      return res.status(400).json({
        message: error.message
      });
    }
    res.status(500).json({
      message: error.message || 'Không thể cập nhật ca làm!'
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
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: 'Vui lòng cung cấp đầy đủ tháng và năm (mm/yyyy).',
      });
    }

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

export const deleteShiftController = async (req, res) => {
  try {
    const { shiftId } = req.params;
    await deleteShift(shiftId);
    res.status(200).json({ message: 'Ca làm đã được xóa thành công!' });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Không thể xóa ca làm!'
    });
  }
};

