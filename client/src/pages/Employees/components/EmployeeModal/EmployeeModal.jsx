import React from "react";
import { Modal, Form, Input } from "antd";

const EmployeeModal = ({ visible, onClose, employee }) => {
  return (
    <Modal 
      title="Thông tin nhân viên" 
      open={visible} 
      onCancel={onClose} 
      footer={null} 
    >
      <Form layout="vertical">
        <Form.Item label="Mã nhân viên">
          <Input value={employee?.employeeCode}  />
        </Form.Item>
        <Form.Item label="Họ và tên">
          <Input value={employee?.name} disabled />
        </Form.Item>
        <Form.Item label="Chức vụ">
          <Input value={employee?.staff} disabled />
        </Form.Item>
        <Form.Item label="Ngày sinh">
          <Input value={employee?.dob} disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;
