import React from 'react';
import { SaleService, DataChangeNotifier } from '../utils/mockDataService.js';

const TestSimple = () => {
  const [ventas, setVentas] = React.useState([]);

  React.useEffect(() => {
    // Cargar ventas iniciales
    setVentas(SaleService.getInProcess());

    // Suscribirse a cambios
    const unsubscribe = DataChangeNotifier.subscribe((dataType, action, data) => {
      console.log('TestSimple: Cambio detectado:', dataType, action, data);
      if (dataType === 'sale') {
        setVentas(SaleService.getInProcess());
      }
    });

    return unsubscribe;
  }, []);

  const crearVentaTest = () => {
    const nuevaVenta = {
      titular: 'Test User',
      tipoPersona: 'Natural',
      expediente: 'EXP-TEST-001',
      tipoSolicitud: 'Certificación de Marca',
      marca: 'TestBrand',
      email: 'test@example.com',
      telefono: '3001234567',
      estado: 'En revisión',
      encargado: 'Sin asignar',
      comentarios: []
    };

    SaleService.create(nuevaVenta);
  };

  return (
    <div className="p-4">
      <h1>Test Simple de Sincronización</h1>
      <button onClick={crearVentaTest} className="px-4 py-2 bg-blue-600 text-white rounded">
        Crear Venta Test
      </button>
      <div className="mt-4">
        <h2>Ventas en Proceso: {ventas.length}</h2>
        {ventas.map((venta, index) => (
          <div key={venta.id} className="border p-2 mb-2">
            <strong>{venta.titular}</strong> - {venta.marca} ({venta.estado})
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestSimple; 