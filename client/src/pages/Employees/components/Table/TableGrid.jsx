import React, { useState } from "react";
import { Space, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import EmployeeModal from "../EmployeeModal/EmployeeModal";
import DeleteConfirmModal from "../EmployeeModal/DeleteConfirm";
import { deleteEmployee } from "../../services/employeesService";

const TableGrid = ({ data, setEmployees }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedEmployee(null);
  };

  const showDeleteConfirm = (employeeId) => {
    setDeleteEmployeeId(employeeId);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {

    if (!deleteEmployeeId) return;
    try {
      await deleteEmployee(deleteEmployeeId);
      window.location.reload(); // Tải lại trang
    } catch (error) {
      console.error("Lỗi khi xóa nhân viên:", error);
    }
    setIsDeleteModalVisible(false);
    setDeleteEmployeeId(null);
  };

  const columns = [
    { title: "STT", dataIndex: "key", key: "key" },
    { title: "Mã", dataIndex: "employeeCode", key: "employeeCode" },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Chức vụ", dataIndex: "staff", key: "staff" },
    { title: "Ngày sinh", dataIndex: "dob", key: "dob" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined style={{ color: "#1890ff", cursor: "pointer" }} onClick={() => handleEdit(record)} />
          <DeleteOutlined style={{ color: "red", cursor: "pointer" }} onClick={() => showDeleteConfirm(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} rowKey="id" />
      <EmployeeModal visible={isModalVisible} onClose={handleCloseModal} employee={selectedEmployee} />
      <DeleteConfirmModal
        visible={isDeleteModalVisible}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        title="Xác nhận xóa"
        content="Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này không thể hoàn tác."
      />
    </>
  );
};

export default TableGrid;
