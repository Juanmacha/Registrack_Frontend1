import React from 'react';

const Hero = () => {
  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">

        {/* Lado izquierdo */}
        <div className="flex-1 text-left">
          <h2 className="text-4xl font-bold text-[#1a1a1a] mb-6">
            Certimarcas
          </h2>
          <p className="text-[#333] leading-relaxed text-base mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mollis pretium arcu vel viverra.
            Nulla euismod dolor et metus bibendum porta nec vel sem. Vivamus imperdiet metus nec risus eleifend
            ultrices. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
            Proin blandit sit amet dui non dictum. Nulla sit amet sapien sollicitudin risus rhoncus laoreet vel
            sollicitudin nunc. Maecenas rutrum eget erat et blandit.
          </p>
          <p className="text-[#333] leading-relaxed text-base mb-6">
            Vivamus congue nibh nisl, a vestibulum lectus vehicula id. Nulla vitae mi sed odio tristique mollis.
            Aliquam et dio in massa ultricies, vel sagittis urna congue.
          </p>
          <button className="bg-[#1a4480] text-white px-6 py-3 rounded-md text-base font-semibold hover:bg-[#163366] transition-all">
            Saber más
          </button>
        </div>

        {/* Lado derecho */}
        <div className="flex-1 flex justify-center items-center">
          <img 
            src="/images/jpg.jpg" 
            alt="Certimarcas Ilustración" 
            className="max-w-[300px] w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

