import React, { useState, useEffect } from 'react';
import { actualizarVenta, agregarComentario } from '../services/ventasService';
import { mockDataService } from '../../../../../utils/mockDataService';
import Swal from 'sweetalert2';
import { PAISES } from '../../../../../shared/utils/paises.js';

const tiposDocumento = ['Cédula', 'Pasaporte', 'DNI', 'Otro'];
const tiposEntidad = ['Sociedad Anónima', 'SAS', 'LTDA', 'Otra'];
const categorias = ['Productos', 'Servicios'];
const estados = ['En revisión', 'Pendiente', 'Pendiente firma', 'Finalizado', 'Anulado'];

const EditarVenta = ({ datos, isOpen, onClose, onGuardar }) => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [justificacionCambioEstado, setJustificacionCambioEstado] = useState("");
  const [estadoAnterior, setEstadoAnterior] = useState("");
  // 1. Agregar estado para el proceso seleccionado para mostrar el modal/tooltip
  const [procesoInfo, setProcesoInfo] = useState(null);

  useEffect(() => {
    if (isOpen && datos) {
      setEstadoAnterior(datos.estado || "");
      setJustificacionCambioEstado("");
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

  const validate = (customForm) => {
    const f = customForm || form;
    const e = {};
    if (!f.expediente) e.expediente = 'Requerido';
    else if (!/^[0-9]{6,15}$/.test(f.expediente)) e.expediente = 'Solo números, 6-15 dígitos';
    if (!f.tipoSolicitante) e.tipoSolicitante = 'Requerido';
    if (f.tipoSolicitante === 'Titular') {
      if (!f.tipoPersona) e.tipoPersona = 'Requerido';
      if (f.tipoPersona === 'Natural') {
        if (!f.tipoDocumento) e.tipoDocumento = 'Requerido';
        if (!f.numeroDocumento) e.numeroDocumento = 'Requerido';
        else if (f.tipoDocumento !== 'Pasaporte' && !/^[0-9]{6,15}$/.test(f.numeroDocumento)) e.numeroDocumento = 'Solo números, 6-15 dígitos';
        else if (f.tipoDocumento === 'Pasaporte' && !/^[A-Za-z0-9]{6,20}$/.test(f.numeroDocumento)) e.numeroDocumento = 'Pasaporte: solo letras y números, 6-20 caracteres';
        if (!f.nombres) e.nombres = 'Requerido';
        else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,50}$/.test(f.nombres)) e.nombres = 'Solo letras, 2-50 caracteres';
        if (!f.apellidos) e.apellidos = 'Requerido';
        else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,50}$/.test(f.apellidos)) e.apellidos = 'Solo letras, 2-50 caracteres';
        if (!f.email) e.email = 'Requerido';
        else if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Correo inválido';
        if (!f.telefono) e.telefono = 'Requerido';
        else if (!/^[0-9]{7,15}$/.test(f.telefono)) e.telefono = 'Solo números, 7-15 dígitos';
      }
      if (f.tipoPersona === 'Jurídica') {
        if (!f.tipoEntidad) e.tipoEntidad = 'Requerido';
        if (!f.razonSocial) e.razonSocial = 'Requerido';
        else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,&-]{2,80}$/.test(f.razonSocial)) e.razonSocial = 'Solo letras, números y básicos, 2-80 caracteres';
        if (!f.nombreEmpresa) e.nombreEmpresa = 'Requerido';
        else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,&-]{2,80}$/.test(f.nombreEmpresa)) e.nombreEmpresa = 'Solo letras, números y básicos, 2-80 caracteres';
        if (!f.nit) e.nit = 'Requerido';
        else if (!/^[0-9]{6,15}$/.test(f.nit)) e.nit = 'Solo números, 6-15 dígitos';
      }
    }
    if (f.tipoSolicitante === 'Representante Autorizado') {
      if (!f.tipoDocumento) e.tipoDocumento = 'Requerido';
      if (!f.numeroDocumento) e.numeroDocumento = 'Requerido';
      else if (f.tipoDocumento !== 'Pasaporte' && !/^[0-9]{6,15}$/.test(f.numeroDocumento)) e.numeroDocumento = 'Solo números, 6-15 dígitos';
      else if (f.tipoDocumento === 'Pasaporte' && !/^[A-Za-z0-9]{6,20}$/.test(f.numeroDocumento)) e.numeroDocumento = 'Pasaporte: solo letras y números, 6-20 caracteres';
      if (!f.nombres) e.nombres = 'Requerido';
      else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,50}$/.test(f.nombres)) e.nombres = 'Solo letras, 2-50 caracteres';
      if (!f.apellidos) e.apellidos = 'Requerido';
      else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,50}$/.test(f.apellidos)) e.apellidos = 'Solo letras, 2-50 caracteres';
      if (!f.email) e.email = 'Requerido';
      else if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Correo inválido';
      if (!f.telefono) e.telefono = 'Requerido';
      else if (!/^[0-9]{7,15}$/.test(f.telefono)) e.telefono = 'Solo números, 7-15 dígitos';
      if (!f.direccion) e.direccion = 'Requerido';
      else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,#-]{5,100}$/.test(f.direccion)) e.direccion = 'Dirección inválida';
    }
    if (!f.pais) e.pais = 'Requerido';
    if (!f.nitMarca) e.nitMarca = 'Requerido';
    else if (!/^[0-9]{6,15}$/.test(f.nitMarca)) e.nitMarca = 'Solo números, 6-15 dígitos';
    if (!f.nombreMarca) e.nombreMarca = 'Requerido';
    else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,&-]{2,80}$/.test(f.nombreMarca)) e.nombreMarca = 'Solo letras, números y básicos, 2-80 caracteres';
    if (!f.categoria) e.categoria = 'Requerido';
    if (!f.clases || !f.clases.length) e.clases = 'Agrega al menos una clase';
    (f.clases || []).forEach((c, i) => {
      if (!c.numero) e[`clase_numero_${i}`] = 'Número requerido';
      if (!c.descripcion) e[`clase_desc_${i}`] = 'Descripción requerida';
    });
    if (f.estado === 'Anulado' && (!f.motivoAnulacion || !f.motivoAnulacion.trim())) {
      e.motivoAnulacion = 'Debes ingresar el motivo de anulación';
    }
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

  // Utilidad para convertir File a base64
  const fileToBase64 = file => new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      AlertService.error("Error en el formulario", "Por favor, corrige los campos marcados en rojo antes de continuar.");
      return;
    }
    try {
      // Convertir archivos a base64 antes de guardar
      const formToSave = { ...form };
      const fileFields = [
        'certificadoCamara',
        'logotipoMarca',
        'poderRepresentante',
        'poderAutorizacion',
      ];
      for (const field of fileFields) {
        if (formToSave[field] instanceof File) {
          formToSave[field] = await fileToBase64(formToSave[field]);
        }
      }
      await onGuardar(formToSave);
      AlertService.success("Solicitud actualizada", "La solicitud se ha actualizado correctamente.");
      onClose();
    } catch (err) {
      AlertService.error("Error al guardar", "");
    }
  };

  // Obtener estados correctos para Certificación de Marca
  let estadosCert = estados;
  if (form.tipoSolicitud === 'Certificación de Marca') {
    const servicios = mockDataService.getServices();
    const cert = servicios.find(s => s.nombre === 'Certificación de Marca');
    estadosCert = cert && cert.process_states ? cert.process_states.map(e => e.name) : estados;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-3xl p-8 overflow-y-auto max-h-[90vh]">
        {/* Encabezado moderno con ícono, título y subtítulo */}
        <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-t-xl mb-6">
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2563eb" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 12.362-12.303ZM19 7l-2-2" />
            </svg>
          </span>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">Editar Solicitud</h2>
            <p className="text-sm text-gray-500">Editando: {form.nombreCompleto || form.nombreEmpresa || form.titular || 'Solicitud'}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-lg p-4">
            {/* Número de Expediente */}
            <div>
              <label className="block text-sm font-medium mb-1">Número de Expediente *</label>
              <input type="text" name="expediente" value={form.expediente || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.expediente ? 'border-red-500' : ''}`} />
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
                      <input type="text" name="numeroDocumento" value={form.numeroDocumento || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.numeroDocumento ? 'border-red-500' : ''}`} />
                      {errors.numeroDocumento && <p className="text-xs text-red-600">{errors.numeroDocumento}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Nombres *</label>
                      <input type="text" name="nombres" value={form.nombres || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.nombres ? 'border-red-500' : ''}`} />
                      {errors.nombres && <p className="text-xs text-red-600">{errors.nombres}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Apellidos *</label>
                      <input type="text" name="apellidos" value={form.apellidos || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.apellidos ? 'border-red-500' : ''}`} />
                      {errors.apellidos && <p className="text-xs text-red-600">{errors.apellidos}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Correo Electrónico *</label>
                      <input type="email" name="email" value={form.email || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.email ? 'border-red-500' : ''}`} />
                      {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Teléfono *</label>
                      <input type="text" name="telefono" value={form.telefono || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.telefono ? 'border-red-500' : ''}`} />
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
                      <input type="text" name="razonSocial" value={form.razonSocial || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.razonSocial ? 'border-red-500' : ''}`} />
                      {errors.razonSocial && <p className="text-xs text-red-600">{errors.razonSocial}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Nombre de la Empresa *</label>
                      <input type="text" name="nombreEmpresa" value={form.nombreEmpresa || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.nombreEmpresa ? 'border-red-500' : ''}`} />
                      {errors.nombreEmpresa && <p className="text-xs text-red-600">{errors.nombreEmpresa}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">NIT *</label>
                      <input type="text" name="nit" value={form.nit || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.nit ? 'border-red-500' : ''}`} />
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
                  <input type="text" name="numeroDocumento" value={form.numeroDocumento || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.numeroDocumento ? 'border-red-500' : ''}`} />
                  {errors.numeroDocumento && <p className="text-xs text-red-600">{errors.numeroDocumento}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nombres *</label>
                  <input type="text" name="nombres" value={form.nombres || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.nombres ? 'border-red-500' : ''}`} />
                  {errors.nombres && <p className="text-xs text-red-600">{errors.nombres}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Apellidos *</label>
                  <input type="text" name="apellidos" value={form.apellidos || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.apellidos ? 'border-red-500' : ''}`} />
                  {errors.apellidos && <p className="text-xs text-red-600">{errors.apellidos}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Correo Electrónico *</label>
                  <input type="email" name="email" value={form.email || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.email ? 'border-red-500' : ''}`} />
                  {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono *</label>
                  <input type="text" name="telefono" value={form.telefono || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.telefono ? 'border-red-500' : ''}`} />
                  {errors.telefono && <p className="text-xs text-red-600">{errors.telefono}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dirección *</label>
                  <input type="text" name="direccion" value={form.direccion || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.direccion ? 'border-red-500' : ''}`} />
                  {errors.direccion && <p className="text-xs text-red-600">{errors.direccion}</p>}
                </div>
              </>
            )}
            {/* Datos de la Marca */}
            <div>
              <label className="block text-sm font-medium mb-1">País *</label>
              <div className="flex items-center gap-2">
                <select name="pais" value={form.pais || ''} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
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
              <input type="text" name="nitMarca" value={form.nitMarca || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.nitMarca ? 'border-red-500' : ''}`} />
              {errors.nitMarca && <p className="text-xs text-red-600">{errors.nitMarca}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de la Marca *</label>
              <input type="text" name="nombreMarca" value={form.nombreMarca || ''} onChange={handleChange} className={`w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${errors.nombreMarca ? 'border-red-500' : ''}`} />
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
              {/* Render de procesos disponibles con icono 'i' */}
              <div className="flex flex-col gap-2 mt-2">
                {estadosCert.map((proceso, idx) => (
                  <div key={proceso} className="flex items-center gap-2">
                    <span>{proceso}</span>
                    <button type="button" title="Información del proceso" className="text-blue-500" onClick={() => setProcesoInfo(proceso)}>
                      <i className="bi bi-info-circle"></i>
                    </button>
                  </div>
                ))}
              </div>
            </select>
            {errors.estado && <p className="text-xs text-red-600">{errors.estado}</p>}
          </div>
          {/* Justificación de cambio de estado */}
          {form.estado !== estadoAnterior && (
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-700">Justificación del cambio de estado *</label>
              <textarea
                name="justificacionCambioEstado"
                value={justificacionCambioEstado}
                onChange={e => setJustificacionCambioEstado(e.target.value)}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-blue-50 text-blue-800"
                rows={3}
                placeholder="Explica el motivo del cambio de estado..."
                required
              />
              {errors.justificacionCambioEstado && <p className="text-xs text-red-600">{errors.justificacionCambioEstado}</p>}
            </div>
          )}
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
      {/* 3. Modal/tooltip para mostrar la información del proceso seleccionado */}
      {procesoInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-2 text-blue-700 flex items-center gap-2">
              <i className="bi bi-info-circle text-blue-500"></i> Información del Proceso
            </h3>
            <p className="text-gray-700 mb-4">
              {/* Texto fijo por proceso */}
              {procesoInfo === 'En revisión' && 'Este proceso corresponde a la etapa de revisión documental.'}
              {procesoInfo === 'Pendiente' && 'El proceso está pendiente de acción por parte del solicitante o encargado.'}
              {procesoInfo === 'Pendiente firma' && 'El proceso requiere la firma de los documentos correspondientes.'}
              {procesoInfo === 'Finalizado' && 'El proceso ha sido completado exitosamente.'}
              {procesoInfo === 'Anulado' && 'El proceso ha sido anulado y no continuará.'}
              {/* Puedes agregar más textos fijos según los procesos */}
              {!['En revisión','Pendiente','Pendiente firma','Finalizado','Anulado'].includes(procesoInfo) && 'Información no disponible para este proceso.'}
            </p>
            <div className="flex justify-end">
              <button onClick={() => setProcesoInfo(null)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarVenta;
