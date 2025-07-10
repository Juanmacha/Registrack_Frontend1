import { useEffect } from 'react';

export const useScrollToTop = () => {
  useEffect(() => {
    // Forzar scroll al inicio de la página
    window.scrollTo(0, 0);
  }, []);
}; 