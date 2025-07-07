// Servicio centralizado para manejo de datos mock
// Conecta todas las entidades del sistema y proporciona métodos unificados

import {
  MOCK_CONFIG,
  TIPOS_DOCUMENTO,
  ROLES,
  ESTADOS_PROCESO,
  METODOS_PAGO,
  SERVICIOS,
  USUARIOS,
  EMPLEADOS,
  CLIENTES,
  VENTAS_EN_PROCESO,
  VENTAS_FINALIZADAS,
  PAGOS,
  CITAS,
  ROLES_PERMISOS,
  getServicioById,
  getUsuarioByEmail,
  getClienteByDocumento,
  getEmpleadoByDocumento,
  getVentasByCliente,
  getPagosByOrdenServicio,
  getCitasByCliente,
  tienePermiso
} from './mockData.js';

// ============================================================================
// CONFIGURACIÓN DE ALMACENAMIENTO
// ============================================================================

const STORAGE_KEYS = {
  USUARIOS: 'usuarios_mock',
  EMPLEADOS: 'empleados_mock',
  CLIENTES: 'clientes_mock',
  VENTAS_PROCESO: 'ventas_proceso_mock',
  VENTAS_FINALIZADAS: 'ventas_finalizadas_mock',
  PAGOS: 'pagos_mock',
  CITAS: 'citas_mock',
  ROLES: 'roles_mock',
  SERVICIOS: 'servicios_mock'
};

// ============================================================================
// FUNCIONES DE ALMACENAMIENTO
// ============================================================================

function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error al obtener datos de ${key}:`, error);
    return [];
  }
}

function setToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error al guardar datos en ${key}:`, error);
    return false;
  }
}

// ============================================================================
// INICIALIZACIÓN DE DATOS
// ============================================================================

export function initializeMockData() {
  console.log('Inicializando datos mock centralizados...');
  
  // Inicializar cada entidad si no existe
  if (getFromStorage(STORAGE_KEYS.USUARIOS).length === 0) {
    setToStorage(STORAGE_KEYS.USUARIOS, USUARIOS);
  }
  
  if (getFromStorage(STORAGE_KEYS.EMPLEADOS).length === 0) {
    setToStorage(STORAGE_KEYS.EMPLEADOS, EMPLEADOS);
  }
  
  if (getFromStorage(STORAGE_KEYS.CLIENTES).length === 0) {
    setToStorage(STORAGE_KEYS.CLIENTES, CLIENTES);
  }
  
  if (getFromStorage(STORAGE_KEYS.VENTAS_PROCESO).length === 0) {
    setToStorage(STORAGE_KEYS.VENTAS_PROCESO, VENTAS_EN_PROCESO);
  }
  
  if (getFromStorage(STORAGE_KEYS.VENTAS_FINALIZADAS).length === 0) {
    setToStorage(STORAGE_KEYS.VENTAS_FINALIZADAS, VENTAS_FINALIZADAS);
  }
  
  if (getFromStorage(STORAGE_KEYS.PAGOS).length === 0) {
    setToStorage(STORAGE_KEYS.PAGOS, PAGOS);
  }
  
  if (getFromStorage(STORAGE_KEYS.CITAS).length === 0) {
    setToStorage(STORAGE_KEYS.CITAS, CITAS);
  }
  
  if (getFromStorage(STORAGE_KEYS.ROLES).length === 0) {
    setToStorage(STORAGE_KEYS.ROLES, ROLES_PERMISOS);
  }
  
  if (getFromStorage(STORAGE_KEYS.SERVICIOS).length === 0) {
    setToStorage(STORAGE_KEYS.SERVICIOS, SERVICIOS);
  }
  
  console.log('Datos mock inicializados correctamente');
}

// ============================================================================
// SERVICIOS DE USUARIOS
// ============================================================================

