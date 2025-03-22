import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoutes from "./routes/userRoutes.js";
import employeeRouters from './routes/employeeRoutes.js';
import cors from 'cors';
dotenv.config(); // Load biến môi trường

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json()); // Middleware để parse JSON

// Kết nối MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRouters);


// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
