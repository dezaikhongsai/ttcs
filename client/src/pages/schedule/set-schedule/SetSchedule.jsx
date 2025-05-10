import React, { useState, useEffect } from 'react';
import { Card, Spin, message } from 'antd';
import { getAssignments } from './services/schedule.service';
import ScheduleTable from './components/ScheduleTable';

const SetSchedule = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    fetchAssignment();
  }, []);

  return (
    <Card title="Lịch làm việc">
      <Spin spinning={loading}>
        {error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <ScheduleTable assignments={assignments} />
        )}
      </Spin>
    </Card>
  );
};

export default SetSchedule;  