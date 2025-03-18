import React, { useState } from "react";
import { Space, Table } from "antd";
import EmployeeModal from "../Modal/EmployeeModal"; // Import modal

const TableGrid = ({ data }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedEmployee(null);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Mã",
      dataIndex: "employeeCode",
      key: "employeeCode",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Chức vụ",
      dataIndex: "staff",
      key: "staff",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} rowKey="id" />
      <EmployeeModal 
        visible={isModalVisible} 
        onClose={handleCloseModal} 
        employee={selectedEmployee} 
      />
    </>
  );
};

export default TableGrid;
