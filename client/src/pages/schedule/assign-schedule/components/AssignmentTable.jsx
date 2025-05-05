import React from 'react';
import { Table, Button, Tag } from 'antd';
import Item from 'antd/es/list/Item';

const ScheduleTable = ({ schedules, handleCancelSchedule }) => {
  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'day',
      key: 'day',
      render: (text) => dayjs(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Ca',
      dataIndex: 'workSchedule',
      key: 'workSchedule',
     render: (item) => {
      if (!item) return 'Không có dữ liệu';
      return `${item.workSchedule} ${item.timeStart} - ${item.timeEnd}`;
    }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let color = '';
        switch (text) {
          case 'pending':
            color = 'orange';
            break;
          case 'approved':
            color = 'green';
            break;
          case 'cancelled':
            color = 'red';
            break;
          default:
            color = 'blue';
        }
        return <Tag color={color}>{text === 'pending' ? 'Chờ duyệt' : text === 'approved' ? 'Đã duyệt' : 'Đã hủy'}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) =>
        record.status === 'pending' ? (
          <Button danger onClick={() => handleCancelSchedule(record.id)}>
            Hủy
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-2">Lịch đã đăng ký</h3>
      <Table columns={columns} dataSource={schedules} rowKey="_id" pagination={false} />
    </>
  );
};

export default ScheduleTable;