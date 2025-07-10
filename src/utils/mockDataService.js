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
    
    // Sincronizar con empleados si el rol es de empleado
    this.syncWithEmployees(newUser);
    
    return newUser;
  },
  
  // Actualizar usuario
  update(id, userData) {
    const usuarios = this.getAll();
    const index = usuarios.findIndex(user => user.id === id);
    if (index !== -1) {
      const oldUser = usuarios[index];
      usuarios[index] = { ...usuarios[index], ...userData };
      setToStorage(STORAGE_KEYS.USUARIOS, usuarios);
      
      // Sincronizar con empleados si el rol cambió
      if (oldUser.role !== userData.role) {
        this.syncWithEmployees(usuarios[index]);
      }
      
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
  },
  
  // Sincronizar usuario con empleados
  syncWithEmployees(user) {
    const empleados = getFromStorage(STORAGE_KEYS.EMPLEADOS);
    const existingEmployee = empleados.find(emp => 
      emp.documento === user.documentNumber && 
      emp.tipoDocumento === user.documentType
    );
    
    if (existingEmployee) {
      // Actualizar empleado existente
      existingEmployee.rol = user.role;
      existingEmployee.email = user.email;
      existingEmployee.nombre = user.firstName;
      existingEmployee.apellidos = user.lastName;
      setToStorage(STORAGE_KEYS.EMPLEADOS, empleados);
    } else if (user.role === 'Empleado' || user.role === 'Administrador') {
      // Crear nuevo empleado si el rol es de empleado
      const newEmployee = {
        id: Date.now().toString(),
        tipoDocumento: user.documentType,
        documento: user.documentNumber,
        nombre: user.firstName,
        apellidos: user.lastName,
        email: user.email,
        rol: user.role,
        estado: 'Activo',
        fechaContratacion: new Date().toISOString().split('T')[0],
        departamento: user.role === 'Administrador' ? 'Administración' : 'General',
        telefono: '',
        direccion: ''
      };
      empleados.push(newEmployee);
      setToStorage(STORAGE_KEYS.EMPLEADOS, empleados);
    }
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
      estado: 'Activo'
    };
    empleados.push(newEmployee);
    setToStorage(STORAGE_KEYS.EMPLEADOS, empleados);
    
    // Sincronizar con usuarios
    this.syncWithUsers(newEmployee);
    
    return newEmployee;
  },
  
  // Actualizar empleado
  update(id, employeeData) {
    const empleados = this.getAll();
    const index = empleados.findIndex(emp => emp.id === id);
    if (index !== -1) {
      const oldEmployee = empleados[index];
      empleados[index] = { ...empleados[index], ...employeeData };
      setToStorage(STORAGE_KEYS.EMPLEADOS, empleados);
      
      // Sincronizar con usuarios si el rol cambió
      if (oldEmployee.rol !== employeeData.rol) {
        this.syncWithUsers(empleados[index]);
      }
      
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
    const empleado = this.update(id, { rol: nuevoRol });
    if (empleado) {
      // Sincronizar con usuarios
      this.syncWithUsers(empleado);
    }
    return empleado;
  },
  
  // Obtener estadísticas
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
  },
  
  // Sincronizar empleado con usuarios
  syncWithUsers(employee) {
    const usuarios = getFromStorage(STORAGE_KEYS.USUARIOS);
    const existingUser = usuarios.find(user => 
      user.documentNumber === employee.documento && 
      user.documentType === employee.tipoDocumento
    );
    
    if (existingUser) {
      // Actualizar usuario existente
      existingUser.role = employee.rol;
      existingUser.email = employee.email;
      existingUser.firstName = employee.nombre;
      existingUser.lastName = employee.apellidos;
      setToStorage(STORAGE_KEYS.USUARIOS, usuarios);
    } else {
      // Crear nuevo usuario si no existe
      const newUser = {
        id: Date.now().toString(),
        firstName: employee.nombre,
        lastName: employee.apellidos,
        documentType: employee.tipoDocumento,
        documentNumber: employee.documento,
        email: employee.email,
        password: '123456', // Contraseña por defecto
        role: employee.rol,
        estado: 'activo'
      };
      usuarios.push(newUser);
      setToStorage(STORAGE_KEYS.USUARIOS, usuarios);
    }
  }
};

// ============================================================================
// SERVICIOS DE CLIENTES
// ============================================================================