export const UserService = {
  // Obtener todos los usuarios
  getAll() {
    return getFromStorage(STORAGE_KEYS.USUARIOS);
  },
  
  // Obtener usuario por email
  getByEmail(email) {
    const usuarios = this.getAll();
    return usuarios.find(user => user.email === email);
  },
  
  // Obtener usuario por documento
  getByDocument(documentType, documentNumber) {
    const usuarios = this.getAll();
    return usuarios.find(user => 
      user.documentType === documentType && 
      user.documentNumber === documentNumber
    );
  },
  
  // Crear nuevo usuario
  create(userData) {
    const usuarios = this.getAll();
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      estado: 'activo'
    };
    usuarios.push(newUser);
    setToStorage(STORAGE_KEYS.USUARIOS, usuarios);
    return newUser;
  },
  
  // Actualizar usuario
  update(id, userData) {
    const usuarios = this.getAll();
    const index = usuarios.findIndex(user => user.id === id);
    if (index !== -1) {
      usuarios[index] = { ...usuarios[index], ...userData };
      setToStorage(STORAGE_KEYS.USUARIOS, usuarios);
      return usuarios[index];
    }
    return null;
  },
  
  // Eliminar usuario
  delete(id) {
    const usuarios = this.getAll();
    const filtered = usuarios.filter(user => user.id !== id);
    setToStorage(STORAGE_KEYS.USUARIOS, filtered);
    return true;
  },
  
  // Autenticar usuario
  authenticate(email, password) {
    const user = this.getByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }
};

// ============================================================================
// SERVICIOS DE EMPLEADOS
// ============================================================================

export const EmployeeService = {
  // Obtener todos los empleados
  getAll() {
    return getFromStorage(STORAGE_KEYS.EMPLEADOS);
  },
  
  // Obtener empleado por documento
  getByDocument(documento) {
    const empleados = this.getAll();
    return empleados.find(emp => emp.documento === documento);
  },
  
  // Obtener empleado por email
  getByEmail(email) {
    const empleados = this.getAll();
    return empleados.find(emp => emp.email === email);
  },
  
  // Obtener empleados por rol
  getByRol(rol) {
    const empleados = this.getAll();
    return empleados.filter(emp => emp.rol === rol);
  },
  
  // Crear nuevo empleado
  create(employeeData) {
    const empleados = this.getAll();
    const newEmployee = {
      id: Date.now().toString(),
      ...employeeData,
      estado: 'Activo',
      fechaContratacion: employeeData.fechaContratacion || new Date().toISOString().split('T')[0]
    };
    empleados.push(newEmployee);
    setToStorage(STORAGE_KEYS.EMPLEADOS, empleados);
    return newEmployee;
  },
  
  // Actualizar empleado
  update(id, employeeData) {
    const empleados = this.getAll();
    const index = empleados.findIndex(emp => emp.id === id);
    if (index !== -1) {
      empleados[index] = { ...empleados[index], ...employeeData };
      setToStorage(STORAGE_KEYS.EMPLEADOS, empleados);
      return empleados[index];
    }
    return null;
  },
  
  // Eliminar empleado
  delete(id) {
    const empleados = this.getAll();
    const filtered = empleados.filter(emp => emp.id !== id);
    setToStorage(STORAGE_KEYS.EMPLEADOS, filtered);
    return true;
  },
  
  // Cambiar rol de empleado
  changeRole(id, nuevoRol) {
    const empleados = this.getAll();
    const index = empleados.findIndex(emp => emp.id === id);
    if (index !== -1) {
      empleados[index].rol = nuevoRol;
      setToStorage(STORAGE_KEYS.EMPLEADOS, empleados);
      return empleados[index];
    }
    return null;
  },
  
  // Obtener estadísticas de empleados
  getStats() {
    const empleados = this.getAll();
    const total = empleados.length;
    const activos = empleados.filter(emp => emp.estado === 'Activo').length;
    const porRol = {};
    
    empleados.forEach(emp => {
      porRol[emp.rol] = (porRol[emp.rol] || 0) + 1;
    });
    
    return {
      total,
      activos,
      inactivos: total - activos,
      porRol
    };
  }
};

// ============================================================================
// SERVICIOS DE CLIENTES
// ============================================================================

export const ClientService = {
  // Obtener todos los clientes
  getAll() {
    return getFromStorage(STORAGE_KEYS.CLIENTES);
  },
  
  // Obtener cliente por documento
  getByDocument(documento) {
    const clientes = this.getAll();
    return clientes.find(cliente => cliente.documento === documento);
  },
  
  // Obtener cliente por email
  getByEmail(email) {
    const clientes = this.getAll();
    return clientes.find(cliente => cliente.email === email);
  },
  
  // Crear nuevo cliente
  create(clientData) {
    const clientes = this.getAll();
    const newClient = {
      id: Date.now().toString(),
      ...clientData,
      estado: 'activo'
    };
    clientes.push(newClient);
    setToStorage(STORAGE_KEYS.CLIENTES, clientes);
    return newClient;
  },
  
  // Actualizar cliente
  update(id, clientData) {
    const clientes = this.getAll();
    const index = clientes.findIndex(cliente => cliente.id === id);
    if (index !== -1) {
      clientes[index] = { ...clientes[index], ...clientData };
      setToStorage(STORAGE_KEYS.CLIENTES, clientes);
      return clientes[index];
    }
    return null;
  },
  
  // Eliminar cliente
  delete(id) {
    const clientes = this.getAll();
    const filtered = clientes.filter(cliente => cliente.id !== id);
    setToStorage(STORAGE_KEYS.CLIENTES, filtered);
    return true;
  }
};

