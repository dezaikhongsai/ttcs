import express from "express";
import { createEmployeeController, getEmployeeController } from "../controllers/employeeController.js";

const router = express.Router();

router.post("/create", createEmployeeController)
router.get("/", getEmployeeController); // Lấy danh sách user

export default router;
