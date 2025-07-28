import React, { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export const usePayments = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const [pagos, setPagos] = useState([]);

  const registrarPago = (pago) => {
    setPagos((prev) => [...prev, pago]);
  };

  return (
    <PaymentContext.Provider value={{ pagos, registrarPago }}>
      {children}
    </PaymentContext.Provider>
  );
}; 