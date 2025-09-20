// Helper para estandarizar todas las alertas de SweetAlert2
import { AlertService } from "../shared/styles/alertStandards.js";

// Función para reemplazar Swal.fire directo con el sistema estandarizado
export const showStandardAlert = (config) => {
  // Si ya es una configuración estandarizada, usarla directamente
  if (config.customClass && config.customClass.popup) {
    return AlertService.success(config.title, config.text, config);
  }

  // Convertir configuración antigua a nueva
  const standardConfig = {
    title: config.title || "",
    text: config.text || "",
    allowOutsideClick: true,
    allowEscapeKey: true,
    focusConfirm: false,
    focusCancel: false,
    ...config,
  };

  // Determinar el tipo de alerta basado en el icono
  switch (config.icon) {
    case "success":
      return AlertService.success(
        standardConfig.title,
        standardConfig.text,
        standardConfig
      );
    case "error":
      return AlertService.error(
        standardConfig.title,
        standardConfig.text,
        standardConfig
      );
    case "warning":
      return AlertService.warning(
        standardConfig.title,
        standardConfig.text,
        standardConfig
      );
    case "info":
      return AlertService.info(
        standardConfig.title,
        standardConfig.text,
        standardConfig
      );
    case "question":
      return AlertService.confirm(
        standardConfig.title,
        standardConfig.text,
        standardConfig
      );
    default:
      return AlertService.info(
        standardConfig.title,
        standardConfig.text,
        standardConfig
      );
  }
};

// Función para cerrar cualquier modal abierto
export const closeAllModals = () => {
  // Cerrar todos los modales de SweetAlert2
  if (window.Swal) {
    window.Swal.close();
  }

  // Cerrar cualquier modal de Bootstrap si existe
  const bootstrapModals = document.querySelectorAll(".modal.show");
  bootstrapModals.forEach((modal) => {
    if (window.bootstrap && window.bootstrap.Modal) {
      const bsModal = window.bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    }
  });
};

// Función para verificar si hay modales abiertos
export const hasOpenModals = () => {
  const swalModals = document.querySelectorAll(".swal2-popup");
  const bootstrapModals = document.querySelectorAll(".modal.show");
  return swalModals.length > 0 || bootstrapModals.length > 0;
};

// Función para forzar el cierre de todos los modales
export const forceCloseAllModals = () => {
  // Cerrar SweetAlert2
  if (window.Swal) {
    window.Swal.close();
  }

  // Remover elementos del DOM si es necesario
  const swalContainers = document.querySelectorAll(".swal2-container");
  swalContainers.forEach((container) => {
    container.remove();
  });

  // Cerrar modales de Bootstrap
  const bootstrapModals = document.querySelectorAll(".modal.show");
  bootstrapModals.forEach((modal) => {
    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  });

  // Remover backdrops
  const backdrops = document.querySelectorAll(".modal-backdrop");
  backdrops.forEach((backdrop) => {
    backdrop.remove();
  });
};

// Función para agregar event listeners a botones de alerta
export const addAlertButtonListeners = () => {
  // Agregar listeners a botones existentes
  const confirmButtons = document.querySelectorAll(".swal2-confirm");
  const cancelButtons = document.querySelectorAll(".swal2-cancel");

  confirmButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      setTimeout(() => {
        if (window.Swal) {
          window.Swal.close();
        }
      }, 100);
    });
  });

  cancelButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      setTimeout(() => {
        if (window.Swal) {
          window.Swal.close();
        }
      }, 100);
    });
  });
};

// Función para observar cambios en el DOM y agregar listeners
export const observeAlertModals = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === 1 &&
            node.classList &&
            node.classList.contains("swal2-container")
          ) {
            setTimeout(() => {
              addAlertButtonListeners();
            }, 100);
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return observer;
};

export default {
  showStandardAlert,
  closeAllModals,
  hasOpenModals,
  forceCloseAllModals,
  addAlertButtonListeners,
  observeAlertModals,
};
