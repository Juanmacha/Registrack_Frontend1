import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import VerDetalleCita from "../gestionCitas/components/verDetallecita";
import dataEmpleados from "../gestionEmpleados/services/dataEmpleados";
import Swal from "sweetalert2";

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [modoReprogramar, setModoReprogramar] = useState(false);
  const [citaAReprogramar, setCitaAReprogramar] = useState(null);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const calendarRef = useRef(null);

 // Agregar efecto para evitar scroll al mostrar modal
  useEffect(() => {
    const body = document.body;
    if (showModal || showDetalle) {
      body.classList.add("overflow-hidden");
    } else {
      body.classList.remove("overflow-hidden");
    }
    return () => {
      body.classList.remove("overflow-hidden");
    };
  }, [showModal, showDetalle]);

  const generarIdUnico = (cedula, fecha, hora) => `${cedula}_${fecha}_${hora}`;

  useEffect(() => {
    try {
      const storedEvents = JSON.parse(localStorage.getItem("citas")) || [];
      const eventsWithIds = storedEvents.map(event => {
        if (!event.id && event.extendedProps) {
          const idUnico = generarIdUnico(
            event.extendedProps.cedula,
            event.start.split('T')[0],
            event.start.split('T')[1]
          );
          return { ...event, id: idUnico };
        }
        return event;
      });
      setEvents(eventsWithIds);
    } catch (error) {
      setEvents([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("citas", JSON.stringify(events));
    } catch (error) {}
  }, [events]);

  const handleDateSelect = (selectInfo) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(selectInfo.startStr);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    if (fechaSeleccionada < hoy) {
      alert("No puedes agendar citas en fechas anteriores a hoy.");
      return;
    }
    setSelectedDate(selectInfo);
    setShowModal(true);
  };

  const getEventColors = (estado) => {
    const estadoLower = (estado || '').toLowerCase();
    if (estadoLower === "programada") return { backgroundColor: "#22c55e", borderColor: "#15803d", textColor: "#fff" };
    if (estadoLower === "reprogramada") return { backgroundColor: "#2563eb", borderColor: "#1e40af", textColor: "#fff" };
    if (estadoLower === "cita anulada") return { backgroundColor: "#d1d5db", borderColor: "#6b7280", textColor: "#6b7280" };
    return { backgroundColor: "#FFD700", borderColor: "#1E3A8A", textColor: "#1E3A8A" };
  };

  const handleSave = (values) => {
    const cleanedValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) =>
        [key, typeof value === 'string' ? value.trim() : value]
      )
    );
    const estado = modoReprogramar ? "Reprogramada" : "Programada";
    const eventColors = getEventColors(estado);
    const idUnico = generarIdUnico(cleanedValues.cedula, selectedDate.startStr, cleanedValues.horaInicio);

    const newEvent = {
      id: idUnico,
      title: `Asesor: ${cleanedValues.asesor}`,
      start: `${selectedDate.startStr}T${cleanedValues.horaInicio}`,
      end: `${selectedDate.startStr}T${cleanedValues.horaFin}`,
      extendedProps: { ...cleanedValues, estado },
      ...eventColors,
    };

    if (modoReprogramar && citaAReprogramar) {
      setEvents((prev) => prev.map(ev => ev.id === citaAReprogramar.id ? newEvent : ev));
      setModoReprogramar(false);
      setCitaAReprogramar(null);
      Swal.fire({ icon: 'success', title: 'Cita reprogramada', text: 'La cita ha sido reprogramada correctamente.', timer: 1800, showConfirmButton: false });
    } else {
      setEvents((prev) => [...prev, newEvent]);
    }
    setShowModal(false);
  };

  const generarOpcionesHora = () => {
    const opciones = [];
    for (let h = 7; h <= 19; h++) {
      for (let m = 0; m < 60; m += 10) {
        const hora24 = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        const value = `${hora24}:${min}`;
        let h12 = h % 12 === 0 ? 12 : h % 12;
        const ampm = h < 12 ? 'AM' : 'PM';
        const label = `${h12.toString().padStart(2, '0')}:${min} ${ampm}`;
        opciones.push({ value, label });
      }
    }
    return opciones;
  };
  const opcionesHora = generarOpcionesHora();

