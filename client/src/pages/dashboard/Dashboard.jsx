import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Select, Space, Typography, Card, Calendar} from 'antd';
import { CheckCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { getWorkSchedule, getShifts } from './services/dashboard.service';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const Dashboard = () => {
  const employee = useSelector((state) => state.auth.user?.employeeId);
  const [viewMode, setViewMode] = useState('attendance'); // 'attendance' or 'schedule'
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workSchedules, setWorkSchedules] = useState([]);
  const [shifts, setShifts] = useState([]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch work schedules
  useEffect(() => {
    const fetchWorkSchedules = async () => {
      try {
        const data = await getWorkSchedule();
        setWorkSchedules(data);
      } catch (error) {
        console.error('Error fetching work schedules:', error);
      }
    };

    fetchWorkSchedules();
  }, []);

  // Fetch shifts for calendar view
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const data = await getShifts();
        setShifts(data);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };

    if (viewMode === 'schedule') {
      fetchShifts();
    }
  }, [viewMode]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 10) return 'sáng';
    if (hour < 13) return 'trưa';
    if (hour < 18) return 'chiều';
    return 'tối';
  };

  const handleCheckIn = () => {
    // Implement check-in logic
    console.log('Check-in clicked');
  };

  const handleCheckOut = () => {
    // Implement check-out logic
    console.log('Check-out clicked');
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 'Admin':
        return 'red';
      case 'Quản lý':
        return 'blue';
      case 'Thu ngân':
        return 'green';
      case 'Pha chế':
        return 'orange';
      case 'Phục vụ':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const dateCellRender = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    const dayShifts = shifts.filter(shift => dayjs(shift.date).format('YYYY-MM-DD') === formattedDate);

    // Nhóm theo ca làm
    const groupedByWorkSchedule = {};
    dayShifts.forEach(shift => {
      if (!groupedByWorkSchedule[shift.workSchedule]) {
        groupedByWorkSchedule[shift.workSchedule] = [];
      }
      groupedByWorkSchedule[shift.workSchedule].push(shift);
    });

    return (
      <div style={{ padding: 0, margin: 0 }}>
        {Object.entries(groupedByWorkSchedule).map(([workSchedule, shiftsInSchedule], idx) => (
          <div key={idx} style={{ marginBottom: 6, background: '#f0f5ff', borderRadius: 4, padding: 4 }}>
            <b>{workSchedule}</b>
            {shiftsInSchedule.map((shift, i) => (
              <div key={i} style={{ fontSize: 12, marginLeft: 4 }}>
                <div>
                  <span style={{ color: '#555' }}>Bắt đầu: {shift.timeStart} | Kết thúc: {shift.timeEnd}</span>
                </div>
                {shift.employees && shift.employees.length > 0 && (
                  <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {shift.employees.map((emp, j) => (
                      <li key={j} style={{ color: '#222' }}>
                        {emp.name} - <span style={{ color: '#1890ff' }}>{emp.position}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="flex justify-between items-center">
          <Space>
            <Button
              type={viewMode === 'attendance' ? 'primary' : 'default'}
              onClick={() => setViewMode('attendance')}
              icon={<CheckCircleOutlined />}
            >
              Chấm công
            </Button>
            <Button
              type={viewMode === 'schedule' ? 'primary' : 'default'}
              onClick={() => setViewMode('schedule')}
              icon={<CalendarOutlined />}
            >
              Lịch làm
            </Button>
          </Space>
        </div>

        {viewMode === 'attendance' ? (
          <Card>
            <div className="text-left mb-4">
              <Title level={4}>Xin chào buổi {getGreeting()}, {employee?.name}</Title>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-4xl font-bold">
                {currentTime.toLocaleTimeString()}
              </div>
              <Space direction="vertical" align="center" size="large">
                <Select
                  style={{ width: 200 }}
                  placeholder="Chọn ca làm"
                >
                  {workSchedules.map((schedule) => (
                    <Select.Option key={schedule._id} value={schedule._id}>
                      {`${schedule.workSchedule} (${schedule.timeStart} - ${schedule.timeEnd})`}
                    </Select.Option>
                  ))}
                </Select>
                <Space>
                  <Button type="primary" onClick={handleCheckIn}>
                    Check-in
                  </Button>
                  <Button type="primary" danger onClick={handleCheckOut}>
                    Check-out
                  </Button>
                </Space>
              </Space>
            </div>
          </Card>
        ) : (
          <Card>
            <Calendar
              cellRender={dateCellRender}
              mode="month"
            />
          </Card>
        )}
      </Space>
    </div>
  );
};

export default Dashboard;