import mongoose from 'mongoose';

const timeSheetSchema = new mongoose.Schema({
    employeeId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    day: {type : Date, required: true},
    checkIn: {type: Date, required: true},
    checkOut: {type: Date, required: true},
    status : {
        type: String,
        enum: ['Đang làm việc', 'Hoàn thành', 'Ngoài ca làm'],
        default: 'Ngoài ca làm'
    },
    workScheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkSchedule',
        required: true
    },  
})
const TimeSheet = mongoose.model('TimeSheet', timeSheetSchema);
export default TimeSheet;
