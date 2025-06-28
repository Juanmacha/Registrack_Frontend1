import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

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

  const handleSave = (values) => {
    const newEvent = {
      title: `${values.tipoCita} - ${values.nombre} ${values.apellido}`,
      start: `${selectedDate.startStr}T${values.horaInicio}`,
      end: `${selectedDate.startStr}T${values.horaFin}`,
      extendedProps: { ...values },
      backgroundColor: "#FFD700",
      borderColor: "#1E3A8A",
      textColor: "#1E3A8A",
    };
    setEvents([...events, newEvent]);
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

  const empleadosActivos = (() => {
    try {
      const empleados = JSON.parse(localStorage.getItem("empleados")) || [];
      return empleados.filter(e => e.estado === "Activo");
    } catch {
      return [];
    }
  })();

  const initialValues = {
    nombre: "",
    apellido: "",
    cedula: "",
    estado: "",
    telefono: "",
    horaInicio: "",
    horaFin: "",
    detalle: "",
    tipoCita: "",
    asesor: "",
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required("Requerido"),
    apellido: Yup.string().required("Requerido"),
    cedula: Yup.string().required("Requerido"),
    estado: Yup.string().required("Requerido"),
    telefono: Yup.string().required("Requerido"),
    tipoCita: Yup.string().required("Requerido"),
    horaInicio: Yup.string().required("Requerido"),
    horaFin: Yup.string().required("Requerido"),
    asesor: Yup.string().required("Requerido"),
  });

  return (
    <div className="w-full max-w-8xl mx-auto px-1 bg-[#eceded]">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 flex justify-center">
          <div className="w-full px-4">
            <div className="bg-white shadow-xl rounded-xl border-t-[6px] border-yellow-400 p-6">
              <h2 className="text-3xl font-extrabold text-blue-900 mb-6 text-center">
                Calendario de Citas Administrativas
              </h2>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                locale={esLocale}
                selectable
                editable
                select={handleDateSelect}
                events={events}
                height="auto"
              />
            </div>
          </div>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title fw-bold">Registrar nueva cita</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSave}
                >
                  {() => (
                    <Form>
                      <div className="modal-body max-h-[70vh] overflow-y-auto">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Nombre</label>
                            <Field name="nombre" className="form-control" />
                            <ErrorMessage name="nombre" component="div" className="text-danger small" />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Apellido</label>
                            <Field name="apellido" className="form-control" />
                            <ErrorMessage name="apellido" component="div" className="text-danger small" />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Cédula</label>
                            <Field name="cedula" className="form-control" />
                            <ErrorMessage name="cedula" component="div" className="text-danger small" />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Teléfono</label>
                            <Field name="telefono" className="form-control" />
                            <ErrorMessage name="telefono" component="div" className="text-danger small" />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Estado</label>
                            <Field as="select" name="estado" className="form-select">
                              <option value="">Seleccionar...</option>
                              <option value="Programada">Programada</option>
                              <option value="Reprogramada">Reprogramada</option>
                              <option value="Cita anulada">Cita anulada</option>
                            </Field>
                            <ErrorMessage name="estado" component="div" className="text-danger small" />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Tipo de Cita</label>
                            <Field as="select" name="tipoCita" className="form-select">
                              <option value="">Seleccionar...</option>
                              <option value="General">General</option>
                              <option value="Oposición">Oposición</option>
                              <option value="Certificación">Certificación</option>
                              <option value="Búsqueda de antecedentes">Búsqueda de antecedentes</option>
                              <option value="Cesión de marca">Cesión de marca</option>
                              <option value="Renovación">Renovación</option>
                            </Field>
                            <ErrorMessage name="tipoCita" component="div" className="text-danger small" />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Hora de Inicio</label>
                            <Field as="select" name="horaInicio" className="form-select">
                              <option value="">Seleccionar...</option>
                              {opcionesHora.map((hora) => (
                                <option key={hora.value} value={hora.value}>{hora.label}</option>
                              ))}
                            </Field>
                            <ErrorMessage name="horaInicio" component="div" className="text-danger small" />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Hora de Fin</label>
                            <Field as="select" name="horaFin" className="form-select">
                              <option value="">Seleccionar...</option>
                              {opcionesHora.map((hora) => (
                                <option key={hora.value} value={hora.value}>{hora.label}</option>
                              ))}
                            </Field>
                            <ErrorMessage name="horaFin" component="div" className="text-danger small" />
                          </div>

                          <div className="col-12">
                            <label className="form-label">Asesor</label>
                            <Field as="select" name="asesor" className="form-select">
                              <option value="">Seleccionar asesor...</option>
                              {empleadosActivos.map((e) => (
                                <option key={e.documento} value={`${e.nombre} ${e.apellidos}`}>
                                  {e.nombre} {e.apellidos}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name="asesor" component="div" className="text-danger small" />
                          </div>

                          <div className="col-12">
                            <label className="form-label">Detalle de la Cita</label>
                            <Field as="textarea" name="detalle" rows="3" className="form-control" />
                            <ErrorMessage name="detalle" component="div" className="text-danger small" />
                          </div>
                        </div>
                      </div>

                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                          Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Guardar Cita
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendario;
