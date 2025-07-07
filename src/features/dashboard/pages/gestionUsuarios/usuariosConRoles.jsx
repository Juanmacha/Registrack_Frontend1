import React, { useState, useEffect } from 'react';
import { 
  UserService, 
  RoleService, 
  initializeMockData 
} from '../../../../utils/mockDataService.js';

const UsuariosConRoles = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [usuariosPorRol, setUsuariosPorRol] = useState({});
  const [stats, setStats] = useState({});
  const [selectedRol, setSelectedRol] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeMockData();
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    setLoading(true);
    
    // Cargar usuarios y roles
    const usuariosData = UserService.getAll();
    const rolesData = RoleService.getAll();
    
    setUsuarios(usuariosData);
    setRoles(rolesData);
    
    // Obtener estadísticas
    const total = usuariosData.length;
    const activos = usuariosData.filter(user => user.estado === 'activo').length;
    const porRol = {};
    
    usuariosData.forEach(user => {
      porRol[user.role] = (porRol[user.role] || 0) + 1;
    });
    
    setStats({
      total,
      activos,
      inactivos: total - activos,
      porRol
    });
    
    // Agrupar usuarios por rol
    const usuariosPorRolData = {};
    rolesData.forEach(rol => {
      usuariosPorRolData[rol.nombre] = usuariosData.filter(user => user.role === rol.nombre);
    });
    setUsuariosPorRol(usuariosPorRolData);
    
    setLoading(false);
  };

  const cambiarRolUsuario = (usuarioId, nuevoRol) => {
    const usuarioActualizado = UserService.update(usuarioId, { role: nuevoRol });
    if (usuarioActualizado) {
      cargarDatos(); // Recargar datos
      alert(`Rol de ${usuarioActualizado.firstName} ${usuarioActualizado.lastName} cambiado a ${nuevoRol}`);
    }
  };

  const verificarPermisos = (rolId, recurso, accion) => {
    return RoleService.hasPermission(rolId, recurso, accion);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Gestión de Usuarios y Roles
      </h1>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Usuarios</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Usuarios Activos</h3>
          <p className="text-3xl font-bold text-green-600">{stats.activos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Administradores</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.porRol?.Administrador || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Clientes</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.porRol?.Cliente || 0}</p>
        </div>
      </div>

      {/* Roles del Sistema */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Roles del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map(rol => (
            <div key={rol.id} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{rol.nombre}</h3>
              <p className="text-gray-600 mb-3">{rol.descripcion}</p>
              <p className="text-sm text-gray-500 mb-4">
                Estado: <span className={`font-semibold ${rol.estado === 'Activo' ? 'text-green-600' : 'text-red-600'}`}>
                  {rol.estado}
                </span>
              </p>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Permisos:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(rol.permisos).map(([recurso, permisos]) => (
                    <div key={recurso} className="flex items-center justify-between">
                      <span className="capitalize">{recurso}:</span>
                      <span className="text-xs">
                        {Object.values(permisos).filter(p => p).length}/{Object.keys(permisos).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Usuarios con este rol:</strong> {usuariosPorRol[rol.nombre]?.length || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usuarios por Rol */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Usuarios por Rol</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por rol:
          </label>
          <select 
            value={selectedRol} 
            onChange={(e) => setSelectedRol(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los roles</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.nombre}>{rol.nombre}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios
                .filter(user => !selectedRol || user.role === selectedRol)
                .map(usuario => (
                <tr key={usuario.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-green-600">
                            {usuario.firstName.charAt(0)}{usuario.lastName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {usuario.firstName} {usuario.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {usuario.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {usuario.documentType}: {usuario.documentNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {usuario.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      usuario.role === 'Administrador' 
                        ? 'bg-purple-100 text-purple-800' 
                        : usuario.role === 'Empleado'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {usuario.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      usuario.estado === 'activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select 
                      value={usuario.role}
                      onChange={(e) => cambiarRolUsuario(usuario.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {roles.map(rol => (
                        <option key={rol.id} value={rol.nombre}>{rol.nombre}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verificación de Permisos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Verificación de Permisos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map(rol => (
            <div key={rol.id} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{rol.nombre}</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Puede crear usuarios:</span>
                  <span className={`text-sm font-semibold ${
                    verificarPermisos(rol.id, 'usuarios', 'crear') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {verificarPermisos(rol.id, 'usuarios', 'crear') ? 'Sí' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Puede eliminar ventas:</span>
                  <span className={`text-sm font-semibold ${
                    verificarPermisos(rol.id, 'ventas', 'eliminar') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {verificarPermisos(rol.id, 'ventas', 'eliminar') ? 'Sí' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Puede gestionar roles:</span>
                  <span className={`text-sm font-semibold ${
                    verificarPermisos(rol.id, 'roles', 'crear') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {verificarPermisos(rol.id, 'roles', 'crear') ? 'Sí' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Puede crear citas:</span>
                  <span className={`text-sm font-semibold ${
                    verificarPermisos(rol.id, 'citas', 'crear') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {verificarPermisos(rol.id, 'citas', 'crear') ? 'Sí' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsuariosConRoles; 