import React, { useState, useEffect, useRef } from "react";
import { useSidebar } from "../../../../shared/contexts/SidebarContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// Configuración del locale español
const esLocale = {
  code: 'es',
  week: {
    dow: 1, // Lunes como primer día de la semana
    doy: 4  // La semana que contiene Jan 4th es la primera semana del año
  },
  buttonText: {
    prev: 'Ant',
    next: 'Sig',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    list: 'Lista'
  },
  weekText: 'Sm',
  allDayText: 'Todo el día',
  moreLinkText: function(n) {
    return '+ ver más (' + n + ')';
  },
  noEventsText: 'No hay eventos para mostrar'
};
import citasApiService from "../../services/citasApiService.js";
import alertService from "../../../../utils/alertService.js";
import { EmployeeService } from "../../../../utils/mockDataService.js";
import DownloadButton from "../../../../shared/components/DownloadButton";
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
  const [isLoading, setIsLoading] = useState(false);
  const calendarRef = useRef(null);
  const { isSidebarExpanded } = useSidebar();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    tipoDocumento: "",
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

  // Función para cargar citas desde la API
  const cargarCitasDesdeAPI = async () => {
    setIsLoading(true);
    try {
      console.log('📅 [Calendario] Cargando citas desde la API...');
      const result = await citasApiService.getAllCitas();
      
      if (result.success) {
        console.log('✅ [Calendario] Citas cargadas desde API:', result.data);
        console.log('📊 [Calendario] Análisis de estructura de datos:', {
          isArray: Array.isArray(result.data),
          length: Array.isArray(result.data) ? result.data.length : 'N/A',
          firstItem: Array.isArray(result.data) && result.data.length > 0 ? result.data[0] : 'N/A',
          firstItemKeys: Array.isArray(result.data) && result.data.length > 0 ? Object.keys(result.data[0]) : 'N/A'
        });
        
        if (!Array.isArray(result.data) || result.data.length === 0) {
          console.log('⚠️ [Calendario] No hay citas en la API');
          setEvents([]);
          return;
        }
        
        // Convertir las citas de la API al formato de FullCalendar
        const eventosCalendario = result.data.map((cita, index) => {
          console.log(`📋 [Calendario] Procesando cita ${index + 1}:`, cita);
          
          const evento = {
            id: cita.id_cita || cita.id,
            title: `${cita.tipo || 'Sin tipo'} - ${cita.cliente?.nombre || cita.cliente?.nombre_completo || 'Cliente'}`,
            start: `${cita.fecha}T${cita.hora_inicio}`,
            end: `${cita.fecha}T${cita.hora_fin}`,
            backgroundColor: getColorByEstado(cita.estado),
            borderColor: getColorByEstado(cita.estado),
            textColor: '#ffffff',
            extendedProps: {
              // Mapear datos de la API al formato que espera VerDetalleCita
              id: cita.id_cita || cita.id,
              nombre: cita.cliente?.nombre || cita.cliente?.nombre_completo || 'N/A',
              apellido: cita.cliente?.apellido || '',
              cedula: cita.cliente?.documento || cita.cliente?.cedula || 'N/A',
              telefono: cita.cliente?.telefono || 'N/A',
              email: cita.cliente?.email || cita.cliente?.correo || 'N/A',
              tipoCita: cita.tipo || 'N/A',
              horaInicio: cita.hora_inicio || 'N/A',
              horaFin: cita.hora_fin || 'N/A',
              asesor: cita.empleado?.nombre || cita.empleado?.nombre_completo || 'N/A',
              detalle: cita.descripcion || cita.observacion || 'Sin detalle',
              estado: cita.estado || 'N/A',
              modalidad: cita.modalidad || 'N/A',
              observacionAnulacion: cita.observacion_anulacion || '',
              fecha: cita.fecha || 'N/A',
              // Datos originales de la API para referencia
              datosOriginales: cita,
              cliente: cita.cliente,
              empleado: cita.empleado,
              // Datos adicionales de la solicitud original
              observacionAdmin: cita.observacion_admin || '',
              fechaSolicitada: cita.fecha_solicitada || '',
              horaSolicitada: cita.hora_solicitada || ''
            }
          };
          
          console.log(`📅 [Calendario] Evento ${index + 1} creado:`, evento);
          return evento;
        });
        
        setEvents(eventosCalendario);
        console.log('📅 [Calendario] Eventos del calendario actualizados desde API:', eventosCalendario);
      } else {
        console.error('❌ [Calendario] Error al cargar citas desde API:', result.message);
        
        // Si es error 404, significa que el endpoint no existe
        if (result.message.includes('404') || result.message.includes('not found')) {
          await alertService.info(
            'Endpoint no disponible', 
            'El endpoint /api/gestion-citas no está implementado en la API. Las citas se crean automáticamente al aprobar solicitudes.'
          );
        } else {
          await alertService.error('Error', result.message || 'No se pudieron cargar las citas desde la API');
        }
      }
    } catch (error) {
      console.error('💥 [Calendario] Error inesperado al cargar desde API:', error);
      await alertService.error('Error', 'Error de conexión con la API');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener color según el estado
  const getColorByEstado = (estado) => {
    const estadoLower = (estado || '').toLowerCase();
    
    if (estadoLower.includes('programada')) return '#3B82F6'; // Azul
    if (estadoLower.includes('pendiente')) return '#F59E0B'; // Amarillo
    if (estadoLower.includes('reprogramada')) return '#8B5CF6'; // Púrpura
    if (estadoLower.includes('anulada') || estadoLower.includes('cancelada')) return '#EF4444'; // Rojo
    if (estadoLower.includes('completada') || estadoLower.includes('finalizada')) return '#10B981'; // Verde
    
    return '#6B7280'; // Gris por defecto
  };

  useEffect(() => {
    // Cargar citas desde la API al montar el componente
    cargarCitasDesdeAPI();

    // Forzar el re-renderizado del calendario después de que el DOM esté estable
    if (calendarRef.current) {
      calendarRef.current.getApi().updateSize();
    }
  }, []);

  useEffect(() => {
    // Este useEffect se ejecutará cada vez que isSidebarExpanded cambie
    if (calendarRef.current) {
      calendarRef.current.getApi().updateSize();
    }
  }, [isSidebarExpanded]);

  useEffect(() => {
    try {
      if (events.length > 0) {
        localStorage.setItem("citas", JSON.stringify(events));
      }
      // Si events está vacío, no sobreescribir localStorage
    } catch (error) {}
  }, [events]);

  // ✅ NUEVO: useEffect para detectar solicitudes desde localStorage y abrir modal automáticamente
  useEffect(() => {
    const solicitudParaAgendar = localStorage.getItem('solicitudParaAgendar');
    if (solicitudParaAgendar) {
      try {
        const solicitudData = JSON.parse(solicitudParaAgendar);
        
        // Separar nombre completo en nombre y apellido si es necesario
        const nombreCompleto = solicitudData.clienteNombre || "";
        const partesNombre = nombreCompleto.trim().split(' ');
        const nombre = partesNombre[0] || "";
        const apellido = partesNombre.slice(1).join(' ') || "";
        
        // Prellenar el formulario con los datos de la solicitud
        setFormData({
          nombre: nombre,
          apellido: apellido,
          cedula: solicitudData.clienteDocumento || "",
          tipoDocumento: solicitudData.tipoDocumento || "",
          telefono: solicitudData.telefono || "",
          tipoCita: solicitudData.tipoSolicitud || "",
          horaInicio: "",
          horaFin: "",
          asesor: "",
          detalle: solicitudData.mensaje || "",
        });

        // Abrir el modal automáticamente
        setShowModal(true);
        
        // Limpiar el localStorage para evitar que se abra nuevamente
        localStorage.removeItem('solicitudParaAgendar');
        
        // Mostrar mensaje informativo
        Swal.fire({
          icon: 'info',
          title: 'Datos cargados automáticamente',
          text: `Se han cargado los datos de la solicitud de ${solicitudData.clienteNombre}. Solo necesitas seleccionar la hora y el asesor.`,
          timer: 3000,
          showConfirmButton: false
        });
        
      } catch (error) {
        console.error('Error al procesar solicitud para agendar:', error);
        localStorage.removeItem('solicitudParaAgendar');
      }
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  const generarIdUnico = (cedula, fecha, hora) => `${cedula}_${fecha}_${hora}`;

  const handleDateSelect = (selectInfo) => {
    console.log('🔧 [Calendario] handleDateSelect llamado:', selectInfo);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(selectInfo.startStr);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    console.log('🔧 [Calendario] Fecha seleccionada:', fechaSeleccionada);
    console.log('🔧 [Calendario] Fecha de hoy:', hoy);
    if (fechaSeleccionada < hoy) {
      AlertService.warning("Fecha inválida", "No puedes agendar citas en días anteriores a hoy.");
      return;
    }
    abrirModal(selectInfo);
  };

  // Función para asignar colores según el estado del evento
  const getEventColors = (estado) => {
    if (estado === "Programada") return { backgroundColor: "#22c55e" };
    if (estado === "Reprogramada") return { backgroundColor: "#2563eb" };
    if (estado === "Cita anulada") return { backgroundColor: "#6b7280" };
    if (estado === "Iniciada") return { backgroundColor: "#f59e0b" }; // Nuevo color para citas iniciadas
    return { backgroundColor: "#fbbf24" };
  };

  // Función para crear cita usando la API
  const handleCreateCita = async (citaData) => {
    setIsLoading(true);
    try {
      console.log('📅 [Calendario] Creando nueva cita...', citaData);
      const result = await citasApiService.createCita(citaData);
      
      if (result.success) {
        await alertService.success(
          "Cita creada",
          result.message || "La cita se ha creado exitosamente.",
          { confirmButtonText: "Entendido" }
        );
        
        cerrarModal();
        // Recargar citas desde la API
        await cargarCitasDesdeAPI();
      } else {
        await alertService.error(
          "Error al crear cita",
          result.message || "No se pudo crear la cita. Intenta de nuevo.",
          { confirmButtonText: "Entendido" }
        );
      }
    } catch (error) {
      console.error('💥 [Calendario] Error al crear cita:', error);
      await alertService.error(
        "Error de conexión",
        "No se pudo conectar con el servidor. Intenta de nuevo.",
        { confirmButtonText: "Entendido" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Función para reprogramar cita usando la API
  const handleReprogramarCita = async (citaId, newData) => {
    setIsLoading(true);
    try {
      console.log('📅 [Calendario] Reprogramando cita ID:', citaId, newData);
      const result = await citasApiService.reprogramarCita(citaId, newData);
      
      if (result.success) {
        await alertService.success(
          "Cita reprogramada",
          result.message || "La cita se ha reprogramado exitosamente.",
          { confirmButtonText: "Entendido" }
        );
        
        setModoReprogramar(false);
        setCitaAReprogramar(null);
        setShowModal(false);
        // Recargar citas desde la API
        await cargarCitasDesdeAPI();
      } else {
        await alertService.error(
          "Error al reprogramar cita",
          result.message || "No se pudo reprogramar la cita. Intenta de nuevo.",
          { confirmButtonText: "Entendido" }
        );
      }
    } catch (error) {
      console.error('💥 [Calendario] Error al reprogramar cita:', error);
      await alertService.error(
        "Error de conexión",
        "No se pudo conectar con el servidor. Intenta de nuevo.",
        { confirmButtonText: "Entendido" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Función para anular cita usando la API
  const handleAnularCita = async (citaId, observacion) => {
    setIsLoading(true);
    try {
      console.log('📅 [Calendario] Anulando cita ID:', citaId, observacion);
      const result = await citasApiService.anularCita(citaId, observacion);
      
      if (result.success) {
        await alertService.success(
          "Cita anulada",
          result.message || "La cita se ha anulado exitosamente.",
          { confirmButtonText: "Entendido" }
        );
        
        setShowDetalle(false);
        // Recargar citas desde la API
        await cargarCitasDesdeAPI();
      } else {
        await alertService.error(
          "Error al anular cita",
          result.message || "No se pudo anular la cita. Intenta de nuevo.",
          { confirmButtonText: "Entendido" }
        );
      }
    } catch (error) {
      console.error('💥 [Calendario] Error al anular cita:', error);
      await alertService.error(
        "Error de conexión",
        "No se pudo conectar con el servidor. Intenta de nuevo.",
        { confirmButtonText: "Entendido" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuardarCita = (e) => {
    e.preventDefault();
    
    // Validar que modalDate esté presente (excepto en modo reprogramar)
    if (!modoReprogramar && !modalDate) {
      console.error('🔧 [Calendario] Error: modalDate no está presente');
      Swal.fire({ 
        icon: 'error', 
        title: 'Error de fecha', 
        text: 'No se ha seleccionado una fecha válida. Por favor, selecciona una fecha en el calendario.' 
      });
      return;
    }
    
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
      AlertService.error("Hora inválida", "La hora de fin debe ser mayor que la de inicio.");
      return;
    }
    // Validar cruce de horarios
    console.log('🔧 [Calendario] modalDate en handleGuardarCita:', modalDate);
    let fechaBase;
    if (modoReprogramar && citaAReprogramar?.start) {
      fechaBase = new Date(citaAReprogramar.start).toISOString().split("T")[0];
    } else if (modalDate?.startStr) {
      fechaBase = modalDate.startStr.split("T")[0];
    } else {
      console.error('🔧 [Calendario] Error: No se puede determinar la fecha base');
      Swal.fire({ 
        icon: 'error', 
        title: 'Error de fecha', 
        text: 'No se puede determinar la fecha para la cita. Por favor, selecciona una fecha válida.' 
      });
      return;
    }
    console.log('🔧 [Calendario] fechaBase calculada:', fechaBase);
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
      AlertService.error("Horario ocupado", "Ya existe una cita en ese rango de horas.");
      return;
    }

    if (modoReprogramar && citaAReprogramar) {
      // Reprogramar cita usando la API
      handleReprogramarCita(citaAReprogramar.id, {
        fecha: fechaBase,
        hora_inicio: formData.horaInicio.includes(':') && formData.horaInicio.split(':').length === 2 ? formData.horaInicio + ':00' : formData.horaInicio,
        hora_fin: formData.horaFin.includes(':') && formData.horaFin.split(':').length === 2 ? formData.horaFin + ':00' : formData.horaFin,
        tipo: formData.tipoCita,
        modalidad: "Presencial",
        observacion: formData.detalle || ''
      });
      return;
    }

    // Crear cita usando la API
    const citaData = {
      fecha: fechaBase,
      hora_inicio: formData.horaInicio.includes(':') && formData.horaInicio.split(':').length === 2 ? formData.horaInicio + ':00' : formData.horaInicio,
      hora_fin: formData.horaFin.includes(':') && formData.horaFin.split(':').length === 2 ? formData.horaFin + ':00' : formData.horaFin,
      tipo: formData.tipoCita,
      modalidad: "Presencial",
      id_cliente: parseInt(formData.cedula) || 1, // Convertir a número entero
      id_empleado: parseInt(formData.asesor) || 1, // Convertir a número entero
      observacion: formData.detalle || '',
      cliente: {
        nombre: formData.nombre,
        apellido: formData.apellido,
        documento: formData.cedula,
        telefono: formData.telefono
      }
    };
    
    console.log('📤 [Calendario] Datos a enviar para crear cita:', citaData);
    console.log('📊 [Calendario] FormData completo:', formData);
    console.log('🔍 [Calendario] Validación de tipos:', {
      fecha: typeof citaData.fecha,
      hora_inicio: typeof citaData.hora_inicio,
      hora_fin: typeof citaData.hora_fin,
      tipo: typeof citaData.tipo,
      modalidad: typeof citaData.modalidad,
      id_cliente: typeof citaData.id_cliente,
      id_empleado: typeof citaData.id_empleado
    });
    
    handleCreateCita(citaData);
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
    nombre: "", apellido: "", cedula: "", tipoDocumento: "", telefono: "",
    horaInicio: "", horaFin: "", detalle: "", tipoCita: "", asesor: "",
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required("Requerido"),
    apellido: Yup.string().required("Requerido"),
    cedula: Yup.string().required("Requerido"),
    tipoDocumento: Yup.string().required("Requerido"),
    telefono: Yup.string().required("Requerido"),
    tipoCita: Yup.string().required("Requerido"),
    horaInicio: Yup.string().required("Requerido"),
    horaFin: Yup.string().required("Requerido"),
    asesor: Yup.string().required("Requerido"),
  });

  const handleEventClick = (clickInfo) => {
    console.log('🖱️ [Calendario] Click en evento:', clickInfo.event);
    console.log('📋 [Calendario] ExtendedProps del evento:', clickInfo.event.extendedProps);
    setCitaSeleccionada(clickInfo.event.extendedProps);
    setCitaAReprogramar(clickInfo.event);
    setShowDetalle(true);
  };

  const handleAnularCitaModal = () => {
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
    }).then(async (result) => {
      if (result.isConfirmed && citaSeleccionada) {
        const observacion = result.value;
        await handleAnularCita(citaSeleccionada.id, observacion);
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
      label: "Finalizadas",
      value: events.filter(e => e.extendedProps?.estado === "Finalizada").length,
      color: "bg-yellow-500",
      icon: <FaCalendarDay className="text-white text-2xl" />,
    },
    {
      label: "Total",
      value: events.length,
      color: "bg-blue-900 text-white",
      icon: <FaCalendarDay className="text-white text-2xl" />,
    },
  ];

  function abrirModal(dateInfo = null) {
    console.log('🔧 [Calendario] abrirModal llamado con dateInfo:', dateInfo);
    setShowModal(true);
    setModalDate(dateInfo); // Aquí se guarda la fecha seleccionada
    console.log('🔧 [Calendario] modalDate establecido:', dateInfo);
    
    // Solo resetear el formulario si no viene de una solicitud
    const solicitudParaAgendar = localStorage.getItem('solicitudParaAgendar');
    if (!solicitudParaAgendar) {
      setFormData({
        nombre: "",
        apellido: "",
        cedula: "",
        tipoDocumento: "",
        telefono: "",
        tipoCita: "",
        horaInicio: dateInfo?.startStr ? dateInfo.startStr.split('T')[1]?.slice(0,5) : "",
        horaFin: "",
        asesor: "",
        detalle: "",
      });
    }
    
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
      tipoDocumento: "",
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
      AlertService.info("Sin datos", "No hay citas en el mes actual.");
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
          {isLoading ? 'Cargando...' : `${events.length} Citas de API`}
        </button>
      </div>

      {/* Barra de controles */}
      <div className="bg-white rounded-xl shadow flex flex-wrap items-center justify-between px-6 py-4 mb-6 gap-4">
        <div className="flex gap-2 items-center">
          {/* Indicador de que se está usando API */}
          <div className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium">
            🌐 Conectado a API
          </div>
          
          {/* Botón de verificar citas */}
          <button
            onClick={async () => {
              console.log('🔍 [Calendario] Verificando citas existentes...');
              const result = await citasApiService.checkCitasExists();
              console.log('🔍 [Calendario] Resultado de verificación:', result);
              if (result.success) {
                if (result.hasCitas) {
                  await alertService.success('Citas encontradas', `Se encontraron ${result.count} citas en la base de datos`);
                } else {
                  await alertService.info('Sin citas', 'No hay citas registradas en la base de datos');
                }
              } else {
                // Si es error 404, significa que el endpoint no existe
                if (result.message && (result.message.includes('404') || result.message.includes('not found'))) {
                  await alertService.info(
                    'Endpoint no disponible', 
                    'El endpoint /api/gestion-citas no está implementado. Las citas se crean automáticamente al aprobar solicitudes de cita.'
                  );
                } else {
                  await alertService.error('Error', result.message || 'No se pudo verificar las citas');
                }
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FaCalendarDay className="w-4 h-4" />
            <span>Verificar Citas</span>
          </button>
          
          {/* Botón de refrescar */}
          <button
            onClick={cargarCitasDesdeAPI}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FaSearch className="w-4 h-4" />
            <span>{isLoading ? 'Cargando...' : 'Refrescar'}</span>
          </button>
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
          <DownloadButton
            type="excel"
            onClick={exportarExcelMesActual}
            title="Descargar Excel"
          />
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
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center sticky top-0 bg-gray-50 z-10">
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
                {/* Tipo de documento */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <FaFileAlt className="inline text-gray-400 mr-1" /> Tipo de documento <span className="text-gray-500">*</span>
                  </label>
                  <select
                    name="tipoDocumento"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="w-full px-2 py-1.5 border rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.tipoDocumento}
                    disabled={modoReprogramar}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                    <option value="Cédula de extranjería">Cédula de extranjería</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="NIT">NIT</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {touched.tipoDocumento && errores.tipoDocumento && <p className="text-red-600 text-xs mt-1">{errores.tipoDocumento}</p>}
                </div>
                {/* Número de documento */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <FaFileAlt className="inline text-gray-400 mr-1" /> Número de documento <span className="text-gray-500">*</span>
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
          onAnular={handleAnularCitaModal}
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