import React, { useEffect } from "react";
import GraficaIngresosPie from "./components/GraficaIngresosPie";
import GraficaResumenServicios from "./components/GraficaResumenServicios";
import TablaServicios from "./components/tablaServicios";
import { useSalesSync } from "../../../../utils/hooks/useDataSync.js";
import { SaleService } from "../../../../utils/mockDataService.js";

const Dashboard = () => {
  // ✅ NUEVO: Sincronización de ventas para el dashboard
  const [ventas, refreshVentas, lastUpdate] = useSalesSync(
    () => SaleService.getAll(),
    []
  );

  // ✅ NUEVO: Efecto para actualizar datos cuando cambian las ventas
  useEffect(() => {
    console.log('[Dashboard] Datos actualizados:', lastUpdate);
  }, [lastUpdate]);

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
