import { createUser, getUsers } from "../services/userServices.js";

// API: Tạo user mới
export const createUserController = async (req, res) => {
  const { name, email, password , role} = req.body;
  try {
    const user = await createUser(name, email, password , role);
    res.status(201).json({ _id: user._id, name: user.name, email: user.email  , role : user.role});
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
