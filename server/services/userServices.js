import User from "../models/UserModel.js";

// Tạo user mới
export const createUser = async (name, email, password , role) => {
  // Kiểm tra email đã tồn tại chưa
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("Email đã tồn tại!");
  }

  // Tạo user mới
  const user = new User({ name, email, password , role});
  return await user.save();
};

// Lấy danh sách user
export const getUsers = async () => {
  return await User.find();
};
