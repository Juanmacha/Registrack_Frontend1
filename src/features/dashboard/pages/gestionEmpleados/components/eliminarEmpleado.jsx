import React from "react";
import Swal from "sweetalert2";

const EliminarEmpleado = ({ empleado, onEliminar }) => {
  const handleEliminar = async () => {
    const result = await Swal.fire({
      title: `¿Eliminar a ${empleado.nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Eliminando...",
        allowOutsideClick: false,
        didOpen: () => {
      
        },
      });

      try {
        await onEliminar(empleado);
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: `${empleado.nombre} fue eliminado exitosamente.`,
          confirmButtonColor: "#3085d6",
        });
      } catch (error) {
        AlertService.error("Error al eliminar", "Hubo un problema al eliminar el empleado.");
      }
    }
  };

  return (
    <button
      title="Eliminar"
      onClick={handleEliminar}
      className="btn btn-outline-danger btn-sm custom-hover rounded-circle p-0 d-flex align-items-center justify-center"
      style={{
        width: "32px",
        height: "32px",
        borderColor: "#dc3545",
        color: "#dc3545",
      }}
    >
      <i className="bi bi-trash-fill"></i>
    </button>
  );
};

export default EliminarEmpleado;
