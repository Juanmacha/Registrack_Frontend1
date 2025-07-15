import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { AppointmentService, EmployeeService } from "../../../../utils/mockDataService.js";
import VerDetalleCita from "../gestionCitas/components/verDetallecita";
import Swal from "sweetalert2";
import { FaCalendarAlt, FaUser, FaPhone, FaFileAlt, FaBriefcase, FaDownload, FaSearch, FaEye, FaEdit, FaTrash, FaCalendarDay } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import * as XLSX from "xlsx";
import "../../../../styles/fullcalendar-custom.css";


const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [modoReprogramar, setModoReprogramar] = useState(false);
  const [citaAReprogramar, setCitaAReprogramar] = useState(null);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [busqueda, setBusqueda] = useState("");
  const calendarRef = useRef(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    tipoCita: "",
    horaInicio: "",
    horaFin: "",
    asesor: "",
    detalle: "",
  });
  const [modalDate, setModalDate] = useState(null);
  const [modalEventos, setModalEventos] = useState({ open: false, eventos: [], hora: "" });
  const [errores, setErrores] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    try {
      const storedEvents = JSON.parse(localStorage.getItem("citas")) || [];
      let eventosValidos = storedEvents.filter(ev =>
        ev && ev.start && ev.end && ev.id && ev.extendedProps
      );
      eventosValidos = eventosValidos.map(event => {
        if (!event.id && event.extendedProps) {
          const idUnico = `${event.extendedProps.cedula}_${event.start.split('T')[0]}_${event.start.split('T')[1]}`;
          return { ...event, id: idUnico };
        }
        return event;
      });
      if (eventosValidos.length > 0) {
        setEvents(eventosValidos);
      }
      // Si no hay eventos válidos, no setear events a [] para no borrar localStorage
    } catch (error) {
      // No hacer nada, así no se borra el localStorage
    }
  }, []);

  useEffect(() => {
    try {
      if (events.length > 0) {
        localStorage.setItem("citas", JSON.stringify(events));
      }
      // Si events está vacío, no sobreescribir localStorage
    } catch (error) {}
  }, [events]);

  const generarIdUnico = (cedula, fecha, hora) => `${cedula}_${fecha}_${hora}`;

  const handleDateSelect = (selectInfo) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(selectInfo.startStr);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    if (fechaSeleccionada < hoy) {
      Swal.fire({ icon: 'warning', title: 'Fecha inválida', text: 'No puedes agendar citas en días anteriores a hoy.' });
      return;
    }
    abrirModal(selectInfo);
  };

  // Función para asignar colores según el estado del evento
  const getEventColors = (estado) => {
    if (estado === "Programada") return { backgroundColor: "#22c55e" };
    if (estado === "Reprogramada") return { backgroundColor: "#2563eb" };
    if (estado === "Cita anulada") return { backgroundColor: "#6b7280" };
    return { backgroundColor: "#fbbf24" };
  };

  const handleGuardarCita = (e) => {
    e.preventDefault();
    // Validación básica
    let camposObligatorios = ["nombre","apellido","cedula","telefono","tipoCita","horaInicio","horaFin","asesor"];
    if (modoReprogramar) {
      camposObligatorios = ["tipoCita","horaInicio","horaFin","asesor"];
    }
    for (let campo of camposObligatorios) {
      if (!formData[campo]) {
        Swal.fire({ icon: 'error', title: 'Campo obligatorio', text: `El campo ${campo} es obligatorio.` });
        return;
      }
    }
    // Validar que horaFin > horaInicio
    if (formData.horaFin <= formData.horaInicio) {
      Swal.fire({ icon: 'error', title: 'Hora inválida', text: 'La hora de fin debe ser mayor que la de inicio.' });
      return;
    }
    // Validar cruce de horarios
    const fechaBase = modoReprogramar && citaAReprogramar?.start
      ? new Date(citaAReprogramar.start).toISOString().split("T")[0]
      : modalDate?.startStr?.split("T")[0] || new Date().toISOString().split("T")[0];
    const horaInicio = formData.horaInicio;
    const horaFin = formData.horaFin;
    const cruza = events.some(ev => {
      if (modoReprogramar && citaAReprogramar && ev.id === citaAReprogramar.id) return false; // Ignorar la cita actual al reprogramar
      const fechaEv = ev.start.split('T')[0];
      if (fechaEv !== fechaBase) return false;
      const inicioEv = ev.start.split('T')[1].slice(0,5);
      const finEv = ev.end.split('T')[1].slice(0,5);
      // Si el nuevo rango se traslapa con uno existente
      return (horaInicio < finEv && horaFin > inicioEv);
    });
    console.log('Intentando guardar cita:', { ...formData, fechaBase });
    if (cruza) {
      Swal.fire({ icon: 'error', title: 'Horario ocupado', text: 'Ya existe una cita en ese rango de horas.' });
      return;
    }

    if (modoReprogramar && citaAReprogramar) {
      const nuevaFechaYHoraInicio = `${fechaBase}T${formData.horaInicio}`;
      const nuevaFechaYHoraFin = `${fechaBase}T${formData.horaFin}`;
      setEvents(prev =>
        prev.map(ev =>
          ev.id === citaAReprogramar.id
            ? {
                ...ev,
                start: nuevaFechaYHoraInicio,
                end: nuevaFechaYHoraFin,
                extendedProps: {
                  ...ev.extendedProps,
                  ...formData,
                  estado: "Reprogramada"
                },
                ...getEventColors("Reprogramada")
              }
            : ev
        )
      );
      setModoReprogramar(false);
      setCitaAReprogramar(null);
      setShowModal(false);
      Swal.fire({ icon: 'success', title: 'Cita reprogramada', timer: 1800, showConfirmButton: false });
      return;
    }

    // Guardar cita
    const idUnico = `${formData.cedula}_${fechaBase}_${formData.horaInicio}`;
    const estado = "Programada";
    const colores = getEventColors(estado);
    const nuevaCita = {
      id: idUnico,
      title: `Asesor: ${formData.asesor}`,
      start: `${fechaBase}T${formData.horaInicio}`,
      end: `${fechaBase}T${formData.horaFin}`,
      extendedProps: { ...formData, estado },
      ...colores,
    };
    setEvents(prev => [...prev, nuevaCita]);
    cerrarModal();
    Swal.fire({ icon: 'success', title: 'Cita agendada', text: 'La cita ha sido agendada correctamente.', timer: 1800, showConfirmButton: false });
  };

  // Cambiar la generación de opciones de hora a intervalos de 1 hora
  const generarOpcionesHora = () => {
    const opciones = [];
    for (let h = 7; h <= 19; h++) {
      const hora24 = h.toString().padStart(2, '0');
      const min = '00';
      const value = `${hora24}:${min}`;
      let h12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? 'AM' : 'PM';
      const label = `${h12.toString().padStart(2, '0')}:${min} ${ampm}`;
      opciones.push({ value, label });
    }
    return opciones;
  };
  const opcionesHora = generarOpcionesHora();

