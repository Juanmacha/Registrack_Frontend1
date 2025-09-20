import React from "react";

const DownloadButton = ({ 
  type = "excel", // "excel" o "pdf"
  onClick, 
  title, 
  className = "",
  disabled = false 
}) => {
  const getButtonStyles = () => {
    const baseStyles = "w-10 h-10 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg";
    
    if (type === "excel") {
      return `${baseStyles} bg-green-600 text-white hover:bg-green-700 border-2 border-green-600 ${className}`;
    } else if (type === "pdf") {
      return `${baseStyles} bg-red-600 text-white hover:bg-red-700 border-2 border-red-600 ${className}`;
    }
    
    return baseStyles;
  };

  const getIcon = () => {
    if (type === "excel") {
      return <i className="bi bi-file-earmark-excel-fill text-base"></i>;
    } else if (type === "pdf") {
      return <i className="bi bi-file-earmark-pdf-fill text-base"></i>;
    }
    return null;
  };

  const getText = () => {
    return ""; // Solo mostrar ícono, sin texto
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonStyles()}
      title={title || (type === "excel" ? "Descargar Excel" : "Descargar PDF")}
    >
      {getIcon()}
    </button>
  );
};

export default DownloadButton;
