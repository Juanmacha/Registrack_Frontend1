// Estándares de botones para el dashboard
export const BUTTON_STANDARDS = {
  // Tamaños estándar
  sizes: {
    small: "h-8 w-8", // 32px
    medium: "h-10 w-10", // 40px (estándar actual)
    large: "h-12 w-12", // 48px
  },

  // Colores por acción
  colors: {
    // Acciones de visualización
    view: {
      bg: "bg-white",
      text: "text-blue-600",
      hover: "hover:bg-blue-50",
      border: "border-blue-200",
      icon: "bi bi-eye-fill",
    },

    // Acciones de edición
    edit: {
      bg: "bg-white",
      text: "text-amber-600",
      hover: "hover:bg-amber-50",
      border: "border-amber-200",
      icon: "bi bi-pencil-fill",
    },

    // Acciones de eliminación
    delete: {
      bg: "bg-white",
      text: "text-red-600",
      hover: "hover:bg-red-50",
      border: "border-red-200",
      icon: "bi bi-trash-fill",
    },

    // Acciones de descarga/exportación
    download: {
      bg: "bg-white",
      text: "text-green-600",
      hover: "hover:bg-green-50",
      border: "border-green-200",
      icon: "bi bi-file-earmark-excel-fill",
    },

    // Acciones de información
    info: {
      bg: "bg-white",
      text: "text-cyan-600",
      hover: "hover:bg-cyan-50",
      border: "border-cyan-200",
      icon: "bi bi-info-circle-fill",
    },

    // Acciones de chat/observaciones
    chat: {
      bg: "bg-white",
      text: "text-purple-600",
      hover: "hover:bg-purple-50",
      border: "border-purple-200",
      icon: "bi bi-chat-dots-fill",
    },

    // Acciones de calendario/citas
    calendar: {
      bg: "bg-white",
      text: "text-emerald-600",
      hover: "hover:bg-emerald-50",
      border: "border-emerald-200",
      icon: "bi bi-calendar-plus-fill",
    },

    // Acciones de renovación/actualización
    renew: {
      bg: "bg-white",
      text: "text-orange-600",
      hover: "hover:bg-orange-50",
      border: "border-orange-200",
      icon: "bi bi-arrow-clockwise",
    },

    // Acciones de estado/toggle
    toggle: {
      bg: "bg-white",
      text: "text-indigo-600",
      hover: "hover:bg-indigo-50",
      border: "border-indigo-200",
      icon: "bi bi-toggle-on",
    },
  },

  // Clases base para botones
  baseClasses:
    "p-2 rounded-full flex items-center justify-center disabled:opacity-50 transition-all duration-200",

  // Tamaño de iconos
  iconSize: "text-base", // 16px - más bold que text-sm

  // Generar clases completas para un botón
  getButtonClasses: (action, size = "medium") => {
    const colorConfig = BUTTON_STANDARDS.colors[action];
    const sizeConfig = BUTTON_STANDARDS.sizes[size];

    return `${BUTTON_STANDARDS.baseClasses} ${colorConfig.bg} ${colorConfig.text} ${colorConfig.hover} ${colorConfig.border} border ${sizeConfig}`;
  },

  // Generar clases para el icono
  getIconClasses: (action) => {
    const colorConfig = BUTTON_STANDARDS.colors[action];
    return `${colorConfig.icon} ${BUTTON_STANDARDS.iconSize}`;
  },
};

// Función helper para crear botones estandarizados
export const createStandardButton = (
  action,
  size = "medium",
  onClick,
  title,
  disabled = false
) => {
  return {
    className: BUTTON_STANDARDS.getButtonClasses(action, size),
    iconClass: BUTTON_STANDARDS.getIconClasses(action),
    onClick,
    title,
    disabled,
  };
};

