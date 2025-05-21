import express from 'express';
import{getAllTimeSheetsController
, getTimeSheetByEmployeeIdController, createTimeSheetController, updateTimeSheetController, deleteTimeSheetController
} from '../controllers/timesheet.controller.js';

import { verifyToken , authorizeRoles } from '../middlewares/auth.middleware.js'; 

const router = express.Router();
router.use(verifyToken);

router.get('/', getAllTimeSheetsController);
router.get('/:employeeId', getTimeSheetByEmployeeIdController);
router.post('/', createTimeSheetController);
router.put('/:id', updateTimeSheetController);
router.delete('/:id', deleteTimeSheetController);

export default router;