import React, { useState, useEffect } from 'react';
import { crearVenta } from '../services/ventasService';
import { getServicios } from '../services/serviciosManagementService';
import authData from '../../../../auth/services/authData.js';
import Swal from 'sweetalert2';
import { PAISES } from '../../../../../shared/utils/paises.js';
// Importar formularios específicos
import FormularioBusqueda from '../../../../../shared/components/formularioBusqueda';
import FormularioCertificacion from '../../../../../shared/components/formularioCertificacion';
import FormularioRenovacion from '../../../../../shared/components/formularioCesiondeMarca';
import FormularioOposicion from '../../../../../shared/components/formularioOposicion';
import FormularioCesion from '../../../../../shared/components/formularioCesiondeMarca';
import FormularioAmpliacion from '../../../../../shared/components/formularioAmpliacion';
import FormularioRespuesta from '../../../../../shared/components/formularioRespuesta';

// Mapeo de formularios por servicio
const FORMULARIOS_POR_SERVICIO = {
  'Búsqueda de Antecedentes': FormularioBusqueda,
  'Certificación de Marca': FormularioCertificacion,
  'Renovación de Marca': FormularioRenovacion,
  'Oposición': FormularioOposicion,
  'Cesión de Marca': FormularioCesion,
  'Ampliamiento de Alcance': FormularioAmpliacion,
  'Respuesta a Oposición': FormularioRespuesta,
};

const tiposDocumento = ['Cédula', 'Pasaporte', 'DNI', 'Otro'];
const tiposEntidad = ['Sociedad Anónima', 'SAS', 'LTDA', 'Otra'];
const categorias = ['Productos', 'Servicios'];

const CrearSolicitud = ({ isOpen, onClose, onGuardar, tipoSolicitud, servicioId }) => {
  // Buscar el nombre del servicio si viene servicioId
  const [servicioNombre, setServicioNombre] = useState('');
  useEffect(() => {
    if (servicioId) {
      const servicio = getServicios().find(s => s.id === servicioId);
      setServicioNombre(servicio ? servicio.nombre : '');
    } else {
      setServicioNombre('');
    }
  }, [servicioId]);

  // Renderizar el formulario correspondiente
  const FormularioComponente = FORMULARIOS_POR_SERVICIO[tipoSolicitud || servicioNombre || 'Certificación de Marca'];

  const [form, setForm] = useState({
    expediente: '',
    tipoSolicitante: '', // Titular o Representante Autorizado
    tipoPersona: '', // Natural o Jurídica
    tipoDocumento: '',
    numeroDocumento: '',
    nombreCompleto: '',
    email: '',
    telefono: '',
    direccion: '',
    tipoEntidad: '',
    razonSocial: '',
    nombreEmpresa: '',
    nit: '',
    pais: '',
    nitMarca: '',
    nombreMarca: '',
    categoria: '',
    clases: [{ numero: '', descripcion: '' }],
    certificadoCamara: null,
    logotipoMarca: null,
    poderRepresentante: null,
    poderAutorizacion: null,
    fechaSolicitud: '',
    estado: 'En revisión',
    tipoSolicitud: tipoSolicitud || servicioNombre || 'Certificación de Marca',
    encargado: 'Sin asignar',
    proximaCita: null,
    comentarios: []
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm(f => ({ ...f, tipoSolicitud: tipoSolicitud || servicioNombre || 'Certificación de Marca' }));
      setErrors({});
    } else {
      // Limpiar el formulario cuando se cierra el modal
      setForm({
        expediente: '',
        tipoSolicitante: '',
        tipoPersona: '',
        tipoDocumento: '',
        numeroDocumento: '',
        nombreCompleto: '',
        email: '',
        telefono: '',
        direccion: '',
        tipoEntidad: '',
        razonSocial: '',
        nombreEmpresa: '',
        nit: '',
        pais: '',
        nitMarca: '',
        nombreMarca: '',
        categoria: '',
        clases: [{ numero: '', descripcion: '' }],
        certificadoCamara: null,
        logotipoMarca: null,
        poderRepresentante: null,
        poderAutorizacion: null,
        fechaSolicitud: '',
        estado: 'En revisión',
        tipoSolicitud: tipoSolicitud || servicioNombre || 'Certificación de Marca',
        encargado: 'Sin asignar',
        proximaCita: null,
        comentarios: []
      });
      setErrors({});
    }
  }, [isOpen, tipoSolicitud, servicioNombre]);

  // Lógica para campos condicionales
  const esTitular = form.tipoSolicitante === 'Titular';
  const esRepresentante = form.tipoSolicitante === 'Representante Autorizado';
  const esNatural = form.tipoPersona === 'Natural';
  const esJuridica = form.tipoPersona === 'Jurídica';

  // Validación simple
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
        if (!f.nombreCompleto) e.nombreCompleto = 'Requerido';
        else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,50}$/.test(f.nombreCompleto)) e.nombreCompleto = 'Solo letras, 2-50 caracteres';
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
      if (!f.nombreCompleto) e.nombreCompleto = 'Requerido';
      else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,50}$/.test(f.nombreCompleto)) e.nombreCompleto = 'Solo letras, 2-50 caracteres';
      if (!f.email) e.email = 'Requerido';
      else if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Correo inválido';
      if (!f.telefono) e.telefono = 'Requerido';
      else if (!/^[0-9]{7,15}$/.test(f.telefono)) e.telefono = 'Solo números, 7-15 dígitos';
      if (!f.direccion) e.direccion = 'Requerido';
      else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,#-]{5,100}$/.test(f.direccion)) e.direccion = 'Dirección inválida';
      if (!f.poderRepresentante) e.poderRepresentante = 'Adjunta el poder';
      if (!f.poderAutorizacion) e.poderAutorizacion = 'Adjunta el poder';
    }
    if (!f.pais) e.pais = 'Requerido';
    if (!f.nitMarca) e.nitMarca = 'Requerido';
    else if (!/^[0-9]{6,15}$/.test(f.nitMarca)) e.nitMarca = 'Solo números, 6-15 dígitos';
    if (!f.nombreMarca) e.nombreMarca = 'Requerido';
    else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,&-]{2,80}$/.test(f.nombreMarca)) e.nombreMarca = 'Solo letras, números y básicos, 2-80 caracteres';
    if (!f.categoria) e.categoria = 'Requerido';
    if (!f.clases.length) e.clases = 'Agrega al menos una clase';
    f.clases.forEach((c, i) => {
      if (!c.numero) e[`clase_numero_${i}`] = 'Número requerido';
      if (!c.descripcion) e[`clase_desc_${i}`] = 'Descripción requerida';
    });
    if (!f.certificadoCamara) e.certificadoCamara = 'Adjunta el certificado';
    if (!f.logotipoMarca) e.logotipoMarca = 'Adjunta el logotipo';
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
        text: 'La solicitud se ha creado correctamente.'
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

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-3xl p-8 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Crear Solicitud</h2>
          {/* Renderizar el formulario dinámico */}
          {FormularioComponente ? (
            <FormularioComponente
              isOpen={isOpen}
              onClose={onClose}
              onGuardar={onGuardar}
              tipoSolicitud={tipoSolicitud}
              servicioId={servicioId}
            />
          ) : (
            <div className="text-red-500">No hay formulario disponible para este servicio.</div>
          )}
          <div className="flex justify-end mt-6">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-700 font-semibold">Cancelar</button>
          </div>
          </div>
      </div>
    )
  );
};

export default CrearSolicitud; 