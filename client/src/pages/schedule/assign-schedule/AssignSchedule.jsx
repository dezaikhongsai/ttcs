import React, { useState } from 'react';
import { Calendar, Modal, Form, Select, Button, Table, message } from 'antd';
import dayjs from 'dayjs';

const ShiftRegistration = () => {
  // Hard-coded data
  const shifts = [
    { id: 'shift1', name: 'Ca sáng', time: '08:00 - 14:00' },
    { id: 'shift2', name: 'Ca tối', time: '14:00 - 20:00' },
  ];

  const [schedules, setSchedules] = useState([
    {
      id: '1',
      date: '2025-04-25',
      shiftName: 'Ca sáng',
      status: 'pending',
    },
    {
      id: '2',
      date: '2025-04-26',
      shiftName: 'Ca tối',
      status: 'approved',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();

  // Handle date selection
  const handleDateSelect = (value) => {
    setSelectedDate(value);
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newSchedule = {
          id: String(schedules.length + 1),
          date: selectedDate.format('YYYY-MM-DD'),
          shiftName: shifts.find((shift) => shift.id === values.shift).name,
          status: 'pending',
        };
        setSchedules([...schedules, newSchedule]);
        message.success('Đăng ký ca thành công!');
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  // Handle modal cancel
  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  // Handle cancel schedule
  const handleCancelSchedule = (id) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
    message.success('Hủy ca thành công!');
  };

  // Table columns
  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (text) => dayjs(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Ca',
      dataIndex: 'shiftName',
      key: 'shiftName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (text === 'pending' ? 'Chờ duyệt' : 'Đã duyệt'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) =>
        record.status === 'pending' ? (
          <Button
            danger
            onClick={() => handleCancelSchedule(record.id)}
          >
            Hủy
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Đăng ký lịch làm việc</h2>
      
      {/* Calendar */}
      <Calendar
        onSelect={handleDateSelect}
        disabledDate={(current) =>
          current && current < dayjs().startOf('day')
        }
      />

      {/* Modal for shift registration */}
      <Modal
        title={`Đăng ký ca làm việc cho ngày ${selectedDate?.format('DD/MM/YYYY')}`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Đăng ký"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="shift"
            label="Chọn ca"
            rules={[{ required: true, message: 'Vui lòng chọn ca!' }]}
          >
            <Select placeholder="Chọn ca làm việc">
              {shifts.map((shift) => (
                <Select.Option key={shift.id} value={shift.id}>
                  {`${shift.name} (${shift.time})`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Schedule Table */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Lịch đã đăng ký</h3>
      <Table
        columns={columns}
        dataSource={schedules}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default ShiftRegistration;