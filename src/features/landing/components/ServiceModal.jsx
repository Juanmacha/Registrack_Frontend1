import React, { useState } from 'react';
import { X } from 'lucide-react';

// Información detallada de los servicios
const SERVICE_DETAILS = {
  'Certificación de Marca': {
    descripcion: 'Certificar tu marca es asegurar legalmente tu identidad comercial y evitar que otros se beneficien de lo que tú construiste. Al hacerlo con nosotros, obtienes respaldo jurídico, asesoría profesional y más de 12 años de experiencia acompañando a emprendedores, empresas y visionarios en el registro nacional e internacional de sus marcas.',
    beneficios: [
      'Protección jurídica exclusiva sobre tu marca registrada.',
      'Asesoría experta con más de 12 años de experiencia.',
      'Trámite rápido, confiable y garantizado ante la Cámara de Comercio.',
      'Defensa legal ante oposiciones o conflictos por similitud.',
      'Mayor valor comercial y posicionamiento de tu marca en el mercado.'
    ],
    proceso: [
      { titulo: 'Consulta inicial', descripcion: 'Evaluamos la viabilidad de tu marca y te asesoramos sobre el proceso.' },
      { titulo: 'Recolección de documentos', descripcion: 'Te guiamos en la preparación de todos los documentos necesarios.' },
      { titulo: 'Presentación ante SIC', descripcion: 'Realizamos el trámite oficial ante la Superintendencia de Industria y Comercio.' },
      { titulo: 'Seguimiento y defensa', descripcion: 'Monitoreamos el proceso y defendemos tu marca ante cualquier oposición.' }
    ],
    requisitos: [
      'Documento de identidad del titular',
      'Certificado de existencia y representación legal',
      'Logotipo de la marca en alta resolución',
      'Clasificación de productos/servicios según Niza',
      'Poder de representación (si aplica)'
    ],
    tiempo: '6-8 meses',
    costo: 'Desde $2.500.000'
  },
  'Búsqueda de Antecedentes': {
    descripcion: 'La búsqueda de antecedentes permite saber si una marca, nombre comercial, logotipo o elemento distintivo ya está registrado o en trámite ante la SIC.',
    beneficios: [
      'Evita registrar una marca que ya existe.',
      'Identifica similitudes que puedan generar conflictos.',
      'Asegura viabilidad antes de iniciar el registro.',
      'Análisis por clase o categoría según la SIC.',
      'Asesoría legal completa durante el proceso.'
    ],
    proceso: [
      { titulo: 'Análisis de viabilidad', descripcion: 'Evaluamos tu propuesta de marca y definimos la estrategia de búsqueda.' },
      { titulo: 'Búsqueda exhaustiva', descripcion: 'Realizamos búsqueda en bases de datos oficiales de la SIC.' },
      { titulo: 'Análisis de resultados', descripcion: 'Evaluamos similitudes y posibles conflictos con marcas existentes.' },
      { titulo: 'Reporte detallado', descripcion: 'Te entregamos un informe completo con recomendaciones legales.' }
    ],
    requisitos: [
      'Nombre o logotipo a consultar',
      'Clasificación de productos/servicios',
      'Información del solicitante',
      'Descripción detallada del signo distintivo'
    ],
    tiempo: '3-5 días hábiles',
    costo: 'Desde $150.000'
  },
  'Renovación de Marca': {
    descripcion: 'La renovación de marca es el proceso mediante el cual se extiende la vigencia de un registro de marca por períodos adicionales de 10 años, manteniendo así la protección legal sobre tu activo más valioso.',
    beneficios: [
      'Mantiene la protección legal de tu marca.',
      'Evita la pérdida de derechos exclusivos.',
      'Conserva el valor comercial acumulado.',
      'Proceso simplificado y ágil.',
      'Asesoría especializada en renovaciones.'
    ],
    proceso: [
      { titulo: 'Verificación de vencimiento', descripcion: 'Confirmamos las fechas de vencimiento de tu marca.' },
      { titulo: 'Preparación de documentos', descripcion: 'Recopilamos y organizamos la documentación necesaria.' },
      { titulo: 'Presentación de renovación', descripcion: 'Realizamos el trámite oficial ante la SIC.' },
      { titulo: 'Seguimiento del proceso', descripcion: 'Monitoreamos hasta la obtención del nuevo certificado.' }
    ],
    requisitos: [
      'Certificado de registro vigente',
      'Documento de identidad del titular',
      'Certificado de existencia y representación',
      'Poder de representación (si aplica)',
      'Comprobante de uso de la marca'
    ],
    tiempo: '2-3 meses',
    costo: 'Desde $1.800.000'
  },
  'Cesión de Marca': {
    descripcion: 'La cesión de marca es el proceso mediante el cual se transfiere la titularidad de una marca registrada de una persona natural o jurídica a otra, manteniendo todos los derechos y obligaciones asociados.',
    beneficios: [
      'Transferencia legal de titularidad.',
      'Mantiene todos los derechos de la marca.',
      'Proceso seguro y respaldado legalmente.',
      'Asesoría en valoración de marca.',
      'Documentación completa del proceso.'
    ],
    proceso: [
      { titulo: 'Evaluación de la cesión', descripcion: 'Analizamos la viabilidad legal de la transferencia.' },
      { titulo: 'Preparación de documentos', descripcion: 'Elaboramos el contrato de cesión y documentos legales.' },
      { titulo: 'Registro ante SIC', descripcion: 'Presentamos la solicitud de cambio de titularidad.' },
      { titulo: 'Seguimiento y certificación', descripcion: 'Monitoreamos hasta obtener el nuevo certificado.' }
    ],
    requisitos: [
      'Certificado de registro de la marca',
      'Documentos de identidad de cedente y cesionario',
      'Contrato de cesión debidamente firmado',
      'Certificados de existencia y representación',
      'Poder de representación (si aplica)'
    ],
    tiempo: '3-4 meses',
    costo: 'Desde $2.200.000'
  },
  'Ampliación de Alcance': {
    descripcion: 'La ampliación de alcance permite extender la protección de tu marca a nuevas clases de productos o servicios, ampliando así el campo de acción comercial de tu marca registrada.',
    beneficios: [
      'Amplía la protección de tu marca.',
      'Permite diversificar tu oferta comercial.',
      'Fortalece la posición competitiva.',
      'Proceso eficiente y especializado.',
      'Asesoría en estrategia comercial.'
    ],
    proceso: [
      { titulo: 'Análisis de nuevas clases', descripcion: 'Evaluamos las clases adicionales que deseas proteger.' },
      { titulo: 'Búsqueda de antecedentes', descripcion: 'Verificamos disponibilidad en las nuevas clases.' },
      { titulo: 'Preparación de solicitud', descripcion: 'Elaboramos la documentación para la ampliación.' },
      { titulo: 'Presentación y seguimiento', descripcion: 'Realizamos el trámite y monitoreamos el proceso.' }
    ],
    requisitos: [
      'Certificado de registro vigente',
      'Documento de identidad del titular',
      'Especificación de nuevas clases',
      'Certificado de existencia y representación',
      'Poder de representación (si aplica)'
    ],
    tiempo: '4-6 meses',
    costo: 'Desde $1.500.000'
  },
  'Presentación de Oposición': {
    descripcion: 'La presentación de oposición es el mecanismo legal mediante el cual puedes oponerte al registro de una marca que consideras similar o idéntica a la tuya, protegiendo así tus derechos de propiedad intelectual.',
    beneficios: [
      'Protege tus derechos de marca existente.',
      'Evita confusión en el mercado.',
      'Defiende tu posición competitiva.',
      'Asesoría legal especializada.',
      'Representación ante autoridades.'
    ],
    proceso: [
      { titulo: 'Análisis de similitud', descripcion: 'Evaluamos el grado de similitud entre las marcas.' },
      { titulo: 'Preparación de argumentos', descripcion: 'Desarrollamos la estrategia legal de oposición.' },
      { titulo: 'Presentación de oposición', descripcion: 'Realizamos el trámite oficial ante la SIC.' },
      { titulo: 'Seguimiento del proceso', descripcion: 'Monitoreamos y defendemos tu posición.' }
    ],
    requisitos: [
      'Certificado de marca registrada',
      'Documento de identidad del opositor',
      'Análisis de similitud detallado',
      'Pruebas de uso de la marca',
      'Poder de representación (si aplica)'
    ],
    tiempo: '6-12 meses',
    costo: 'Desde $3.000.000'
  },
  'Respuesta a Oposición': {
    descripcion: 'La respuesta a oposición es el proceso mediante el cual defiendes tu solicitud de marca cuando otra persona se opone a su registro, presentando argumentos legales y pruebas que respalden tu derecho al registro.',
    beneficios: [
      'Defiende tu solicitud de marca.',
      'Presenta argumentos legales sólidos.',
      'Mantiene la viabilidad de tu registro.',
      'Asesoría legal especializada.',
      'Representación ante autoridades.'
    ],
    proceso: [
      { titulo: 'Análisis de la oposición', descripcion: 'Evaluamos los argumentos presentados por el opositor.' },
      { titulo: 'Desarrollo de defensa', descripcion: 'Elaboramos la estrategia de respuesta legal.' },
      { titulo: 'Presentación de respuesta', descripcion: 'Realizamos el trámite oficial de respuesta.' },
      { titulo: 'Seguimiento del proceso', descripcion: 'Monitoreamos hasta la resolución final.' }
    ],
    requisitos: [
      'Solicitud de marca en trámite',
      'Documento de identidad del solicitante',
      'Análisis de diferencias entre marcas',
      'Pruebas de uso y distintividad',
      'Poder de representación (si aplica)'
    ],
    tiempo: '6-12 meses',
    costo: 'Desde $2.800.000'
  }
};

