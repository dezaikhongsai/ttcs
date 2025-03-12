import express from "express";
import { createUserController, getUsersController } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/create", createUserController); // Tạo user mới
router.get("/", getUsersController); // Lấy danh sách user

export default router;
