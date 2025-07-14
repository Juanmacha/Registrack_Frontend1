import Swal from 'sweetalert2';

// Configuración personalizada para SweetAlert2
const customConfig = {
  confirmButtonColor: '#2563eb', // Azul
  cancelButtonColor: '#dc2626', // Rojo
  background: '#ffffff',
  backdrop: 'rgba(0, 0, 0, 0.4)',
  customClass: {
    popup: 'rounded-xl shadow-2xl',
    title: 'text-gray-800 font-semibold',
    content: 'text-gray-600',
    confirmButton: 'rounded-lg px-6 py-2 font-medium',
    cancelButton: 'rounded-lg px-6 py-2 font-medium'
  }
};

const alertService = {
  // Alerta de éxito
  success: (title, message = '', options = {}) => {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      ...customConfig,
      ...options
    });
  },

  // Alerta de error
  error: (title, message = '', options = {}) => {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      ...customConfig,
      ...options
    });
  },

  // Alerta de advertencia
  warning: (title, message = '', options = {}) => {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      ...customConfig,
      ...options
    });
  },

  // Alerta de información
  info: (title, message = '', options = {}) => {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: message,
      ...customConfig,
      ...options
    });
  },

  // Alerta de pregunta (confirmación)
  question: (title, message = '', options = {}) => {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      ...customConfig,
      ...options
    });
  },

  // Confirmación personalizada
  confirm: (title, message = '', confirmText = 'Confirmar', cancelText = 'Cancelar', options = {}) => {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      ...customConfig,
      ...options
    });
  },

  // Alerta de carga con spinner personalizado
  loading: (title = 'Cargando...', options = {}) => {
    return Swal.fire({
      title: title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      html: `
        <div class="flex flex-col items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-600 mb-4"></div>
          <p class="text-gray-600">${title}</p>
        </div>
      `,
      ...customConfig,
      ...options
    });
  },

  // Cerrar alerta
  close: () => {
    Swal.close();
  },

  // Alerta de login exitoso
  loginSuccess: (userName) => {
    return Swal.fire({
      icon: 'success',
      title: '¡Bienvenido!',
      text: `Hola ${userName}, has iniciado sesión correctamente.`,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      ...customConfig
    });
  },

  // Alerta de login fallido
  loginError: () => {
    return Swal.fire({
      icon: 'error',
      title: 'Error de autenticación',
      text: 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.',
      ...customConfig
    });
  },

  // Alerta de registro exitoso
  registerSuccess: () => {
    return Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      text: 'Tu cuenta ha sido creada correctamente. Por favor, inicia sesión.',
      ...customConfig
    });
  },

  // Alerta de registro fallido
  registerError: (message = 'Error al registrar el usuario. Por favor, intenta de nuevo.') => {
    return Swal.fire({
      icon: 'error',
      title: 'Error en el registro',
      text: message,
      ...customConfig
    });
  },

  // Alerta de logout
  logoutConfirm: () => {
    return Swal.fire({
      icon: 'question',
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que quieres cerrar tu sesión?',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      ...customConfig
    });
  },

  // Alerta de eliminación
  deleteConfirm: (itemName = 'este elemento') => {
    return Swal.fire({
      icon: 'warning',
      title: '¿Eliminar?',
      text: `¿Estás seguro de que quieres eliminar ${itemName}? Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      ...customConfig
    });
  },

  // Alerta de eliminación exitosa
  deleteSuccess: (itemName = 'el elemento') => {
    return Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      text: `${itemName} ha sido eliminado correctamente.`,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      ...customConfig
    });
  },

  // Alerta de guardado exitoso
  saveSuccess: (itemName = 'los datos') => {
    return Swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: `${itemName} han sido guardados correctamente.`,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      ...customConfig
    });
  },

  // Alerta de error de guardado
  saveError: (message = 'Error al guardar los datos. Por favor, intenta de nuevo.') => {
    return Swal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: message,
      ...customConfig
    });
  },

  // Alerta de validación
  validationError: (message) => {
    return Swal.fire({
      icon: 'warning',
      title: 'Datos incompletos',
      text: message,
      ...customConfig
    });
  },

  // Alerta de acceso denegado
  accessDenied: () => {
    return Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'No tienes permisos para realizar esta acción.',
      ...customConfig
    });
  },

  // Alerta de sesión expirada
  sessionExpired: () => {
    return Swal.fire({
      icon: 'warning',
      title: 'Sesión expirada',
      text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      confirmButtonText: 'Entendido',
      ...customConfig
    });
  },

  // ✅ NUEVO: Alertas automáticas para cambios de estado
  saleStatusChanged: (saleData, oldStatus, newStatus) => {
    return Swal.fire({
      icon: 'info',
      title: 'Estado actualizado',
      text: `La solicitud "${saleData.marca}" ha cambiado de "${oldStatus}" a "${newStatus}"`,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      ...customConfig
    });
  },

  // ✅ NUEVO: Alerta de cita próxima
  upcomingAppointment: (appointmentData) => {
    return Swal.fire({
      icon: 'info',
      title: 'Cita próxima',
      text: `Tienes una cita programada para ${appointmentData.fecha} a las ${appointmentData.horaInicio}`,
      confirmButtonText: 'Ver detalles',
      showCancelButton: true,
      cancelButtonText: 'Más tarde',
      ...customConfig
    });
  },

  // ✅ NUEVO: Alerta de nueva solicitud
  newSaleCreated: (saleData) => {
    return Swal.fire({
      icon: 'success',
      title: 'Nueva solicitud',
      text: `Se ha creado una nueva solicitud para "${saleData.marca}"`,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      ...customConfig
    });
  },

  // ✅ NUEVO: Alerta de pago recibido
  paymentReceived: (paymentData) => {
    return Swal.fire({
      icon: 'success',
      title: 'Pago recibido',
      text: `Se ha registrado un pago de $${paymentData.monto} por ${paymentData.metodo_pago}`,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      ...customConfig
    });
  },

  // ✅ NUEVO: Alerta de error de validación
  validationError: (errors) => {
    const errorMessages = Object.values(errors).join('\n');
    return Swal.fire({
      icon: 'warning',
      title: 'Datos incompletos',
      text: errorMessages,
      ...customConfig
    });
  },

  // ✅ NUEVO: Alerta de confirmación de eliminación
  confirmDelete: (itemName, itemType = 'elemento') => {
    return Swal.fire({
      icon: 'warning',
      title: '¿Eliminar?',
      text: `¿Estás seguro de que quieres eliminar ${itemName}? Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      ...customConfig
    });
  },

  // ✅ NUEVO: Alerta de éxito de eliminación
  deleteSuccess: (itemName) => {
    return Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      text: `${itemName} ha sido eliminado correctamente.`,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      ...customConfig
    });
  },

  // ✅ NUEVO: Alerta de confirmación de cancelación
  confirmCancel: (itemName, itemType = 'elemento') => {
    return Swal.fire({
      icon: 'question',
      title: '¿Cancelar?',
      text: `¿Estás seguro de que quieres cancelar ${itemName}?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      ...customConfig
    });
  },

  // ✅ NUEVO: Alerta de cancelación exitosa
  cancelSuccess: (itemName) => {
    return Swal.fire({
      icon: 'success',
      title: 'Cancelado',
      text: `${itemName} ha sido cancelado correctamente.`,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      ...customConfig
    });
  }
};

export default alertService; 