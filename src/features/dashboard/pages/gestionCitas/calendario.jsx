import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import SideBarGeneral from '../../components/sideBarGeneral';
import NavBar from '../../components/navBarGeneral';

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    estado: '',
    telefono: '',
    horaInicio: '',
    horaFin: '',
    detalle: '',
    tipoCita: '',
    asesor: ''
  });
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (selectInfo) => {
    setSelectedDate(selectInfo);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const newEvent = {
      title: `${formData.tipoCita} - ${formData.nombre} ${formData.apellido}`,
      start: `${selectedDate.startStr}T${formData.horaInicio}`,
      end: `${selectedDate.startStr}T${formData.horaFin}`,
      extendedProps: { ...formData },
      backgroundColor: '#FFD700',
      borderColor: '#1E3A8A',
      textColor: '#1E3A8A'
    };
    setEvents([...events, newEvent]);
    setShowModal(false);
    setFormData({
      nombre: '',
      apellido: '',
      cedula: '',
      estado: '',
      telefono: '',
      horaInicio: '',
      horaFin: '',
      detalle: '',
      tipoCita: '',
      asesor: ''
    });
  };

  const handleEventClick = (clickInfo) => {
    if (window.confirm(`¿Está seguro de eliminar la cita "${clickInfo.event.title}"?`)) {
      clickInfo.event.remove();
    }
  };

  return (
    <div className="bg-[#eceded] flex h-screen w-screen overflow-hidden">
      <SideBarGeneral />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <NavBar titulo="Gestión de Citas" />
        <div className="flex-1 flex mt-12 justify-center">
          <div className="w-full px-4">
            <div className="bg-white shadow-xl rounded-xl border-t-[6px] border-yellow-400 p-6">
              <h2 className="text-3xl font-extrabold text-blue-900 mb-6 text-center">
                Calendario de Citas Administrativas
              </h2>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                locale={esLocale}
                selectable={true}
                editable={true}
                select={handleDateSelect}
                events={events}
                eventClick={handleEventClick}
                height="auto"
              />
            </div>
          </div>
        </div>

        {showModal && (
          <div className="absolute top-0 left-0 w-full h-full flex items-start justify-center z-50 p-10">
            <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-6 w-full max-w-3xl">
              <h3 className="text-xl font-semibold text-blue-800 mb-4 text-center">Registrar nueva cita</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <input name="nombre" value={formData.nombre} onChange={handleChange} className="form-control mb-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">Apellido</label>
                  <input name="apellido" value={formData.apellido} onChange={handleChange} className="form-control mb-2" />
                </div>

                <div>
                  <label className="text-sm font-medium">Cédula</label>
                  <input name="cedula" value={formData.cedula} onChange={handleChange} className="form-control mb-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">Estado</label>
                  <input name="estado" value={formData.estado} onChange={handleChange} className="form-control mb-2" />
                </div>

                <div>
                  <label className="text-sm font-medium">Teléfono</label>
                  <input name="telefono" value={formData.telefono} onChange={handleChange} className="form-control mb-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo de Cita</label>
                  <input name="tipoCita" value={formData.tipoCita} onChange={handleChange} className="form-control mb-2" />
                </div>

                <div>
                  <label className="text-sm font-medium">Hora de Inicio</label>
                  <input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleChange} className="form-control mb-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">Hora de Fin</label>
                  <input type="time" name="horaFin" value={formData.horaFin} onChange={handleChange} className="form-control mb-2" />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium">Asesor</label>
                  <input name="asesor" value={formData.asesor} onChange={handleChange} className="form-control mb-2" />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium">Detalle de la Cita</label>
                  <textarea name="detalle" value={formData.detalle} onChange={handleChange} className="form-control" rows={3}></textarea>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancelar</button>
                <button onClick={handleSave} className="btn btn-primary">Guardar Cita</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendario;