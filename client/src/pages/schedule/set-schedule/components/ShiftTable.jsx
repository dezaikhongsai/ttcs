import React from 'react';
import { Table, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

const { Title } = Typography;

const ShiftTable = ({ data, loading }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <Title level={4}>Không có dữ liệu ca làm việc</Title>
      </div>
    );
  }

  // Chuẩn bị dữ liệu cho bảng
  const tableData = data.flatMap(dayData => 
    dayData.shifts.map(shift => ({
      key: shift._id,
      date: dayData.day,
      workSchedule: shift.workSchedule.workSchedule,
      timeStart: shift.workSchedule.timeStart,
      timeEnd: shift.workSchedule.timeEnd,
      employees: shift.employees,
    }))
  );

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (text) => dayjs(text).format('DD/MM/YYYY'),
      width: 120,
    },
    {
      title: 'Ca làm',
      dataIndex: 'workSchedule',
      key: 'workSchedule',
      width: 150,
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_, record) => `${record.timeStart} - ${record.timeEnd}`,
      width: 150,
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employees',
      key: 'employees',
      render: (employees) => (
        <Space direction="vertical">
          {employees.map(employee => (
            <Tag key={employee._id} color="blue">
              {employee.name}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      pagination={false}
      scroll={{ x: 'max-content' }}
      size="middle"
      bordered
      loading={loading}
    />
  );
};

export default ShiftTable; 