const ServiceModal = ({ isOpen, onClose, servicio }) => {
  const [activeTab, setActiveTab] = useState('descripcion');

  if (!isOpen || !servicio) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Obtener información detallada del servicio
  const serviceDetails = SERVICE_DETAILS[servicio.nombre] || {};

  // Definir las pestañas disponibles
  const tabs = [
    { id: 'descripcion', label: 'Descripción' },
    { id: 'beneficios', label: 'Beneficios' },
    { id: 'requisitos', label: 'Requisitos' },
    { id: 'info', label: 'Información' }
  ];

  // Renderizar contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'descripcion':
  return (
          <div className="space-y-6">
            <div>
            <h3 className="text-xl font-semibold text-[#275FAA] mb-4 title-secondary">
              ¿Qué es {servicio.landing_data?.titulo || servicio.nombre}?
            </h3>
            <p className="text-gray-700 text-body leading-relaxed">
              {servicio.landing_data?.resumen || servicio.descripcion_corta}
            </p>
          </div>

          {serviceDetails.descripcion && (
              <div>
                <h3 className="text-lg font-semibold text-[#275FAA] mb-3 title-secondary">
                Descripción Detallada
              </h3>
              <p className="text-gray-700 text-body leading-relaxed">
                {serviceDetails.descripcion}
              </p>
            </div>
          )}
          </div>
        );

      case 'beneficios':
        return (
          <div>
              <h3 className="text-xl font-semibold text-[#275FAA] mb-4 title-secondary">
                Beneficios
              </h3>
            {serviceDetails.beneficios ? (
              <ul className="space-y-3">
                {serviceDetails.beneficios.map((beneficio, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-body">{beneficio}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-body">No hay información de beneficios disponible.</p>
            )}
            </div>
        );

      case 'proceso':
        return (
          <div>
              <h3 className="text-xl font-semibold text-[#275FAA] mb-4 title-secondary">
                Proceso
              </h3>
            {serviceDetails.proceso ? (
              <div className="space-y-4">
                {serviceDetails.proceso.map((paso, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#275FAA] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{paso.titulo}</h4>
                      <p className="text-gray-600 text-sm">{paso.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-body">No hay información de proceso disponible.</p>
            )}
            </div>
        );

      case 'requisitos':
        return (
          <div>
              <h3 className="text-xl font-semibold text-[#275FAA] mb-4 title-secondary">
                Requisitos
              </h3>
            {serviceDetails.requisitos ? (
              <ul className="space-y-2">
                {serviceDetails.requisitos.map((requisito, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-[#275FAA] rounded-full mt-2"></div>
                    <span className="text-gray-700 text-body">{requisito}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-body">No hay información de requisitos disponible.</p>
            )}
            </div>
        );

      case 'info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceDetails.tiempo && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-[#275FAA] mb-2 title-secondary">
                    Tiempo de Procesamiento
                  </h4>
                  <p className="text-gray-700 text-body">{serviceDetails.tiempo}</p>
                </div>
              )}
              {serviceDetails.costo && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-[#275FAA] mb-2 title-secondary">
                    Costo
                  </h4>
                  <p className="text-gray-700 text-body">{serviceDetails.costo}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative">
          <img
            src={servicio.landing_data?.imagen || "/images/certificacion.jpg"}
            alt={servicio.landing_data?.titulo || servicio.nombre}
            className="w-full h-48 object-cover rounded-t-2xl"
            onError={e => { e.target.src = "/images/certificacion.jpg"; }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-lg"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <h2 className="text-2xl font-bold text-white title-primary">
              {servicio.landing_data?.titulo || servicio.nombre}
            </h2>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-[#275FAA] shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-[#275FAA] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#163366] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
