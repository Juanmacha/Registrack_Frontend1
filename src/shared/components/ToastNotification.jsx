import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ToastNotification = ({ 
  type = 'success', 
  title, 
  message, 
  duration = 4000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const getIconAndColors = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'bi-check-circle-fill',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700'
        };
      case 'error':
        return {
          icon: 'bi-x-circle-fill',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700'
        };
      case 'warning':
        return {
          icon: 'bi-exclamation-triangle-fill',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600',
          titleColor: 'text-amber-800',
          messageColor: 'text-amber-700'
        };
      case 'info':
        return {
          icon: 'bi-info-circle-fill',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700'
        };
      default:
        return {
          icon: 'bi-check-circle-fill',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700'
        };
    }
  };

  const { icon, bgColor, borderColor, iconColor, titleColor, messageColor } = getIconAndColors();

  if (!isVisible) return null;

  return createPortal(
    <div
      className={`fixed top-4 right-4 z-[9999] max-w-sm w-full transform transition-all duration-300 ease-in-out ${
        isExiting 
          ? 'translate-x-full opacity-0' 
          : 'translate-x-0 opacity-100'
      }`}
    >
      <div className={`${bgColor} ${borderColor} border rounded-xl shadow-lg p-4 backdrop-blur-sm`}>
        <div className="flex items-start gap-3">
          {/* Icono */}
          <div className={`${iconColor} text-xl flex-shrink-0 mt-0.5`}>
            <i className={`bi ${icon}`}></i>
          </div>
          
          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <h4 className={`${titleColor} font-semibold text-sm mb-1`}>
              {title}
            </h4>
            {message && (
              <p className={`${messageColor} text-sm leading-relaxed`}>
                {message}
              </p>
            )}
          </div>
          
          {/* Botón de cerrar */}
          <button
            onClick={handleClose}
            className={`${iconColor} hover:opacity-70 transition-opacity flex-shrink-0 ml-2`}
          >
            <i className="bi bi-x-lg text-sm"></i>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ToastNotification;



