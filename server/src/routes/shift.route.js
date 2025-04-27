import express from 'express';
import { createShiftController, addEmployeesToShiftController , getShiftsByMonthYearController, getShiftsController} from '../controllers/shift.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(verifyToken); 
router.get('/shifts', getShiftsController);

router.get('/shifts/by-month-year', getShiftsByMonthYearController);
router.post('/shifts', createShiftController);
router.put('/shifts/:id/employees', addEmployeesToShiftController);

export default router;