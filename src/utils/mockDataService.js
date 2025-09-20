// Servicio centralizado para manejo de datos mock
// Conecta todas las entidades del sistema y proporciona métodos unificados

import {
  USUARIOS,
  EMPLEADOS,
  CLIENTES,
  VENTAS_EN_PROCESO,
  VENTAS_FINALIZADAS,
  PAGOS,
  CITAS,
  SOLICITUDES_CITAS,
  ROLES_PERMISOS,
  SERVICIOS,
} from "./mockData.js";
import alertService from "./alertService.js";

// ============================================================================
// CONFIGURACIÓN DE ALMACENAMIENTO
// ============================================================================

const STORAGE_KEYS = {
  USUARIOS: "usuarios_mock",
  EMPLEADOS: "empleados_mock",
  CLIENTES: "clientes_mock",
  VENTAS_PROCESO: "ventas_proceso_mock",
  VENTAS_FINALIZADAS: "ventas_finalizadas_mock",
  PAGOS: "pagos_mock",
  CITAS: "citas_mock",
  SOLICITUDES_CITAS: "solicitudes_citas_mock",
  ROLES: "roles_mock",
  SERVICIOS: "servicios_mock",
};

// ============================================================================
// SISTEMA DE NOTIFICACIONES PARA ACTUALIZACIONES
// ============================================================================

const dataChangeListeners = new Set();

export const DataChangeNotifier = {
  // Suscribirse a cambios de datos
  subscribe(callback) {
    dataChangeListeners.add(callback);
    return () => dataChangeListeners.delete(callback);
  },

  // Notificar a todos los listeners
  notify(dataType, action, data) {
    console.log("🔧 [DataChangeNotifier] notify:", dataType, action, data);
    console.log(
      "🔧 [DataChangeNotifier] Listeners activos:",
      dataChangeListeners.size
    );
    dataChangeListeners.forEach((callback) => {
      try {
        callback(dataType, action, data);
      } catch (error) {
        console.error("Error en listener de cambio de datos:", error);
      }
    });
  },

  // Notificar cambio específico
  notifySaleChange(action, saleData) {
    console.log("🔧 [DataChangeNotifier] notifySaleChange:", action, saleData);
    this.notify("sale", action, saleData);
  },

  // Notificar cambio de usuario
  notifyUserChange(action, userData) {
    this.notify("user", action, userData);
  },
};

// ============================================================================
// SERVICIO DE LOCALSTORAGE CENTRALIZADO
// ============================================================================

