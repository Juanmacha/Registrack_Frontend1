import React, { useState } from "react";
import NavBarLanding from "../../features/landing/components/landingNavbar";

const FormularioBusqueda = () => {
  const [paso, setPaso] = useState(1);

  const siguientePaso = () => setPaso(paso + 1);
  const pasoAnterior = () => setPaso(paso - 1);

  return (
    <div className="bg-gray-100">
      <div className="max-w-5xl mx-auto pt-[30px] p-6 space-y-8">

        {/* Paso 1: Representante y documentos */}
        {paso === 1 && (
          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Datos del representante autorizado</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <select className="border rounded px-4 py-2 w-full" required>
                  <option value="">Tipo de documento *</option>
                  <option value="cc">C.C</option>
                  <option value="ce">C.E</option>
                </select>
                <input type="text" placeholder="Número de documento *" className="border rounded px-4 py-2 w-full" required />
                <input type="text" placeholder="Nombre completo *" className="border rounded px-4 py-2 w-full" required />
                <input type="email" placeholder="Correo electrónico *" className="border rounded px-4 py-2 w-full" required />
                <input type="tel" placeholder="Teléfono *" className="border rounded px-4 py-2 w-full" required />
                <input type="text" placeholder="Dirección *" className="border rounded px-4 py-2 w-full" required />
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Documentos requeridos</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Poder del representante autorizado (PDF)</label>
                  <input type="file" accept="application/pdf" className="border rounded px-4 py-2 w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Poder para el registro de la marca (PDF)</label>
                  <input type="file" accept="application/pdf" className="border rounded px-4 py-2 w-full" />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Paso 2: Marca y Clase NIZA */}
        {paso === 2 && (
          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Datos de la marca a registrar</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <select className="border rounded px-4 py-2 w-full" required>
                  <option value="colombia">Colombia</option>
                </select>
                <input type="text" placeholder="NIT de la marca *" className="border rounded px-4 py-2 w-full" required />
                <input type="text" placeholder="Nombre de la marca *" className="border rounded px-4 py-2 w-full" required />
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-1">Clase NIZA</h3>
              <p className="text-sm text-gray-600 mb-3">
                Seleccione las clases 🛈 en las cuales desea registrar su marca. Si necesita ayuda con su número de clase,
                por favor use nuestro <a href="#" className="text-blue-600 underline">Buscador de CLASE NIZA</a>.
              </p>
              <div className="grid grid-cols-6 gap-2 bg-gray-50 p-4 border rounded">
                {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => (
                  <label key={num} className="flex items-center space-x-1 text-sm text-gray-700">
                    <input type="checkbox" value={num} className="accent-blue-600" />
                    <span>{num}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Para cada clase seleccionada, especifique los productos o servicios que desea proteger.
                </label>
                <input
                  type="text"
                  placeholder="Ej: Clase 30: Productos alimenticios..."
                  className="border rounded px-4 py-2 w-full"
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioBusqueda;
