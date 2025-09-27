import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import DownloadButton from "../../../../../shared/components/DownloadButton";
import empleadosApiService from "../../../services/empleadosApiService.js";

const DescargarExcelEmpleados = ({ empleados }) => {
  const [downloading, setDownloading] = useState(false);

  const exportarExcel = async () => {
    setDownloading(true);
    
    try {
      console.log('🔄 [DescargarExcel] Descargando reporte desde API...');
      const response = await empleadosApiService.downloadReporteExcel();
      
      if (response.success) {
        console.log('✅ [DescargarExcel] Reporte descargado desde API');
        
        // Si la API devuelve un blob directamente
        if (response.data instanceof Blob) {
          saveAs(response.data, "reporte_empleados.xlsx");
        } else {
          // Si devuelve datos, crear el archivo
          const data = new Blob([response.data], { type: "application/octet-stream" });
          saveAs(data, "reporte_empleados.xlsx");
        }
        
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Reporte Excel descargado exitosamente desde la API.",
          confirmButtonColor: "#3085d6",
        });
      } else {
        console.error('❌ [DescargarExcel] Error al descargar desde API:', response.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al descargar el reporte: " + response.message,
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error('💥 [DescargarExcel] Error:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al descargar el reporte",
        confirmButtonColor: "#d33",
      });
    } finally {
      setDownloading(false);
    }
  };

  const generarExcelLocal = () => {
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
      title={downloading ? "Descargando..." : "Descargar Excel"}
      disabled={downloading}
    />
  );
};

export default DescargarExcelEmpleados;
