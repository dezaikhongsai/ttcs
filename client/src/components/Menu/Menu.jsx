import React, { useState, useContext } from "react";
import { TableOutlined, PieChartOutlined, DollarOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import Header from "../Header/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ToggleMenu from "../Button/ToggleMenu";

const MenuHome = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  const userRole = user?.role;

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      handleLogout();
    } else {
      navigate(`/home/${e.key}`);
    }
  };

  const items = [
    { key: "dashboard", label: "Dashboard", icon: <PieChartOutlined /> },
    {
      key: "schedule",
      label: "Lịch làm",
      icon: <TableOutlined />,
      children: [
        ...(userRole !== "staff" ? [{ key: "schedule/manage", label: "Xếp lịch" }] : []),
        { key: "schedule/submit", label: "Đăng ký lịch làm" },
      ],
    },
    { type: "divider" },
    {
      key: "payrolls",
      label: "Bảng lương",
      icon: <DollarOutlined />,
      children: [
        ...(userRole !== "staff" ? [{ key: "payrolls/employees", label: "Lương nhân viên" }] : []),
        { key: "payrolls/personal", label: "Lương cá nhân" },
      ],
    },
    { type: "divider" },
    {
      key: "employees",
      label: "Nhân sự",
      icon: <UserOutlined />,
      children: [
        ...(userRole !== "staff" ? [{ key: "employees/infor", label: "Thông tin nhân viên" }] : []),
        { key: "employees/personal", label: "Thông tin cá nhân" },
      ],
    },
    { type: "divider" },
    {
      key: "logout",
      label: <span className="text-red-500 font-semibold">Đăng xuất</span>,
      icon: <LogoutOutlined className="text-red-500" />,
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      <ToggleMenu collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      <div className="flex flex-1">
        <div className={`transition-all duration-300 ${collapsed ? "w-16" : "w-60"} bg-white shadow-md border-r`}>
          <Menu
            className="w-full h-full"
            defaultSelectedKeys={["dashboard"]}
            mode="inline"
            inlineCollapsed={collapsed}
            items={items}
            onClick={handleMenuClick}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuHome;
