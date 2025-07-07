import React, { useState, useEffect } from 'react';
import { crearVenta } from '../services/ventasService.js';
import { getServicios } from '../services/serviciosManagementService.js';
import authData from '../../../../auth/services/authData.js';

const tiposDocumento = ['Cédula', 'Pasaporte', 'DNI', 'Otro'];
const tiposEntidad = ['Sociedad Anónima', 'SAS', 'LTDA', 'Otra'];
const categorias = ['Productos', 'Servicios'];
const paisesFallback = ['Colombia', 'Perú', 'México', 'Argentina', 'Chile', 'Otro'];

const CrearSolicitud = ({ isOpen, onClose, onGuardar, tipoSolicitud, servicioId }) => {
  const [paso, setPaso] = useState(1);
  const siguientePaso = () => setPaso(prev => prev + 1);
  const pasoAnterior = () => setPaso(prev => prev - 1);

  const [servicioNombre, setServicioNombre] = useState('');
  const [paises, setPaises] = useState(paisesFallback);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    expediente: '', tipoSolicitante: '', tipoPersona: '', tipoDocumento: '', numeroDocumento: '', nombreCompleto: '',
    email: '', telefono: '', direccion: '', tipoEntidad: '', razonSocial: '', nombreEmpresa: '', nit: '', pais: '',
    nitMarca: '', nombreMarca: '', categoria: '', clases: [{ numero: '', descripcion: '' }], certificadoCamara: null,
    logotipoMarca: null, poderRepresentante: null, poderAutorizacion: null, fechaSolicitud: '', estado: 'En revisión',
    tipoSolicitud: tipoSolicitud || servicioNombre || 'Certificación de Marca', encargado: 'Sin asignar', comentarios: []
  });

  useEffect(() => {
    if (servicioId) {
      const servicio = getServicios().find(s => s.id === servicioId);
      setServicioNombre(servicio ? servicio.nombre : '');
    }
  }, [servicioId]);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => setPaises(data.map(p => p.name.common).sort()))
      .catch(() => setPaises(paisesFallback));
  }, []);

  useEffect(() => {
    if (isOpen) {
      setPaso(1);
      setForm(f => ({ ...f, tipoSolicitud: tipoSolicitud || servicioNombre || 'Certificación de Marca' }));
      setErrors({});
    }
  }, [isOpen, tipoSolicitud, servicioNombre]);

  const esTitular = form.tipoSolicitante === 'Titular';
  const esRepresentante = form.tipoSolicitante === 'Representante Autorizado';
  const esNatural = form.tipoPersona === 'Natural';
  const esJuridica = form.tipoPersona === 'Jurídica';

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm(f => ({ ...f, [name]: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleClaseChange = (i, field, value) => {
    setForm(f => {
      const clases = [...f.clases];
      clases[i][field] = value;
      return { ...f, clases };
    });
    setErrors(prev => ({ ...prev, [`clase_${field}_${i}`]: '' }));
  };

  const addClase = () => {
    if (form.clases.length < 25) {
      setForm(f => ({ ...f, clases: [...f.clases, { numero: '', descripcion: '' }] }));
    }
  };

  const removeClase = i => {
    setForm(f => ({ ...f, clases: f.clases.filter((_, idx) => idx !== i) }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const user = authData.getUser && typeof authData.getUser === 'function' ? authData.getUser() : null;
    const datos = {
      ...form,
      email: user?.email || form.email,
      certificadoCamara: form.certificadoCamara?.name || '',
      logotipoMarca: form.logotipoMarca?.name || '',
      poderRepresentante: form.poderRepresentante?.name || '',
      poderAutorizacion: form.poderAutorizacion?.name || '',
      fechaSolicitud: new Date().toISOString().slice(0, 10),
    };
    crearVenta(datos);
    if (onGuardar) onGuardar(datos);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Paso {paso} de 5 - {form.tipoSolicitud}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {paso === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Número de Expediente *</label>
                <input type="text" name="expediente" value={form.expediente} onChange={handleChange} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Tipo de Solicitante *</label>
                <select name="tipoSolicitante" value={form.tipoSolicitante} onChange={handleChange} className="w-full border rounded p-2">
                  <option value="">Seleccionar</option>
                  <option value="Titular">Titular</option>
                  <option value="Representante Autorizado">Representante Autorizado</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Tipo de Solicitud *</label>
                <input type="text" name="tipoSolicitud" value={form.tipoSolicitud} readOnly className="w-full border rounded p-2 bg-gray-100" />
              </div>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-4">
              {esTitular && (
                <div>
                  <label className="block text-sm font-medium">Tipo de Persona *</label>
                  <select name="tipoPersona" value={form.tipoPersona} onChange={handleChange} className="w-full border rounded p-2">
                    <option value="">Seleccionar</option>
                    <option value="Natural">Natural</option>
                    <option value="Jurídica">Jurídica</option>
                  </select>
                </div>
              )}
              {esRepresentante && (
                <div>
                  <label className="block text-sm font-medium">Nombre Completo *</label>
                  <input type="text" name="nombreCompleto" value={form.nombreCompleto} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
              )}
            </div>
          )}

          {paso === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">País *</label>
                <select name="pais" value={form.pais} onChange={handleChange} className="w-full border rounded p-2">
                  <option value="">Seleccionar</option>
                  {paises.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">NIT Marca *</label>
                <input type="text" name="nitMarca" value={form.nitMarca} onChange={handleChange} className="w-full border rounded p-2" />
              </div>
            </div>
          )}

          {paso === 4 && (
            <div>
              <label className="block text-sm font-medium mb-2">Clases de la Marca *</label>
              {form.clases.map((clase, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input type="number" placeholder="Nº Clase" value={clase.numero} onChange={e => handleClaseChange(i, 'numero', e.target.value)} className="w-24 border rounded p-2" />
                  <input type="text" placeholder="Descripción" value={clase.descripcion} onChange={e => handleClaseChange(i, 'descripcion', e.target.value)} className="flex-1 border rounded p-2" />
                  <button type="button" onClick={() => removeClase(i)} className="text-red-500">&times;</button>
                </div>
              ))}
              <button type="button" onClick={addClase} className="mt-2 px-4 py-1 bg-blue-600 text-white rounded">+ Clase</button>
            </div>
          )}

          {paso === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Certificado de Cámara *</label>
                <input type="file" name="certificadoCamara" onChange={handleChange} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium">Logotipo de Marca *</label>
                <input type="file" name="logotipoMarca" onChange={handleChange} className="w-full" />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {paso > 1 ? (
              <button type="button" onClick={pasoAnterior} className="px-4 py-2 bg-gray-200 rounded">Atrás</button>
            ) : <span />}
            {paso < 5 ? (
              <button type="button" onClick={siguientePaso} className="px-4 py-2 bg-blue-600 text-white rounded">Siguiente</button>
            ) : (
              <div className="flex gap-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Guardar</button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearSolicitud;
