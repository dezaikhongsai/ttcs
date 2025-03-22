import express from "express";
import { createEmployeeController, getEmployeeController , deleteEmployeeController} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/create", createEmployeeController)
router.get("/", getEmployeeController); // Lấy danh sách user
router.delete("/delete/:id", deleteEmployeeController);

export default router;
