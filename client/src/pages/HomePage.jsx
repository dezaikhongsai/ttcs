import React from "react";
import { Outlet } from "react-router-dom";
import MenuHome from "../components/Menu/Menu";
import Header from "../components/Header/Header";
import logo from '../assets/ttcslogo.png'

const HomePage = () => {
  return (
    <>
      <Header logo={logo}/>
      <div className="flex min-h-screen">
     
      {/* Sidebar + Header */}
      <MenuHome />

      {/* Nội dung chính */}
      <div className="">
        <Outlet />
      </div>
    </div>
    </>
  );
};

export default HomePage;
