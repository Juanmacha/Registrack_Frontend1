import { mostrarConfirmacion } from "../../../../../utils/alerts";
import notificationService from "../../../../../shared/services/NotificationService.js";
import rolesApiService from "../services/rolesApiService";

const eliminarRol = async (rolId, roles, setRoles, loadRoles) => {
  const confirmado = await mostrarConfirmacion(
    "¿Estás seguro?",
    "Esta acción no se puede deshacer.",
    "Sí, eliminar"
  );

  if (confirmado.isConfirmed) {
    try {
      console.log(`🔄 [EliminarRol] Eliminando rol con ID: ${rolId}`);
      await rolesApiService.deleteRole(rolId);
      console.log('✅ [EliminarRol] Rol eliminado exitosamente');
      
      // Recargar la lista de roles desde la API
      await loadRoles();
      notificationService.deleteSuccess('rol');
    } catch (error) {
      console.error('❌ [EliminarRol] Error eliminando rol:', error);
      notificationService.deleteError('Error al eliminar el rol');
    }
  }
};

export default eliminarRol;
