import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Tạo user mới
export const createUser = async (email, password, role, employeeId = null) => {
  try {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email đã được sử dụng!");
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      employeeId, // Lưu employeeId nếu có
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email hoặc mật khẩu không chính xác!");
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Email hoặc mật khẩu không chính xác!");
    }

    // Tạo JWT Token
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET is not defined. Please set it in your .env file.");
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, employeeId: user.employeeId },
      secretKey,
      { expiresIn: "1h" }
    );

    return { token, user };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Lấy danh sách user
export const getUsers = async () => {
  return await User.find();
};
