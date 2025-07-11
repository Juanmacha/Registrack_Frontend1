import React from 'react';

const ResponsiveExample = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Ejemplo de Media Queries Responsivas</h1>
      
      {/* Sección de Gráficas del Dashboard */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Dashboard - Gráficas</h2>
        <div className="dashboard-chart-container">
          <div className="dashboard-chart bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Gráfica Responsiva</p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Esta gráfica se adapta automáticamente según el tamaño de pantalla:
            </p>
            <ul className="text-xs text-gray-500 mt-2">
              <li>• Móvil: 280x280px</li>
              <li>• Tablet: 350x350px</li>
              <li>• Laptop: 400x400px</li>
              <li>• Desktop: 450x450px</li>
              <li>• Pantalla grande: 500x500px</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sección de Cards Responsivas */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cards Responsivas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card-responsive">
            <h3 className="font-semibold mb-2">Card 1</h3>
            <p className="text-sm text-gray-600">Esta card tiene efectos hover y es responsiva.</p>
          </div>
          <div className="card-responsive">
            <h3 className="font-semibold mb-2">Card 2</h3>
            <p className="text-sm text-gray-600">Se adapta automáticamente al grid.</p>
          </div>
          <div className="card-responsive">
            <h3 className="font-semibold mb-2">Card 3</h3>
            <p className="text-sm text-gray-600">Con animaciones suaves.</p>
          </div>
        </div>
      </section>

      {/* Sección de Tabla Responsiva */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tabla Responsiva</h2>
        <div className="table-responsive">
          <table className="table-auto w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Columna 1</th>
                <th className="px-4 py-2 text-left">Columna 2</th>
                <th className="px-4 py-2 text-left">Columna 3</th>
                <th className="px-4 py-2 text-left">Columna 4</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b">Dato 1</td>
                <td className="px-4 py-2 border-b">Dato 2</td>
                <td className="px-4 py-2 border-b">Dato 3</td>
                <td className="px-4 py-2 border-b">Dato 4</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-b">Dato 5</td>
                <td className="px-4 py-2 border-b">Dato 6</td>
                <td className="px-4 py-2 border-b">Dato 7</td>
                <td className="px-4 py-2 border-b">Dato 8</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Sección de Utilidades Responsivas */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Utilidades Responsivas</h2>
        <div className="space-y-4">
          <div className="hidden-mobile bg-blue-100 p-4 rounded">
            <p>Este contenido solo se muestra en pantallas de 640px o más</p>
          </div>
          <div className="mobile-only bg-green-100 p-4 rounded">
            <p>Este contenido solo se muestra en móviles (menos de 640px)</p>
          </div>
          <div className="hidden-tablet bg-yellow-100 p-4 rounded">
            <p>Este contenido solo se muestra en pantallas de 768px o más</p>
          </div>
          <div className="tablet-only bg-purple-100 p-4 rounded">
            <p>Este contenido solo se muestra en tablets (menos de 768px)</p>
          </div>
        </div>
      </section>

      {/* Sección de Botones Responsivos */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Botones Responsivos</h2>
        <div className="space-x-4">
          <button className="btn-responsive bg-blue-600 text-white hover:bg-blue-700">
            Botón Responsivo
          </button>
          <button className="btn-responsive bg-green-600 text-white hover:bg-green-700">
            Otro Botón
          </button>
        </div>
      </section>

      {/* Sección de Animaciones */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Animaciones Responsivas</h2>
        <div className="space-y-4">
          <div className="slide-in-mobile bg-red-100 p-4 rounded">
            <p>Animación de deslizamiento para móviles</p>
          </div>
          <div className="fade-in-tablet bg-orange-100 p-4 rounded">
            <p>Animación de fade para tablets</p>
          </div>
        </div>
      </section>

      {/* Información de Breakpoints */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Breakpoints Utilizados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">Móviles</h3>
            <p className="text-sm text-gray-600">320px - 480px</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">Tablets</h3>
            <p className="text-sm text-gray-600">481px - 768px</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">Laptops</h3>
            <p className="text-sm text-gray-600">769px - 1024px</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">Desktop</h3>
            <p className="text-sm text-gray-600">1025px - 1440px</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">Pantallas Grandes</h3>
            <p className="text-sm text-gray-600">1441px+</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResponsiveExample; 