import React, { createContext, useContext, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import notificationService from '../services/NotificationService';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { toasts, removeToast, success, error, warning, info } = useToast();

  useEffect(() => {
    // Registrar el callback para mostrar toasts
    const showToast = (type, title, message, options) => {
      switch (type) {
        case 'success':
          success(title, message, options);
          break;
        case 'error':
          error(title, message, options);
          break;
        case 'warning':
          warning(title, message, options);
          break;
        case 'info':
          info(title, message, options);
          break;
        default:
          success(title, message, options);
      }
    };

    notificationService.registerToastCallback(showToast);

    return () => {
      notificationService.unregisterToastCallback(showToast);
    };
  }, [success, error, warning, info]);

  const value = {
    // Métodos directos para toasts
    success,
    error,
    warning,
    info,
    
    // Métodos del servicio de notificaciones
    createSuccess: notificationService.createSuccess.bind(notificationService),
    updateSuccess: notificationService.updateSuccess.bind(notificationService),
    deleteSuccess: notificationService.deleteSuccess.bind(notificationService),
    createError: notificationService.createError.bind(notificationService),
    updateError: notificationService.updateError.bind(notificationService),
    deleteError: notificationService.deleteError.bind(notificationService),
    
    // Confirmaciones (modales)
    confirm: notificationService.confirm.bind(notificationService),
    deleteConfirm: notificationService.deleteConfirm.bind(notificationService),
    updateConfirm: notificationService.updateConfirm.bind(notificationService),
    
    // Validaciones
    validationError: notificationService.validationError.bind(notificationService),
    
    // Archivos
    fileUploadSuccess: notificationService.fileUploadSuccess.bind(notificationService),
    fileUploadError: notificationService.fileUploadError.bind(notificationService),
    
    // Sistema
    networkError: notificationService.networkError.bind(notificationService),
    serverError: notificationService.serverError.bind(notificationService),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </NotificationContext.Provider>
  );
};

export default NotificationContext;



