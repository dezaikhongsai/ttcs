import React from "react";
import { GithubOutlined } from "@ant-design/icons";

const Header = ({ logo }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-16 flex items-center justify-between pl-4 pr-6 bg-white shadow-md z-50">
      <div className="flex items-center gap-3">
        {logo && <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />}
        <h2 className="text-gray-700 text-xl font-semibold">Quản lý nhân sự</h2>
      </div>
      <div id="avatar" className="flex items-center">
        <GithubOutlined className="text-2xl cursor-pointer" />
      </div>
    </div>
  );
};

export default Header;
