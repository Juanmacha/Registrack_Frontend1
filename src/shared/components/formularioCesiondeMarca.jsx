import React, { useState } from "react";
import NavBarLanding from "../../features/landing/components/landingNavbar";

const FormularioCesiondeMarca = () => {
  const [propietarios, setPropietarios] = useState([{ tipoPersona: "", datos: {} }]);

  const handleTipoPersonaChange = (index, value) => {
    const nuevos = [...propietarios];
    nuevos[index].tipoPersona = value;
    nuevos[index].datos = {};
    setPropietarios(nuevos);
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const nuevos = [...propietarios];
    nuevos[index].datos[name] = value;
    setPropietarios(nuevos);
  };

  const agregarPropietario = () => {
    setPropietarios([...propietarios, { tipoPersona: "", datos: {} }]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto pt-[30px] p-6 space-y-8">
        {propietarios.map((propietario, index) => (
          <div key={index} className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Datos del nuevo propietario</h3>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Tipo de persona *</label>
                <select
                  value={propietario.tipoPersona}
                  onChange={(e) => handleTipoPersonaChange(index, e.target.value)}
                  className="border rounded px-4 py-2 w-full"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="natural">Natural</option>
                  <option value="juridica">Jurídica</option>
                </select>
              </div>
            </section>

            {/* Persona natural */}
            {propietario.tipoPersona === "natural" && (
              <section>
                <div className="grid md:grid-cols-3 gap-4">
                  <select
                    name="docTipoNatural"
                    onChange={(e) => handleInputChange(index, e)}
                    className="border rounded px-4 py-2 w-full"
                  >
                    <option value="">Tipo de documento</option>
                    <option value="CC">Cédula</option>
                    <option value="CE">Cédula de extranjería</option>
                  </select>
                  <input
                    name="docNumeroNatural"
                    placeholder="Número de documento"
                    onChange={(e) => handleInputChange(index, e)}
                    className="border rounded px-4 py-2 w-full"
                  />
                  <input
                    name="nombreNatural"
                    placeholder="Nombre completo"
                    onChange={(e) => handleInputChange(index, e)}
                    className="border rounded px-4 py-2 w-full"
                  />
                  <input
                    name="correoNatural"
                    placeholder="Correo electrónico"
                    type="email"
                    onChange={(e) => handleInputChange(index, e)}
                    className="border rounded px-4 py-2 w-full"
                  />
                  <input
                    name="telefonoNatural"
                    placeholder="Teléfono"
                    onChange={(e) => handleInputChange(index, e)}
                    className="border rounded px-4 py-2 w-full"
                  />
                  <input
                    name="direccionNatural"
                    placeholder="Dirección"
                    onChange={(e) => handleInputChange(index, e)}
                    className="border rounded px-4 py-2 w-full"
                  />
                </div>
              </section>
            )}

            {/* Persona jurídica */}
            {propietario.tipoPersona === "juridica" && (
              <section>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    name="tipoEntidad"
                    placeholder="Tipo de entidad (ej. SAS)"
                    onChange={(e) => handleInputChange(index, e)}
                    className="border rounded px-4 py-2 w-full"
                  />
                  <input
                    name="razonSocial"
                    placeholder="Razón social"
                    onChange={(e) => handleInputChange(index, e)}
                    className="border rounded px-4 py-2 w-full"
                  />
                  <input
                    name="nombreEmpresa"
                    placeholder="Nombre de la empresa"
                    onChange={(e) => handleInputChange(index, e)}
                    className="border rounded px-4 py-2 w-full"
                  />
                  <input
                    name="nit"
                    placeholder="NIT"
                    onChange={(e) => handleInputChange(index, e)}
                    className="border rounded px-4 py-2 w-full"
                  />
                </div>
              </section>
            )}
          </div>
        ))}

        <div className="pt-4">
          <button
            type="button"
            onClick={agregarPropietario}
            className="border text-blue-600 border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
          >
            Agregar otro propietario
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormularioCesiondeMarca;
