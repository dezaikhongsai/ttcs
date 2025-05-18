import { Table, Space, Tag, Typography, Button, Modal, Form, DatePicker, Select, Card, Input, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import ModalEditShift from './ModalEditShift';
const { Title } = Typography;

const ShiftTable = ({ data, employeeList = [], loading, onSetShift, onEdit, onDelete }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleEdit = (shiftRecord) => {
    console.log("Chỉnh sửa :", shiftRecord);
    setSelectedRecord(shiftRecord);
    setIsModalEditVisible(true);
  };

  const handleShiftClick = (record) => {
    console.log("Full record:", record);
    console.log("WorkSchedule:", record.workSchedule);
    
    // Đảm bảo record là một object đơn giản
    const selectedShiftData = {
      _id: record._id,
      key: record.key,
      workSchedule: record.workSchedule,
      workScheduleId: record.workScheduleObj?._id,
      w_id: record.workScheduleObj?._id,
      timeStart: record.timeStart,
      timeEnd: record.timeEnd,
      employees: record.employees,
      date: record.date
    };
    
    setSelectedShift(selectedShiftData);
    console.log("Selected shift:", selectedShiftData);
    setIsModalEditVisible(true);
  };

  // const handleRowClick = (record) => {
  //   console.log("Row clicked:", record);
  //   setSelectedShift(record);
  //   // Có thể thêm xử lý khác ở đây
  // };

  // Hàm để lấy màu sắc dựa trên tên ca
  const getShiftColor = (shiftName) => {
    switch(shiftName) {
      case 'Ca sáng':
        return '#87d068';
      case 'Ca chiều':
        return '#108ee9';
      case 'Ca tối':
        return '#722ed1';
      default:
        return 'default';
    }
  };

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
  const grouped = [];
  let sttCounter = 1;

  enrichedData.forEach(dayData => {
    const caMap = {};

    dayData.shifts.forEach(shift => {
      const caKey = `${shift.workSchedule.workSchedule}-${shift.workSchedule.timeStart}-${shift.workSchedule.timeEnd}`;
      if (!caMap[caKey]) {
        caMap[caKey] = {
          key: `${dayData.day}-${caKey}`,
          _id: dayData._id,
          date: dayData.day,
          stt: null,
          workSchedule: shift.workSchedule.workSchedule,
          workScheduleObj: shift.workSchedule,
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

  // Hàm kiểm tra xem click có nằm trong các cột được phép không
  const isClickableColumn = (columnKey) => {
    return ['workSchedule', 'time', 'employees'].includes(columnKey);
  };

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
      render: (workSchedule, record) => (
        <div data-column-key="workSchedule">
          <Tooltip title="Nhấn để chỉnh sửa">
            <Tag
              color={getShiftColor(workSchedule)}
              style={{ 
                cursor: 'pointer',
                padding: '5px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onClick={() => handleShiftClick(record)}
            >
              <ClockCircleOutlined /> {workSchedule}
            </Tag>
          </Tooltip>
        </div>
      )
    },
    {
      title: 'Thời gian',
      key: 'time',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="Nhấn để chỉnh sửa" onClick={() => handleShiftClick(record)}>
          <div data-column-key="time" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Tag color="success">
            <ClockCircleOutlined /> Bắt đầu: {record.timeStart}
          </Tag>
          <Tag color="error">
            <ClockCircleOutlined /> Kết thúc: {record.timeEnd}
          </Tag>
        </div>
        </Tooltip>
      ),
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employees',
      key: 'employees',
      align: 'center',
      render: (employees, record) => (
        <Tooltip title="Nhấn để chỉnh sửa">
          <div data-column-key="employees" onClick={() => handleShiftClick(record)}>
            <Space wrap>
              {[...new Map(employees.map(emp => [emp._id, emp])).values()].map(emp => (
                <Tag 
                  key={emp._id || emp.employee._id} // Thêm key prop
                  color="blue"
                >
                  {emp.employee?.name || emp.name}
                </Tag>
              ))}
            </Space>
          </div>
        </Tooltip>
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
                onClick={() => onDelete?.(record)}
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
        onRow={(record) => ({
          onClick: (e) => {
            // Kiểm tra xem click có nằm trong các cột được phép không
            const targetCell = e.target.closest('td');
            if (targetCell) {
              const columnKey = targetCell.getAttribute('data-column-key');
              if (isClickableColumn(columnKey)) {
                handleRowClick(record);
              }
            }
          },
          onMouseEnter: () => setHoveredRow(record.key),
          onMouseLeave: () => setHoveredRow(null),
          style: {
            cursor: 'pointer',
            backgroundColor: hoveredRow === record.key ? '#f5f5f5' : 'white',
            transition: 'background-color 0.3s'
          }
        })}
        rowClassName={(record) => 
          selectedShift?.key === record.key ? 'selected-row' : ''
        }
      />
      <ModalEditShift
        visible={isModalEditVisible}
        onCancel={() => setIsModalEditVisible(false)}
        onSave={() => {}}
        shiftData={selectedShift}
        // employeeList={employeeList}
        loading={loading}
      />
    </>
  );
};

export default ShiftTable;
