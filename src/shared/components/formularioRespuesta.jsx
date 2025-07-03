import React, { useState } from "react";
import NavBarLanding from "../../features/landing/components/landingNavbar";

const FormularioRespuestaOposicion = () => {
  const [paso, setPaso] = useState(2); // Mostrando directamente el paso 2

  const pasoAnterior = () => setPaso(paso - 1);

  return (
    <div className="bg-gray-100">
      <div className="max-w-3xl mx-auto pt-[30px] p-6">
        {paso === 2 && (
          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Datos de la marca a responder</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre de la marca *"
                  className="border rounded px-4 py-2 w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="NIT marca *"
                  className="border rounded px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="País(es) donde está registrada *"
                  className="border rounded px-4 py-2 w-full"
                  required
                />
              </div>
            </section>

            {/* Argumentos de defensa */}
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Argumentos de defensa</h3>
              <p className="text-sm text-gray-600 mb-2">Explicación de defensa (debe incluir razones claras)</p>
              <textarea
                placeholder="Describa aquí los argumentos de defensa..."
                className="border rounded px-4 py-2 w-full h-40 resize-none"
                required
              ></textarea>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioRespuestaOposicion;
