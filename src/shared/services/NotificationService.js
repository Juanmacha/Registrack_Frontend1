import { AlertService } from "../styles/alertStandards.js";

class NotificationService {
  constructor() {
    this.toastCallbacks = [];
  }

  // Registrar callback para mostrar toasts
  registerToastCallback(callback) {
    this.toastCallbacks.push(callback);
  }

  // Remover callback
  unregisterToastCallback(callback) {
    this.toastCallbacks = this.toastCallbacks.filter((cb) => cb !== callback);
  }

  // Mostrar toast
  showToast(type, title, message, options = {}) {
    this.toastCallbacks.forEach((callback) => {
      callback(type, title, message, options);
    });
  }

  // Métodos específicos para toasts
  success(title, message, options = {}) {
    this.showToast("success", title, message, options);
  }

  error(title, message, options = {}) {
    this.showToast("error", title, message, options);
  }

  warning(title, message, options = {}) {
    this.showToast("warning", title, message, options);
  }

  info(title, message, options = {}) {
    this.showToast("info", title, message, options);
  }

  // Métodos para confirmaciones (mantienen el estilo de modal)
  confirm(title, message, options = {}) {
    return AlertService.confirm(title, message, options);
  }

  // Métodos específicos para operaciones CRUD
  createSuccess(entity = "registro") {
    this.success(
      "¡Creado exitosamente!",
      `El ${entity} ha sido creado correctamente.`
    );
  }

  updateSuccess(entity = "registro") {
    this.success(
      "¡Actualizado exitosamente!",
      `El ${entity} ha sido actualizado correctamente.`
    );
  }

  deleteSuccess(entity = "registro") {
    this.success(
      "¡Eliminado exitosamente!",
      `El ${entity} ha sido eliminado correctamente.`
    );
  }

  createError(entity = "registro") {
    this.error(
      "Error al crear",
      `No se pudo crear el ${entity}. Por favor, intenta nuevamente.`
    );
  }

  updateError(entity = "registro") {
    this.error(
      "Error al actualizar",
      `No se pudo actualizar el ${entity}. Por favor, intenta nuevamente.`
    );
  }

  deleteError(entity = "registro") {
    this.error(
      "Error al eliminar",
      `No se pudo eliminar el ${entity}. Por favor, intenta nuevamente.`
    );
  }

  // Confirmaciones específicas
  deleteConfirm(entity = "registro") {
    return this.confirm(
      "¿Eliminar?",
      `¿Estás seguro de que deseas eliminar este ${entity}? Esta acción no se puede deshacer.`
    );
  }

  updateConfirm(entity = "registro") {
    return this.confirm(
      "¿Guardar cambios?",
      `¿Estás seguro de que deseas guardar los cambios en este ${entity}?`
    );
  }

  // Validaciones
  validationError(
    message = "Por favor, completa todos los campos obligatorios."
  ) {
    this.warning("Campos requeridos", message);
  }

  // Archivos
  fileUploadSuccess(filename = "archivo") {
    this.success(
      "Archivo subido",
      `El archivo ${filename} ha sido subido correctamente.`
    );
  }

  fileUploadError() {
    this.error(
      "Error de subida",
      "No se pudo subir el archivo. Por favor, intenta nuevamente."
    );
  }

  // Sistema
  networkError() {
    this.error(
      "Error de conexión",
      "No se pudo conectar con el servidor. Por favor, verifica tu internet e intenta nuevamente."
    );
  }

  serverError() {
    this.error(
      "Error del servidor",
      "Ocurrió un error en el servidor. Por favor, intenta más tarde."
    );
  }
}

// Instancia singleton
const notificationService = new NotificationService();

export default notificationService;




