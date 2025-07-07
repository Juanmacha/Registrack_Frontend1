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

  // Alerta de carga
  loading: (title = 'Cargando...', options = {}) => {
    return Swal.fire({
      title: title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
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
  }
};

export default alertService; 