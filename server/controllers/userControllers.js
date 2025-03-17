import { createUser, getUsers, loginUser } from "../services/userServices.js";

// API: Tạo user mới
export const createUserController = async (req, res) => {
  const { email, password, role, employeeId } = req.body;

  try {
    const user = await createUser(email, password, role, employeeId);
    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// API: Đăng nhập
export const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await loginUser(email, password);
    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId, // Trả về employeeId
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// API: Lấy danh sách user
export const getUsersController = async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
