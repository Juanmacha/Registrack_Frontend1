import React from 'react';
import { Link } from 'react-router-dom';
import clientsData from "../services/clientesData";

const Clients = () => {
  return (
    <div className="py-[80px] bg-[#f8fafc]">
      <h2 className="text-center text-[2.5rem] text-[#1a4480] mb-12 relative">
        Nuestros Clientes
      </h2>

      <div className="grid gap-8 mt-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {clientsData.map((client, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-[15px] text-center shadow-[0_5px_20px_rgba(39,95,170,0.1)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(39,95,170,0.15)]"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-[#275FAA] to-[#F3D259] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-[1.5rem] font-bold">
              {client.initials}
            </div>
            <p className="text-[#1a4480] font-semibold">{client.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;