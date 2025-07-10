import React, { useState, useEffect } from 'react';
import { PAISES } from '../utils/paises.js';
import Swal from 'sweetalert2';

const tiposDocumento = ['Cédula', 'Pasaporte', 'DNI', 'Otro'];

const FormularioBusqueda = ({ isOpen, onClose, onGuardar, tipoSolicitud = 'Búsqueda de Marca' }) => {
  const [form, setForm] = useState({
    expediente: '',
    tipoSolicitante: 'Representante Autorizado',
    tipoDocumento: '',
    numeroDocumento: '',
    nombreCompleto: '',
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

  useEffect(() => {
    if (isOpen) {
      setForm(f => ({ ...f, tipoSolicitud: tipoSolicitud }));
      setErrors({});
    } else {
      setForm({
        expediente: '',
        tipoSolicitante: 'Representante Autorizado',
        tipoDocumento: '',
        numeroDocumento: '',
        nombreCompleto: '',
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
      setErrors({});
    }
  }, [isOpen, tipoSolicitud]);

  const validate = (customForm) => {
    const f = customForm || form;
    const e = {};
    if (!f.expediente) e.expediente = 'Requerido';
    else if (!/^[0-9]{6,15}$/.test(f.expediente)) e.expediente = 'Solo números, 6-15 dígitos';
    if (!f.tipoDocumento) e.tipoDocumento = 'Requerido';
    if (!f.numeroDocumento) e.numeroDocumento = 'Requerido';
    else if (f.tipoDocumento !== 'Pasaporte' && !/^[0-9]{6,15}$/.test(f.numeroDocumento)) e.numeroDocumento = 'Solo números, 6-15 dígitos';
    else if (f.tipoDocumento === 'Pasaporte' && !/^[A-Za-z0-9]{6,20}$/.test(f.numeroDocumento)) e.numeroDocumento = 'Pasaporte: solo letras y números, 6-20 caracteres';
    if (!f.nombreCompleto) e.nombreCompleto = 'Requerido';
    else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,50}$/.test(f.nombreCompleto)) e.nombreCompleto = 'Solo letras, 2-50 caracteres';
    if (!f.email) e.email = 'Requerido';
    else if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Correo inválido';
    if (!f.telefono) e.telefono = 'Requerido';
    else if (!/^[0-9]{7,15}$/.test(f.telefono)) e.telefono = 'Solo números, 7-15 dígitos';
    if (!f.direccion) e.direccion = 'Requerido';
    else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,#-]{5,100}$/.test(f.direccion)) e.direccion = 'Dirección inválida';
    if (!f.pais) e.pais = 'Requerido';
    if (!f.nitMarca) e.nitMarca = 'Requerido';
    else if (!/^[0-9]{6,15}$/.test(f.nitMarca)) e.nitMarca = 'Solo números, 6-15 dígitos';
    if (!f.nombreMarca) e.nombreMarca = 'Requerido';
    else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,&-]{2,80}$/.test(f.nombreMarca)) e.nombreMarca = 'Solo letras, números y básicos, 2-80 caracteres';
    if (!f.clases.length) e.clases = 'Agrega al menos una clase';
    f.clases.forEach((c, i) => {
      if (!c.numero) e[`clase_numero_${i}`] = 'Número requerido';
      if (!c.descripcion) e[`clase_desc_${i}`] = 'Descripción requerida';
    });
    if (!f.poderRepresentante) e.poderRepresentante = 'Adjunta el poder';
    if (!f.poderAutorizacion) e.poderAutorizacion = 'Adjunta el poder';
    return e;
  };

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    let newValue = type === 'file' ? files[0] : value;
    setForm(f => {
      const updatedForm = { ...f, [name]: newValue };
      const newErrors = validate(updatedForm);
      setErrors(newErrors);
      return updatedForm;
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        text: 'Por favor, corrige los campos marcados en rojo antes de continuar.'
      });
      return;
    }
    try {
      await onGuardar(form);
      Swal.fire({
        icon: 'success',
        title: 'Solicitud creada',
        text: 'La solicitud de búsqueda se ha creado correctamente.'
      });
      onClose();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: err?.message || 'Ocurrió un error al guardar la solicitud.'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-60 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-3xl p-8 overflow-y-auto max-h-[90vh]">
        {/* Encabezado con ícono, título y subtítulo */}
        <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-t-xl mb-6">
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2563eb" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 12.362-12.303ZM19 7l-2-2" />
            </svg>
          </span>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Solicitud de Búsqueda de Marca</h2>
            <p className="text-sm text-gray-500">Complete la información del proceso</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-lg p-4">
            {/* Número de Expediente */}
            <div>
              <label className="block text-sm font-medium mb-1">Número de Expediente *</label>
              <input type="text" name="expediente" value={form.expediente} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.expediente ? 'border-red-500' : ''}`} />
              {errors.expediente && <p className="text-xs text-red-600">{errors.expediente}</p>}
            </div>
            {/* Tipo de Solicitud (bloqueado) */}
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Solicitud *</label>
              <input
                type="text"
                name="tipoSolicitud"
                value={form.tipoSolicitud}
                readOnly
                className="w-full border rounded p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            {/* Datos del Representante */}
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Documento *</label>
              <select name="tipoDocumento" value={form.tipoDocumento} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.tipoDocumento ? 'border-red-500' : ''}`}>
                <option value="">Seleccionar</option>
                {tiposDocumento.map(t => <option key={t}>{t}</option>)}
              </select>
              {errors.tipoDocumento && <p className="text-xs text-red-600">{errors.tipoDocumento}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Número de Documento *</label>
              <input type="text" name="numeroDocumento" value={form.numeroDocumento} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.numeroDocumento ? 'border-red-500' : ''}`} />
              {errors.numeroDocumento && <p className="text-xs text-red-600">{errors.numeroDocumento}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre Completo *</label>
              <input type="text" name="nombreCompleto" value={form.nombreCompleto} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.nombreCompleto ? 'border-red-500' : ''}`} />
              {errors.nombreCompleto && <p className="text-xs text-red-600">{errors.nombreCompleto}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Correo Electrónico *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.email ? 'border-red-500' : ''}`} />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono *</label>
              <input type="text" name="telefono" value={form.telefono} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.telefono ? 'border-red-500' : ''}`} />
              {errors.telefono && <p className="text-xs text-red-600">{errors.telefono}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dirección *</label>
              <input type="text" name="direccion" value={form.direccion} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.direccion ? 'border-red-500' : ''}`} />
              {errors.direccion && <p className="text-xs text-red-600">{errors.direccion}</p>}
            </div>
            {/* Datos de la Marca */}
            <div>
              <label className="block text-sm font-medium mb-1">País *</label>
              <div className="flex items-center gap-2">
                <select name="pais" value={form.pais} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.pais ? 'border-red-500' : ''}`}>
                  <option value="">Seleccionar</option>
                  {PAISES.map(p => (
                    <option key={p.codigo} value={p.nombre}>{p.nombre}</option>
                  ))}
                </select>
                {form.pais && PAISES.find(p => p.nombre === form.pais) && (
                  <img
                    src={PAISES.find(p => p.nombre === form.pais).bandera}
                    alt={form.pais}
                    title={form.pais}
                    className="w-7 h-5 rounded shadow border border-gray-300"
                  />
                )}
              </div>
              {errors.pais && <p className="text-xs text-red-600">{errors.pais}</p>}
            </div>
                <div>
              <label className="block text-sm font-medium mb-1">NIT de la Marca *</label>
              <input type="text" name="nitMarca" value={form.nitMarca} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.nitMarca ? 'border-red-500' : ''}`} />
              {errors.nitMarca && <p className="text-xs text-red-600">{errors.nitMarca}</p>}
                </div>
                <div>
              <label className="block text-sm font-medium mb-1">Nombre de la Marca *</label>
              <input type="text" name="nombreMarca" value={form.nombreMarca} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.nombreMarca ? 'border-red-500' : ''}`} />
              {errors.nombreMarca && <p className="text-xs text-red-600">{errors.nombreMarca}</p>}
            </div>
          </div>
          {/* Clases de la Marca */}
          <div>
            <label className="block text-sm font-medium mb-1">Clases de la Marca *</label>
            <div className="space-y-2">
              {form.clases.map((clase, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="number" min="1" max="45" placeholder="N° Clase" value={clase.numero} onChange={e => handleClaseChange(i, 'numero', e.target.value)} className="w-24 border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                  <input type="text" placeholder="Descripción (el porqué)" value={clase.descripcion} onChange={e => handleClaseChange(i, 'descripcion', e.target.value)} className="flex-1 border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" />
                  <button type="button" onClick={() => removeClase(i)} className="text-red-500 hover:text-red-700 text-lg">×</button>
                  {errors[`clase_numero_${i}`] && <span className="text-xs text-red-600">{errors[`clase_numero_${i}`]}</span>}
                  {errors[`clase_desc_${i}`] && <span className="text-xs text-red-600">{errors[`clase_desc_${i}`]}</span>}
                </div>
              ))}
              {errors.clases && <p className="text-xs text-red-600">{errors.clases}</p>}
              <button type="button" onClick={addClase} disabled={form.clases.length >= 25} className="mt-2 px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-50">Añadir Clase</button>
              </div>
          </div>
          {/* Adjuntar Documentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Poder del Representante Autorizado *</label>
              <input type="file" name="poderRepresentante" onChange={handleChange} className="w-full" />
              {errors.poderRepresentante && <p className="text-xs text-red-600">{errors.poderRepresentante}</p>}
              </div>
            <div>
              <label className="block text-sm font-medium mb-1">Poder que nos autoriza *</label>
              <input type="file" name="poderAutorizacion" onChange={handleChange} className="w-full" />
              {errors.poderAutorizacion && <p className="text-xs text-red-600">{errors.poderAutorizacion}</p>}
              </div>
              </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition focus:ring-2 focus:ring-blue-400">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioBusqueda;
