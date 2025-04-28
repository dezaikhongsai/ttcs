import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({

}, {

  timestamps: true,
});

const Payroll = mongoose.model('payroll', payrollSchema);

export default Payroll;