export const ClientService = {
  getAll() {
    return getFromStorage(STORAGE_KEYS.CLIENTES);
  },
  
  getByDocument(documento) {
    const clientes = this.getAll();
    return clientes.find(cli => cli.documento === documento);
  },
  
  getByEmail(email) {
    const clientes = this.getAll();
    return clientes.find(cli => cli.email === email);
  },
  
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
  
  update(id, clientData) {
    const clientes = this.getAll();
    const index = clientes.findIndex(cli => cli.id === id);
    if (index !== -1) {
      clientes[index] = { ...clientes[index], ...clientData };
      setToStorage(STORAGE_KEYS.CLIENTES, clientes);
      return clientes[index];
    }
    return null;
  },
  
  delete(id) {
    const clientes = this.getAll();
    const filtered = clientes.filter(cli => cli.id !== id);
    setToStorage(STORAGE_KEYS.CLIENTES, filtered);
    return true;
  }
};

// ============================================================================
// SERVICIOS DE VENTAS
// ============================================================================

export const SaleService = {
  getInProcess() {
    return getFromStorage(STORAGE_KEYS.VENTAS_PROCESO);
  },
  
  getCompleted() {
    return getFromStorage(STORAGE_KEYS.VENTAS_FINALIZADAS);
  },
  
  getAll() {
    const enProceso = this.getInProcess();
    const finalizadas = this.getCompleted();
    return [...enProceso, ...finalizadas];
  },
  
  getByClient(email) {
    const ventas = this.getAll();
    return ventas.filter(venta => venta.email === email);
  },
  
  create(saleData) {
    const ventas = this.getInProcess();
    const newSale = {
      id: Date.now().toString(),
      ...saleData,
      fechaSolicitud: new Date().toISOString().split('T')[0]
    };
    ventas.push(newSale);
    setToStorage(STORAGE_KEYS.VENTAS_PROCESO, ventas);
    return newSale;
  },
  
  update(id, saleData) {
    const ventas = this.getInProcess();
    const index = ventas.findIndex(venta => venta.id === id);
    if (index !== -1) {
      ventas[index] = { ...ventas[index], ...saleData };
      setToStorage(STORAGE_KEYS.VENTAS_PROCESO, ventas);
      return ventas[index];
    }
    return null;
  },
  
  delete(id) {
    const ventas = this.getInProcess();
    const filtered = ventas.filter(venta => venta.id !== id);
    setToStorage(STORAGE_KEYS.VENTAS_PROCESO, filtered);
    return true;
  },
  
  cancel(id, motivo) {
    const venta = this.update(id, { 
      estado: 'Cancelado',
      comentarios: [...(this.getById(id)?.comentarios || []), {
        fecha: new Date().toISOString(),
        texto: `Cancelado: ${motivo}`
      }]
    });
    return venta;
  },
  
  addComment(id, comment) {
    const venta = this.getById(id);
    if (venta) {
      const comentarios = [...(venta.comentarios || []), {
        fecha: new Date().toISOString(),
        texto: comment
      }];
      return this.update(id, { comentarios });
    }
    return null;
  }
};

// ============================================================================
// SERVICIOS DE PAGOS
// ============================================================================

export const PaymentService = {
  getAll() {
    return getFromStorage(STORAGE_KEYS.PAGOS);
  },
  
  getByOrder(orderId) {
    const pagos = this.getAll();
    return pagos.filter(pago => pago.id_orden_servicio === orderId);
  },
  
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
  getAll() {
    return getFromStorage(STORAGE_KEYS.CITAS);
  },
  
  getByClient(cedula) {
    const citas = this.getAll();
    return citas.filter(cita => cita.extendedProps?.cedula === cedula);
  },
  
  create(appointmentData) {
    const citas = this.getAll();
    const newAppointment = {
      id: Date.now().toString(),
      title: `Asesor: ${appointmentData.asesor}`,
      start: appointmentData.fecha + 'T' + appointmentData.horaInicio,
      end: appointmentData.fecha + 'T' + appointmentData.horaFin,
      extendedProps: {
        nombre: appointmentData.nombre,
        apellido: appointmentData.apellido,
        cedula: appointmentData.cedula,
        telefono: appointmentData.telefono,
        horaInicio: appointmentData.horaInicio,
        horaFin: appointmentData.horaFin,
        detalle: appointmentData.detalle,
        tipoCita: appointmentData.tipoCita,
        asesor: appointmentData.asesor,
        estado: 'Programada'
      }
    };
    citas.push(newAppointment);
    setToStorage(STORAGE_KEYS.CITAS, citas);
    return newAppointment;
  },
  
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
  
  cancel(id, motivo) {
    const cita = this.update(id, { 
      extendedProps: {
        ...this.getById(id)?.extendedProps,
        estado: 'Cancelada',
        motivo: motivo
      }
    });
    return cita;
  }
};