// ============================================================================
// SERVICIOS DE VENTAS/SERVICIOS
// ============================================================================

export const SalesService = {
  // Obtener ventas en proceso
  getInProcess() {
    return getFromStorage(STORAGE_KEYS.VENTAS_PROCESO);
  },
  
  // Obtener ventas finalizadas
  getCompleted() {
    return getFromStorage(STORAGE_KEYS.VENTAS_FINALIZADAS);
  },
  
  // Obtener todas las ventas
  getAll() {
    return [
      ...this.getInProcess(),
      ...this.getCompleted()
    ];
  },
  
  // Obtener ventas por cliente
  getByClient(email) {
    const allSales = this.getAll();
    return allSales.filter(venta => venta.email === email);
  },
  
  // Crear nueva venta
  create(saleData) {
    const ventas = this.getInProcess();
    const newSale = {
      id: Date.now().toString(),
      ...saleData,
      comentarios: [],
      fechaSolicitud: new Date().toISOString().split('T')[0]
    };
    ventas.push(newSale);
    setToStorage(STORAGE_KEYS.VENTAS_PROCESO, ventas);
    return newSale;
  },
  
  // Actualizar venta
  update(id, saleData) {
    let ventas = this.getInProcess();
    let ventasFin = this.getCompleted();
    
    // Buscar en ventas en proceso
    let index = ventas.findIndex(venta => venta.id === id);
    if (index !== -1) {
      const venta = ventas[index];
      const updatedVenta = { ...venta, ...saleData };
      
      // Si cambia a finalizado/anulado, mover a finalizadas
      if (['Finalizado', 'Anulado', 'Rechazado'].includes(saleData.estado)) {
        ventas.splice(index, 1);
        ventasFin.push(updatedVenta);
      } else {
        ventas[index] = updatedVenta;
      }
      
      setToStorage(STORAGE_KEYS.VENTAS_PROCESO, ventas);
      setToStorage(STORAGE_KEYS.VENTAS_FINALIZADAS, ventasFin);
      return updatedVenta;
    }
    
    // Buscar en ventas finalizadas
    index = ventasFin.findIndex(venta => venta.id === id);
    if (index !== -1) {
      const venta = ventasFin[index];
      const updatedVenta = { ...venta, ...saleData };
      
      // Si vuelve a proceso
      if (!['Finalizado', 'Anulado'].includes(saleData.estado)) {
        ventasFin.splice(index, 1);
        ventas.push(updatedVenta);
      } else {
        ventasFin[index] = updatedVenta;
      }
      
      setToStorage(STORAGE_KEYS.VENTAS_PROCESO, ventas);
      setToStorage(STORAGE_KEYS.VENTAS_FINALIZADAS, ventasFin);
      return updatedVenta;
    }
    
    return null;
  },
  
  // Anular venta
  cancel(id, motivo) {
    return this.update(id, { 
      estado: 'Anulado', 
      motivoAnulacion: motivo,
      fechaAnulacion: new Date().toISOString()
    });
  },
  
  // Agregar comentario
  addComment(id, comment) {
    const ventas = this.getInProcess();
    const ventasFin = this.getCompleted();
    
    let venta = ventas.find(v => v.id === id);
    if (venta) {
      venta.comentarios.push({
        id: Date.now().toString(),
        texto: comment,
        fecha: new Date().toISOString()
      });
      setToStorage(STORAGE_KEYS.VENTAS_PROCESO, ventas);
      return venta;
    }
    
    venta = ventasFin.find(v => v.id === id);
    if (venta) {
      venta.comentarios.push({
        id: Date.now().toString(),
        texto: comment,
        fecha: new Date().toISOString()
      });
      setToStorage(STORAGE_KEYS.VENTAS_FINALIZADAS, ventasFin);
      return venta;
    }
    
    return null;
  }
};

// ============================================================================
// SERVICIOS DE PAGOS
// ============================================================================

