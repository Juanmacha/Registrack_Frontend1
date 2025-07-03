import React from "react";
import TablaVentasProceso from "./components/tablaVentasProceso";
import { useLocation } from "react-router-dom";

const GestionVentasServiciosProceso = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const adquirir = params.get('adquirir');

  return (
    <div className="flex-1 flex justify-center">
      <div className="w-full  px-4">
        <TablaVentasProceso adquirir={adquirir} />
      </div>
    </div>
  );
};

export default GestionVentasServiciosProceso;
