import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift',
    required: true,
  },
  day: {
    type: Date,
    required: true, 
  },
  employee: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, // ID nhân viên
    name: { type: String, required: true }, 
    position: { type: String, required: true }, 
  },
  status: {
    type: String,
    enum: ['Chờ duyệt', 'Đã duyệt', 'Hủy'], 
    default: 'Chờ duyệt',
  },
}, {
  timestamps: true, 
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;