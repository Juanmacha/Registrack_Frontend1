import React, { useState } from "react";
import {
  CiGrid41,
  CiViewList,
  CiUser,
  CiCalendar,
  CiSettings,
  CiCircleCheck,
} from "react-icons/ci";
import { BsBullseye, BsCreditCard } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { LuBriefcase, LuUsers } from "react-icons/lu";

const SideBarGeneral = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const iconClass = "text-gray-600 w-6 h-6 flex-shrink-0";
  const baseLinkClasses =
    "flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 transition-all";
  const activeLinkClasses = "bg-gray-100 border-l-4 border-blue-500";

  const menuItems = [
    { label: "Dashboard", icon: CiGrid41, to: "/admin/dashboard" },
    { label: "Usuarios", icon: CiUser, to: "/admin/gestionUsuarios" },
    { label: "Empleados", icon: LuBriefcase, to: "/admin/empleados" },
    // Solicitudes va como dropdown abajo
    { label: "Citas", icon: CiCalendar, to: "/admin/calendario" },
    { label: "Pagos", icon: BsCreditCard, to: "/admin/pagos" },
    { label: "Clientes", icon: LuUsers, to: "/admin/gestionClientes" },
    { label: "Configuración", icon: CiSettings, to: "/admin/roles" },
  ];

  const handleToggleDropdown = () => setIsDropdownOpen(prev => !prev);
  const handleSidebarLeave = () => setIsDropdownOpen(false);

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
              src="/images/logo.png"
              alt="Logo"
              className="w-12 h-auto group-hover:w-32 transition-all duration-300"
            />
          </div>

          {/* Navegación */}
          <nav className="space-y-2">
            {menuItems.slice(0, 3).map(({ label, icon: Icon, to }) => (
              <Link to={to} key={to} className="no-underline block">
                <div
                  className={`${baseLinkClasses} ${
                    location.pathname === to ? activeLinkClasses : ""
                  }`}
                >
                  <Icon className={iconClass} />
                  <span className="text-gray-700 text-sm font-medium hidden group-hover:block">
                    {label}
                  </span>
                </div>
              </Link>
            ))}

            {/* Dropdown: Solicitudes */}
            <div className="relative">
              <div
                onClick={handleToggleDropdown}
                role="button"
                aria-expanded={isDropdownOpen}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <CiViewList className={iconClass} />
                  <span className="text-gray-700 text-sm font-medium hidden group-hover:block">
                    Solicitudes
                  </span>
                </div>
                <FiChevronRight
                  className={`text-gray-600 transition-transform duration-300 hidden group-hover:block ${
                    isDropdownOpen ? "rotate-90" : ""
                  }`}
                />
              </div>

              <div
                className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${
                  isDropdownOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                }`}
              >
                <Link to="/admin/ventasServiciosProceso" className="no-underline block">
                  <div
                    className={`${baseLinkClasses} ${
                      location.pathname === "/admin/ventasServiciosProceso"
                        ? activeLinkClasses
                        : ""
                    }`}
                  >
                    <BsBullseye className={iconClass} />
                    <span className="text-gray-700 text-sm font-medium hidden group-hover:block">
                      En proceso
                    </span>
                  </div>
                </Link>

                <Link to="/admin/ventasServiciosFin" className="no-underline block">
                  <div
                    className={`${baseLinkClasses} ${
                      location.pathname === "/admin/ventasServiciosFin"
                        ? activeLinkClasses
                        : ""
                    }`}
                  >
                    <CiCircleCheck className={iconClass} />
                    <span className="text-gray-700 text-sm font-medium hidden group-hover:block">
                      Terminadas
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {menuItems.slice(3).map(({ label, icon: Icon, to }) => (
              <Link to={to} key={to} className="no-underline block">
                <div
                  className={`${baseLinkClasses} ${
                    location.pathname === to ? activeLinkClasses : ""
                  }`}
                >
                  <Icon className={iconClass} />
                  <span className="text-gray-700 text-sm font-medium hidden group-hover:block">
                    {label}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default SideBarGeneral;