export const PaymentService = {
  // Obtener todos los pagos
  getAll() {
    return getFromStorage(STORAGE_KEYS.PAGOS);
  },
  
  // Obtener pagos por orden de servicio
  getByOrder(orderId) {
    const pagos = this.getAll();
    return pagos.filter(pago => pago.id_orden_servicio === orderId);
  },
  
  // Crear nuevo pago
  create(paymentData) {
    const pagos = this.getAll();
    const newPayment = {
      id_pago: Date.now(),
      ...paymentData,
      fecha_pago: new Date().toISOString()
    };
    pagos.push(newPayment);
    setToStorage(STORAGE_KEYS.PAGOS, pagos);
    return newPayment;
  },
  
  // Actualizar pago
  update(id, paymentData) {
    const pagos = this.getAll();
    const index = pagos.findIndex(pago => pago.id_pago === id);
    if (index !== -1) {
      pagos[index] = { ...pagos[index], ...paymentData };
      setToStorage(STORAGE_KEYS.PAGOS, pagos);
      return pagos[index];
    }
    return null;
  }
};

// ============================================================================
// SERVICIOS DE CITAS
// ============================================================================

export const AppointmentService = {
  // Obtener todas las citas
  getAll() {
    return getFromStorage(STORAGE_KEYS.CITAS);
  },
  
  // Obtener citas por cliente
  getByClient(cedula) {
    const citas = this.getAll();
    return citas.filter(cita => cita.extendedProps.cedula === cedula);
  },
  
  // Crear nueva cita
  create(appointmentData) {
    const citas = this.getAll();
    const newAppointment = {
      id: Date.now().toString(),
      title: `Asesor: ${appointmentData.asesor}`,
      start: `${appointmentData.fecha}T${appointmentData.horaInicio}`,
      end: `${appointmentData.fecha}T${appointmentData.horaFin}`,
      extendedProps: {
        ...appointmentData,
        estado: 'Programada'
      }
    };
    citas.push(newAppointment);
    setToStorage(STORAGE_KEYS.CITAS, citas);
    return newAppointment;
  },
  
  // Actualizar cita
  update(id, appointmentData) {
    const citas = this.getAll();
    const index = citas.findIndex(cita => cita.id === id);
    if (index !== -1) {
      citas[index] = { ...citas[index], ...appointmentData };
      setToStorage(STORAGE_KEYS.CITAS, citas);
      return citas[index];
    }
    return null;
  },
  
  // Cancelar cita
  cancel(id, motivo) {
    const citas = this.getAll();
    const index = citas.findIndex(cita => cita.id === id);
    if (index !== -1) {
      citas[index].extendedProps.estado = 'Cita anulada';
      citas[index].extendedProps.observacionAnulacion = motivo;
      setToStorage(STORAGE_KEYS.CITAS, citas);
      return citas[index];
    }
    return null;
  }
};

// ============================================================================
// SERVICIOS DE SERVICIOS
// ============================================================================

export const ServiceService = {
  // Obtener todos los servicios
  getAll() {
    return getFromStorage(STORAGE_KEYS.SERVICIOS);
  },
  
  // Obtener servicio por ID
  getById(id) {
    const servicios = this.getAll();
    return servicios.find(servicio => servicio.id === id);
  },
  
  // Obtener servicios visibles en landing
  getVisible() {
    const servicios = this.getAll();
    return servicios.filter(servicio => servicio.visible_en_landing);
  },
  
  // Actualizar servicio
  update(id, serviceData) {
    const servicios = this.getAll();
    const index = servicios.findIndex(servicio => servicio.id === id);
    if (index !== -1) {
      servicios[index] = { ...servicios[index], ...serviceData };
      setToStorage(STORAGE_KEYS.SERVICIOS, servicios);
      return servicios[index];
    }
    return null;
  },
  
  // Toggle visibilidad
  toggleVisibility(id) {
    const servicios = this.getAll();
    const index = servicios.findIndex(servicio => servicio.id === id);
    if (index !== -1) {
      servicios[index].visible_en_landing = !servicios[index].visible_en_landing;
      setToStorage(STORAGE_KEYS.SERVICIOS, servicios);
      return servicios[index];
    }
    return null;
  }
};

// ============================================================================
// SERVICIOS DE ROLES Y PERMISOS
// ============================================================================

