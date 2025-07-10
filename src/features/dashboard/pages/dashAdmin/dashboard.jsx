import React from "react";
import Dashboard from "./components/dashboardTitle";
import GraficaResumenServicios from "./components/GraficaResumenServicios";
import TablaServicios from "./components/tablaServicios";

const GestionVentasServiciosProceso = () => {
  return (
    <div className="flex flex-col px-4">

      {/* Gráfica de resumen de servicios */}
      <GraficaResumenServicios />

      {/* Tabla al "final", pero sin ocupar el fondo de la pantalla */}
      <div className="mt-8">
        <TablaServicios />
      </div>
    </div>
  );
};

export default GestionVentasServiciosProceso;
