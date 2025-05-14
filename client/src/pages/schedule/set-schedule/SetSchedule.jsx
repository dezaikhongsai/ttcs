import React, { useState, useEffect } from 'react';
import { Spin, message, Button, Space, Switch } from 'antd';
import { getAssignments , createShift , updateAssignment , deleteAssignment , getShifts } from './services/schedule.service';
import ScheduleTable from './components/ScheduleTable';
import ListShift from './components/ListShift';
import ShiftTable from './components/ShiftTable';

const SetSchedule = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('schedule'); // 'schedule' or 'shift'
  const [shifts, setShifts] = useState([]);
  const [shiftViewMode, setShiftViewMode] = useState('calendar'); // 'calendar' or 'table'

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

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await getShifts();
      console.log("API Response:", response);
      setShifts(response.data || []);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      setError(error.message);
      message.error('Không thể lấy dữ liệu ca làm');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAssignment();
    fetchShifts();
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
      await fetchShifts();
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Button 
            type={activeView === 'schedule' ? 'primary' : 'default'}
            onClick={() => setActiveView('schedule')}
          >
            Quản lý đăng ký ca làm
          </Button>
          <Button 
            type={activeView === 'shift' ? 'primary' : 'default'}
            onClick={() => setActiveView('shift')}
          >
            Lịch làm
          </Button>
        </Space>

        {activeView === 'shift' && (
          <Space align="center">
            <Switch 
              checked={shiftViewMode === 'table'}
              onChange={(checked) => setShiftViewMode(checked ? 'table' : 'calendar')}
            />
            Xem bảng
          </Space>
        )}
      </div>

      <Spin spinning={loading}>
        {error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          activeView === 'schedule' ? (
            <ScheduleTable 
              assignments={assignments} 
              handleApproveSchedule={handleApproveSchedule} 
              handleCancelSchedule={handleCancelSchedule} 
              loading={loading} 
            />
          ) : shiftViewMode === 'calendar' ? (
            <ListShift data={shifts} loading={loading} />
          ) : (
            <ShiftTable
            data={shifts}
            loading={loading}
            onView={(record) => console.log('Xem:', record)}
            onEdit={(record) => console.log('Sửa:', record)}
            onDelete={(record) => console.log('Xóa:', record)}
          />
          )
        )}
      </Spin>
    </div>
  );
};

export default SetSchedule;  