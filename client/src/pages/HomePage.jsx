import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import MenuHome from "../components/Menu/Menu";
import Header from "../components/Header/Header";
import logo from '../assets/ttcslogo.png';

const HomePage = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header cố định */}
      <Header logo={logo} className="fixed w-full top-0 left-0" />

      {/* Sidebar + Nội dung */}
      <div className="flex flex-grow pt-16">
        {/* Sidebar cố định */}
        <MenuHome collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Nội dung chính, cập nhật khoảng cách `ml` để tránh bị che */}
        <div className={`flex-grow p-6 bg-gray-100 transition-all duration-300 ${collapsed ? "ml-[64px]" : "ml-[240px]"}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
