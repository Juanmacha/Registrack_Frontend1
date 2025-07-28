import React from "react";
import GraficaIngresosPie from "./components/GraficaIngresosPie";
import GraficaResumenServicios from "./components/GraficaResumenServicios";
import TablaServicios from "./components/tablaServicios";
import TablaMarcasCertificadas from "./components/tablaMarcasCertificadas";

const Dashboard = () => {
  return (
    <div className="flex flex-col px-4 space-y-6">
      {/* Solo la gráfica circular de ingresos arriba */}
      <GraficaIngresosPie />

      {/* Gráfica de resumen de servicios debajo */}
      <GraficaResumenServicios />

      {/* Tabla de marcas certificadas próximas a vencerse */}
      <TablaMarcasCertificadas />

      {/* Tabla de servicios inactivos al final */}
      <TablaServicios />
    </div>
  );
};

export default Dashboard;
