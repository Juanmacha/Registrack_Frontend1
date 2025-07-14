import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="auth-container flex h-screen w-full overflow-hidden bg-white">
      {/* Lado Izquierdo: Formulario */}
      <div className="auth-form w-full md:w-1/2 h-full flex items-center justify-center px-4 bg-white">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

{/* Lado Derecho: Branding */}
<div className="auth-video hidden md:flex w-1/2 h-full items-center justify-center bg-white">
  <div className="flex-1 flex justify-center items-center h-[400px] md:h-[500px] ml-16">
    <video
      src="/images/Whisk_cauajgm4ymzhyjjkltawzjetndazzc1hn2y3lwe.mp4"
      alt="Video Registrack"
      className="w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
    />
  </div>
</div>



      {/* Prevenir scroll horizontal innecesario */}
      <style>{`body { overflow-x: hidden; }`}</style>
    </div>
  );
};

export default AuthLayout;
