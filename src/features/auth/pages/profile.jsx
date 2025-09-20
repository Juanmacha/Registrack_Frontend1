import React, { useState, useEffect } from "react";
import { BiEditAlt, BiCheck, BiX } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/contexts/authContext";
import SideBarGeneral from "../../dashboard/components/sideBarGeneral";
import NavBar from "../../dashboard/components/navBarGeneral";
import { SidebarProvider } from "../../../shared/contexts/SidebarContext";
import alertService from "../../../utils/alertService";

const ViewProfile = () => {
  const { user: usuario, loading, updateUser } = useAuth();
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

  if (loading) return (
    <SidebarProvider>
      <div className="bg-[#eceded] flex h-screen w-screen overflow-hidden">
        <SideBarGeneral />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <NavBar titulo="Mi Perfil" />
          <div className="flex-1 mt-10 px-1">
            <div className="h-screen flex justify-center items-center">Cargando perfil...</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
  
  if (!usuario) return (
    <SidebarProvider>
      <div className="bg-[#eceded] flex h-screen w-screen overflow-hidden">
        <SideBarGeneral />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <NavBar titulo="Mi Perfil" />
          <div className="flex-1 mt-10 px-1">
            <div className="h-screen flex justify-center items-center">No se pudo cargar el perfil</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );

  // Inicializar datos del formulario cuando el usuario cambie
  useEffect(() => {
    if (usuario) {
      const fullName = usuario.name || `${usuario.firstName || ''} ${usuario.lastName || ''}`.trim() || 'Usuario';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const userData = {
        name: fullName,
        firstName: firstName,
        lastName: lastName,
        email: usuario.email || '',
        phone: usuario.phone || ''
      };
      
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [usuario]);

  const fullName = formData.name || `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Usuario';
  const initials = fullName.split(' ').map(n => n.charAt(0)).join('').toUpperCase();

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

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);
    
    // Validar en tiempo real
    const newErrors = validateForm(newFormData);
    setErrors(newErrors);
  };

  // Manejar el cambio de nombre completo
  const handleNameChange = (e) => {
    const value = e.target.value;
    const nameParts = value.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    setFormData(prev => ({
      ...prev,
      name: value,
      firstName: firstName,
      lastName: lastName
    }));
  };

  // Iniciar edición
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Cancelar edición
  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setErrors({});
  };

  // Guardar cambios
  const handleSave = async () => {
    try {
      // Validar formulario
      const newErrors = validateForm(formData);
      setErrors(newErrors);

      // Si hay errores, no guardar
      if (Object.keys(newErrors).length > 0) {
        await alertService.error("Error", "Por favor corrige los errores en el formulario");
        return;
      }

      // Actualizar datos del usuario
      const updatedData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      };

      updateUser(updatedData);
      setOriginalData(formData);
      setIsEditing(false);
      setErrors({});

      await alertService.success(
        "¡Perfil actualizado!",
        "Tus datos se han guardado correctamente.",
        { confirmButtonText: "Entendido" }
      );
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      await alertService.error(
        "Error",
        "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        { confirmButtonText: "Entendido" }
      );
    }
  };

  return (
    <SidebarProvider>
      <div className="bg-[#eceded] flex h-screen w-screen overflow-hidden">
        <SideBarGeneral />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <NavBar titulo="Mi Perfil" />
          <div className="flex-1 mt-10 px-1">
            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Tarjeta: Mi Perfil */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header del perfil */}
            <div className="flex items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center border-4 border-white shadow-lg">
                {initials}
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
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
              
              {/* Segunda fila: Email */}
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
                  placeholder="Ingresa tu correo electrónico"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Tercera fila: Teléfono */}
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
                  placeholder="Ingresa tu número de teléfono"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-8">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg"
                >
                  <BiEditAlt className="inline mr-2" />
                  Editar perfil
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-green-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg"
                  >
                    <BiCheck className="inline mr-2" />
                    Guardar
                  </button>
        <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-lg"
        >
                    <BiX className="inline mr-2" />
                    Cancelar
        </button>
          </div>
              )}
        </div>
      </div>
        </div>
        </div>
        </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ViewProfile;