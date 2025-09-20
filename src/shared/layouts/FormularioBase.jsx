import React, { useState } from "react";
import { Outlet } from "react-router-dom";

// Importar formularios específicos
import FormularioBusqueda from "../components/formularioBusqueda";
import FormularioCertificacion from "../components/formularioCertificacion";
import FormularioRenovacion from "../components/formularioRenovacion";
import FormularioOposicion from "../components/formularioOposicion";
import FormularioCesion from "../components/formularioCesiondeMarca";
import FormularioAmpliacion from "../components/formularioAmpliacion";
import FormularioRespuesta from "../components/formularioRespuesta";
import DemoPasarelaPagoModal from '../../features/landing/components/DemoPasarelaPagoModal';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import AlertService from '../../utils/alertService.js';

// Mapeo de formularios por servicio
const FORMULARIOS_POR_SERVICIO = {
  'Búsqueda de Antecedentes': FormularioBusqueda,
  'Certificación de Marca': FormularioCertificacion,
  'Renovación de Marca': FormularioRenovacion,
  'Presentación de Oposición': FormularioOposicion,
  'Cesión de Marca': FormularioCesion,
  'Ampliación de Alcance': FormularioAmpliacion,
  'Respuesta a Oposición': FormularioRespuesta,
};

const FormularioBaseModal = ({ onClose, children, titulo = "Solicitud de Servicio", tipoSolicitud }) => {
  const [step, setStep] = useState(1);
  const [tipoSolicitante, setTipoSolicitante] = useState("");
  const [tipoPersona, setTipoPersona] = useState("");
  const [showPago, setShowPago] = useState(false);
  const [datosPago, setDatosPago] = useState(null);
  const [montoDemo, setMontoDemo] = useState(1848000); // Monto demo, puedes ajustarlo
  
  // Estado para el formulario específico
  const [form, setForm] = useState({
    tipoSolicitante: 'Representante Autorizado',
    tipoDocumento: '',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    pais: '',
    nitMarca: '',
    nombreMarca: '',
    clases: [{ numero: '', descripcion: '' }],
    poderRepresentante: null,
    poderAutorizacion: null,
    fechaSolicitud: '',
    estado: 'En revisión',
    tipoSolicitud: tipoSolicitud,
    encargado: 'Sin asignar',
    proximaCita: null,
    comentarios: []
  });
  const [errors, setErrors] = useState({});

  const siguientePaso = () => setStep(2);
  const pasoAnterior = () => setStep(1);

  // Determinar qué formulario renderizar en el paso 2
  const FormularioComponente = FORMULARIOS_POR_SERVICIO[tipoSolicitud];

  // Lógica para generar y descargar comprobante PDF
  const generarComprobantePDF = (datos) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Proceso completado', 105, 20, { align: 'center' });
    doc.setDrawColor(0, 200, 83);
    doc.setFillColor(0, 200, 83);
    doc.circle(105, 35, 10, 'F');
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text('Pago realizado con éxito', 105, 55, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let y = 70;
    const salto = 8;
    const lines = [
      `Servicio de oposición: ${datos.servicioId || ''}`,
      `Nombre de la marca: ${datos.nombreMarca || ''}`,
      `Nombre del representante: ${datos.representante || ''}`,
      `Tipo de documento: ${datos.tipoDocumento || ''}`,
      `N° Documento de identidad: ${datos.numeroDocumento || ''}`,
      `Fecha de pago: ${datos.fecha ? new Date(datos.fecha).toLocaleDateString() : ''}`,
      `Valor total del servicio: ${datos.monto ? datos.monto.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : ''}`,
      `Gasto legal: ${datos.gastoLegal || '928.000,00 COP'}`,
      `Honorarios: ${datos.honorarios || '920.000,00 COP'}`,
      `Numero de transacción: ${datos.transaccion || Math.floor(Math.random()*1000000000)}`
    ];
    lines.forEach(line => {
      doc.text(line, 20, y);
      y += salto;
    });
    doc.save('comprobante_pago.pdf');
  };

  // Cambiar el submit final para que solo abra el modal de pago
  const handleFinalizar = async (formData) => {
    setDatosPago(formData);
    setShowPago(true);
  };

  // Cuando el pago es exitoso, crear la solicitud y generar el comprobante
  const handlePagoExitoso = async (pagoInfo) => {
    try {
      await onGuardar(datosPago); // Crear la solicitud solo después del pago
      generarComprobantePDF({ ...datosPago, ...pagoInfo });
      AlertService.success("Solicitud creada y pago realizado", "La solicitud se ha creado correctamente y el comprobante ha sido generado.");
      setShowPago(false);
      onClose();
    } catch (err) {
      AlertService.error("Error al guardar", "");
    }
  };

  return (
    <div className="modal-responsive">
      <div className="modal-content-responsive bg-white rounded-xl shadow-md max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Encabezado limpio */}
        <div className="bg-gray-50 px-6 py-4 rounded-t-xl mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{titulo}</h2>
            <p className="text-sm text-gray-500">Complete la información del proceso</p>
        </div>

        {/* Stepper visual */}
        <div className="flex items-center justify-center mb-8 mt-2">
          {/* Paso 1 */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200
              ${step === 1 ? 'bg-[#275FAA] border-[#275FAA] text-white' : step > 1 ? 'bg-[#F3D273] border-[#F3D273] text-[#275FAA]' : 'bg-gray-200 border-gray-300 text-gray-400'}`}
            >1</div>
            <span className={`mt-2 text-xs font-semibold ${step === 1 ? 'text-[#275FAA]' : step > 1 ? 'text-[#F3D273]' : 'text-gray-400'}`}>Datos generales</span>
          </div>
          {/* Línea */}
          <div className={`h-1 w-12 mx-2 rounded transition-all duration-200 ${step > 1 ? 'bg-[#F3D273]' : 'bg-gray-200'}`}></div>
          {/* Paso 2 */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200
              ${step === 2 ? 'bg-[#275FAA] border-[#275FAA] text-white' : 'bg-gray-200 border-gray-300 text-gray-400'}`}
            >2</div>
            <span className={`mt-2 text-xs font-semibold ${step === 2 ? 'text-[#275FAA]' : 'text-gray-400'}`}>Datos para la solicitud</span>
          </div>
        </div>

        {/* Paso 1 */}
        {step === 1 && (
          <form className="space-y-6">
            <div className="form-grid grid md:grid-cols-2 gap-4">
              <div className="form-field">
                <label className="form-label text-sm text-gray-600 font-medium">¿Quién solicita el servicio? *</label>
                <select
                  value={tipoSolicitante}
                  onChange={(e) => setTipoSolicitante(e.target.value)}
                  className="form-input input"
                >
                  <option value="">Seleccionar...</option>
                  <option value="titular">Titular de la marca</option>
                  <option value="representante">Representante autorizado</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label text-sm text-gray-600 font-medium">Tipo de persona *</label>
                <select
                  value={tipoPersona}
                  onChange={(e) => setTipoPersona(e.target.value)}
                  className="form-input input"
                >
                  <option value="">Seleccionar...</option>
                  <option value="natural">Natural</option>
                  <option value="juridica">Jurídica</option>
                </select>
              </div>
            </div>

            {/* Persona natural */}
            {tipoPersona === "natural" && (
              <div className="border p-4 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">Persona natural</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Tipo de documento" className="input" />
                  <input type="text" placeholder="Número de documento" className="input" />
                  <input type="text" placeholder="Nombre completo" className="input" />
                  <input type="email" placeholder="Correo electrónico" className="input" />
                  <input type="text" placeholder="Teléfono" className="input" />
                  <input type="text" placeholder="Dirección" className="input" />
                </div>
              </div>
            )}

            {/* Persona jurídica */}
            {tipoPersona === "juridica" && (
              <div className="border p-4 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">Persona jurídica</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Tipo de entidad" className="input" />
                  <input type="text" placeholder="Razón social" className="input" />
                  <input type="text" placeholder="Nombre del apoderado legal" className="input" />
                  <input type="text" placeholder="NIT" className="input" />
                </div>
              </div>
            )}

            {/* Representante autorizado */}
            {tipoSolicitante === "representante" && (
              <div className="border p-4 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">Datos del representante autorizado</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Tipo de documento" className="input" />
                  <input type="text" placeholder="Número de documento" className="input" />
                  <input type="text" placeholder="Nombre completo" className="input" />
                  <input type="email" placeholder="Correo electrónico" className="input" />
                  <input type="text" placeholder="Teléfono" className="input" />
                  <input type="text" placeholder="Dirección" className="input" />
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <input type="file" className="input" />
                  <input type="file" className="input" />
                </div>
              </div>
            )}

            <div className="flex justify-end border-t pt-4 gap-x-2">
              <button
                onClick={onClose}
                className="btn-responsive border border-red-300 px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={siguientePaso}
                className="btn-responsive bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Siguiente
              </button>
            </div>

          </form>
        )}

        {/* Paso 2 */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Renderizar el formulario dinámico según el tipo de solicitud */}
            {FormularioComponente ? (
              (() => {
                console.log('🔧 [FormularioBaseModal] Pasando props al formulario:', { form, errors, tipoSolicitud });
                return (
                  <FormularioComponente 
                    isOpen={true}
                    onClose={onClose}
                    onGuardar={handleFinalizar}
                    tipoSolicitud={tipoSolicitud}
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    setErrors={setErrors}
                  />
                );
              })()
            ) : children || <Outlet />} {/* Fallback a children o Outlet si no hay formulario específico */}
            <div className="flex justify-between border-t pt-4">
              <button
                onClick={pasoAnterior}
                className="btn-responsive bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Atrás
              </button>
              <button
                type="button"
                className="btn-responsive bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={() => setShowPago(true)}
              >
                Ir a pago
              </button>
            </div>
            {/* Modal demo pasarela de pago */}
            <DemoPasarelaPagoModal
              isOpen={showPago}
              onClose={() => setShowPago(false)}
              monto={montoDemo}
              datosPago={datosPago}
              onPagoExitoso={handlePagoExitoso}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioBaseModal;
