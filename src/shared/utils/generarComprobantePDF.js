import jsPDF from 'jspdf';

export function generarComprobantePDF(datos) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Proceso completado', 20, 20);
  doc.setFontSize(16);
  doc.setTextColor(34, 197, 94); // Verde para éxito
  doc.text('Pago realizado con éxito', 20, 32);
  doc.setTextColor(0,0,0);
  doc.setFontSize(12);
  let y = 45;
  const rows = [
    [`Servicio de oposición:`, datos.servicioOposicion],
    [`Nombre de la marca:`, datos.nombreMarca],
    [`Nombre del representante:`, datos.nombreRepresentante],
    [`Tipo de documento:`, datos.tipoDocumento],
    [`N° Documento de identidad:`, datos.numeroDocumento],
    [`Fecha de pago:`, datos.fechaPago],
    [`Valor total del servicio:`, datos.valorTotal],
    [`Gasto legal:`, datos.gastoLegal],
    [`Honorarios:`, datos.honorarios],
    [`Número de transacción:`, datos.numeroTransaccion],
  ];
  rows.forEach(([label, value]) => {
    doc.setFont(undefined, 'bold');
    doc.text(label, 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(String(value), 90, y);
    y += 8;
  });
  doc.save(`comprobante_pago_${datos.numeroTransaccion}.pdf`);
} 