import React, { useState } from "react";
import {
  CiGrid41,
  CiViewList,
  CiUser,
  CiCalendar,
  CiSettings,
  CiGrid2H,
  CiCircleCheck,
} from "react-icons/ci";
import { BsBullseye } from "react-icons/bs";
import { SlArrowRight } from "react-icons/sl";
import { Link } from "react-router-dom";


const SideBarGeneral = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSidebarLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="h-screen">
      <div
        className="flex flex-col group transition-all duration-300 h-full"
        onMouseLeave={handleSidebarLeave}
      >
        <aside className="bg-white hover:w-64 w-20 transition-all duration-300 ease-in-out text-gray-900 p-3 h-full border-r border-gray-300 shadow-md relative">

          {/* Logo */}
          <div className="flex justify-center items-center mb-8">
            <img
              src="/images/logo.jpeg"
              alt="Logo"
              className="w-12 h-auto group-hover:w-32 transition-all duration-300"
            />
          </div>

          {/* Navegación */}
          <nav className="space-y-2">

            {/* Dashboard */}
            <Link to="/dashboard" className="no-underline block">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-all duration-200">
                <CiGrid41 className="text-gray-600 w-6 h-6" />
                <span className="text-gray-700 text-sm font-medium hidden group-hover:block">
                  Dashboard
                </span>
              </div>
            </Link>

            {/* Dropdown */}
            <div className="relative">
              <div
                onClick={handleToggleDropdown}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-200 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <CiViewList className="text-gray-600 w-6 h-6" />
                  <span className="text-gray-700 text-sm font-medium hidden group-hover:block">
                    Solicitudes
                  </span>
                </div>
                <div className="hidden group-hover:block text-gray-600 transition-transform duration-300 transform"
                  style={{ transform: isDropdownOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                  <SlArrowRight />
                </div>
              </div>

              {/* Subopciones con animación */}
              <div
                className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${
                  isDropdownOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'
                }`}
              >
                <Link to="/ventasServiciosProceso" className="no-underline block">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-all duration-200">
                    <BsBullseye className="text-gray-600 w-6 h-6" />
                    <span className="text-gray-700 text-sm font-medium hidden group-hover:block">
                      En proceso
                    </span>
                  </div>
                </Link>

                <Link to="/ventasServiciosFin" className="no-underline block">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-all duration-200">
                    <CiCircleCheck className="text-gray-600 w-6 h-6" />
                    <span className="text-gray-700 text-sm font-medium hidden group-hover:block">
                      Terminadas
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Otros ítems */}
            <Link to="#" className="no-underline block">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-all duration-200">
                <CiGrid2H className="text-gray-600 w-6 h-6" />
                <span className="text-gray-700 text-sm font-medium hidden group-hover:block">
                  Ventas
                </span>
              </div>
            </Link>

            <Link to="#" className="no-underline block">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-all duration-200">
                <CiCalendar className="text-gray-600 w-6 h-6" />
                <span className="text-gray-700 text-sm font-medium hidden group-hover:block">
                  Calendario
                </span>
              </div>
            </Link>

            <Link to="#" className="no-underline block">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-all duration-200">
                <CiUser className="text-gray-600 w-6 h-6" />
                <span className="text-gray-700 text-sm font-medium hidden group-hover:block">
                  Usuarios
                </span>
              </div>
            </Link>

            <Link to="#" className="no-underline block">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-all duration-200">
                <CiSettings className="text-gray-600 w-6 h-6" />
                <span className="text-gray-700 text-sm font-medium hidden group-hover:block">
                  Configuración
                </span>
              </div>
            </Link>
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default SideBarGeneral;