// ✅ NUEVO: Obtener empleados del servicio centralizado
const empleadosActivos = EmployeeService.getAll().filter(emp => emp.estado === 'Activo');


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

  // Estadísticas
  const stats = [
    {
      label: "Programadas",
      value: events.filter(e => e.extendedProps?.estado === "Programada").length,
      color: "bg-green-500",
      icon: <FaCalendarAlt className="text-white text-2xl" />,
    },
    {
      label: "Reprogramadas",
      value: events.filter(e => e.extendedProps?.estado === "Reprogramada").length,
      color: "bg-blue-500",
      icon: <FaEdit className="text-white text-2xl" />,
    },
    {
      label: "Anuladas",
      value: events.filter(e => e.extendedProps?.estado === "Cita anulada").length,
      color: "bg-gray-600",
      icon: <FaTrash className="text-white text-2xl" />,
    },
    {
      label: "Total",
      value: events.length,
      color: "bg-blue-900 text-white",
      icon: <FaCalendarDay className="text-white text-2xl" />,
    },
  ];

  function abrirModal(dateInfo = null) {
    setShowModal(true);
    setModalDate(dateInfo); // Aquí se guarda la fecha seleccionada
    setFormData({
      nombre: "",
      apellido: "",
      cedula: "",
      telefono: "",
      tipoCita: "",
      horaInicio: dateInfo?.startStr ? dateInfo.startStr.split('T')[1]?.slice(0,5) : "",
      horaFin: "",
      asesor: "",
      detalle: "",
    });
    setErrores({}); // Limpiar errores al abrir modal
    setTouched({}); // Limpiar campos tocados al abrir modal
  }

  function cerrarModal() {
    setShowModal(false);
    setModalDate(null);
    setFormData({
      nombre: "",
      apellido: "",
      cedula: "",
      telefono: "",
      tipoCita: "",
      horaInicio: "",
      horaFin: "",
      asesor: "",
      detalle: "",
    });
    setErrores({}); // Limpiar errores al cerrar modal
    setTouched({}); // Limpiar campos tocados al cerrar modal
  }

  function horaEstaOcupada(hora, fecha) {
    if (!fecha) return false;
    const rangosOcupados = events
      .filter(ev => {
        // Si estamos reprogramando, ignorar la cita actual
        if (modoReprogramar && citaAReprogramar) {
          return ev.id !== citaAReprogramar.id && ev.start.split('T')[0] === fecha;
        }
        return ev.start.split('T')[0] === fecha;
      })
      .map(ev => ({
        inicio: ev.start.split('T')[1].slice(0,5),
        fin: ev.end.split('T')[1].slice(0,5)
      }));
    return rangosOcupados.some(rango => hora >= rango.inicio && hora < rango.fin);
  }

  // Función para filtrar eventos según la búsqueda
  const filtrarEventos = (eventos, termino) => {
    if (!termino) return eventos;
    const t = termino.toLowerCase();
    return eventos.filter(ev => {
      // Buscar en todos los campos de extendedProps y en el título
      const props = ev.extendedProps || {};
      const values = [
        ev.title,
        ev.id,
        props.nombre,
        props.apellido,
        props.cedula,
        props.telefono,
        props.tipoCita,
        props.asesor,
        props.detalle,
        props.estado,
        props.observacionAnulacion,
        // Agrega aquí cualquier otro campo relevante
      ];
      return values.some(val =>
        typeof val === 'string' && val.toLowerCase().includes(t)
      );
    });
  };

  const validarCampos = (campos = formData) => {
    const nuevosErrores = {};
    // Nombre
    if (!campos.nombre || campos.nombre.trim().length < 2) {
      nuevosErrores.nombre = "El nombre es obligatorio y debe tener al menos 2 letras.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(campos.nombre.trim())) {
      nuevosErrores.nombre = "El nombre solo puede contener letras y espacios.";
    } else if (/^\s|\s$/.test(campos.nombre) || !campos.nombre.trim()) {
      nuevosErrores.nombre = "El nombre no debe tener espacios al inicio/final ni solo espacios.";
    }
    // Apellido
    if (!campos.apellido || campos.apellido.trim().length < 2) {
      nuevosErrores.apellido = "El apellido es obligatorio y debe tener al menos 2 letras.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(campos.apellido.trim())) {
      nuevosErrores.apellido = "El apellido solo puede contener letras y espacios.";
    } else if (/^\s|\s$/.test(campos.apellido) || !campos.apellido.trim()) {
      nuevosErrores.apellido = "El apellido no debe tener espacios al inicio/final ni solo espacios.";
    }
    // Cédula
    if (!campos.cedula) {
      nuevosErrores.cedula = "La cédula es obligatoria.";
    } else if (!/^[0-9]{7,10}$/.test(campos.cedula)) {
      nuevosErrores.cedula = "La cédula debe tener entre 7 y 10 dígitos numéricos y sin espacios.";
    }
    // Teléfono
    if (!campos.telefono) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    } else if (!/^[0-9]{7,10}$/.test(campos.telefono)) {
      nuevosErrores.telefono = "El teléfono debe tener entre 7 y 10 dígitos numéricos y sin espacios.";
    }
    // Tipo de cita
    if (!campos.tipoCita || !campos.tipoCita.trim()) {
      nuevosErrores.tipoCita = "El tipo de cita es obligatorio.";
    }
    // Hora de inicio
    if (!campos.horaInicio || !campos.horaInicio.trim()) {
      nuevosErrores.horaInicio = "La hora de inicio es obligatoria.";
    }
    // Hora de fin
    if (!campos.horaFin || !campos.horaFin.trim()) {
      nuevosErrores.horaFin = "La hora de fin es obligatoria.";
    }
    // Asesor
    if (!campos.asesor || !campos.asesor.trim()) {
      nuevosErrores.asesor = "El asesor es obligatorio.";
    }
    // No validar detalle (opcional)
    return nuevosErrores;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrores(validarCampos({ ...formData, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrores(validarCampos(formData));
  };

  // Función para exportar a Excel las citas del mes visible
  const exportarExcelMesActual = () => {
    if (!calendarRef.current) return;
    const calendarApi = calendarRef.current.getApi();
    const start = calendarApi.view.currentStart;
    const end = calendarApi.view.currentEnd;
    // Filtrar eventos del mes visible
    const eventosMes = events.filter(ev => {
      const fecha = new Date(ev.start);
      return fecha >= start && fecha < end;
    });
    if (eventosMes.length === 0) {
      Swal.fire({ icon: 'info', title: 'Sin datos', text: 'No hay citas en el mes actual.' });
      return;
    }
    // Preparar datos para Excel
    const data = eventosMes.map(ev => ({
      Nombre: ev.extendedProps?.nombre || '',
      Apellido: ev.extendedProps?.apellido || '',
      Cédula: ev.extendedProps?.cedula || '',
      Teléfono: ev.extendedProps?.telefono || '',
      "Tipo de Cita": ev.extendedProps?.tipoCita || '',
      Asesor: ev.extendedProps?.asesor || '',
      Fecha: ev.start ? new Date(ev.start).toLocaleDateString() : '',
      "Hora Inicio": ev.start ? new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      "Hora Fin": ev.end ? new Date(ev.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      Estado: ev.extendedProps?.estado || '',
      Detalle: ev.extendedProps?.detalle || '',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Citas");
    // Nombre del archivo con mes y año
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const mesNombre = meses[start.getMonth()];
    const anio = start.getFullYear();
    XLSX.writeFile(wb, `Citas_${mesNombre}_${anio}.xlsx`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 bg-gray-100 min-h-screen pb-4">
      {/* Header principal */}
      <div className="bg-blue-900 rounded-xl shadow-lg p-6 flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaCalendarAlt className="text-white text-4xl" />
            Calendario de Citas
          </h1>
          <p className="text-blue-100 text-lg mt-1">Gestiona tus citas administrativas de forma eficiente</p>
        </div>
        <button className="bg-white text-[#174B8A] font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition-all">
          {events.length} Citas Registradas
        </button>
      </div>

      {/* Barra de controles */}
      <div className="bg-white rounded-xl shadow flex flex-wrap items-center justify-between px-6 py-4 mb-6 gap-4">
        <div className="flex gap-2 items-center">
          <button
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
            onClick={() => {
              if (calendarRef.current) {
                calendarRef.current.getApi().prev();
              }
            }}
            aria-label="Anterior"
          >
            &lt;
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
            onClick={() => {
              if (calendarRef.current) {
                calendarRef.current.getApi().next();
              }
            }}
            aria-label="Siguiente"
          >
            &gt;
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
            onClick={() => {
              if (calendarRef.current) {
                calendarRef.current.getApi().today();
              }
            }}
            aria-label="Hoy"
          >
            Hoy
          </button>
          <button
            className={`border px-4 py-1 rounded-md text-base font-medium ${currentView === 'dayGridMonth' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-800 border-blue-600'}`}
            onClick={() => cambiarVista('dayGridMonth')}
          >
            Mes
          </button>
          <button
            className={`border px-4 py-1 rounded-md text-base font-medium ${currentView === 'timeGridWeek' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-800 border-blue-600'}`}
            onClick={() => cambiarVista('timeGridWeek')}
          >
            Semana
          </button>
          <button
            className={`border px-4 py-1 rounded-md text-base font-medium ${currentView === 'timeGridDay' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-800 border-blue-600'}`}
            onClick={() => cambiarVista('timeGridDay')}
          >
            Día
          </button>
        </div>
        <div className="flex gap-2 items-center flex-1 justify-end">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar citas..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow" onClick={exportarExcelMesActual}>
            <FaDownload /> Exportar Excel
          </button>
          <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md flex items-center gap-2 font-semibold shadow" onClick={() => abrirModal()}>
            <FaCalendarAlt /> Nueva Cita
          </button>
        </div>
      </div>

      {/* Leyenda de colores y tipos de cita */}
      <div className="flex flex-wrap gap-4 items-center my-4">
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 rounded bg-green-500 border border-gray-300"></span>
          <span className="text-sm">Programada</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 rounded bg-blue-600 border border-gray-300"></span>
          <span className="text-sm">Reprogramada</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5 rounded bg-gray-500 border border-gray-300"></span>
          <span className="text-sm">Anulada</span>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={stat.label} className={`rounded-xl shadow flex items-center justify-between p-4 ${stat.color}`}>
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
            <div>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Contenedor del calendario */}
      <div className="bg-white rounded-xl shadow-xl p-4 min-h-[500px]">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={currentView}
          headerToolbar={{
            left: '',
            center: 'title',
            right: ''
          }}
          locale={esLocale}
          events={filtrarEventos(events, busqueda).map((event) => ({
            ...event,
            ...getEventColors(event.extendedProps?.estado),
          }))}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={1}
          dayMaxEventRows={false}
          eventDisplay="block"
          eventClassNames={arg => {
            let base = "custom-event";
            if (arg.view.type === "timeGridWeek" || arg.view.type === "timeGridDay") {
              base += " custom-event-timegrid";
            }
            if (arg.view.type === "dayGridMonth") {
              base += " custom-event-month";
            }
            return base;
          }}
          eventContent={arg => {
            const { event } = arg;
            return (
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1em' }}>
                  {event.extendedProps?.tipoCita || event.title}
                </div>
                {event.extendedProps?.asesor && (
                  <div style={{ fontSize: '0.92em', opacity: 0.9 }}>
                    {event.extendedProps.asesor}
                  </div>
                )}
              </div>
            );
          }}
          eventClick={handleEventClick}
          slotDuration="01:00:00"
          slotMinTime="07:00:00"
          slotMaxTime="19:00:00"
          height="auto"
          select={handleDateSelect}
        />
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96 text-gray-300">
            <FaCalendarAlt className="text-7xl mb-4" />
            <p className="text-lg">No hay citas registradas</p>
          </div>
        )}
      </div>

      {/* MODAL DE AGENDAR CITA */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-gray-50 z-10">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-1.5 rounded-full">
                  <FaCalendarAlt className="text-blue-600 text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{modoReprogramar ? 'Reprogramar Cita' : 'Agendar Nueva Cita'}</h2>
                  <p className="text-xs text-gray-500">
                    {modoReprogramar ? 'Modifica solo los campos permitidos para reprogramar la cita' : 'Llena los campos para registrar una cita'}
                  </p>
                </div>
              </div>
              <button onClick={cerrarModal} className="text-gray-900 hover:text-red-700 bg-gray-50 p-1 rounded">
                <span className="text-xl">&times;</span>
              </button>
            </div>
            {/* Formulario en dos columnas */}
            <form onSubmit={handleGuardarCita} className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <FaUser className="inline text-gray-400 mr-1" /> Nombre <span className="text-gray-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full px-2 py-1.5 border rounded-md shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.nombre}
                    readOnly={modoReprogramar}
                  />
                  {touched.nombre && errores.nombre && <p className="text-red-600 text-xs mt-1">{errores.nombre}</p>}
                </div>
                {/* Apellido */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <FaUser className="inline text-gray-400 mr-1" /> Apellido <span className="text-gray-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full px-2 py-1.5 border rounded-md shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.apellido}
                    readOnly={modoReprogramar}
                  />
                  {touched.apellido && errores.apellido && <p className="text-red-600 text-xs mt-1">{errores.apellido}</p>}
                </div>
                {/* Cédula */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <FaFileAlt className="inline text-gray-400 mr-1" /> Cédula <span className="text-gray-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cedula"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full px-2 py-1.5 border rounded-md shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.cedula}
                    readOnly={modoReprogramar}
                  />
                  {touched.cedula && errores.cedula && <p className="text-red-600 text-xs mt-1">{errores.cedula}</p>}
                </div>
                {/* Teléfono */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <FaPhone className="inline text-gray-400 mr-1" /> Teléfono <span className="text-gray-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full px-2 py-1.5 border rounded-md shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.telefono}
                    readOnly={modoReprogramar}
                  />
                  {touched.telefono && errores.telefono && <p className="text-red-600 text-xs mt-1">{errores.telefono}</p>}
                </div>
                {/* Tipo de Cita */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <FaBriefcase className="inline text-gray-400 mr-1" /> Tipo de Cita <span className="text-gray-500">*</span>
                  </label>
                  <select
                    name="tipoCita"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full px-2 py-1.5 border rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.tipoCita}
                    disabled={!modoReprogramar ? false : !modoReprogramar ? false : false}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="General">General</option>
                    <option value="Oposición">Oposición</option>
                    <option value="Certificación">Certificación</option>
                    <option value="Búsqueda de antecedentes">Búsqueda de antecedentes</option>
                    <option value="Cesión de marca">Cesión de marca</option>
                    <option value="Renovación">Renovación</option>
                  </select>
                  {touched.tipoCita && errores.tipoCita && <p className="text-red-600 text-xs mt-1">{errores.tipoCita}</p>}
                </div>
                {/* Hora Inicio */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Hora de Inicio <span className="text-gray-500">*</span></label>
                  <select
                    name="horaInicio"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full px-2 py-1.5 border rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.horaInicio}
                    disabled={!modoReprogramar ? false : !modoReprogramar ? false : false}
                  >
                    <option value="">Seleccionar...</option>
                    {opcionesHora.map(hora => (
                      <option key={hora.value} value={hora.value} disabled={horaEstaOcupada(hora.value, modalDate?.startStr?.split('T')[0] || new Date().toISOString().split('T')[0])}>{hora.label}</option>
                    ))}
                  </select>
                  {touched.horaInicio && errores.horaInicio && <p className="text-red-600 text-xs mt-1">{errores.horaInicio}</p>}
                </div>
                {/* Hora Fin */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Hora de Fin <span className="text-gray-500">*</span></label>
                  <select
                    name="horaFin"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full px-2 py-1.5 border rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.horaFin}
                    disabled={!modoReprogramar ? false : !modoReprogramar ? false : false}
                  >
                    <option value="">Seleccionar...</option>
                    {opcionesHora.map(hora => {
                      const menorOIgual = formData.horaInicio && hora.value <= formData.horaInicio;
                      const cruce = horaEstaOcupada(hora.value, modalDate?.startStr?.split('T')[0] || new Date().toISOString().split('T')[0]);
                      return (
                        <option key={hora.value} value={hora.value} disabled={menorOIgual || cruce}>
                          {hora.label}
                        </option>
                      );
                    })}
                  </select>
                  {touched.horaFin && errores.horaFin && <p className="text-red-600 text-xs mt-1">{errores.horaFin}</p>}
                </div>
                {/* Asesor */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <FaUser className="inline text-gray-400 mr-1" /> Asesor <span className="text-gray-500">*</span>
                  </label>
                  <select
                    name="asesor"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full px-2 py-1.5 border rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.asesor}
                    disabled={!modoReprogramar ? false : !modoReprogramar ? false : false}
                  >
                    <option value="">Seleccionar...</option>
                    {empleadosActivos.map(e => (
                      <option key={e.cedula} value={`${e.nombre} ${e.apellido}`}>{e.nombre} {e.apellido}</option>
                    ))}
                  </select>
                  {touched.asesor && errores.asesor && <p className="text-red-600 text-xs mt-1">{errores.asesor}</p>}
                </div>
                {/* Detalle */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <FaFileAlt className="inline text-gray-400 mr-1" /> Detalle
                  </label>
                  <textarea
                    name="detalle"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full px-2 py-1.5 border rounded-md shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={1}
                    value={formData.detalle}
                    readOnly={modoReprogramar}
                    placeholder="Detalles adicionales de la cita..."
                  />
                  {touched.detalle && errores.detalle && <p className="text-red-600 text-xs mt-1">{errores.detalle}</p>}
                </div>
              </div>
              {/* Botones */}
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={cerrarModal} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                  {modoReprogramar ? 'Reprogramar Cita' : 'Agendar Cita'}
                </button>
              </div>
            </form>
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
            // Precarga los datos de la cita a reprogramar
            setFormData({
              nombre: citaSeleccionada.nombre,
              apellido: citaSeleccionada.apellido,
              cedula: citaSeleccionada.cedula,
              telefono: citaSeleccionada.telefono,
              tipoCita: citaSeleccionada.tipoCita,
              horaInicio: citaSeleccionada.horaInicio,
              horaFin: citaSeleccionada.horaFin,
              asesor: citaSeleccionada.asesor,
              detalle: citaSeleccionada.detalle,
            });
          }}
          onAnular={handleAnularCita}
          puedeReprogramar={citaSeleccionada?.estado !== "Cita anulada"}
          puedeAnular={citaSeleccionada?.estado !== "Cita anulada"}
        />
      )}
      {modalEventos.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Eventos en {modalEventos.hora}</h2>
            <ul>
              {modalEventos.eventos.map((ev, idx) => (
                <li key={ev.publicId || idx} className="mb-2">
                  <span className="font-semibold">{ev.title}</span>
                  {ev.asesor && (
                    <span className="ml-2 text-gray-600">({ev.asesor})</span>
                  )}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setModalEventos({ open: false, eventos: [], hora: "" })}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;