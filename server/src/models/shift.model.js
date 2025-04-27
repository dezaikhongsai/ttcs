import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  shiftName: { type: String, required: true }, // Tên ca làm
  day: { type: Date, required: true }, // Ngày của ca làm
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId, // Chỉ lưu _id của nhân viên
      ref: 'Employee', // Tham chiếu đến model Employee
    },
  ],
}, {
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

const Shift = mongoose.model('Shift', shiftSchema);

export default Shift;