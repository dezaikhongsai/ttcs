import { Table, Space, Tag, Typography, Button } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ModalEditShift from './ModalEditShift';
import { useState } from 'react';
const { Title } = Typography;

const ShiftTable = ({ data, employeeList = [], loading, onSetShift, onEdit, onDelete }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const handleEdit = (shiftRecord) => {
    setSelectedRecord(shiftRecord);
    setIsModalEditVisible(true);
  }
  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <Title level={4}>Không có dữ liệu ca làm việc</Title>
      </div>
    );
  }
  // Gán tên nhân viên vào từng item employees
  const attachEmployeeNames = (data, employeeList) => {
    return data.map(dayData => {
      const updatedShifts = dayData.shifts.map(shift => {
        const updatedEmployees = shift.employees.map(emp => {
          const fullEmp = employeeList.find(e => e._id === emp.employee || e._id === emp._id);
          return {
            ...emp,
            name: fullEmp?.name || 'Không rõ',
          };
        });
        return {
          ...shift,
          employees: updatedEmployees,
        };
      });
      return {
        ...dayData,
        shifts: updatedShifts,
      };
    });
  };
  const enrichedData = attachEmployeeNames(data, employeeList);
  // Group dữ liệu theo ngày và ca làm (trùng workSchedule, timeStart, timeEnd)
  const grouped = [];
  let sttCounter = 1;

  enrichedData.forEach(dayData => {
    const caMap = {};

    dayData.shifts.forEach(shift => {
      const caKey = `${shift.workSchedule.workSchedule}-${shift.workSchedule.timeStart}-${shift.workSchedule.timeEnd}`;
      if (!caMap[caKey]) {
        caMap[caKey] = {
          key: `${dayData.day}-${caKey}`,
          date: dayData.day,
          stt: null,
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

    caList.forEach((item, index) => {
      item.stt = index === 0 ? sttCounter : null;
    });

    grouped.push(...caList);
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
                {emp.employee.name + " --> " + emp.roleInShift}  <br />
              </Tag>
              
            ))}
          </Space>
        ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      align: 'center',
      render: (_, record, index) => {
        const firstIndex = grouped.findIndex(item => item.date === record.date);
        if (index !== firstIndex) return { children: null, props: { rowSpan: 0 } };

        const rowCount = grouped.filter(item => item.date === record.date).length;
        // const fullData = enrichedData.find(item => item.day === record.date);
        return {
          children: (
            <Space>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => onSetShift?.(record)}
              >
                Phân ca
              </Button>
              <Button
                style={{ backgroundColor: '#ffc107', border: 'none', color: '#fff' }}
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                Sửa
              </Button>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete?.(record) }
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
    <>
      <Table
        columns={columns}
        dataSource={grouped}
        pagination={true}
        size="middle"
        bordered
        loading={loading}
        scroll={{ x: 'max-content' }}
      />
      <ModalEditShift
          visible={isModalEditVisible}
          onCancel={() => setIsModalEditVisible(false)}
          onOk={()=>{}}
          shiftData={selectedRecord}
          employeeList={employeeList}
        />
      </>
  );
};

export default ShiftTable;
