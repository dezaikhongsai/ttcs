import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config(); // Load biến môi trường

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware để parse JSON

// Kết nối MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
