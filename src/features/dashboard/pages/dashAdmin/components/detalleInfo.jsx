// BotonInfo.js
import React from "react";
import { Info } from "lucide-react";
import ModalDetalleServicio from "./modalInfo"; 

const BotonInfo = ({ onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn btn-outline-secondary btn-sm custom-hover rounded-circle p-0 d-flex align-items-center justify-center"
      style={{ width: "40px", height: "40px" }}
    >
      <i className="bi bi-info-lg fs-5"></i>
    </button>
  );
};

export default BotonInfo; 