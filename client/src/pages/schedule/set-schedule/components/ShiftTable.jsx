import React from 'react';
import { Table, Space, Tag, Typography, Button } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;

const ShiftTable = ({ data, loading, onSetShift, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <Title level={4}>Không có dữ liệu ca làm việc</Title>
      </div>
    );
  }

  // Group dữ liệu theo ngày và ca làm (trùng workSchedule, timeStart, timeEnd)
  const grouped = [];
  let sttCounter = 1;

  data.forEach(dayData => {
    const caMap = {};

    dayData.shifts.forEach(shift => {
      const caKey = `${shift.workSchedule.workSchedule}-${shift.workSchedule.timeStart}-${shift.workSchedule.timeEnd}`;
      if (!caMap[caKey]) {
        caMap[caKey] = {
          key: `${dayData.day}-${caKey}`,
          date: dayData.day,
          stt: null, // sẽ cập nhật ở dòng đầu tiên của ngày
          workSchedule: shift.workSchedule.workSchedule,
          timeStart: shift.workSchedule.timeStart,
          timeEnd: shift.workSchedule.timeEnd,
          employees: [...shift.employees],
        };
      } else {
        caMap[caKey].employees.push(...shift.employees);
      }
    });

    const caList = Object.values(caMap);

    // Gán STT vào dòng đầu tiên trong ngày
    caList.forEach((item, index) => {
      item.stt = index === 0 ? sttCounter : null;
    });

    grouped.push(...caList);

    // Thêm dòng chứa các nút hành động
    grouped.push({
      key: `action-${dayData.day}`,
      date: dayData.day,
      type: 'action',
    });

    sttCounter++;
  });

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      align: 'center',
      render: (_, record, index) => {
        if (record.type === 'action') return '';
        if (record.stt !== null) {
          const rowCount = grouped.filter(item => item.date === record.date && !item.type).length;
          return {
            children: record.stt,
            props: { rowSpan: rowCount },
          };
        }
        return { children: null, props: { rowSpan: 0 } };
      },
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      align: 'center',
      render: (text, record, index) => {
        if (record.type === 'action') return '';
        const firstIndex = grouped.findIndex(item => item.date === text && !item.type);
        if (index === firstIndex) {
          const rowCount = grouped.filter(item => item.date === text && !item.type).length;
          return {
            children: dayjs(text).format('DD/MM/YYYY'),
            props: { rowSpan: rowCount },
          };
        }
        return { children: null, props: { rowSpan: 0 } };
      },
    },
    {
      title: 'Ca làm',
      dataIndex: 'workSchedule',
      key: 'workSchedule',
      width: 150,
      align: 'center',
      render: (_, record) => record.type === 'action' ? '' : record.workSchedule,
    },
    {
      title: 'Thời gian',
      key: 'time',
      width: 150,
      align: 'center',
      render: (_, record) =>
        record.type === 'action' ? '' : `${record.timeStart} - ${record.timeEnd}`,
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employees',
      key: 'employees',
      align: 'center',
      render: (employees, record) =>
        record.type === 'action' ? '' : (
          <Space wrap>
            {[...new Map(employees.map(emp => [emp._id, emp])).values()].map(emp => (
              <Tag key={emp._id} color="blue">
                {emp.name} <br />
              </Tag>
            ))}
          </Space>
        ),
    },
   {
  title: 'Hành động',
  key: 'actions',
  width: 250,
  align: 'center',
  render: (_, record, index) => {
    // chỉ render tại dòng đầu tiên của mỗi ngày
    const firstIndex = grouped.findIndex(item => item.date === record.date);
    if (index !== firstIndex) return { children: null, props: { rowSpan: 0 } };

    const rowCount = grouped.filter(item => item.date === record.date).length;
    const fullData = data.find(item => item.day === record.date);

    return {
      children: (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => onSetShift?.(fullData)}
          >
            Phân ca
          </Button>
          <Button
            style={{ backgroundColor: '#ffc107', border: 'none', color: '#fff' }}
            icon={<EditOutlined />}
            onClick={() => onEdit?.(fullData)}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete?.(fullData)}
          >
            Xóa
          </Button>
        </Space>
      ),
      props: { rowSpan: rowCount },
    };
  },
}


  ];

  return (
    <Table
      columns={columns}
      dataSource={grouped}
      pagination={false}
      size="middle"
      bordered
      loading={loading}
      scroll={{ x: 'max-content' }}
    />
  );
};
export default ShiftTable;
