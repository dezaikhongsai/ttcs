import { getShifts, createShift, getShiftsByMonthYear, deleteShift , getShiftByWorkSchedule} from '../services/shift.service.js';

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
    const { day, workScheduleId, employees } = req.body;

    if (!day || !workScheduleId || !employees) {
      return res.status(400).json({
        message: 'Vui lòng cung cấp đầy đủ thông tin: ngày, ca làm việc và danh sách nhân viên'
      });
    }

    if (!Array.isArray(employees)) {
      return res.status(400).json({
        message: 'Danh sách nhân viên phải là một mảng'
      });
    }

    const shiftData = { day, workScheduleId, employees };
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

export const getShiftsByMonthYearController = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ tháng và năm (mm/yyyy).',
      });
    }

    // Validate month and year
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: 'Tháng không hợp lệ. Vui lòng nhập số từ 1 đến 12.',
      });
    }

    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      return res.status(400).json({
        success: false,
        message: 'Năm không hợp lệ. Vui lòng nhập năm từ 2000 đến 2100.',
      });
    }

    const shifts = await getShiftsByMonthYear(monthNum, yearNum);

    res.status(200).json({
      success: true,
      message: 'Lấy danh sách ca làm thành công!',
      data: shifts,
    });
  } catch (error) {
    console.error('Error in getShiftsByMonthYearController:', error);
    res.status(500).json({
      success: false,
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

export const updateShiftByWorkScheduleController = async (req, res) => {
  try {
    const { shiftId, workScheduleId } = req.params;
    const { employees } = req.body;

    const shift = await getShiftByWorkSchedule(shiftId, workScheduleId);
    
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Không thể cập nhật ca làm!'
    });
  }
}

export const getShiftByWorkScheduleController = async (req, res) => {
  try {
    const { id } = req.params;
    const { workScheduleName } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID ca làm việc không được để trống"
      });
    }

    if (!workScheduleName) {
      return res.status(400).json({
        success: false,
        message: "Tên ca làm việc không được để trống"
      });
    }

    const shift = await getShiftByWorkSchedule(id, workScheduleName);
    
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ca làm việc"
      });
    }

    res.status(200).json({
      success: true,
      message: "Lấy danh sách thành công",
      data: shift
    });
  } catch (error) {
    console.error("Error in getShiftByWorkScheduleController:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Lấy danh sách thất bại"
    });
  }
}