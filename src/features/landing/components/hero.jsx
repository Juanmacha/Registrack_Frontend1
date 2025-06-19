import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Lado izquierdo */}
      <div className="flex-1 bg-gradient-to-br from-[#275FAA] to-[#4a7bc8] text-white py-20 px-8 flex flex-col justify-center items-center text-center">
        <h1 className="text-[2.5rem] md:text-[3.5rem] font-bold mb-6 bg-gradient-to-r from-white to-[#F3D259] bg-clip-text text-transparent animate-fade-in-up">
          Certimarcas
        </h1>
        <p className="text-lg md:text-[1.3rem] mb-10 opacity-90 animate-fade-in-up animation-delay-[200ms] animation-fill-both">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit veritatis quisquam quod. Asperiores, cum. Ipsam laboriosam asperiores quam ipsum! Recusandae aspernatur ipsa nesciunt ut ipsam quo, vitae itaque reiciendis nostrum.
        </p>
        <button className="bg-gradient-to-r from-[#F3D259] to-[#f7e084] text-[#1a4480] px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-[0_4px_15px_rgba(243,210,89,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(243,210,89,0.4)]">
          Saber más
        </button>
      </div>

      {/* Lado derecho */}
      <div className="flex-1 bg-gradient-to-br  flex justify-center items-center">
        <img src="/images/logo.png" alt="Ilustración Certimarcas" className="max-w-[80%] md:max-w-[60%] h-auto animate-fade-in-up" />
      </div>
    </div>
  );
};

export default Hero;
