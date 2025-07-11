import React from "react";
import GraficaIngresosPie from "./components/GraficaIngresosPie";
import GraficaResumenServicios from "./components/GraficaResumenServicios";
import TablaServicios from "./components/tablaServicios";

const Dashboard = () => {
  return (
    <div className="flex flex-col px-4">
      {/* Solo la gráfica circular de ingresos arriba */}
      <GraficaIngresosPie />

      {/* Gráfica de resumen de servicios debajo */}
      <GraficaResumenServicios />

      {/* Tabla al "final", pero sin ocupar el fondo de la pantalla */}
      <div className="mt-8">
        <TablaServicios />
      </div>
    </div>
  );
};

export default Dashboard;
