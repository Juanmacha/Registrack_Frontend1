// src/features/dashboard/layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import SideBarGeneral from "../../dashboard/components/sideBarGeneral";
import NavBar from "../../dashboard/components/navBarGeneral";

const AdminLayout = () => {
  return (
    <div className="bg-[#eceded] flex h-screen w-screen overflow-hidden">
      <SideBarGeneral />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <NavBar titulo="Panel de Administración" />
        <div className="flex-1 mt-10 px-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
