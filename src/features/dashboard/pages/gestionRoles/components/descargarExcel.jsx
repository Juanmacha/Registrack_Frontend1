// components/DescargarExcel.js

import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import DownloadButton from "../../../../../shared/components/DownloadButton";

const DescargarExcel = ({ roles }) => {
  const exportarExcel = () => {
    const rolesData = roles || [];

    const encabezados = ["Nombre del Rol", "Estado", "Permisos Asignados"];

    const datosExcel = rolesData.map((rol) => ({
      "Nombre del Rol": rol.nombre,
      Estado: rol.estado,
      "Permisos Asignados": Object.entries(rol.permisos || {})
        .map(([modelo, acciones]) => {
          const accionesActivas = Object.entries(acciones)
            .filter(([_, activo]) => activo)
            .map(([accion]) => accion)
            .join(", ");
          return `${modelo}: ${accionesActivas}`;
        })
        .join(" | "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosExcel, {
      header: encabezados,
    });

    // Estilo de encabezados: color de fondo y negrita
    const headerStyle = {
      fill: { fgColor: { rgb: "D9E1F2" } },
      font: { bold: true },
      alignment: { horizontal: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cell_address]) continue;
      worksheet[cell_address].s = headerStyle;
    }

    // Ajustar el ancho de las columnas
    worksheet["!cols"] = [
      { wch: 25 }, // Nombre del Rol
      { wch: 15 }, // Estado
      { wch: 80 }, // Permisos Asignados
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "roles.xlsx");
    AlertService.success("¡Éxito!", "Archivo Excel descargado exitosamente.");
  };

  return (
    <DownloadButton
      type="excel"
      onClick={exportarExcel}
      title="Descargar Excel"
    />
  );
};

export default DescargarExcel;
