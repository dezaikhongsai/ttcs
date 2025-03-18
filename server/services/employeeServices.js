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

export const getEmployee = async () => {
  return await Employee.find();
};
