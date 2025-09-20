import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";
import DownloadButton from "../../../../../shared/components/DownloadButton";

const BotonDescargarPdf = ({ datos, nombreArchivo = "reporte.pdf", chartRef }) => {
  const exportarPdf = async () => {
    try {
      // Mostrar loading
      Swal.fire({
        title: "Generando PDF...",
        text: "Por favor espere",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const pdf = new jsPDF("landscape", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;

      // Título del reporte
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("Distribución de Ingresos por Servicio", pageWidth / 2, 25, { align: "center" });

      // Fecha del reporte
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      const fecha = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      pdf.text(`Fecha: ${fecha}`, pageWidth - margin, 35, { align: "right" });

      // Si tenemos referencia al chart, capturarlo
      if (chartRef && chartRef.current) {
        try {
          const canvas = await html2canvas(chartRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff"
          });

          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 120;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // Posicionar la imagen en el lado izquierdo
          pdf.addImage(imgData, "PNG", margin, 50, imgWidth, imgHeight);
        } catch (error) {
          console.error("Error capturando chart:", error);
        }
      }

      // Tabla de datos en el lado derecho
      const tableX = margin + 140;
      const tableY = 50;
      const colWidth = 40;
      const rowHeight = 8;

      // Encabezados de la tabla
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Servicio", tableX, tableY);
      pdf.text("Cantidad", tableX + colWidth, tableY);
      pdf.text("Porcentaje", tableX + colWidth * 2, tableY);

      // Línea separadora
      pdf.line(tableX, tableY + 2, tableX + colWidth * 3, tableY + 2);

      // Datos de la tabla
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      
      const total = datos.reduce((sum, item) => sum + item.Cantidad, 0);
      
      datos.forEach((item, index) => {
        const y = tableY + (index + 1) * rowHeight + 5;
        const porcentaje = ((item.Cantidad / total) * 100).toFixed(1);
        
        pdf.text(item.Servicio, tableX, y);
        pdf.text(item.Cantidad.toString(), tableX + colWidth, y);
        pdf.text(`${porcentaje}%`, tableX + colWidth * 2, y);
      });

      // Resumen total
      const totalY = tableY + (datos.length + 1) * rowHeight + 10;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.line(tableX, totalY - 2, tableX + colWidth * 3, totalY - 2);
      pdf.text("TOTAL", tableX, totalY);
      pdf.text(total.toString(), tableX + colWidth, totalY);
      pdf.text("100%", tableX + colWidth * 2, totalY);

      // Guardar el PDF
      pdf.save(nombreArchivo);

      // Mostrar éxito
      AlertService.success("¡Éxito!", "Archivo PDF descargado exitosamente.");
    } catch (error) {
      console.error("Error generando PDF:", error);
      AlertService.error("Error", "Hubo un problema al generar el PDF.");
    }
  };

  return (
    <DownloadButton
      type="pdf"
      onClick={exportarPdf}
      title="Descargar PDF"
    />
  );
};

export default BotonDescargarPdf; 