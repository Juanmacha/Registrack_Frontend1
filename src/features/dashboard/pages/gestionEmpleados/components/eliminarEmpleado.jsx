import React from "react";
import Swal from "sweetalert2";

const EliminarEmpleado = ({ empleado, onEliminar }) => {
  const handleEliminar = () => {
    Swal.fire({
      title: `¿Eliminar a ${empleado.nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onEliminar(empleado);
        Swal.fire("Eliminado", `${empleado.nombre} fue eliminado.`, "success");
      }
    });
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
