import axios from 'axios'

export const fetchEmployees = async (setEmployee, setLoading) => {
    try {
        const respone = await axios.get(`${import.meta.env.VITE_SERVER_URL}/employees`);
        const fillterData = respone.data.map((employee, index) => ({
            key: index + 1,
            id: employee._id,
            employeeCode:  employee.employeeCode,
            name: employee.name,
            staff: employee.staff,
            dob: employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString("vi-VN") : "Chưa cập nhật"
        }))
        console.log(fillterData);
        setEmployee(fillterData);
        setLoading(false);
    } catch (e) {
        setLoading(false);
    }
}

export const deleteEmployee = async (id) => {
    try {
        const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/employees/delete/${id}`);
        console.log(res.data.message);
        return res.data;
    } catch (e) {
        throw new Error(e.message);
    }
}