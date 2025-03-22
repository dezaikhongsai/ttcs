import Employee from "../models/employeeModel.js";

// Tạo employee
export const createEmployee = async (employeeCode,name , staff, salaryPerHour , dateOfBirth) => {
  try {
    // Tạo employee
      const newEmployee = new Employee({
          employeeCode,
          name,
          staff,
          salaryPerHour,
          dateOfBirth
      })

    await newEmployee.save();
    return newEmployee;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteEmployee = async (id) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      throw new Error("Employee not found");
    }
    return { message: "Employee deleted successfully", deletedEmployee };
  } catch (error) {
    throw new Error(error.message);
  }
};
// Lấy danh sách employee
export const getEmployee = async () => {
  return await Employee.find();
};
