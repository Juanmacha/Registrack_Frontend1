import React from 'react';
import { Link } from 'react-router-dom';

const Specialties = () => {
    return (
        <div className="py-[80px] bg-gradient-to-br from-[#f8fafc] to-white">
            <div>
                <h2 className="text-center text-[2.5rem] text-[#1a4480] mb-12 relative">Nuestras Especialidades</h2>
                <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[60px] h-1 bg-gradient-to-r from-[#F3D259] to-[#f7e084] rounded"></span>
            </div>
            <div className="grid gap-10 mt-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative bg-white p-10 rounded-[20px] text-center border border-[#275faa1a] shadow-[0_10px_40px_rgba(39,95,170,0.1)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_20px_60px_rgba(39,95,170,0.15)] overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#275FAA] to-[#F3D259]"></div>
                    <h3 className="text-xl font-bold mb-2">¿Quiénes somos?</h3>
                    <p className="text-gray-600">En Certimarcas, somos especialistas en la certificación de marcas. Actuamos como intermediarios ante la Cámara de Industria y Comercio, asegurando que el proceso de registro, renovación y protección de tu marca sea ágil, seguro y sin complicaciones.</p>
                </div>
                <div className="relative bg-white p-10 rounded-[20px] text-center border border-[#275faa1a] shadow-[0_10px_40px_rgba(39,95,170,0.1)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_20px_60px_rgba(39,95,170,0.15)] overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#275FAA] to-[#F3D259]"></div>
                    <h3 className="text-xl font-bold mb-2">Nuestra misión</h3>
                    <p className="text-gray-600">Nuestro objetivo es proteger la identidad comercial de emprendedores y empresas, ofreciendo un servicio transparente, eficiente y con acompañamiento en cada etapa del proceso.</p>
                </div>
                <div className="relative bg-white p-10 rounded-[20px] text-center border border-[#275faa1a] shadow-[0_10px_40px_rgba(39,95,170,0.1)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_20px_60px_rgba(39,95,170,0.15)] overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#275FAA] to-[#F3D259]"></div>
                    <h3 className="text-xl font-bold mb-2">¿Por qué elegirnos?</h3>
                    <p className="text-gray-600">Contamos con experiencia y conocimiento en certificación de marcas.</p>
                    <br />
                    <p className="text-gray-600">Nos encargamos de todo el trámite legal, sin estrés para ti.</p>
                    <br />
                    <p className="text-gray-600">Brindamos protección legal garantizada para tu marca.</p>
                    <br />
                    <p className="text-gray-600">Ofrecemos atención personalizada en cada paso del proceso.</p>
                </div>
            </div>
        </div>

    );
}

export default Specialties