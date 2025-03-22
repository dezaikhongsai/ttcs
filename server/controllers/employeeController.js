import { createEmployee, getEmployee , deleteEmployee} from '../services/employeeServices.js';

export const createEmployeeController = async (req, res) => {
    console.log("Request Body:", req.body); // Kiểm tra dữ liệu đầu vào

    const { employeeCode, name, staff, salaryPerHour, dateOfBirth } = req.body;

    if (!employeeCode || !name || staff === undefined || !salaryPerHour || !dateOfBirth) {
        return res.status(400).json({ message: "Thiếu thông tin nhân viên!" });
    }

    try {
        const employee = await createEmployee(employeeCode, name, staff, salaryPerHour, dateOfBirth);
        res.status(201).json(employee);
    } catch (e) {
        console.error("Lỗi tạo nhân viên:", e.message); // In lỗi ra console
        res.status(500).json({ message: "Lỗi server: " + e.message });
    }
};

export const getEmployeeController = async (req, res) => {
    try {
        const employee = await getEmployee();
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
}

export const deleteEmployeeController = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await deleteEmployee(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}