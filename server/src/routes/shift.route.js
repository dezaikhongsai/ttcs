import express from 'express';
import { createShiftController , getShiftsByMonthYearController, getShiftsController , deleteShiftController} from '../controllers/shift.controller.js';
import { verifyToken , authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(verifyToken); 
// Lấy tất cả ca làm
router.get('/shifts', getShiftsController);

// Lấy ca làm theo tháng và năm
router.get('/shifts/by-month-year', getShiftsByMonthYearController);

// Tạo ca làm mới
router.post('/shifts', createShiftController);
// Xóa ca làm
router.delete('/shifts/:shiftId',authorizeRoles(['Admin', 'Manager']), deleteShiftController);

export default router;