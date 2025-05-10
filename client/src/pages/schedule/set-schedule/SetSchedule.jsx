import React, { useState, useEffect } from 'react';
import { Spin, message } from 'antd';
import { getAssignments , createShift , updateAssignment , deleteAssignment } from './services/schedule.service';
import ScheduleTable from './components/ScheduleTable';

const SetSchedule = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const response = await getAssignments();
      setAssignments(response.data || []);
    } catch (error) {
      setError(error.message);
      message.error('Không thể lấy dữ liệu lịch làm việc');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, []);
  
  const handleApproveSchedule = async (record) => {
    try {
      setLoading(true);
      const shiftData = {
        day: record.day,
        workScheduleId: record.workSchedule._id,
        employeeIds: [record.employee._id]
      }
      await createShift(shiftData);
      await updateAssignment(record._id, { status: 'Đã duyệt' });
      message.success('Duyệt lịch thành công');
      // Cập nhật lại danh sách assignments
      await fetchAssignment();
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  }
  const handleCancelSchedule = async (record) => {
    console.log('Hủy lịch:', record);
    try {
      setLoading(true);
      await deleteAssignment(record._id);
      message.success('Hủy lịch thành công');
      await fetchAssignment();
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="p-4">
      <Spin spinning={loading}>
        {error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <ScheduleTable assignments={assignments} handleApproveSchedule={handleApproveSchedule} handleCancelSchedule={handleCancelSchedule} loading = {loading} />
        )}
      </Spin>
    </div>
  );
};

export default SetSchedule;  