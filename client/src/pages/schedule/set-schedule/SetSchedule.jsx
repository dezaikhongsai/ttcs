import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select, message, DatePicker } from 'antd';
import dayjs from 'dayjs';

const ManageSchedule = () => {
  // Hard-coded data
  const employees = [
    { id: 'emp1', name: 'Nguyễn Văn A' },
    { id: 'emp2', name: 'Trần Thị B' },
  ];

  const shifts = [
    { id: 'shift1', name: 'Ca sáng', time: '08:00 - 14:00' },
    { id: 'shift2', name: 'Ca tối', time: '14:00 - 20:00' },
  ];

  const [schedules, setSchedules] = useState([
    {
      id: '1',
      employeeId: 'emp1',
      employeeName: 'Nguyễn Văn A',
      date: '2025-04-25',
      shiftId: 'shift1',
      shiftName: 'Ca sáng',
      status: 'pending',
    },
    {
      id: '2',
      employeeId: 'emp2',
      employeeName: 'Trần Thị B',
      date: '2025-04-26',
      shiftId: 'shift2',
      shiftName: 'Ca tối',
      status: 'approved',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();

  // Handle approve schedule
  const handleApprove = (id) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, status: 'approved' } : schedule
      )
    );
    message.success('Duyệt ca thành công!');
  };

  // Handle reject schedule
  const handleReject = (id) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, status: 'rejected' } : schedule
      )
    );
    message.success('Từ chối ca thành công!');
  };

  // Handle edit schedule
  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setIsModalVisible(true);
    form.setFieldsValue({
      employee: schedule.employeeId,
      shift: schedule.shiftId,
      date: dayjs(schedule.date),
    });
  };

  // Handle modal submit for editing
  const handleEditOk = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedSchedule = {
          ...selectedSchedule,
          employeeId: values.employee,
          employeeName: employees.find((emp) => emp.id === values.employee).name,
          shiftId: values.shift,
          shiftName: shifts.find((shift) => shift.id === values.shift).name,
          date: values.date.format('YYYY-MM-DD'),
        };
        setSchedules(
          schedules.map((schedule) =>
            schedule.id === selectedSchedule.id ? updatedSchedule : schedule
          )
        );
        message.success('Cập nhật ca thành công!');
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  // Handle assign new shift
  const handleAssignOk = () => {
    assignForm
      .validateFields()
      .then((values) => {
        const newSchedule = {
          id: String(schedules.length + 1),
          employeeId: values.employee,
          employeeName: employees.find((emp) => emp.id === values.employee).name,
          date: values.date.format('YYYY-MM-DD'),
          shiftId: values.shift,
          shiftName: shifts.find((shift) => shift.id === values.shift).name,
          status: 'approved',
        };
        setSchedules([...schedules, newSchedule]);
        message.success('Phân ca thành công!');
        setIsAssignModalVisible(false);
        assignForm.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAssignCancel = () => {
    setIsAssignModalVisible(false);
    assignForm.resetFields();
  };

  // Table columns
  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'employeeName',
      key: 'employeeName',
      filters: employees.map((emp) => ({
        text: emp.name,
        value: emp.id,
      })),
      onFilter: (value, record) => record.employeeId === value,
    },
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
      filters: [
        { text: 'Chờ duyệt', value: 'pending' },
        { text: 'Đã duyệt', value: 'approved' },
        { text: 'Từ chối', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (text) =>
        text === 'pending' ? 'Chờ duyệt' : text === 'approved' ? 'Đã duyệt' : 'Từ chối',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          {record.status === 'pending' && (
            <>
              <Button type="primary" onClick={() => handleApprove(record.id)}>
                Duyệt
              </Button>
              <Button danger onClick={() => handleReject(record.id)}>
                Từ chối
              </Button>
            </>
          )}
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quản lý lịch làm việc</h2>
        <Button
          type="primary"
          onClick={() => setIsAssignModalVisible(true)}
        >
          Phân ca
        </Button>
      </div>

      {/* Schedule Table */}
      <Table
        columns={columns}
        dataSource={schedules}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      {/* Modal for editing schedule */}
      <Modal
        title="Chỉnh sửa ca làm việc"
        open={isModalVisible}
        onOk={handleEditOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="employee"
            label="Nhân viên"
            rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
          >
            <Select placeholder="Chọn nhân viên">
              {employees.map((emp) => (
                <Select.Option key={emp.id} value={emp.id}>
                  {emp.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="shift"
            label="Ca"
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

      {/* Modal for assigning new shift */}
      <Modal
        title="Phân ca làm việc"
        open={isAssignModalVisible}
        onOk={handleAssignOk}
        onCancel={handleAssignCancel}
        okText="Phân ca"
        cancelText="Hủy"
      >
        <Form form={assignForm} layout="vertical">
          <Form.Item
            name="employee"
            label="Nhân viên"
            rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
          >
            <Select placeholder="Chọn nhân viên">
              {employees.map((emp) => (
                <Select.Option key={emp.id} value={emp.id}>
                  {emp.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="shift"
            label="Ca"
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
    </div>
  );
};

export default ManageSchedule;