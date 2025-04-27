import express from 'express';
import {
  createAssignmentController,
  getAllAssignmentsController,
  updateAssignmentStatusController,
} from '../controllers/assignment.controller.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(verifyToken);

router.get('/', getAllAssignmentsController);
router.post('/', createAssignmentController);

router.put('/:id/status', authorizeRoles(['Admin', 'Manager']), updateAssignmentStatusController);

export default router;