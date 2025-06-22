import React from "react";
import SideBarGeneral from "../../components/sideBarGeneral";
import TablaVentasProceso from "./components/tablaVentasProceso";
import NavBar from "../../components/navBarGeneral"; // Asegúrate que la ruta sea correcta

const GestionVentasServiciosProceso = () => {
  return (
    <div className="bg-[#eceded] flex h-screen w-screen overflow-hidden">
      {/* Sidebar con ancho fijo */}
      <SideBarGeneral />

      {/* Contenedor del contenido principal */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Navbar superior */}
        <NavBar titulo="Solicitudes en Proceso" />

        {/* Contenido de la tabla */}
        <div className="flex-1 flex mt-12 justify-center">
          <div className="w-full  px-4">
            <TablaVentasProceso />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionVentasServiciosProceso;
