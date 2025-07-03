import React, { useState, useEffect } from 'react';
import { actualizarVenta } from '../services/ventasService';
import { getServicios } from '../services/serviciosManagementService.js';

const tiposDocumento = ['Cédula', 'Pasaporte', 'DNI', 'Otro'];
const tiposEntidad = ['Sociedad Anónima', 'SAS', 'LTDA', 'Otra'];
const categorias = ['Productos', 'Servicios'];
const estados = ['En revisión', 'Pendiente', 'Pendiente firma', 'Finalizado', 'Anulado'];
const paisesFallback = ['Colombia', 'Perú', 'México', 'Argentina', 'Chile', 'Otro'];

const EditarVenta = ({ datos, isOpen, onClose, onGuardar }) => {
  const [form, setForm] = useState({});
  const [paises, setPaises] = useState(paisesFallback);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => setPaises(data.map(p => p.name.common).sort()))
      .catch(() => setPaises(paisesFallback));
  }, []);

  useEffect(() => {
    if (isOpen && datos) {
      setForm({
        ...datos,
        certificadoCamara: '',
        logotipoMarca: '',
        poderRepresentante: '',
        poderAutorizacion: '',
      });
      setErrors({});
    }
  }, [isOpen, datos]);

  useEffect(() => {
    if (form.estado !== 'Anulado' && form.motivoAnulacion) {
      setForm(f => ({ ...f, motivoAnulacion: '' }));
    }
  }, [form.estado]);

  const esTitular = form.tipoSolicitante === 'Titular';
  const esRepresentante = form.tipoSolicitante === 'Representante Autorizado';
  const esNatural = form.tipoPersona === 'Natural';
  const esJuridica = form.tipoPersona === 'Jurídica';

  const validate = () => {
    const e = {};
    if (!form.expediente) e.expediente = 'Requerido';
    if (!form.tipoSolicitante) e.tipoSolicitante = 'Requerido';
    if (esTitular) {
      if (!form.tipoPersona) e.tipoPersona = 'Requerido';
      if (esNatural) {
        if (!form.tipoDocumento) e.tipoDocumento = 'Requerido';
        if (!form.numeroDocumento) e.numeroDocumento = 'Requerido';
        if (!form.nombreCompleto) e.nombreCompleto = 'Requerido';
        if (!form.email) e.email = 'Requerido';
        if (!form.telefono) e.telefono = 'Requerido';
      }
      if (esJuridica) {
        if (!form.tipoEntidad) e.tipoEntidad = 'Requerido';
        if (!form.razonSocial) e.razonSocial = 'Requerido';
        if (!form.nombreEmpresa) e.nombreEmpresa = 'Requerido';
        if (!form.nit) e.nit = 'Requerido';
      }
    }
    if (esRepresentante) {
      if (!form.tipoDocumento) e.tipoDocumento = 'Requerido';
      if (!form.numeroDocumento) e.numeroDocumento = 'Requerido';
      if (!form.nombreCompleto) e.nombreCompleto = 'Requerido';
      if (!form.email) e.email = 'Requerido';
      if (!form.telefono) e.telefono = 'Requerido';
      if (!form.direccion) e.direccion = 'Requerido';
    }
    if (!form.pais) e.pais = 'Requerido';
    if (!form.nitMarca) e.nitMarca = 'Requerido';
    if (!form.nombreMarca) e.nombreMarca = 'Requerido';
    if (!form.categoria) e.categoria = 'Requerido';
    if (!form.clases || !form.clases.length) e.clases = 'Agrega al menos una clase';
    (form.clases || []).forEach((c, i) => {
      if (!c.numero) e[`clase_numero_${i}`] = 'Número requerido';
      if (!c.descripcion) e[`clase_desc_${i}`] = 'Descripción requerida';
    });
    if (form.estado === 'Anulado' && (!form.motivoAnulacion || !form.motivoAnulacion.trim())) {
      e.motivoAnulacion = 'Debes ingresar el motivo de anulación';
    }
    return e;
  };

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
      const clases = [...(f.clases || [])];
      clases[i][field] = value;
      return { ...f, clases };
    });
    setErrors(prev => ({ ...prev, [`clase_${field}_${i}`]: '' }));
  };

  const addClase = () => {
    if ((form.clases || []).length < 25) {
      setForm(f => ({ ...f, clases: [...(f.clases || []), { numero: '', descripcion: '' }] }));
    }
  };
  const removeClase = i => {
    setForm(f => ({ ...f, clases: (f.clases || []).filter((_, idx) => idx !== i) }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const eValid = validate();
    setErrors(eValid);
    if (Object.keys(eValid).length === 0) {
      // Guardar solo el nombre del archivo si se subió uno nuevo
      const datos = {
        ...form,
        certificadoCamara: form.certificadoCamara && form.certificadoCamara.name ? form.certificadoCamara.name : form.certificadoCamara || '',
        logotipoMarca: form.logotipoMarca && form.logotipoMarca.name ? form.logotipoMarca.name : form.logotipoMarca || '',
        poderRepresentante: form.poderRepresentante && form.poderRepresentante.name ? form.poderRepresentante.name : form.poderRepresentante || '',
        poderAutorizacion: form.poderAutorizacion && form.poderAutorizacion.name ? form.poderAutorizacion.name : form.poderAutorizacion || '',
        motivoAnulacion: form.estado === 'Anulado' ? (form.motivoAnulacion || '') : '',
      };
      actualizarVenta(form.id, datos);
      if (onGuardar) onGuardar(datos);
      onClose();
    }
  };

  // Obtener estados correctos para Certificación de Marca
  let estadosCert = estados;
  if (form.tipoSolicitud === 'Certificación de Marca') {
    const servicios = getServicios();
    const cert = servicios.find(s => s.nombre === 'Certificación de Marca');
    estadosCert = cert && cert.process_states ? cert.process_states.map(e => e.name) : estados;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-3xl p-8 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Editar Solicitud</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-lg p-4">
            {/* Número de Expediente */}
            <div>
              <label className="block text-sm font-medium mb-1">Número de Expediente *</label>
              <input type="text" name="expediente" value={form.expediente || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
              {errors.expediente && <p className="text-xs text-red-600">{errors.expediente}</p>}
            </div>
            {/* Tipo de Solicitante */}
            <div>
              <label className="block text-sm font-medium mb-1">¿Quién solicita el servicio? *</label>
              <select name="tipoSolicitante" value={form.tipoSolicitante || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                <option value="">Seleccionar</option>
                <option value="Titular">Titular</option>
                <option value="Representante Autorizado">Representante Autorizado</option>
              </select>
              {errors.tipoSolicitante && <p className="text-xs text-red-600">{errors.tipoSolicitante}</p>}
            </div>
            {/* Si Titular */}
            {esTitular && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Persona *</label>
                  <select name="tipoPersona" value={form.tipoPersona || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                    <option value="">Seleccionar</option>
                    <option value="Natural">Natural</option>
                    <option value="Jurídica">Jurídica</option>
                  </select>
                  {errors.tipoPersona && <p className="text-xs text-red-600">{errors.tipoPersona}</p>}
                </div>
                {/* Si Natural */}
                {esNatural && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de Documento *</label>
                      <select name="tipoDocumento" value={form.tipoDocumento || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                        <option value="">Seleccionar</option>
                        {tiposDocumento.map(t => <option key={t}>{t}</option>)}
                      </select>
                      {errors.tipoDocumento && <p className="text-xs text-red-600">{errors.tipoDocumento}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Número de Documento *</label>
                      <input type="text" name="numeroDocumento" value={form.numeroDocumento || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                      {errors.numeroDocumento && <p className="text-xs text-red-600">{errors.numeroDocumento}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Nombre Completo *</label>
                      <input type="text" name="nombreCompleto" value={form.nombreCompleto || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                      {errors.nombreCompleto && <p className="text-xs text-red-600">{errors.nombreCompleto}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Correo Electrónico *</label>
                      <input type="email" name="email" value={form.email || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                      {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Teléfono *</label>
                      <input type="text" name="telefono" value={form.telefono || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                      {errors.telefono && <p className="text-xs text-red-600">{errors.telefono}</p>}
                    </div>
                  </>
                )}
                {/* Si Jurídica */}
                {esJuridica && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de Entidad *</label>
                      <select name="tipoEntidad" value={form.tipoEntidad || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                        <option value="">Seleccionar</option>
                        {tiposEntidad.map(t => <option key={t}>{t}</option>)}
                      </select>
                      {errors.tipoEntidad && <p className="text-xs text-red-600">{errors.tipoEntidad}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Razón Social *</label>
                      <input type="text" name="razonSocial" value={form.razonSocial || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                      {errors.razonSocial && <p className="text-xs text-red-600">{errors.razonSocial}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Nombre de la Empresa *</label>
                      <input type="text" name="nombreEmpresa" value={form.nombreEmpresa || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                      {errors.nombreEmpresa && <p className="text-xs text-red-600">{errors.nombreEmpresa}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">NIT *</label>
                      <input type="text" name="nit" value={form.nit || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                      {errors.nit && <p className="text-xs text-red-600">{errors.nit}</p>}
                    </div>
                  </>
                )}
              </>
            )}
            {/* Si Representante Autorizado */}
            {esRepresentante && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Documento *</label>
                  <select name="tipoDocumento" value={form.tipoDocumento || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                    <option value="">Seleccionar</option>
                    {tiposDocumento.map(t => <option key={t}>{t}</option>)}
                  </select>
                  {errors.tipoDocumento && <p className="text-xs text-red-600">{errors.tipoDocumento}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Número de Documento *</label>
                  <input type="text" name="numeroDocumento" value={form.numeroDocumento || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                  {errors.numeroDocumento && <p className="text-xs text-red-600">{errors.numeroDocumento}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre Completo *</label>
                  <input type="text" name="nombreCompleto" value={form.nombreCompleto || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                  {errors.nombreCompleto && <p className="text-xs text-red-600">{errors.nombreCompleto}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Correo Electrónico *</label>
                  <input type="email" name="email" value={form.email || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                  {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono *</label>
                  <input type="text" name="telefono" value={form.telefono || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                  {errors.telefono && <p className="text-xs text-red-600">{errors.telefono}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dirección *</label>
                  <input type="text" name="direccion" value={form.direccion || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                  {errors.direccion && <p className="text-xs text-red-600">{errors.direccion}</p>}
                </div>
              </>
            )}
            {/* Datos de la Marca */}
            <div>
              <label className="block text-sm font-medium mb-1">País *</label>
              <select name="pais" value={form.pais || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                <option value="">Seleccionar</option>
                {paises.map(p => <option key={p}>{p}</option>)}
              </select>
              {errors.pais && <p className="text-xs text-red-600">{errors.pais}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NIT de la Marca *</label>
              <input type="text" name="nitMarca" value={form.nitMarca || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
              {errors.nitMarca && <p className="text-xs text-red-600">{errors.nitMarca}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de la Marca *</label>
              <input type="text" name="nombreMarca" value={form.nombreMarca || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
              {errors.nombreMarca && <p className="text-xs text-red-600">{errors.nombreMarca}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoría *</label>
              <select name="categoria" value={form.categoria || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                <option value="">Seleccionar</option>
                {categorias.map(c => <option key={c}>{c}</option>)}
              </select>
              {errors.categoria && <p className="text-xs text-red-600">{errors.categoria}</p>}
            </div>
          </div>
          {/* Clases de la Marca */}
          <div>
            <label className="block text-sm font-medium mb-1">Clases de la Marca *</label>
            <div className="space-y-2">
              {(form.clases || []).map((clase, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="number" min="1" max="45" placeholder="N° Clase" value={clase.numero} onChange={e => handleClaseChange(i, 'numero', e.target.value)} className="w-24 border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                  <input type="text" placeholder="Descripción (el porqué)" value={clase.descripcion} onChange={e => handleClaseChange(i, 'descripcion', e.target.value)} className="flex-1 border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                  <button type="button" onClick={() => removeClase(i)} className="text-red-500 hover:text-red-700 text-lg">×</button>
                  {errors[`clase_numero_${i}`] && <span className="text-xs text-red-600">{errors[`clase_numero_${i}`]}</span>}
                  {errors[`clase_desc_${i}`] && <span className="text-xs text-red-600">{errors[`clase_desc_${i}`]}</span>}
                </div>
              ))}
              {errors.clases && <p className="text-xs text-red-600">{errors.clases}</p>}
              <button type="button" onClick={addClase} disabled={(form.clases || []).length >= 25} className="mt-2 px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-50">Añadir Clase</button>
            </div>
          </div>
          {/* Adjuntar Documentos Finales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Certificado de Cámara y Comercio</label>
              <input type="file" name="certificadoCamara" onChange={handleChange} className="w-full" />
              {form.certificadoCamara && typeof form.certificadoCamara === 'string' && <div className="text-xs text-gray-500 mt-1">Actual: {form.certificadoCamara}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Logotipo de la Marca</label>
              <input type="file" name="logotipoMarca" onChange={handleChange} className="w-full" />
              {form.logotipoMarca && typeof form.logotipoMarca === 'string' && <div className="text-xs text-gray-500 mt-1">Actual: {form.logotipoMarca}</div>}
            </div>
            {esRepresentante && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Poder del Representante Autorizado</label>
                  <input type="file" name="poderRepresentante" onChange={handleChange} className="w-full" />
                  {form.poderRepresentante && typeof form.poderRepresentante === 'string' && <div className="text-xs text-gray-500 mt-1">Actual: {form.poderRepresentante}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Poder que nos autoriza</label>
                  <input type="file" name="poderAutorizacion" onChange={handleChange} className="w-full" />
                  {form.poderAutorizacion && typeof form.poderAutorizacion === 'string' && <div className="text-xs text-gray-500 mt-1">Actual: {form.poderAutorizacion}</div>}
                </div>
              </>
            )}
          </div>
          {/* Campo de Estado */}
          <div>
            <label className="block text-sm font-medium mb-1">Estado *</label>
            <select name="estado" value={form.estado || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
              <option value="">Seleccionar</option>
              {estadosCert.map(e => <option key={e}>{e}</option>)}
            </select>
            {errors.estado && <p className="text-xs text-red-600">{errors.estado}</p>}
          </div>
          {/* Motivo de Anulación */}
          {form.estado === 'Anulado' && (
            <div>
              <label className="block text-sm font-medium mb-1 text-red-700">Motivo de Anulación *</label>
              <textarea
                name="motivoAnulacion"
                value={form.motivoAnulacion || ''}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-red-50 text-red-800"
                rows={3}
                placeholder="Explica el motivo de la anulación..."
                required
              />
              {errors.motivoAnulacion && <p className="text-xs text-red-600">{errors.motivoAnulacion}</p>}
            </div>
          )}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition focus:ring-2 focus:ring-blue-400">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarVenta;
