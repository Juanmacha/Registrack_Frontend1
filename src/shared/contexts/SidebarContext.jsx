import React, { createContext, useState, useContext, useEffect } from 'react';

const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <SidebarContext.Provider value={{ isSidebarExpanded, setIsSidebarExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
