import React from 'react';

const Timeline = ({ estados, estadoActual, esHistorial, estadoFinal, motivoAnulacion }) => {
  const actualIdx = estados.findIndex(e => e.name === estadoActual || e.status_key === estadoActual);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center gap-2 overflow-x-auto py-2">
          {estados.length === 0 ? (
            <span className="text-gray-400 text-sm">No hay etapas definidas para este servicio.</span>
          ) : (
            estados.map((e, idx) => (
              <div key={e.id} className="flex flex-col items-center min-w-[100px]">
                <div className={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-base border-4 shadow-md
                  ${idx < actualIdx ? (esHistorial ? 'bg-blue-300 text-white border-blue-300' : 'bg-blue-500 text-white border-blue-500 scale-100 short-pulse')
                  : idx === actualIdx ? (esHistorial ? 'bg-blue-500 text-white border-blue-500' : 'bg-blue-700 text-white border-blue-700 scale-105 short-bounce')
                  : 'bg-gray-200 text-gray-400 border-gray-300 scale-100'}
                  ${esHistorial ? '' : 'transition-all duration-300'}
                `}>
                  {idx + 1}
                </div>
                <span className={`text-xs mt-2 text-center font-semibold ${idx <= actualIdx ? 'text-blue-700' : 'text-gray-400'}`}>{e.name}</span>
                {idx < estados.length - 1 && <div className={`h-2 w-12 rounded-full mt-1 mb-1 ${idx < actualIdx ? (esHistorial ? 'bg-blue-300' : 'bg-blue-500') : 'bg-gray-300'} ${esHistorial ? '' : 'transition-all duration-300'}`}></div>}
              </div>
            ))
          )}
        </div>
        {/* Estado actual solo para historial */}
        {esHistorial && (
          <div className="-mt-2 mb-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold shadow inline-block">
            Solicitud terminada: {estadoFinal}
            {estadoFinal === 'Anulado' && motivoAnulacion && (
              <span className="ml-2 text-red-700">- Motivo: <span className="italic">{motivoAnulacion}</span></span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline; 