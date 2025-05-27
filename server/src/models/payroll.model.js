import mongoose from 'mongoose';
const payrollSchema = mongoose.Schema({
    employeeId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
        unique: true
    },
    name :{
        type: String,
        required: true
    },
    term : {
        type: String,
        required: true
    },
    baseSalary : {
        type: Number,
        required: true
    },
    totalSalary : {
        type: Number,
        required: true
    },
    status : {
        type: String,
    }
} , {timestamps: true})

// Thêm compound index cho employeeId và term
payrollSchema.index({ employeeId: 1, term: 1 }, { unique: true });

const Payroll = mongoose.model('Payroll', payrollSchema);
export default Payroll;
