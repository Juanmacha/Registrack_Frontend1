import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

const BotonDescargarExcel = ({ datos, nombreArchivo = "reporte.xlsx" }) => {
  const exportarExcel = () => {
    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils.json_to_sheet(datos);
    XLSX.utils.book_append_sheet(libro, hoja, "Datos");
    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, nombreArchivo);
    
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: "Archivo Excel descargado exitosamente.",
      confirmButtonColor: "#3085d6",
    });
  };

  return (
    <button
      onClick={exportarExcel}
      className="rounded-circle p-0 d-flex align-items-center justify-content-center"
      style={{
        width: "40px",
        height: "40px",
        backgroundColor: "transparent",
        transition: "background-color 0.3s",
        border: "1px solid green",
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#86ed53")}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
      title="Descargar Excel"
    >
      <i
        className="bi bi-file-earmark-excel-fill"
        style={{ color: "#107C41", fontSize: "18px" }}
      ></i>
    </button>
  );
};

export default BotonDescargarExcel; 