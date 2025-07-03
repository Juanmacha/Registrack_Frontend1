import React, { useState } from "react";
import TablaPagos from "./components/tablaPagos";
import VerDetallePago from "./components/verDetallePagos"; // Asegúrate de que la ruta sea correcta

const Pagos = () => {
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const abrirDetalle = (pago) => {
    setDetalleSeleccionado(pago);
    setModalAbierto(true);
  };

  const cerrarDetalle = () => {
    setDetalleSeleccionado(null);
    setModalAbierto(false);
  };

  return (
    <div className="flex-1 flex justify-center">
      <div className="w-full px-4">
        <TablaPagos onVerDetalle={abrirDetalle} />
      </div>

      <VerDetallePago
        datos={detalleSeleccionado}
        isOpen={modalAbierto}
        onClose={cerrarDetalle}
      />
    </div>
  );
};

export default Pagos;
