import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return visible ? (
    <button
      onClick={scrollToTop}
      aria-label="Subir al inicio"
      className="fixed bottom-8 right-8 z-50 bg-white border-2 border-blue-600 shadow-lg rounded-full p-3 flex items-center justify-center transition-colors duration-200 hover:bg-blue-600 group"
      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
    >
      <svg
        className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-200"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  ) : null;
};

export default ScrollToTopButton; 