// ============================================================================
// SERVICIOS DE SERVICIOS
// ============================================================================

export const ServiceService = {
  getAll() {
    return getFromStorage(STORAGE_KEYS.SERVICIOS);
  },
  
  getById(id) {
    const servicios = this.getAll();
    return servicios.find(serv => serv.id === id);
  },
  
  getVisible() {
    const servicios = this.getAll();
    return servicios.filter(serv => serv.visible_en_landing);
  },
  
  update(id, serviceData) {
    const servicios = this.getAll();
    const index = servicios.findIndex(serv => serv.id === id);
    if (index !== -1) {
      servicios[index] = { ...servicios[index], ...serviceData };
      setToStorage(STORAGE_KEYS.SERVICIOS, servicios);
      return servicios[index];
    }
    return null;
  },
  
  toggleVisibility(id) {
    const servicio = this.getById(id);
    if (servicio) {
      return this.update(id, { 
        visible_en_landing: !servicio.visible_en_landing 
      });
    }
    return null;
  }
};

// ============================================================================
// SERVICIOS DE ROLES
// ============================================================================

export const RoleService = {
  getAll() {
    return getFromStorage(STORAGE_KEYS.ROLES);
  },
  
  getById(id) {
    const roles = this.getAll();
    return roles.find(rol => rol.id === id);
  },
  
  getByNombre(nombre) {
    const roles = this.getAll();
    return roles.find(rol => rol.nombre === nombre);
  },
  
  create(rolData) {
    const roles = this.getAll();
    const newRole = {
      id: Date.now().toString(),
      ...rolData,
      estado: 'Activo'
    };
    roles.push(newRole);
    setToStorage(STORAGE_KEYS.ROLES, roles);
    return newRole;
  },
  
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
  
  delete(id) {
    const roles = this.getAll();
    const filtered = roles.filter(rol => rol.id !== id);
    setToStorage(STORAGE_KEYS.ROLES, filtered);
    return true;
  },
  
  getRolesDisponibles() {
    const roles = this.getAll();
    return roles.filter(rol => rol.estado === 'Activo');
  },
  
  getRolesDisponiblesUsuarios() {
    const roles = this.getAll();
    return roles.filter(rol => rol.estado === 'Activo' && rol.nombre !== 'Cliente');
  },
  
  getEmpleadosByRol(rolNombre) {
    return EmployeeService.getByRol(rolNombre);
  },
  
  hasPermission(rolId, resource, action) {
    const rol = this.getById(rolId);
    return rol?.permisos?.[resource]?.[action] === true;
  },
  
  hasUserPermission(user, resource, action) {
    if (user.role === 'Administrador') return true;
    const rol = this.getByNombre(user.role);
    return rol?.permisos?.[resource]?.[action] === true;
  }
};

// ============================================================================
// BÚSQUEDA GLOBAL
// ============================================================================

export function globalSearch(query) {
  const results = {
    usuarios: [],
    empleados: [],
    clientes: [],
    ventas: []
  };
  
  if (!query) return results;
  
  const searchTerm = query.toLowerCase();
  
  // Buscar en usuarios
  const usuarios = UserService.getAll();
  results.usuarios = usuarios.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm) ||
    user.lastName.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm) ||
    user.documentNumber.includes(searchTerm)
  );
  
  // Buscar en empleados
  const empleados = EmployeeService.getAll();
  results.empleados = empleados.filter(emp => 
    emp.nombre.toLowerCase().includes(searchTerm) ||
    emp.apellidos.toLowerCase().includes(searchTerm) ||
    emp.email.toLowerCase().includes(searchTerm) ||
    emp.documento.includes(searchTerm)
  );
  
  // Buscar en clientes
  const clientes = ClientService.getAll();
  results.clientes = clientes.filter(cli => 
    cli.nombre.toLowerCase().includes(searchTerm) ||
    cli.apellido.toLowerCase().includes(searchTerm) ||
    cli.email.toLowerCase().includes(searchTerm) ||
    cli.documento.includes(searchTerm)
  );
  
  // Buscar en ventas
  const ventas = SaleService.getAll();
  results.ventas = ventas.filter(venta => 
    venta.titular.toLowerCase().includes(searchTerm) ||
    venta.marca.toLowerCase().includes(searchTerm) ||
    venta.email.toLowerCase().includes(searchTerm)
  );
  
  return results;
} 