export const LocalStorageService = {
  // Obtener datos con manejo de errores
  get(key) {
    try {
      const data = localStorage.getItem(key);
      const parsed = data ? JSON.parse(data) : null;
      console.log(
        "🔧 [LocalStorageService.get] Obteniendo datos:",
        key,
        parsed
      );
      return parsed;
    } catch (error) {
      console.error(`Error al obtener datos de ${key}:`, error);
      return null;
    }
  },

  // Guardar datos con manejo de errores
  set(key, data) {
    try {
      console.log("🔧 [LocalStorageService.set] Guardando datos:", key, data);
      localStorage.setItem(key, JSON.stringify(data));
      console.log("🔧 [LocalStorageService.set] Datos guardados exitosamente");
      return true;
    } catch (error) {
      console.error(`Error al guardar datos en ${key}:`, error);
      return false;
    }
  },

  // Eliminar datos
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error al eliminar datos de ${key}:`, error);
      return false;
    }
  },

  // Verificar si existe una clave
  has(key) {
    return localStorage.getItem(key) !== null;
  },

  // Limpiar todas las claves mock
  clearMockData() {
    Object.values(STORAGE_KEYS).forEach((key) => {
      this.remove(key);
    });
  },

  // Obtener todas las claves mock
  getMockKeys() {
    return Object.values(STORAGE_KEYS);
  },
};

// ============================================================================
// FUNCIONES DE ALMACENAMIENTO
// ============================================================================

function getFromStorage(key) {
  return LocalStorageService.get(key) || [];
}

function setToStorage(key, data) {
  return LocalStorageService.set(key, data);
}

// ============================================================================
// INICIALIZACIÓN DE DATOS
// ============================================================================

export function initializeMockData() {
  console.log("Inicializando datos mock centralizados...");

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

  if (getFromStorage(STORAGE_KEYS.SOLICITUDES_CITAS).length === 0) {
    setToStorage(STORAGE_KEYS.SOLICITUDES_CITAS, SOLICITUDES_CITAS);
  }

  if (getFromStorage(STORAGE_KEYS.ROLES).length === 0) {
    setToStorage(STORAGE_KEYS.ROLES, ROLES_PERMISOS);
  }

  if (getFromStorage(STORAGE_KEYS.SERVICIOS).length === 0) {
    setToStorage(STORAGE_KEYS.SERVICIOS, SERVICIOS);
  }

  console.log("Datos mock inicializados correctamente");
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
    return usuarios.find((user) => user.email === email);
  },

  // Obtener usuario por documento
  getByDocument(documentType, documentNumber) {
    const usuarios = this.getAll();
    return usuarios.find(
      (user) =>
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
      estado: "activo",
    };
    usuarios.push(newUser);
    setToStorage(STORAGE_KEYS.USUARIOS, usuarios);

    // Sincronizar con empleados si el rol es de empleado
    this.syncWithEmployees(newUser);

    // Sincronizar con clientes si el rol es de cliente
    this.syncWithClients(newUser);

    return newUser;
  },

  // Actualizar usuario
  update(id, userData) {
    console.log(
      "UserService.update: Recibiendo id:",
      id,
      "y userData:",
      userData
    );
    const usuarios = this.getAll();
    console.log("UserService.update: Usuarios antes de actualizar:", usuarios);
    const index = usuarios.findIndex((user) => user.id === id);
    if (index !== -1) {
      const oldUser = usuarios[index];
      usuarios[index] = { ...usuarios[index], ...userData };
      setToStorage(STORAGE_KEYS.USUARIOS, usuarios);
      console.log(
        "UserService.update: Usuarios después de actualizar:",
        usuarios
      );

      // Sincronizar con empleados si el rol cambió
      if (oldUser.role !== userData.role) {
        this.syncWithEmployees(usuarios[index]);
      }

      // Sincronizar con clientes si el rol cambió o es cliente
      if (oldUser.role !== userData.role || userData.role === "Cliente") {
        this.syncWithClients(usuarios[index]);
      }

      return usuarios[index];
    }
    console.log("UserService.update: Usuario con id", id, "no encontrado.");
    return null;
  },

  // Eliminar usuario
  delete(id) {
    const usuarios = this.getAll();
    const filtered = usuarios.filter((user) => user.id !== id);
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
    const existingEmployee = empleados.find(
      (emp) =>
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
    } else if (user.role === "Empleado" || user.role === "Administrador") {
      // Crear nuevo empleado si el rol es de empleado
      const newEmployee = {
        id: Date.now().toString(),
        tipoDocumento: user.documentType,
        documento: user.documentNumber,
        nombre: user.firstName,
        apellidos: user.lastName,
        email: user.email,
        rol: user.role,
        estado: "activo",
        fechaContratacion: new Date().toISOString().split("T")[0],
        departamento:
          user.role === "Administrador" ? "Administración" : "General",
        telefono: "",
        direccion: "",
      };
      empleados.push(newEmployee);
      setToStorage(STORAGE_KEYS.EMPLEADOS, empleados);
    }
  },

  // Sincronizar usuario con clientes
  syncWithClients(user) {
    if (user.role === "Cliente") {
      const clientes = getFromStorage(STORAGE_KEYS.CLIENTES);
      // Buscar si ya existe un cliente con el mismo documento
      let cliente = clientes.find(
        (cli) => cli.documento === user.documentNumber
      );
      if (cliente) {
        // Actualizar datos del cliente
        cliente.nombre = user.firstName;
        cliente.apellido = user.lastName;
        cliente.email = user.email;
        cliente.tipoDocumento = user.documentType;
        cliente.documento = user.documentNumber;
        cliente.tipoPersona = user.tipoPersona || "Natural";
        cliente.estado = user.estado || "activo";
      } else {
        // Crear nuevo cliente
        cliente = {
          id: Date.now().toString(),
          nombre: user.firstName,
          apellido: user.lastName,
          email: user.email,
          tipoDocumento: user.documentType,
          documento: user.documentNumber,
          tipoPersona: user.tipoPersona || "Natural",
          estado: user.estado || "activo",
          nitEmpresa: user.nitEmpresa || "",
          nombreEmpresa: user.nombreEmpresa || "",
          marca: user.marca || "",
          telefono: user.telefono || "",
        };
        clientes.push(cliente);
      }
      setToStorage(STORAGE_KEYS.CLIENTES, clientes);
    }
  },
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
    return empleados.find((emp) => emp.documento === documento);
  },

  // Obtener empleado por email
  getByEmail(email) {
    const empleados = this.getAll();
    return empleados.find((emp) => emp.email === email);
  },

  // Obtener empleados por rol
  getByRol(rol) {
    const empleados = this.getAll();
    return empleados.filter((emp) => emp.rol === rol);
  },

  // Crear nuevo empleado
  create(employeeData) {
    const empleados = this.getAll();
    const newEmployee = {
      id: Date.now().toString(),
      ...employeeData,
      estado: "activo",
    };
    empleados.push(newEmployee);
    setToStorage(STORAGE_KEYS.EMPLEADOS, empleados);

    // Sincronizar con usuarios
    this.syncWithUsers(newEmployee);

    return newEmployee;
  },

  // Actualizar empleado
  update(id, employeeData) {
    console.log(
      "EmployeeService.update: Recibiendo id:",
      id,
      "y employeeData:",
      employeeData
    );
    const empleados = this.getAll();
    console.log(
      "EmployeeService.update: Empleados antes de actualizar:",
      empleados
    );
    const index = empleados.findIndex((emp) => emp.id === id);
    if (index !== -1) {
      const oldEmployee = empleados[index];
      empleados[index] = { ...empleados[index], ...employeeData };
      setToStorage(STORAGE_KEYS.EMPLEADOS, empleados);
      console.log(
        "EmployeeService.update: Empleados después de actualizar:",
        empleados
      );

      // Sincronizar con usuarios si el rol cambió
      if (oldEmployee.rol !== employeeData.rol) {
        this.syncWithUsers(empleados[index]);
      }

      return empleados[index];
    }
    console.log(
      "EmployeeService.update: Empleado con id",
      id,
      "no encontrado."
    );
    return null;
  },

  // Eliminar empleado
  delete(id) {
    const empleados = this.getAll();
    const filtered = empleados.filter((emp) => emp.id !== id);
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
    const activos = empleados.filter((emp) => emp.estado === "activo").length;
    const porRol = {};

    empleados.forEach((emp) => {
      porRol[emp.rol] = (porRol[emp.rol] || 0) + 1;
    });

    return {
      total,
      activos,
      inactivos: total - activos,
      porRol,
    };
  },

  // Sincronizar empleado con usuarios
  syncWithUsers(employee) {
    const usuarios = getFromStorage(STORAGE_KEYS.USUARIOS);
    const existingUser = usuarios.find(
      (user) =>
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
        password: "123456", // Contraseña por defecto
        role: employee.rol,
        estado: "activo",
      };
      usuarios.push(newUser);
      setToStorage(STORAGE_KEYS.USUARIOS, usuarios);
    }
  },
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
    return clientes.find((cli) => cli.documento === documento);
  },

  getByEmail(email) {
    const clientes = this.getAll();
    return clientes.find((cli) => cli.email === email);
  },

  create(clientData) {
    const clientes = this.getAll();
    const newClient = {
      id: Date.now().toString(),
      ...clientData,
      estado: "activo",
    };
    clientes.push(newClient);
    setToStorage(STORAGE_KEYS.CLIENTES, clientes);
    return newClient;
  },

  update(id, clientData) {
    const clientes = this.getAll();
    const index = clientes.findIndex((cli) => cli.id === id);
    if (index !== -1) {
      clientes[index] = { ...clientes[index], ...clientData };
      setToStorage(STORAGE_KEYS.CLIENTES, clientes);
      return clientes[index];
    }
    return null;
  },

  delete(id) {
    const clientes = this.getAll();
    const filtered = clientes.filter((cli) => cli.id !== id);
    setToStorage(STORAGE_KEYS.CLIENTES, filtered);
    return true;
  },
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

  getById(id) {
    const ventas = this.getAll();
    return ventas.find((venta) => venta.id === id);
  },

  getByClient(email) {
    const ventas = this.getAll();
    return ventas.filter((venta) => venta.email === email);
  },

  create(saleData) {
    console.log("🔧 [SaleService.create] Iniciando creación de venta");
    console.log("🔧 [SaleService.create] Datos recibidos:", saleData);

    const ventas = this.getInProcess();
    console.log("🔧 [SaleService.create] Ventas actuales en proceso:", ventas);

    const newSale = {
      id: Date.now().toString(),
      ...saleData,
      fechaSolicitud: new Date().toISOString().split("T")[0],
    };
    console.log("🔧 [SaleService.create] Nueva venta creada:", newSale);

    ventas.push(newSale);
    console.log("🔧 [SaleService.create] Ventas después de agregar:", ventas);

    const storageResult = setToStorage(STORAGE_KEYS.VENTAS_PROCESO, ventas);
    console.log(
      "🔧 [SaleService.create] Resultado de setToStorage:",
      storageResult
    );

    // Verificar que se guardó correctamente
    const ventasVerificadas = this.getInProcess();
    console.log(
      "🔧 [SaleService.create] Ventas verificadas después de guardar:",
      ventasVerificadas
    );

    // ✅ NUEVO: Alerta automática de nueva solicitud (comentado para evitar conflictos de autenticación)
    // alertService.newSaleCreated(newSale);

    // Notificar el cambio
    console.log("🔧 [SaleService.create] Notificando cambio...");
    DataChangeNotifier.notifySaleChange("create", newSale);

    return newSale;
  },

  update(id, saleData) {
    const ventas = this.getInProcess();
    const ventasFin = this.getCompleted();
    let ventaIndex = ventas.findIndex((venta) => venta.id === id);
    let ventaFinIndex = ventasFin.findIndex((venta) => venta.id === id);
    let venta;

    // Si está en proceso
    if (ventaIndex !== -1) {
      venta = ventas[ventaIndex];
      const ventaActualizada = { ...venta, ...saleData };

      // ✅ NUEVO: Alerta automática de cambio de estado
      if (saleData.estado && saleData.estado !== venta.estado) {
        alertService.saleStatusChanged(
          ventaActualizada,
          venta.estado,
          saleData.estado
        );
      }

      // Si cambia a finalizado/anulado/rechazado/cancelado, mover a finalizadas
      if (
        ["Finalizado", "Anulado", "Rechazado", "Cancelado"].includes(
          saleData.estado
        )
      ) {
        ventas.splice(ventaIndex, 1);
        ventasFin.push(ventaActualizada);
        setToStorage(STORAGE_KEYS.VENTAS_PROCESO, ventas);
        setToStorage(STORAGE_KEYS.VENTAS_FINALIZADAS, ventasFin);
        DataChangeNotifier.notifySaleChange(
          "move_to_completed",
          ventaActualizada
        );
      } else {
        ventas[ventaIndex] = ventaActualizada;
        setToStorage(STORAGE_KEYS.VENTAS_PROCESO, ventas);
        DataChangeNotifier.notifySaleChange("update", ventaActualizada);
      }
      return ventaActualizada;
    }

    // Si está en finalizadas
    if (ventaFinIndex !== -1) {
      venta = ventasFin[ventaFinIndex];
      const ventaActualizada = { ...venta, ...saleData };

      // ✅ NUEVO: Alerta automática de cambio de estado
      if (saleData.estado && saleData.estado !== venta.estado) {
        alertService.saleStatusChanged(
          ventaActualizada,
          venta.estado,
          saleData.estado
        );
      }

      // Si vuelve a proceso
      if (!["Finalizado", "Anulado", "Rechazado"].includes(saleData.estado)) {
        ventasFin.splice(ventaFinIndex, 1);
        ventas.push(ventaActualizada);
        setToStorage(STORAGE_KEYS.VENTAS_FINALIZADAS, ventasFin);
        setToStorage(STORAGE_KEYS.VENTAS_PROCESO, ventas);
        DataChangeNotifier.notifySaleChange(
          "move_to_process",
          ventaActualizada
        );
      } else {
        ventasFin[ventaFinIndex] = ventaActualizada;
        setToStorage(STORAGE_KEYS.VENTAS_FINALIZADAS, ventasFin);
        DataChangeNotifier.notifySaleChange("update", ventaActualizada);
      }
      return ventaActualizada;
    }

    return null;
  },

  delete(id) {
    const ventas = this.getInProcess();
    const filtered = ventas.filter((venta) => venta.id !== id);
    setToStorage(STORAGE_KEYS.VENTAS_PROCESO, filtered);

    // Notificar el cambio
    DataChangeNotifier.notifySaleChange("delete", { id });

    return true;
  },

  cancel(id, motivo) {
    const venta = this.update(id, {
      estado: "Cancelado",
      comentarios: [
        ...(this.getById(id)?.comentarios || []),
        {
          fecha: new Date().toISOString(),
          texto: `Cancelado: ${motivo}`,
        },
      ],
    });

    // Notificar el cambio
    DataChangeNotifier.notifySaleChange("cancel", venta);

    return venta;
  },

  addComment(id, comment) {
    const venta = this.getById(id);
    if (venta) {
      const comentarios = [
        ...(venta.comentarios || []),
        {
          fecha: new Date().toISOString(),
          texto: comment,
        },
      ];
      const ventaActualizada = this.update(id, { comentarios });

      // Notificar el cambio
      DataChangeNotifier.notifySaleChange("add_comment", ventaActualizada);

      return ventaActualizada;
    }
    return null;
  },
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
    return pagos.filter((pago) => pago.id_orden_servicio === orderId);
  },

  create(paymentData) {
    const pagos = this.getAll();
    const newPayment = {
      id_pago: Date.now(),
      ...paymentData,
      fecha_pago: new Date().toISOString(),
    };
    pagos.push(newPayment);
    setToStorage(STORAGE_KEYS.PAGOS, pagos);
    return newPayment;
  },

  update(id, paymentData) {
    const pagos = this.getAll();
    const index = pagos.findIndex((pago) => pago.id_pago === id);
    if (index !== -1) {
      pagos[index] = { ...pagos[index], ...paymentData };
      setToStorage(STORAGE_KEYS.PAGOS, pagos);
      return pagos[index];
    }
    return null;
  },
};

// ============================================================================
// SERVICIOS DE CITAS
// ============================================================================

export const AppointmentService = {
  getAll() {
    return getFromStorage(STORAGE_KEYS.CITAS);
  },

  getById(id) {
    const citas = this.getAll();
    return citas.find((cita) => cita.id === id);
  },

  getByClient(cedula) {
    const citas = this.getAll();
    return citas.filter((cita) => cita.cedulaCliente === cedula);
  },

  create(appointmentData) {
    const citas = this.getAll();
    const newAppointment = {
      id: Date.now().toString(),
      ...appointmentData,
      fechaCreacion: new Date().toISOString(),
      estado: "programada",
    };
    citas.push(newAppointment);
    setToStorage(STORAGE_KEYS.CITAS, citas);

    // Notificar cambio
    DataChangeNotifier.notify("appointment", "create", newAppointment);

    return newAppointment;
  },

  update(id, appointmentData) {
    const citas = this.getAll();
    const index = citas.findIndex((cita) => cita.id === id);
    if (index !== -1) {
      citas[index] = { ...citas[index], ...appointmentData };
      setToStorage(STORAGE_KEYS.CITAS, citas);

      // Notificar cambio
      DataChangeNotifier.notify("appointment", "update", citas[index]);

      return citas[index];
    }
    return null;
  },

  cancel(id, motivo) {
    const cita = this.getById(id);
    if (cita) {
      const citaActualizada = this.update(id, {
        estado: "cancelada",
        motivoCancelacion: motivo,
        fechaCancelacion: new Date().toISOString(),
      });

      // Notificar cambio
      DataChangeNotifier.notify("appointment", "cancel", citaActualizada);

      return citaActualizada;
    }
    return null;
  },

  // ✅ NUEVO: Obtener empleados para calendario
  getEmployeesForCalendar() {
    return EmployeeService.getAll().filter((emp) => emp.estado === "Activo");
  },

  // ✅ NUEVO: Obtener citas por empleado
  getByEmployee(empleadoId) {
    const citas = this.getAll();
    return citas.filter((cita) => cita.empleadoId === empleadoId);
  },

  // ✅ NUEVO: Obtener citas próximas
  getUpcoming(days = 7) {
    const citas = this.getAll();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return citas.filter((cita) => {
      const citaDate = new Date(cita.fecha);
      return (
        citaDate >= today &&
        citaDate <= futureDate &&
        cita.estado === "programada"
      );
    });
  },
};

// ============================================================================
// SERVICIOS DE SOLICITUDES DE CITAS
// ============================================================================

export const SolicitudCitaService = {
  // Obtener todas las solicitudes
  getAll() {
    return getFromStorage(STORAGE_KEYS.SOLICITUDES_CITAS);
  },

  // Obtener solicitud por ID
  getById(id) {
    const solicitudes = this.getAll();
    return solicitudes.find((solicitud) => solicitud.id === id);
  },

  // Crear nueva solicitud
  create(solicitudData) {
    const solicitudes = this.getAll();
    const newSolicitud = {
      id: Date.now().toString(),
      ...solicitudData,
      fechaCreacion: new Date().toISOString(),
      estado: "Pendiente",
    };
    solicitudes.push(newSolicitud);
    setToStorage(STORAGE_KEYS.SOLICITUDES_CITAS, solicitudes);

    // Notificar cambio
    DataChangeNotifier.notify("solicitudCita", "create", newSolicitud);

    // ✅ NUEVO: Alerta automática de nueva solicitud
    alertService.newAppointmentRequest(newSolicitud);

    return newSolicitud;
  },

  // Actualizar solicitud
  update(id, solicitudData) {
    const solicitudes = this.getAll();
    const index = solicitudes.findIndex((solicitud) => solicitud.id === id);
    if (index !== -1) {
      const oldSolicitud = solicitudes[index];
      solicitudes[index] = { ...solicitudes[index], ...solicitudData };
      setToStorage(STORAGE_KEYS.SOLICITUDES_CITAS, solicitudes);

      // Notificar cambio
      DataChangeNotifier.notify("solicitudCita", "update", solicitudes[index]);

      // ✅ NUEVO: Alerta automática de cambio de estado
      if (
        solicitudData.estado &&
        solicitudData.estado !== oldSolicitud.estado
      ) {
        alertService.appointmentRequestStatusChanged(
          solicitudes[index],
          oldSolicitud.estado,
          solicitudData.estado
        );
      }

      return solicitudes[index];
    }
    return null;
  },

  // Aprobar solicitud
  aprobar(id, observaciones = "") {
    const result = this.update(id, {
      estado: "Aprobada",
      fechaAprobacion: new Date().toISOString(),
      observaciones,
    });

    if (result) {
      // ✅ NUEVO: Crear cita automáticamente
      const cita = AppointmentService.create({
        ...result,
        estado: "programada",
        fechaProgramada: result.fechaSolicitada,
        observaciones: result.observaciones,
      });

      // ✅ NUEVO: Alerta de cita creada
      alertService.appointmentCreatedFromRequest(cita, result);
    }

    return result;
  },

  // Rechazar solicitud
  rechazar(id, motivo) {
    return this.update(id, {
      estado: "Rechazada",
      fechaRechazo: new Date().toISOString(),
      motivoRechazo: motivo,
    });
  },

  // Obtener solicitudes por estado
  getByEstado(estado) {
    const solicitudes = this.getAll();
    return solicitudes.filter((solicitud) => solicitud.estado === estado);
  },

  // Obtener solicitudes por usuario
  getByUsuario(email) {
    const solicitudes = this.getAll();
    return solicitudes.filter((solicitud) => solicitud.email === email);
  },

  // ✅ NUEVO: Obtener solicitudes pendientes
  getPendientes() {
    return this.getByEstado("Pendiente");
  },

  // ✅ NUEVO: Obtener solicitudes del día
  getSolicitudesHoy() {
    const solicitudes = this.getAll();
    const hoy = new Date().toISOString().split("T")[0];
    return solicitudes.filter((solicitud) =>
      solicitud.fechaCreacion.startsWith(hoy)
    );
  },

  // ✅ NUEVO: Obtener estadísticas
  getStats() {
    const solicitudes = this.getAll();
    const stats = {
      total: solicitudes.length,
      porEstado: {},
      promedioTiempoRespuesta: 0,
    };

    // Conteo por estado
    solicitudes.forEach((solicitud) => {
      stats.porEstado[solicitud.estado] =
        (stats.porEstado[solicitud.estado] || 0) + 1;
    });

    // Calcular tiempo promedio de respuesta
    const solicitudesRespondidas = solicitudes.filter(
      (s) => s.estado === "Aprobada" || s.estado === "Rechazada"
    );

    if (solicitudesRespondidas.length > 0) {
      const tiempoTotal = solicitudesRespondidas.reduce((total, s) => {
        const fechaRespuesta = new Date(s.fechaAprobacion || s.fechaRechazo);
        const fechaCreacion = new Date(s.fechaCreacion);
        return total + (fechaRespuesta - fechaCreacion);
      }, 0);

      stats.promedioTiempoRespuesta =
        tiempoTotal / solicitudesRespondidas.length;
    }

    return stats;
  },
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
    return servicios.find((serv) => serv.id === id);
  },

  getVisible() {
    const servicios = this.getAll();
    return servicios.filter((serv) => serv.visible_en_landing);
  },

  update(id, serviceData) {
    const servicios = this.getAll();
    const index = servicios.findIndex((serv) => serv.id === id);
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
        visible_en_landing: !servicio.visible_en_landing,
      });
    }
    return null;
  },
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
    return roles.find((rol) => rol.id === id);
  },

  getByNombre(nombre) {
    const roles = this.getAll();
    return roles.find((rol) => rol.nombre === nombre);
  },

  create(rolData) {
    const roles = this.getAll();
    const newRole = {
      id: Date.now().toString(),
      ...rolData,
      estado: "Activo",
    };
    roles.push(newRole);
    setToStorage(STORAGE_KEYS.ROLES, roles);
    return newRole;
  },

  update(id, rolData) {
    const roles = this.getAll();
    const index = roles.findIndex((rol) => rol.id === id);
    if (index !== -1) {
      roles[index] = { ...roles[index], ...rolData };
      setToStorage(STORAGE_KEYS.ROLES, roles);
      return roles[index];
    }
    return null;
  },

  delete(id) {
    const roles = this.getAll();
    const filtered = roles.filter((rol) => rol.id !== id);
    setToStorage(STORAGE_KEYS.ROLES, filtered);
    return true;
  },

  getRolesDisponibles() {
    const roles = this.getAll();
    return roles.filter((rol) => rol.estado === "Activo");
  },

  getRolesDisponiblesUsuarios() {
    const roles = this.getAll();
    return roles.filter(
      (rol) => rol.estado === "Activo" && rol.nombre !== "Cliente"
    );
  },

  getEmpleadosByRol(rolNombre) {
    return EmployeeService.getByRol(rolNombre);
  },

  hasPermission(rolId, resource, action) {
    const rol = this.getById(rolId);
    return rol?.permisos?.[resource]?.[action] === true;
  },

  hasUserPermission(user, resource, action) {
    if (user.role === "Administrador") return true;
    const rol = this.getByNombre(user.role);
    return rol?.permisos?.[resource]?.[action] === true;
  },
};

// ============================================================================
// BÚSQUEDA GLOBAL
// ============================================================================

export function globalSearch(query) {
  const results = {
    usuarios: [],
    empleados: [],
    clientes: [],
    ventas: [],
  };

  if (!query) return results;

  const searchTerm = query.toLowerCase();

  // Buscar en usuarios
  const usuarios = UserService.getAll();
  results.usuarios = usuarios.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.documentNumber.includes(searchTerm)
  );

  // Buscar en empleados
  const empleados = EmployeeService.getAll();
  results.empleados = empleados.filter(
    (emp) =>
      emp.nombre.toLowerCase().includes(searchTerm) ||
      emp.apellidos.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.documento.includes(searchTerm)
  );

  // Buscar en clientes
  const clientes = ClientService.getAll();
  results.clientes = clientes.filter(
    (cli) =>
      cli.nombre.toLowerCase().includes(searchTerm) ||
      cli.apellido.toLowerCase().includes(searchTerm) ||
      cli.email.toLowerCase().includes(searchTerm) ||
      cli.documento.includes(searchTerm)
  );

  // Buscar en ventas
  const ventas = SaleService.getAll();
  results.ventas = ventas.filter(
    (venta) =>
      venta.titular.toLowerCase().includes(searchTerm) ||
      venta.marca.toLowerCase().includes(searchTerm) ||
      venta.email.toLowerCase().includes(searchTerm)
  );

  return results;
}

// ============================================================================
// EXPORTACIÓN PRINCIPAL PARA COMPATIBILIDAD
// ============================================================================

export const mockDataService = {
  // Servicios individuales
  UserService,
  EmployeeService,
  ClientService,
  SaleService,
  PaymentService,
  AppointmentService,
  SolicitudCitaService,
  ServiceService,
  RoleService,

  // Métodos de conveniencia
  getUsers: () => UserService.getAll(),
  getEmployees: () => EmployeeService.getAll(),
  getClients: () => ClientService.getAll(),
  getSales: () => SaleService,
  getServices: () => ServiceService.getAll(),
  getRoles: () => RoleService.getAll(),

  // Inicialización
  initialize: initializeMockData,

  // Búsqueda global
  search: globalSearch,

  // Notificador de cambios
  DataChangeNotifier,
};

// Exportación por defecto para compatibilidad
export default mockDataService;
