import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/contexts/authContext";
import SideBarGeneral from "../../dashboard/components/sideBarGeneral";
import NavBar from "../../dashboard/components/navBarGeneral";
import ClientNavbar from "../components/ClientNavbar";
import ProfileContent from "../components/ProfileContent";
import { SidebarProvider } from "../../../shared/contexts/SidebarContext";

const ViewProfile = () => {
  const { user: usuario, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    </div>
  );
  
  if (!usuario) return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar perfil</h2>
        <p className="text-gray-600 mb-4">No se pudo cargar la información del usuario</p>
        <button 
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Ir al Login
        </button>
      </div>
    </div>
  );

  // Determinar el rol del usuario
  const userRole = usuario?.rol?.nombre || usuario?.role || 'cliente';
  const isClient = userRole === 'cliente';

  // Renderizar layout según el rol
  if (isClient) {
    // Layout para clientes (sin sidebar de admin)
    return (
      <div className="min-h-screen bg-gray-100">
        <ClientNavbar title="Mi Perfil" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ProfileContent />
        </div>
      </div>
    );
  }

  // Layout para administradores y empleados (con sidebar)
  return (
    <SidebarProvider>
      <div className="bg-[#eceded] flex h-screen w-screen overflow-hidden">
        <SideBarGeneral />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <NavBar titulo="Mi Perfil" />
          <div className="flex-1 mt-10 px-1">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto">
                <ProfileContent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ViewProfile;