export const RoleService = {
  // Obtener todos los roles
  getAll() {
    return getFromStorage(STORAGE_KEYS.ROLES);
  },
  
  // Obtener rol por ID
  getById(id) {
    const roles = this.getAll();
    return roles.find(rol => rol.id === id);
  },
  
  // Obtener rol por nombre
  getByNombre(nombre) {
    const roles = this.getAll();
    return roles.find(rol => rol.nombre === nombre);
  },
  
  // Crear nuevo rol
  create(rolData) {
    const roles = this.getAll();
    const newRol = {
      id: Date.now().toString(),
      ...rolData,
      estado: rolData.estado || 'Activo'
    };
    roles.push(newRol);
    setToStorage(STORAGE_KEYS.ROLES, roles);
    return newRol;
  },
  
  // Actualizar rol
  update(id, rolData) {
    const roles = this.getAll();
    const index = roles.findIndex(rol => rol.id === id);
    if (index !== -1) {
      roles[index] = { ...roles[index], ...rolData };
      setToStorage(STORAGE_KEYS.ROLES, roles);
      return roles[index];
    }
    return null;
  },
  
  // Eliminar rol
  delete(id) {
    const roles = this.getAll();
    const filtered = roles.filter(rol => rol.id !== id);
    setToStorage(STORAGE_KEYS.ROLES, filtered);
    return true;
  },
  
  // Obtener roles disponibles para empleados
  getRolesDisponibles() {
    const roles = this.getAll();
    return roles.filter(rol => 
      rol.nombre === 'Administrador' || 
      rol.nombre === 'Empleado'
    );
  },
  
  // Obtener roles disponibles para usuarios
  getRolesDisponiblesUsuarios() {
    const roles = this.getAll();
    return roles.filter(rol => 
      rol.nombre === 'Administrador' || 
      rol.nombre === 'Empleado' ||
      rol.nombre === 'Cliente'
    );
  },
  
  // Obtener empleados por rol
  getEmpleadosByRol(rolNombre) {
    const empleados = EmployeeService.getAll();
    return empleados.filter(emp => emp.rol === rolNombre);
  },
  
  // Verificar permisos de un rol específico
  hasPermission(rolId, resource, action) {
    const rol = this.getById(rolId);
    if (!rol || !rol.permisos) return false;
    
    const resourcePerms = rol.permisos[resource];
    if (!resourcePerms) return false;
    
    return resourcePerms[action] === true;
  },
  
  // Verificar permisos de un usuario
  hasUserPermission(user, resource, action) {
    const roles = this.getAll();
    const userRole = roles.find(rol => rol.nombre === user.role);
    if (!userRole) return false;
    return userRole.permisos[resource]?.[action] || false;
  }
};

// ============================================================================
// SERVICIOS DE BÚSQUEDA Y FILTRADO
// ============================================================================

export const SearchService = {
  // Búsqueda global
  globalSearch(query) {
    const results = {
      usuarios: [],
      empleados: [],
      clientes: [],
      ventas: [],
      pagos: []
    };
    
    const searchTerm = query.toLowerCase();
    
    // Buscar en usuarios
    results.usuarios = UserService.getAll().filter(user =>
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.documentNumber.includes(searchTerm)
    );
    
    // Buscar en empleados
    results.empleados = EmployeeService.getAll().filter(emp =>
      emp.nombre.toLowerCase().includes(searchTerm) ||
      emp.apellidos.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.documento.includes(searchTerm)
    );
    
    // Buscar en clientes
    results.clientes = ClientService.getAll().filter(cliente =>
      cliente.nombre.toLowerCase().includes(searchTerm) ||
      cliente.apellido.toLowerCase().includes(searchTerm) ||
      cliente.email.toLowerCase().includes(searchTerm) ||
      cliente.documento.includes(searchTerm) ||
      cliente.marca.toLowerCase().includes(searchTerm)
    );
    
    // Buscar en ventas
    results.ventas = SalesService.getAll().filter(venta =>
      venta.titular.toLowerCase().includes(searchTerm) ||
      venta.marca.toLowerCase().includes(searchTerm) ||
      venta.tipoSolicitud.toLowerCase().includes(searchTerm) ||
      venta.expediente.includes(searchTerm)
    );
    
    return results;
  }
};

// ============================================================================
// EXPORTACIÓN PRINCIPAL
// ============================================================================

export default {
  // Configuración
  MOCK_CONFIG,
  TIPOS_DOCUMENTO,
  ROLES,
  ESTADOS_PROCESO,
  METODOS_PAGO,
  
  // Inicialización
  initializeMockData,
  
  // Servicios
  UserService,
  EmployeeService,
  ClientService,
  SalesService,
  PaymentService,
  AppointmentService,
  ServiceService,
  RoleService,
  SearchService,
  
  // Funciones de utilidad
  getServicioById,
  getUsuarioByEmail,
  getClienteByDocumento,
  getEmpleadoByDocumento,
  getVentasByCliente,
  getPagosByOrdenServicio,
  getCitasByCliente,
  tienePermiso
}; 