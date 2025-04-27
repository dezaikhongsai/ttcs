import express from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employee.controller.js';
import { verifyToken , authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(verifyToken); 
router.use(authorizeRoles(['Admin' , 'Manager'])); 
router.get('/',  getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id',deleteEmployee);

export default router;
