import React, { useContext } from "react";
import { TableOutlined, PieChartOutlined, DollarOutlined, LogoutOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Menu, Button } from "antd";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MenuHome = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
    <div
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-md border-r transition-all duration-300 flex flex-col"
      style={{ width: collapsed ? "64px" : "240px" }}
    >
      {/* Nút Toggle NẰM TRONG SIDEBAR */}
      <div className="p-2">
        <Button
          type="text"
          className="w-full flex items-center justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined className="text-xl" /> : <MenuFoldOutlined className="text-xl" />}
        </Button>
      </div>

      {/* Menu chính */}
      <Menu
        className="w-full flex-1"
        defaultSelectedKeys={["dashboard"]}
        mode="inline"
        inlineCollapsed={collapsed}
        items={items}
        onClick={handleMenuClick}
      />
    </div>
  );
};

export default MenuHome;