const empleadosActivos = dataEmpleados.filter(e => e.estado === "Activo");


  const initialValues = {
    nombre: "", apellido: "", cedula: "", telefono: "",
    horaInicio: "", horaFin: "", detalle: "", tipoCita: "", asesor: "",
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required("Requerido"),
    apellido: Yup.string().required("Requerido"),
    cedula: Yup.string().required("Requerido"),
    telefono: Yup.string().required("Requerido"),
    tipoCita: Yup.string().required("Requerido"),
    horaInicio: Yup.string().required("Requerido"),
    horaFin: Yup.string().required("Requerido"),
    asesor: Yup.string().required("Requerido"),
  });

  const handleEventClick = (clickInfo) => {
    setCitaSeleccionada(clickInfo.event.extendedProps);
    setCitaAReprogramar(clickInfo.event);
    setShowDetalle(true);
  };

  const handleAnularCita = () => {
    Swal.fire({
      title: "Observación obligatoria",
      input: "textarea",
      inputLabel: "Por favor, ingresa la razón de la anulación:",
      inputPlaceholder: "Escribe aquí la observación...",
      inputValidator: (value) => {
        if (!value || value.trim().length === 0) return 'La observación es obligatoria';
        return null;
      },
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Anular cita",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed && citaAReprogramar) {
        const observacion = result.value;
        setEvents((prev) => prev.map(ev =>
          ev.id === citaAReprogramar.id
            ? {
                ...ev,
                extendedProps: { ...ev.extendedProps, estado: "Cita anulada", observacionAnulacion: observacion },
                ...getEventColors("Cita anulada")
              }
            : ev
        ));
        setShowDetalle(false);
        setCitaAReprogramar(null);
        Swal.fire({ icon: 'success', title: 'Cita anulada', text: 'La cita ha sido anulada correctamente.', timer: 1800, showConfirmButton: false });
      }
    });
  };

  const cambiarVista = (vista) => {
    setCurrentView(vista);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(vista);
    }
  };

  const irAHoy = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
    }
  };


  return (
    <div className="w-full max-w-7xl mx-auto px-4 bg-gray-100 min-h-screen pb-4">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="flex items-center justify-between bg-[#111827] text-white rounded-t-xl px-6 py-4">
          <div className="flex items-center gap-3">
            <i className="bi bi-calendar3 text-blue-400 text-2xl"></i>
            <h2 className="text-xl font-bold">Calendario de Citas Administrativas</h2>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-[#1f2937] hover:bg-[#374151] px-4 py-1 rounded-md text-sm"
              onClick={irAHoy}
            >
              Hoy
            </button>
            <button
              className={`px-4 py-1 rounded-md text-sm ${currentView === 'dayGridMonth' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => cambiarVista('dayGridMonth')}
            >
              Mes
            </button>
            <button
              className={`px-4 py-1 rounded-md text-sm ${currentView === 'timeGridWeek' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => cambiarVista('timeGridWeek')}
            >
              Semana
            </button>
            <button
              className={`px-4 py-1 rounded-md text-sm ${currentView === 'timeGridDay' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => cambiarVista('timeGridDay')}
            >
              Día
            </button>
          </div>
        </div>
        <div className="p-6">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ left: "", center: "title", right: "" }}
            locale={esLocale}
            selectable
            editable
            select={handleDateSelect}
            events={events}
            height="auto"
            eventClick={handleEventClick}
            dayMaxEventRows={3}
            eventDisplay="block"
            eventClassNames={(arg) => {
              const view = arg.view.type;
              const estado = arg.event.extendedProps.estado;
              let base = "font-semibold text-xs border-0 shadow-sm transition-all duration-200 ";
              if (view === "dayGridMonth") {
                base += "rounded-full px-2 py-1 ";
              } else {
                base += "rounded-md px-1 py-0.5 text-sm ";
              }
              if (estado === "Cita anulada") {
                base += "opacity-60 ";
              } else {
                base += "hover:scale-105 ";
              }
              return base;
            }}
          />
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <i className="bi bi-calendar-event text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{modoReprogramar ? "Reprogramar Cita" : "Agendar Cita"}</h2>
                  <p className="text-sm text-gray-500">Llena los campos para {modoReprogramar ? "reprogramar la cita" : "agendar una nueva cita"}</p>
                </div>
              </div>
              <button onClick={() => { setShowModal(false); setModoReprogramar(false); setCitaAReprogramar(null); }} className="text-gray-900 hover:text-red-700 bg-gray-50">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <Formik
              initialValues={modoReprogramar && citaSeleccionada ? {
                ...citaSeleccionada,
                estado: "Reprogramada"
              } : initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSave}
              enableReinitialize
            >
              {() => (
                <Form className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <i className="bi bi-person text-gray-400 mr-2"></i>
                        Nombre
                      </label>
                      <Field name="nombre" className="w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500" disabled={modoReprogramar} />
                      <ErrorMessage name="nombre" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    {/* Apellido */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <i className="bi bi-person text-gray-400 mr-2"></i>
                        Apellido
                      </label>
                      <Field name="apellido" className="w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500" disabled={modoReprogramar} />
                      <ErrorMessage name="apellido" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    {/* Cédula */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <i className="bi bi-card-text text-gray-400 mr-2"></i>
                        Cédula
                      </label>
                      <Field name="cedula" className="w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500" disabled={modoReprogramar} />
                      <ErrorMessage name="cedula" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    {/* Teléfono */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <i className="bi bi-telephone text-gray-400 mr-2"></i>
                        Teléfono
                      </label>
                      <Field name="telefono" className="w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500" disabled={modoReprogramar} />
                      <ErrorMessage name="telefono" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    {/* Tipo de Cita */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <i className="bi bi-briefcase text-gray-400 mr-2"></i>
                        Tipo de Cita
                      </label>
                      <Field as="select" name="tipoCita" className="w-full px-3 py-2 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccionar...</option>
                        <option value="General">General</option>
                        <option value="Oposición">Oposición</option>
                        <option value="Certificación">Certificación</option>
                        <option value="Búsqueda de antecedentes">Búsqueda de antecedentes</option>
                        <option value="Cesión de marca">Cesión de marca</option>
                        <option value="Renovación">Renovación</option>
                      </Field>
                      <ErrorMessage name="tipoCita" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    {/* Hora de Inicio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <i className="bi bi-clock text-gray-400 mr-2"></i>
                        Hora de Inicio
                      </label>
                      <Field as="select" name="horaInicio" className="w-full px-3 py-2 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccionar...</option>
                        {opcionesHora.map((hora) => (
                          <option key={hora.value} value={hora.value}>{hora.label}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="horaInicio" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    {/* Hora de Fin */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <i className="bi bi-clock-history text-gray-400 mr-2"></i>
                        Hora de Fin
                      </label>
                      <Field as="select" name="horaFin" className="w-full px-3 py-2 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccionar...</option>
                        {opcionesHora.map((hora) => (
                          <option key={hora.value} value={hora.value}>{hora.label}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="horaFin" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    {/* Asesor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <i className="bi bi-person-badge text-gray-400 mr-2"></i>
                        Asesor
                      </label>
                      <Field as="select" name="asesor" className="w-full px-3 py-2 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccionar...</option>
                        {empleadosActivos.map((e) => (
                          <option key={e.cedula} value={`${e.nombre ? e.nombre : ''}${e.apellido ? ' ' + e.apellido : ''}`.trim()}>{e.nombre} {e.apellido}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="asesor" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    {/* Detalle */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <i className="bi bi-chat-left-text text-gray-400 mr-2"></i>
                        Detalle
                      </label>
                      <Field as="textarea" name="detalle" rows={2} className="w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500" disabled={modoReprogramar} />
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 flex items-center">
                      <i className="bi bi-exclamation-circle text-gray-400 mr-2"></i>
                      * Todos los campos son obligatorios
                    </p>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => { setShowModal(false); setModoReprogramar(false); setCitaAReprogramar(null); }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
                      >
                        {modoReprogramar ? "Guardar Cambios" : "Agendar Cita"}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {showDetalle && (
        <VerDetalleCita
          cita={citaSeleccionada}
          isOpen={showDetalle}
          onClose={() => setShowDetalle(false)}
          onReprogramar={() => {
            setModoReprogramar(true);
            setShowDetalle(false);
            setShowModal(true);
          }}
          onAnular={handleAnularCita}
          puedeReprogramar={citaSeleccionada?.estado !== "Cita anulada"}
          puedeAnular={citaSeleccionada?.estado !== "Cita anulada"}
        />
      )}
    </div>
  );
};

export default Calendario;
