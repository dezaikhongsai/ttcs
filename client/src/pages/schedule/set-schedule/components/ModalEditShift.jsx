import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  DatePicker,
  Select,
  TimePicker,
  Space,
  Divider,
} from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const ModalEditShift = ({ visible, onCancel, onOk, shiftData, employeeList }) => {
  const [form] = Form.useForm();
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    if (shiftData && shiftData.workSchedule) {
      form.setFieldsValue({
        date: dayjs(shiftData.day),
        workSchedule: shiftData.workSchedule.workSchedule,
        timeRange: [
          dayjs(shiftData.workSchedule.timeStart, 'HH:mm'),
          dayjs(shiftData.workSchedule.timeEnd, 'HH:mm'),
        ],
      });
  
      setSelectedEmployees(
        (shiftData.employees || []).map(emp => ({
          employeeId: emp.employee?._id,
          roleInShift: emp.roleInShift,
        }))
      );
    }
  }, [shiftData, form]);

  const handleEmployeeChange = (value) => {
    const updated = value.map(empId => {
      const existing = selectedEmployees.find(emp => emp.employeeId === empId);
      return existing || { employeeId: empId, roleInShift: 'Nhân viên' };
    });
    setSelectedEmployees(updated);
  };

  const handleRoleChange = (empId, newRole) => {
    setSelectedEmployees(prev =>
      prev.map(emp => emp.employeeId === empId ? { ...emp, roleInShift: newRole } : emp)
    );
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const result = {
        day: values.date.format('YYYY-MM-DD'),
        workSchedule: {
          workSchedule: values.workSchedule,
          timeStart: values.timeRange[0].format('HH:mm'),
          timeEnd: values.timeRange[1].format('HH:mm'),
        },
        employees: selectedEmployees.map(emp => ({
          employee: emp.employeeId,
          roleInShift: emp.roleInShift,
        })),
      };
      onOk(result);
    });
  };

  return (
    <Modal
      title="Chỉnh sửa ca làm"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Lưu"
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="workSchedule" label="Ca làm" rules={[{ required: true }]}>
          <Select placeholder="Chọn ca">
            <Option value="Ca sáng">Ca sáng</Option>
            <Option value="Ca chiều">Ca chiều</Option>
            <Option value="Ca tối">Ca tối</Option>
          </Select>
        </Form.Item>

        <Form.Item name="timeRange" label="Thời gian" rules={[{ required: true }]}>
          <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Nhân viên tham gia">
          <Select
            mode="multiple"
            value={selectedEmployees.map(emp => emp.employeeId)}
            onChange={handleEmployeeChange}
            placeholder="Chọn nhân viên"
            style={{ width: '100%' }}
          >
            {employeeList.map(emp => (
              <Option key={emp._id} value={emp._id}>{emp.name}</Option>
            ))}
          </Select>
        </Form.Item>

        {selectedEmployees.length > 0 && (
          <>
            <Divider />
            <div><strong>Vai trò trong ca:</strong></div>
            {selectedEmployees.map(emp => (
              <Space key={emp.employeeId} style={{ display: 'flex', marginTop: 8 }}>
                <span>{employeeList.find(e => e._id === emp.employeeId)?.name || 'Không rõ'}</span>
                <Select
                  value={emp.roleInShift}
                  onChange={val => handleRoleChange(emp.employeeId, val)}
                  style={{ width: 160 }}
                >
                  <Option value="Pha chế">Pha Chế</Option>
                  <Option value="Phục vụ">Phục vụ</Option>
                  <Option value="Thu ngân">Thu ngân</Option>
                </Select>
              </Space>
            ))}
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ModalEditShift;
