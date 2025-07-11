import React, { useState } from "react";
import {
  TbLayoutGrid,
  TbUser,
  TbUsers,
  TbBriefcase,
  TbCalendar,
  TbCreditCard,
  TbListDetails,
  TbBox,
  TbSettings,
  TbCircleCheck,
  TbUserSquareRounded
} from "react-icons/tb";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const SideBarGeneral = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const iconClass = "text-gray-600 w-5 h-5 flex-shrink-0";
  const baseLinkClasses =
    "flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 transition-all text-[0.95rem]";
  const activeLinkClasses = "bg-gray-100 border-l-4 border-blue-500";

  const menuItems = [
    { label: "Dashboard", icon: TbLayoutGrid, to: "/admin/dashboard" },
    { label: "Usuarios", icon: TbUser, to: "/admin/gestionUsuarios" },
    { label: "Empleados", icon: TbUsers, to: "/admin/empleados" },
    // Solicitudes va como dropdown abajo
    { label: "Citas", icon: TbCalendar, to: "/admin/calendario" },
    { label: "Pagos", icon: TbCreditCard, to: "/admin/pagos" },
    { label: "Clientes", icon: TbUserSquareRounded, to: "/admin/gestionClientes" },
    { label: "Servicios", icon: TbBox, to: "/admin/servicios" }, // Cambiado a CiBoxList
    { label: "Configuración", icon: TbSettings, to: "/admin/roles" },
  ];

  const handleToggleDropdown = () => setIsDropdownOpen(prev => !prev);
  const handleSidebarLeave = () => setIsDropdownOpen(false);

  return (
    <div className="h-screen">
      <div
        className="flex flex-col group transition-all duration-300 h-full"
        onMouseLeave={handleSidebarLeave}
      >
        <aside className="sidebar-responsive w-20 group-hover:w-64 transition-all duration-300 ease-in-out text-gray-900 p-3 h-full">
          {/* Logo */}
          <div className="flex justify-center items-center mb-8">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-12 h-auto group-hover:w-32 transition-all duration-300"
            />
          </div>
          {/* Navegación */}
          <nav className="space-y-2 h-full overflow-y-hidden group-hover:overflow-y-auto pr-1">
            {menuItems.slice(0, 3).map(({ label, icon: Icon, to }) => (
              <Link to={to} key={to} className="no-underline block">
                <div
                  className={`${baseLinkClasses} ${location.pathname === to ? activeLinkClasses : ""}`}
                >
                  <Icon className={iconClass} />
                  <span className="text-gray-700 text-[0.95rem] font-medium hidden group-hover:inline">{label}</span>
                </div>
              </Link>
            ))}
            {/* Dropdown: Solicitudes */}
            <div className="relative">
              <div
                onClick={handleToggleDropdown}
                role="button"
                aria-expanded={isDropdownOpen}
                className={`${baseLinkClasses} cursor-pointer justify-between`}
              >
                <div className="flex items-center space-x-2">
                  <TbListDetails className={iconClass} />
                  <span className="text-gray-700 text-[0.95rem] font-medium hidden group-hover:inline">Solicitudes</span>
                </div>
                <FiChevronRight
                  className={`text-gray-600 transition-transform duration-300 hidden group-hover:inline ${isDropdownOpen ? "rotate-90" : ""}`}
                />
              </div>
              <div
                className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${isDropdownOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
              >
                <Link to="/admin/ventasServiciosProceso" className="no-underline block">
                  <div
                    className={`${baseLinkClasses} ${location.pathname === "/admin/ventasServiciosProceso" ? activeLinkClasses : ""}`}
                  >
                    <TbListDetails className={iconClass} />
                    <span className="text-gray-700 text-[0.95rem] font-medium hidden group-hover:inline">En proceso</span>
                  </div>
                </Link>
                <Link to="/admin/ventasServiciosFin" className="no-underline block">
                  <div
                    className={`${baseLinkClasses} ${location.pathname === "/admin/ventasServiciosFin" ? activeLinkClasses : ""}`}
                  >
                    <TbCircleCheck className={iconClass} />
                    <span className="text-gray-700 text-[0.95rem] font-medium hidden group-hover:inline">Terminadas</span>
                  </div>
                </Link>
              </div>
            </div>
            {menuItems.slice(3).map(({ label, icon: Icon, to }) => (
              <Link to={to} key={to} className="no-underline block">
                <div
                  className={`${baseLinkClasses} ${location.pathname === to ? activeLinkClasses : ""}`}
                >
                  <Icon className={iconClass} />
                  <span className="text-gray-700 text-[0.95rem] font-medium hidden group-hover:inline">{label}</span>
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
