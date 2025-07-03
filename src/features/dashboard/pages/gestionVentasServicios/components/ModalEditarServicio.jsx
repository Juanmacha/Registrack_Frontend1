import React, { useState, useEffect } from 'react';

function EditarLandingData({ servicio, isOpen, onClose, onSave }) {
  const [form, setForm] = useState(servicio?.landing_data || {});
  useEffect(() => { if (isOpen) setForm(servicio?.landing_data || {}); }, [isOpen, servicio]);
  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-blue-800">Editar Datos para Landing Page</h3>
        <label className="block mb-2 text-sm">Título</label>
        <input className="w-full border rounded p-2 mb-3" value={form.titulo || ''} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
        <label className="block mb-2 text-sm">Resumen</label>
        <textarea className="w-full border rounded p-2 mb-3" value={form.resumen || ''} onChange={e => setForm(f => ({ ...f, resumen: e.target.value }))} />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  ) : null;
}

function EditarInfoPageData({ servicio, isOpen, onClose, onSave }) {
  const [form, setForm] = useState(servicio?.info_page_data || {});
  useEffect(() => { if (isOpen) setForm(servicio?.info_page_data || {}); }, [isOpen, servicio]);
  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-green-800">Editar Datos de Página de Información</h3>
        <label className="block mb-2 text-sm">Descripción</label>
        <textarea className="w-full border rounded p-2 mb-3" value={form.descripcion || ''} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  ) : null;
}

function GestionarProcessStates({ servicio, isOpen, onClose, onSave }) {
  const [states, setStates] = useState(servicio?.process_states || []);
  const [nuevoNombre, setNuevoNombre] = useState('');
  useEffect(() => { if (isOpen) setStates(servicio?.process_states || []); }, [isOpen, servicio]);

  const addState = () => {
    if (!nuevoNombre.trim()) return;
    const newState = {
      id: Date.now().toString(),
      name: nuevoNombre,
      order: states.length + 1,
      status_key: nuevoNombre.toLowerCase().replace(/\s+/g, '_'),
    };
    setStates([...states, newState]);
    setNuevoNombre('');
  };
  const removeState = (id) => setStates(states.filter(s => s.id !== id));
  const moveState = (idx, dir) => {
    const arr = [...states];
    if (dir === 'up' && idx > 0) {
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    } else if (dir === 'down' && idx < arr.length - 1) {
      [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
    }
    setStates(arr.map((s, i) => ({ ...s, order: i + 1 })));
  };
  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-yellow-800">Gestionar Estados del Proceso</h3>
        <ol className="list-decimal ml-6 mb-4">
          {states.map((s, idx) => (
            <li key={s.id} className="flex items-center gap-2 mb-2">
              <span className="flex-1">{s.name}</span>
              <button onClick={() => moveState(idx, 'up')} disabled={idx === 0} className="text-xs px-2 py-1 bg-gray-200 rounded">↑</button>
              <button onClick={() => moveState(idx, 'down')} disabled={idx === states.length - 1} className="text-xs px-2 py-1 bg-gray-200 rounded">↓</button>
              <button onClick={() => removeState(s.id)} className="text-xs px-2 py-1 bg-red-200 text-red-700 rounded">Eliminar</button>
            </li>
          ))}
        </ol>
        <div className="flex gap-2 mb-4">
          <input className="flex-1 border rounded p-2" placeholder="Nuevo estado" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} />
          <button onClick={addState} className="px-4 py-2 bg-green-600 text-white rounded">Añadir</button>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
          <button onClick={() => onSave(states)} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  ) : null;
}

export default function ModalEditarServicio({ servicio, isOpen, onClose, onSave }) {
  const [modal, setModal] = useState(null); // 'landing', 'info', 'process'
  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative border border-blue-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-700 hover:text-red-600 text-2xl focus:outline-none bg-white border border-gray-300 rounded-full shadow" aria-label="Cerrar"><i className="bi bi-x-lg"></i></button>
        <h3 className="text-2xl font-bold mb-8 text-center text-blue-800">¿Qué deseas editar?</h3>
        <div className="flex flex-col gap-6">
          <button onClick={() => setModal('landing')} className="px-6 py-4 bg-blue-100 text-blue-800 rounded-xl font-semibold hover:bg-blue-200 shadow transition-all text-lg">Editar Datos para Landing Page</button>
          <button onClick={() => setModal('info')} className="px-6 py-4 bg-green-100 text-green-800 rounded-xl font-semibold hover:bg-green-200 shadow transition-all text-lg">Editar Datos de Página de Información</button>
          <button onClick={() => setModal('process')} className="px-6 py-4 bg-yellow-100 text-yellow-800 rounded-xl font-semibold hover:bg-yellow-200 shadow transition-all text-lg">Gestionar Estados del Proceso</button>
        </div>
        <EditarLandingData
          servicio={servicio}
          isOpen={modal === 'landing'}
          onClose={() => setModal(null)}
          onSave={data => { onSave('landing', data); setModal(null); }}
        />
        <EditarInfoPageData
          servicio={servicio}
          isOpen={modal === 'info'}
          onClose={() => setModal(null)}
          onSave={data => { onSave('info', data); setModal(null); }}
        />
        <GestionarProcessStates
          servicio={servicio}
          isOpen={modal === 'process'}
          onClose={() => setModal(null)}
          onSave={data => { onSave('process', data); setModal(null); }}
        />
      </div>
    </div>
  ) : null;
} 