import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import DownloadButton from "../../../../../shared/components/DownloadButton";

const DescargarExcelEmpleados = ({ empleados }) => {
  const exportarExcel = () => {
    const encabezados = [
      "ID",
      "Tipo de Documento",
      "Documento",
      "Nombre",
      "Apellidos",
      "Email",
      "Rol",
      "Estado",
    ];

    const datosExcel = empleados.map((e) => ({
      ID: e.id,
      "Tipo de Documento": e.tipoDocumento,
      Documento: e.documento,
      Nombre: e.nombre,
      Apellidos: e.apellidos,
      Email: e.email,
      Rol: e.rol,
      Estado: e.estado,
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosExcel, { header: encabezados });

    worksheet["!cols"] = [
      { wch: 5 },  // ID
      { wch: 20 }, // Tipo de Documento
      { wch: 15 }, // Documento
      { wch: 20 }, // Nombre
      { wch: 20 }, // Apellidos
      { wch: 30 }, // Email
      { wch: 15 }, // Rol
      { wch: 12 }, // Estado
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Empleados");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, "empleados.xlsx");

    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: "Archivo Excel descargado exitosamente.",
      confirmButtonColor: "#3085d6",
    });
  };

  return (
    <DownloadButton
      type="excel"
      onClick={exportarExcel}
      title="Descargar Excel"
    />
  );
};

export default DescargarExcelEmpleados;
