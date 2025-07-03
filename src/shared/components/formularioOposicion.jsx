import React, { useState } from "react";
import NavBarLanding from "../../features/landing/components/landingNavbar";

const FormularioOposicion = () => {
  const [paso, setPaso] = useState(2); // Mostrando directamente el paso 2, como en Ampliación

  const pasoAnterior = () => setPaso(paso - 1);

  return (
    <div className="bg-gray-100">
      <div className="max-w-3xl mx-auto pt-[30px] p-6">
        {paso === 2 && (
          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Datos de la oposición</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre de la marca a la que se opone *"
                  className="border rounded px-4 py-2 w-full"
                  required
                />
                <textarea
                  placeholder="Motivo de la oposición (similitud, riesgo de confusión, notoriedad, etc) *"
                  className="border rounded px-4 py-2 w-full h-40 resize-none"
                  required
                ></textarea>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioOposicion;
