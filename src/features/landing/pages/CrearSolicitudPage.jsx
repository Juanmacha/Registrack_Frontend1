import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDataService } from '../../../utils/mockDataService';
import NavBarLanding from '../../landing/components/landingNavbar';
import authData from '../../auth/services/authData.js';
import alertService from '../../../utils/alertService.js';
import { crearVenta } from '../../dashboard/pages/gestionVentasServicios/services/ventasService';

const CrearSolicitudPage = () => {
  const { servicioId } = useParams();
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
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
    pais: 'Colombia',
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
    tipoSolicitud: '',
    encargado: 'Sin asignar',
    comentarios: []
  });

  const tiposDocumento = ['Cédula de Ciudadanía', 'Pasaporte', 'DNI', 'Tarjeta de Identidad', 'NIT'];
  const tiposEntidad = ['Sociedad Anónima', 'SAS', 'LTDA', 'Empresa Unipersonal', 'Otra'];
  const categorias = ['Productos', 'Servicios', 'Ambos'];
  const paisesFallback = ['Colombia', 'Perú', 'México', 'Argentina', 'Chile', 'Ecuador', 'Venezuela', 'Otro'];

  useEffect(() => {
    if (servicioId) {
      const servicioEncontrado = mockDataService.getServices().find(s => s.id === servicioId);
      setServicio(servicioEncontrado);
      setForm(prev => ({ ...prev, tipoSolicitud: servicioEncontrado?.nombre || '' }));
      setLoading(false);
    }
  }, [servicioId]);

  useEffect(() => {
    // Cargar datos del usuario si está autenticado
    const user = authData.getUser();
    if (user) {
      setForm(prev => ({
        ...prev,
        email: user.email || '',
        nombreCompleto: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '',
        numeroDocumento: user.documentNumber || ''
      }));
    }
  }, []);

  const siguientePaso = () => setPaso(prev => prev + 1);
  const pasoAnterior = () => setPaso(prev => prev - 1);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm(f => ({ ...f, [name]: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleClaseChange = (i, field, value) => {
    setForm(f => {
      const clases = [...f.clases];
      clases[i][field] = value;
      return { ...f, clases };
    });
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
    
    try {
      const user = authData.getUser();
      if (!user || !user.email) {
        await alertService.error(
          "Error", 
          "Debes iniciar sesión para crear una solicitud."
        );
        navigate('/login');
        return;
      }

      // Preparar los datos de la solicitud
      const datos = {
        ...form,
        email: user.email,
        fechaSolicitud: new Date().toISOString().slice(0, 10),
        certificadoCamara: form.certificadoCamara?.name || '',
        logotipoMarca: form.logotipoMarca?.name || '',
        poderRepresentante: form.poderRepresentante?.name || '',
        poderAutorizacion: form.poderAutorizacion?.name || '',
        estado: 'En revisión',
        encargado: 'Sin asignar',
        comentarios: []
      };

      // Guardar la solicitud usando crearVenta
      await crearVenta(datos);

      await alertService.success(
        "Solicitud creada", 
        `Tu solicitud de ${form.tipoSolicitud} ha sido creada exitosamente. Te contactaremos pronto.`
      );
      
      navigate('/misprocesos');
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      await alertService.error(
        "Error", 
        "Hubo un problema al crear la solicitud. Por favor, intenta nuevamente."
      );
    }
  };

  const esTitular = form.tipoSolicitante === 'Titular';
  const esRepresentante = form.tipoSolicitante === 'Representante Autorizado';
  const esNatural = form.tipoPersona === 'Natural';
  const esJuridica = form.tipoPersona === 'Jurídica';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBarLanding />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!servicio) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBarLanding />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Servicio no encontrado</h2>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBarLanding />
      <div className="max-w-4xl mx-auto pt-[30px] p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">{servicio.nombre}</h1>
            <p className="text-gray-600">{servicio.descripcion_corta}</p>
            <div className="mt-4">
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Paso {paso} de 5
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Paso 1: Información básica */}
            {paso === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Información básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número de Expediente *</label>
                    <input 
                      type="text" 
                      name="expediente" 
                      value={form.expediente} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Solicitante *</label>
                    <select 
                      name="tipoSolicitante" 
                      value={form.tipoSolicitante} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar</option>
                      <option value="Titular">Titular</option>
                      <option value="Representante Autorizado">Representante Autorizado</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Solicitud *</label>
                    <input 
                      type="text" 
                      name="tipoSolicitud" 
                      value={form.tipoSolicitud} 
                      readOnly 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 2: Datos del solicitante */}
            {paso === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Datos del solicitante</h3>
                <div className="space-y-4">
                  {esTitular && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Persona *</label>
                      <select 
                        name="tipoPersona" 
                        value={form.tipoPersona} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Seleccionar</option>
                        <option value="Natural">Natural</option>
                        <option value="Jurídica">Jurídica</option>
                      </select>
                    </div>
                  )}
                  {esRepresentante && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                      <input 
                        type="text" 
                        name="nombreCompleto" 
                        value={form.nombreCompleto} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  )}
                  {esNatural && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento *</label>
                        <select 
                          name="tipoDocumento" 
                          value={form.tipoDocumento} 
                          onChange={handleChange} 
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Seleccionar</option>
                          {tiposDocumento.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número de Documento *</label>
                        <input 
                          type="text" 
                          name="numeroDocumento" 
                          value={form.numeroDocumento} 
                          onChange={handleChange} 
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  )}
                  {esJuridica && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Entidad *</label>
                        <select 
                          name="tipoEntidad" 
                          value={form.tipoEntidad} 
                          onChange={handleChange} 
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Seleccionar</option>
                          {tiposEntidad.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">NIT *</label>
                        <input 
                          type="text" 
                          name="nit" 
                          value={form.nit} 
                          onChange={handleChange} 
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Paso 3: Datos de la marca */}
            {paso === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Datos de la marca</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">País *</label>
                    <select 
                      name="pais" 
                      value={form.pais} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar</option>
                      {paisesFallback.map(pais => (
                        <option key={pais} value={pais}>{pais}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NIT Marca *</label>
                    <input 
                      type="text" 
                      name="nitMarca" 
                      value={form.nitMarca} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Marca *</label>
                    <input 
                      type="text" 
                      name="nombreMarca" 
                      value={form.nombreMarca} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 4: Clases de la marca */}
            {paso === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Clases de la marca</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clases NIZA *</label>
                  <p className="text-sm text-gray-600 mb-4">
                    Seleccione las clases en las cuales desea registrar su marca. 
                    Si necesita ayuda, use nuestro{" "}
                    <a href="#" className="text-blue-600 underline">Buscador de CLASE NIZA</a>.
                  </p>
                  
                  {form.clases.map((clase, i) => (
                    <div key={i} className="flex items-center gap-2 mb-3">
                      <input 
                        type="number" 
                        placeholder="Nº Clase" 
                        value={clase.numero} 
                        onChange={e => handleClaseChange(i, 'numero', e.target.value)} 
                        className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input 
                        type="text" 
                        placeholder="Descripción de productos/servicios" 
                        value={clase.descripcion} 
                        onChange={e => handleClaseChange(i, 'descripcion', e.target.value)} 
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      {form.clases.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeClase(i)} 
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={addClase} 
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    + Agregar Clase
                  </button>
                </div>
              </div>
            )}

            {/* Paso 5: Documentos */}
            {paso === 5 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Documentos requeridos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Certificado de Cámara de Comercio *</label>
                    <input 
                      type="file" 
                      name="certificadoCamara" 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Formatos: PDF, JPG, PNG</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logotipo de la Marca *</label>
                    <input 
                      type="file" 
                      name="logotipoMarca" 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      accept=".jpg,.jpeg,.png,.svg"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, SVG</p>
                  </div>
                  {esRepresentante && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Poder de Representación *</label>
                        <input 
                          type="file" 
                          name="poderRepresentante" 
                          onChange={handleChange} 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Autorización del Titular *</label>
                        <input 
                          type="file" 
                          name="poderAutorizacion" 
                          onChange={handleChange} 
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Navegación entre pasos */}
            <div className="flex justify-between pt-6 border-t">
              {paso > 1 ? (
                <button 
                  type="button" 
                  onClick={pasoAnterior} 
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  ← Anterior
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => navigate('/')}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  ← Volver
                </button>
              )}
              
              {paso < 5 ? (
                <button 
                  type="button" 
                  onClick={siguientePaso} 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Siguiente →
                </button>
              ) : (
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Crear Solicitud
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearSolicitudPage; 