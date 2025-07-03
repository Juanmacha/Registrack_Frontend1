import React, { useState } from "react";
import NavBarLanding from "../../features/landing/components/landingNavbar";

const FormularioRenovacion = () => {
  const [paso, setPaso] = useState(2); // Directamente al paso 2
  const [form, setForm] = useState({
    pais: "",
    nitMarca: "",
    nombreMarca: "",
    certExistencia: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  return (
    <div className="bg-gray-100">
      <div className="max-w-3xl mx-auto pt-[30px] p-6">
        {paso === 2 && (
          <div className="space-y-8">
            {/* Sección de datos de la marca */}
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Datos de la marca a renovar</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <select
                  name="pais"
                  value={form.pais}
                  onChange={handleInputChange}
                  className="border rounded px-4 py-2 w-full"
                  required
                >
                  <option value="">Seleccione país *</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Otro">Otro</option>
                </select>
                <input
                  name="nitMarca"
                  placeholder="NIT de la marca *"
                  value={form.nitMarca}
                  onChange={handleInputChange}
                  className="border rounded px-4 py-2 w-full"
                  required
                />
                <input
                  name="nombreMarca"
                  placeholder="Nombre de la marca *"
                  value={form.nombreMarca}
                  onChange={handleInputChange}
                  className="border rounded px-4 py-2 w-full"
                  required
                />
              </div>
            </section>

            {/* Sección de certificado */}
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Documento requerido</h3>
              <p className="text-sm text-gray-600 mb-2">
                Adjunte el certificado de existencia vigente expedido por la Cámara de Comercio.
              </p>
              <input
                type="file"
                name="certExistencia"
                accept=".pdf"
                onChange={handleInputChange}
                className="border rounded px-4 py-2 w-full"
                required
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioRenovacion;
