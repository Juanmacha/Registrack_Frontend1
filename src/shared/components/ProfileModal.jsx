import React from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Shield, Edit } from 'lucide-react';
import StandardAvatar from './StandardAvatar';

const ProfileModal = ({ isOpen, onClose, user, onEdit }) => {
  if (!isOpen || !user) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'empleado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cliente':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'empleado':
        return <User className="w-4 h-4" />;
      case 'cliente':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#275FAA] to-[#163366] p-8 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex items-center space-x-6">
            <StandardAvatar
              nombre={user.nombre || user.nombres || user.firstName || user.razonSocial || 'Usuario'}
              size="xl"
              color="white"
            />
            <div className="text-white">
              <h2 className="text-2xl font-bold title-primary mb-2">
                {user.nombre || user.nombres || user.firstName || user.razonSocial || 'Usuario'}
              </h2>
              {(user.apellidos || user.lastName) && (
                <p className="text-lg opacity-90 mb-2">
                  {user.apellidos || user.lastName}
                </p>
              )}
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getRoleColor(user.rol || user.role)}`}>
                {getRoleIcon(user.rol || user.role)}
                <span className="text-sm font-medium">
                  {user.rol || user.role || 'Usuario'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Información Personal */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#275FAA] mb-6 title-secondary flex items-center">
              <User className="w-5 h-5 mr-2" />
              Información Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              {user.email && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-[#275FAA]" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Teléfono */}
              {(user.telefono || user.phone) && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-[#275FAA]" />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium text-gray-800">{user.telefono || user.phone}</p>
                  </div>
                </div>
              )}

              {/* Dirección */}
              {(user.direccion || user.address) && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-[#275FAA]" />
                  <div>
                    <p className="text-sm text-gray-500">Dirección</p>
                    <p className="font-medium text-gray-800">{user.direccion || user.address}</p>
                  </div>
                </div>
              )}

              {/* Fecha de Registro */}
              {(user.fechaRegistro || user.createdAt) && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-[#275FAA]" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Registro</p>
                    <p className="font-medium text-gray-800">
                      {new Date(user.fechaRegistro || user.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              )}

              {/* Documento */}
              {(user.documento || user.documentNumber) && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-[#275FAA]" />
                  <div>
                    <p className="text-sm text-gray-500">Documento</p>
                    <p className="font-medium text-gray-800">{user.documento || user.documentNumber}</p>
                  </div>
                </div>
              )}

              {/* Tipo de Documento */}
              {(user.tipoDocumento || user.documentType) && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-[#275FAA]" />
                  <div>
                    <p className="text-sm text-gray-500">Tipo de Documento</p>
                    <p className="font-medium text-gray-800">{user.tipoDocumento || user.documentType}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información Empresarial (para clientes jurídicos) */}
          {(user.nit || user.razonSocial || user.nombreEmpresa) && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#275FAA] mb-6 title-secondary">
                Información Empresarial
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.nit && (
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Shield className="w-5 h-5 text-[#275FAA]" />
                    <div>
                      <p className="text-sm text-gray-500">NIT</p>
                      <p className="font-medium text-gray-800">{user.nit}</p>
                    </div>
                  </div>
                )}

                {user.razonSocial && (
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <User className="w-5 h-5 text-[#275FAA]" />
                    <div>
                      <p className="text-sm text-gray-500">Razón Social</p>
                      <p className="font-medium text-gray-800">{user.razonSocial}</p>
                    </div>
                  </div>
                )}

                {user.nombreEmpresa && (
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <User className="w-5 h-5 text-[#275FAA]" />
                    <div>
                      <p className="text-sm text-gray-500">Nombre de Empresa</p>
                      <p className="font-medium text-gray-800">{user.nombreEmpresa}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Estado */}
          {user.estado !== undefined && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#275FAA] mb-4 title-secondary">
                Estado
              </h3>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${user.estado ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-medium ${user.estado ? 'text-green-700' : 'text-red-700'}`}>
                  {user.estado ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(user);
                  onClose();
                }}
                className="flex items-center space-x-2 bg-[#275FAA] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#163366] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
