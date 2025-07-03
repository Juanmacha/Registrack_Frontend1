import React, { useState } from "react";
import { Outlet } from "react-router-dom";

const FormularioBaseModal = ({ onClose, children }) => {
  const [step, setStep] = useState(1);
  const [tipoSolicitante, setTipoSolicitante] = useState("");
  const [tipoPersona, setTipoPersona] = useState("");

  const siguientePaso = () => setStep(2);
  const pasoAnterior = () => setStep(1);

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-md max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Encabezado */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <i className="bi bi-pencil-square text-blue-600 text-xl"></i>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Solicitud de Servicio</h2>
            <p className="text-sm text-gray-500">Complete la información del proceso</p>
          </div>
        </div>

        {/* Paso 1 */}
        {step === 1 && (
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 font-medium">¿Quién solicita el servicio? *</label>
                <select
                  value={tipoSolicitante}
                  onChange={(e) => setTipoSolicitante(e.target.value)}
                  className="input"
                >
                  <option value="">Seleccionar...</option>
                  <option value="titular">Titular de la marca</option>
                  <option value="representante">Representante autorizado</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 font-medium">Tipo de persona *</label>
                <select
                  value={tipoPersona}
                  onChange={(e) => setTipoPersona(e.target.value)}
                  className="input"
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
                className="border border-red-300 px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={siguientePaso}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Siguiente
              </button>
            </div>

          </form>
        )}

        {/* Paso 2 */}
        {step === 2 && (
          <div className="space-y-4">
            {children || <Outlet />} {/* Soporta rutas o props.children */}
            <div className="flex justify-between border-t pt-4">
              <button
                onClick={pasoAnterior}
                className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Atrás
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Finalizar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioBaseModal;
