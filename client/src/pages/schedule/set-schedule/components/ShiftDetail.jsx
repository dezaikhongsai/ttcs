import React from 'react';
import { Card, Descriptions, Tag, Space, Typography } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ShiftDetail = ({ shift }) => {
  if (!shift) return null;

  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY');
  };

  const getPositionColor = (position) => {
    const colorMap = {
      'Admin': 'red',
      'Quản lý': 'blue',
      'Thu ngân': 'green',
      'Pha chế': 'orange',
      'Phục vụ': 'purple'
    };
    return colorMap[position] || 'default';
  };

  return (
    <Card className="mb-4">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4}>Thông tin ca làm</Title>
          <Text type="secondary">Ngày: {formatDate(shift.day)}</Text>
        </div>

        {shift.shifts.map((shiftDetail, index) => (
          <Card key={shiftDetail._id} className="mb-3" size="small">
            <Descriptions title={`Ca ${index + 1}`} bordered>
              <Descriptions.Item label="Ca làm" span={3}>
                <Space direction="vertical">
                  <Text strong>{shiftDetail.workSchedule.workSchedule}</Text>
                  <Text type="secondary">
                    {shiftDetail.workSchedule.timeStart} - {shiftDetail.workSchedule.timeEnd}
                  </Text>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Nhân viên" span={3}>
                <Space direction="vertical">
                  {shiftDetail.employees.map((employee) => (
                    <Space key={employee._id}>
                      <Text>{employee.name}</Text>
                      <Tag color={getPositionColor(employee.position)}>
                        {employee.position}
                      </Tag>
                    </Space>
                  ))}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        ))}

        <div>
          <Text type="secondary">
            Cập nhật lần cuối: {dayjs(shift.updatedAt).format('DD/MM/YYYY HH:mm')}
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default ShiftDetail; 