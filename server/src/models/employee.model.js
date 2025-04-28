import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String , required: true },
  startWork: { type: Date, required: true },
  dob: { type: Date, required: true },
  position: { type: String, required: true },
  address: { type: String, required: true },
}, {
  timestamps: true,
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
