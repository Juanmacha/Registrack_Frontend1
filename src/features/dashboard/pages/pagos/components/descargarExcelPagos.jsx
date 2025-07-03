import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

const DescargarExcelPagos = ({ pagos }) => {
  const exportarExcel = () => {
    const encabezados = ["ID Pago", "Monto", "Fecha", "Método", "Orden de Servicio", "Estado"];

    const datosExcel = pagos.map((p) => ({
      "ID Pago": p.id_pago,
      "Monto": p.monto,
      "Fecha": new Date(p.fecha_pago).toLocaleDateString(),
      "Método": p.metodo_pago,
      "Orden de Servicio": p.id_orden_servicio,
      "Estado": p.estado ? "Completado" : "Fallido",
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosExcel, { header: encabezados });

    worksheet["!cols"] = [
      { wch: 10 }, // ID Pago
      { wch: 15 }, // Monto
      { wch: 15 }, // Fecha
      { wch: 20 }, // Método
      { wch: 20 }, // Orden
      { wch: 15 }, // Estado
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pagos");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, "pagos.xlsx");

    // ✅ Mostrar mensaje con SweetAlert2
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: "Archivo Excel descargado exitosamente.",
      confirmButtonColor: "#3085d6",
    });
  };

  return (
    <button
      className="btn btn-success px-4 py-2 text-sm rounded-md"
      onClick={exportarExcel}
    >
      <i className="bi bi-file-earmark-excel-fill"></i> Descargar Excel
    </button>
  );
};

export default DescargarExcelPagos;
