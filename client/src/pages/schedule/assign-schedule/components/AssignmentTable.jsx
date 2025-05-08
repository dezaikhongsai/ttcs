import React, { useEffect } from 'react';
import { Table, Button, Tag } from 'antd';
import dayjs from 'dayjs';

function ScheduleTable({ schedules, handleCancelSchedule }) {
  useEffect(() => {
    console.log("schedules", schedules);
  }, [schedules]);

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (_, __, index) => index + 1,
      width: 80,
      align: 'center'
    },
    {
      title: 'Ngày làm việc',
      dataIndex: 'day',
      key: 'day',
      render: (text) => dayjs(text).format('DD/MM/YYYY'),
      width: 150,
      align: 'center'
    },
    {
      title: 'Ca làm việc',
      dataIndex: 'workSchedule',
      key: 'workSchedule',
      render: (item) => {
        if (!item) return 'Không có dữ liệu';
        return `${item.workSchedule} ${item.timeStart} - ${item.timeEnd}`;
      },
      width: 200,
      align: 'center'
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employee',
      key: 'employee',
      render: (employee) => {
        if (!employee) return 'Không có dữ liệu';
        return employee.name || 'Không có tên';
      },
      width: 200,
      align: 'center'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let color = '';
        switch (text) {
          case 'Chờ duyệt':
            color = 'orange';
            break;
          case 'Đã duyệt':
            color = 'green';
            break;
          case 'Đã hủy':
            color = 'red';
            break;
          default:
            color = 'blue';
        }
        return <Tag color={color}>{text}</Tag>;
      },
      width: 150,
      align: 'center'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) =>
        record.status === 'Chờ duyệt' ? (
          <Button danger onClick={() => handleCancelSchedule(record._id)}>
            Hủy
          </Button>
        ) : null,
      width: 120,
      align: 'center'
    },
  ];

  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-2">Lịch đã đăng ký</h3>
      <Table 
        columns={columns} 
        dataSource={schedules} 
        rowKey="_id" 
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </>
  );
}

export default ScheduleTable;