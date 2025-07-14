import React, { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa';

const TutorialModal = ({ isOpen, onClose, tutorialData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  if (!isOpen || !tutorialData) return null;

  const handleNext = () => {
    if (currentStep < tutorialData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleImageError = (imagePath) => {
    setFailedImages(prev => new Set([...prev, imagePath]));
  };

  const currentStepData = tutorialData.steps[currentStep];
  const imageFailed = failedImages.has(currentStepData.image);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <div className="mr-4 text-3xl text-[#275FAA]">
              {tutorialData.icon}
            </div>
            <h2 className="text-2xl font-semibold text-[#275FAA]">
              {tutorialData.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Paso {currentStep + 1} de {tutorialData.steps.length}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayPause}
                className="p-2 text-gray-600 hover:text-blue-600 transition"
              >
                {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#275FAA] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / tutorialData.steps.length) * 100}%`
              }}
            ></div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="px-6 py-2">
          <div className="flex space-x-2">
            {tutorialData.steps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentStep
                    ? 'bg-[#275FAA]'
                    : index < currentStep
                    ? 'bg-[#F3D273]'
                    : 'bg-gray-300'
                }`}
              ></button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-[#275FAA] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">
                {currentStepData.step}
              </span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 text-lg">
              {currentStepData.description}
            </p>
          </div>

          {/* Image */}
          {currentStepData.image && (
            <div className="mb-6">
              {!imageFailed ? (
                <img
                  src={currentStepData.image}
                  alt={`Paso ${currentStepData.step}: ${currentStepData.title}`}
                  className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                  onError={() => handleImageError(currentStepData.image)}
                />
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center mb-6">
                  <div className="text-gray-400 text-sm">
                    📸 Captura de pantalla del paso {currentStepData.step}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    (Imagen no disponible)
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tips */}
          <div className="bg-[#F3D273] bg-opacity-20 rounded-xl p-6">
            <h4 className="font-semibold text-[#275FAA] mb-3 text-lg">💡 Consejo:</h4>
            <p className="text-gray-700">
              {currentStepData.tip || 'Asegúrate de completar todos los campos requeridos antes de continuar.'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center px-4 py-2 rounded-lg transition ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaChevronLeft className="mr-2" />
            Anterior
          </button>

          <div className="flex space-x-2">
            {tutorialData.steps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`w-2 h-2 rounded-full transition ${
                  index === currentStep
                    ? 'bg-[#275FAA]'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              ></button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentStep === tutorialData.steps.length - 1}
            className={`flex items-center px-6 py-3 rounded-lg transition ${
              currentStep === tutorialData.steps.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#275FAA] text-white hover:bg-[#163366]'
            }`}
          >
            {currentStep === tutorialData.steps.length - 1 ? 'Finalizar' : 'Siguiente'}
            <FaChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal; 