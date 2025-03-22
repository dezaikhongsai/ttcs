import React from "react";
import { Modal, Form, Input, Select, DatePicker, Button } from "antd";
import { UserOutlined, CoffeeOutlined, ShopOutlined, CrownOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddEmployeeModal = ({ isOpen, onClose, onSubmit, userRole }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Thêm nhân viên:", values);
    onSubmit(values);
    form.resetFields();
    onClose();
  };

  return (
    <Modal title="Thêm nhân viên" open={isOpen} onCancel={onClose} footer={null}>
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item label="Tên nhân viên" name="name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Chức vụ" name="role" rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}>
          <Select placeholder="Chọn chức vụ">
            <Option value="Thu ngân">
              <ShopOutlined className="mr-2" /> Thu ngân
            </Option>
            <Option value="Pha chế">
              <CoffeeOutlined className="mr-2" /> Pha chế
            </Option>
            <Option value="Phục vụ">
              <UserOutlined className="mr-2" /> Phục vụ
            </Option>
            {userRole === "admin" && (
              <Option value="Quản lý">
                <CrownOutlined className="mr-2" /> Quản lý
              </Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item label="Ngày sinh" name="dob">
          <DatePicker className="w-full" />
        </Form.Item>

        <Button type="primary" htmlType="submit" className="w-full">
          Thêm
        </Button>
      </Form>
    </Modal>
  );
};

export default AddEmployeeModal;
