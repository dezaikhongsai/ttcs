import React, { useEffect, useState } from "react";
import { Input, Button, Select } from "antd";
import { fetchEmployees } from "./services/employeesService";
import TableGrid from "./components/Table/TableGrid";
import { useOutletContext } from "react-router-dom";
import AddEmployeeModal from "./components/EmployeeModal/AddEmployeeModal";
import { UserOutlined, CoffeeOutlined, ShopOutlined, CrownOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const EmployeeInfor = () => {
  const { userRole } = useOutletContext();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees(setEmployees, setLoading);
  }, []);

  useEffect(() => {
    const filteredData = employees.filter((emp) => {
      const matchesName = searchTerm ? emp.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchesRole = filterRole ? emp.staff === filterRole : true;
      return matchesName && matchesRole;
    });

    setFilteredEmployees(filteredData);
  }, [searchTerm, filterRole, employees]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 w-2/3">
          <Search
            placeholder="Tìm kiếm nhân viên theo tên"
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-2/3"
          />
          <Select placeholder="Chọn chức vụ" allowClear value={filterRole} onChange={setFilterRole} className="w-1/3">
             <Option value="Thu ngân">
              <ShopOutlined className="mr-2" /> Thu ngân
            </Option>
            <Option value="Pha chế">
              <CoffeeOutlined className="mr-2" /> Pha chế
            </Option>
            <Option value="Phục vụ">
              <UserOutlined className="mr-2" /> Phục vụ
            </Option>
              <Option value="Quản lý">
                <CrownOutlined className="mr-2" /> Quản lý
              </Option>
          </Select>
        </div>
        <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
          Thêm nhân viên
        </Button>
      </div>

      <TableGrid data={filteredEmployees} />

      {/* Sử dụng modal thêm nhân viên */}
      <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={(data) => console.log(data)} userRole={userRole} />
    </div>
  );
};

export default EmployeeInfor;
