import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    employeeCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    staff: { type: String, required: true },
    salaryPerHour: { type: Number, required: true },
    dateOfBirth: { type: Date, required: true }
}, { timestamps: true });

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
