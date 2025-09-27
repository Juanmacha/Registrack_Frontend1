import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiEditAlt, BiCheck, BiX, BiArrowBack } from "react-icons/bi";
import { useAuth } from "../../../shared/contexts/authContext";
import alertService from "../../../utils/alertService";

const ProfileContent = () => {
  const { user: usuario, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});

  // Inicializar datos del formulario cuando el usuario cambie
  useEffect(() => {
    if (usuario) {
      const fullName = usuario.name || `${usuario.nombre || usuario.firstName || ''} ${usuario.apellido || usuario.lastName || ''}`.trim() || 'Usuario';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const userData = {
        name: fullName,
        firstName: firstName,
        lastName: lastName,
        email: usuario.correo || usuario.email || '',
        phone: usuario.telefono || usuario.phone || ''
      };
      
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [usuario]);

  const fullName = formData.name || `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Usuario';
  const initials = fullName.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  
  // Determinar el rol del usuario
  const userRole = usuario?.rol?.nombre || usuario?.role || 'cliente';
  const isAdmin = userRole === 'administrador';
  const isEmployee = userRole === 'empleado';
  const isClient = userRole === 'cliente';

  // Función de validación
  const validateForm = (data) => {
    const newErrors = {};

    if (!data.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!data.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!data.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido';
    }

    if (!data.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^[0-9+\-\s()]+$/.test(data.phone)) {
      newErrors.phone = 'El formato del teléfono no es válido';
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(originalData);
    setErrors({});
  };

  const handleSave = async () => {
    const newErrors = validateForm(formData);
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const updatedData = {
        nombre: formData.firstName,
        apellido: formData.lastName,
        correo: formData.email,
        telefono: formData.phone
      };

      const result = await updateUser(updatedData);
      
      if (result.success) {
        setOriginalData(formData);
        setIsEditing(false);
        await alertService.success(
          "Perfil actualizado",
          "Tu perfil se ha actualizado correctamente.",
          { confirmButtonText: "Entendido" }
        );
      } else {
        await alertService.error(
          "Error",
          result.message || "No se pudo actualizar el perfil. Inténtalo de nuevo.",
          { confirmButtonText: "Entendido" }
        );
      }
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      await alertService.error(
        "Error",
        "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        { confirmButtonText: "Entendido" }
      );
    }
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Botón de regreso a landing */}
      <div className="mb-6">
        <button
          onClick={handleBackToLanding}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <BiArrowBack className="mr-2" />
          <span className="text-sm font-medium">Volver al inicio</span>
        </button>
      </div>

      {/* Header del perfil */}
      <div className="flex items-center mb-8">
        <div className={`w-20 h-20 rounded-full text-white font-bold text-2xl flex items-center justify-center border-4 border-white shadow-lg ${
          isAdmin ? 'bg-red-600' : isEmployee ? 'bg-green-600' : 'bg-blue-600'
        }`}>
          {initials}
        </div>
        <div className="ml-6">
          <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isAdmin ? 'bg-red-100 text-red-800' : 
              isEmployee ? 'bg-green-100 text-green-800' : 
              'bg-blue-100 text-blue-800'
            }`}>
              {isAdmin ? '👑 Administrador' : isEmployee ? '👨‍💼 Empleado' : '👤 Cliente'}
            </span>
          </div>
          <p className="text-gray-500 text-sm">Último acceso {new Date().toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p className="text-gray-500 text-sm">Registrack, Colombia</p>
        </div>
      </div>

      {/* Sección específica por rol */}
      {isAdmin && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">👑 Panel de Administración</h3>
          <p className="text-red-700 text-sm mb-3">Como administrador, tienes acceso completo al sistema:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Gestión de Usuarios</span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Configuración</span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Reportes</span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Sistema</span>
          </div>
        </div>
      )}

      {isEmployee && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">👨‍💼 Panel de Empleado</h3>
          <p className="text-green-700 text-sm mb-3">Como empleado, puedes gestionar operaciones del día a día:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Solicitudes</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Citas</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Clientes</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Seguimiento</span>
          </div>
        </div>
      )}

      {isClient && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">👤 Panel de Cliente</h3>
          <p className="text-blue-700 text-sm mb-3">Como cliente, puedes gestionar tus servicios y solicitudes:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Mis Solicitudes</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Mis Citas</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Documentos</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Seguimiento</span>
          </div>
        </div>
      )}

      {/* Información editable */}
      <div className="space-y-6">
        {/* Primera fila: Nombre y Apellido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              type="text" 
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full text-lg font-medium text-gray-800 p-3 rounded-lg transition-all duration-200 ${
                isEditing 
                  ? errors.firstName 
                    ? 'bg-red-50 border-2 border-red-200 focus:border-red-500 focus:outline-none cursor-text'
                    : 'bg-blue-50 border-2 border-blue-200 focus:border-blue-500 focus:outline-none cursor-text'
                  : 'bg-gray-50 border border-gray-200 focus:border-gray-300 focus:outline-none cursor-text'
              }`}
              placeholder="Ingresa tu nombre"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input 
              type="text" 
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full text-lg font-medium text-gray-800 p-3 rounded-lg transition-all duration-200 ${
                isEditing 
                  ? errors.lastName 
                    ? 'bg-red-50 border-2 border-red-200 focus:border-red-500 focus:outline-none cursor-text'
                    : 'bg-blue-50 border-2 border-blue-200 focus:border-blue-500 focus:outline-none cursor-text'
                  : 'bg-gray-50 border border-gray-200 focus:border-gray-300 focus:outline-none cursor-text'
              }`}
              placeholder="Ingresa tu apellido"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Segunda fila: Email y Teléfono */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full text-lg font-medium text-gray-800 p-3 rounded-lg transition-all duration-200 ${
                isEditing 
                  ? errors.email 
                    ? 'bg-red-50 border-2 border-red-200 focus:border-red-500 focus:outline-none cursor-text'
                    : 'bg-blue-50 border-2 border-blue-200 focus:border-blue-500 focus:outline-none cursor-text'
                  : 'bg-gray-50 border border-gray-200 focus:border-gray-300 focus:outline-none cursor-text'
              }`}
              placeholder="Ingresa tu correo"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full text-lg font-medium text-gray-800 p-3 rounded-lg transition-all duration-200 ${
                isEditing 
                  ? errors.phone 
                    ? 'bg-red-50 border-2 border-red-200 focus:border-red-500 focus:outline-none cursor-text'
                    : 'bg-blue-50 border-2 border-blue-200 focus:border-blue-500 focus:outline-none cursor-text'
                  : 'bg-gray-50 border border-gray-200 focus:border-gray-300 focus:outline-none cursor-text'
              }`}
              placeholder="Ingresa tu teléfono"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BiEditAlt className="w-4 h-4" />
              <span>Editar</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <BiX className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <BiCheck className="w-4 h-4" />
                <span>Guardar</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
