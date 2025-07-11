import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const BotonDescargarExcel = ({ datos, nombreArchivo = "reporte.xlsx" }) => {
  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Servicios");
    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, nombreArchivo);
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
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = "#86ed53")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
    >
      <i
        className="bi bi-file-earmark-excel-fill"
        style={{ color: "#107C41", fontSize: "18px" }}
      ></i>
    </button>
  );
};

export default BotonDescargarExcel; 