import React, { useState, useRef, useEffect } from 'react';

const StandardDropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Seleccionar",
  className = "",
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botón trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 min-w-[140px]"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <i className={`bi bi-chevron-down text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors duration-200 flex items-center gap-2 ${
                  value === option.value 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.icon && <i className={`${option.icon} text-sm`}></i>}
                <span>{option.label}</span>
                {value === option.value && (
                  <i className="bi bi-check text-blue-600 ml-auto"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StandardDropdown;
