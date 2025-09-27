// Script de prueba para verificar la conexión con la API de empleados
import empleadosApiService from './empleadosApiService.js';

const testEmpleadosAPI = async () => {
  console.log('🧪 [TestEmpleadosAPI] Iniciando pruebas de conectividad...');
  
  try {
    // 1. Probar conectividad básica
    console.log('\n1️⃣ Probando conectividad básica...');
    const connectionTest = await empleadosApiService.testConnection();
    console.log('Resultado:', connectionTest.success ? '✅ Conectado' : '❌ Error');
    
    if (!connectionTest.success) {
      console.error('❌ Error de conectividad:', connectionTest.error);
      return;
    }
    
    // 2. Verificar si existen empleados
    console.log('\n2️⃣ Verificando existencia de empleados...');
    const existsTest = await empleadosApiService.checkEmpleadosExists();
    console.log('Empleados encontrados:', existsTest.count);
    console.log('Tiene empleados:', existsTest.hasEmpleados ? '✅ Sí' : '❌ No');
    
    // 3. Obtener todos los empleados
    console.log('\n3️⃣ Obteniendo todos los empleados...');
    const allEmpleados = await empleadosApiService.getAllEmpleados();
    console.log('Resultado:', allEmpleados.success ? '✅ Exitoso' : '❌ Error');
    
    if (allEmpleados.success) {
      console.log('Cantidad de empleados:', allEmpleados.data.length);
      console.log('Primer empleado:', allEmpleados.data[0] || 'No hay empleados');
    } else {
      console.error('Error:', allEmpleados.message);
    }
    
    // 4. Probar descarga de reporte (opcional)
    console.log('\n4️⃣ Probando descarga de reporte...');
    const reportTest = await empleadosApiService.downloadReporteExcel();
    console.log('Resultado:', reportTest.success ? '✅ Exitoso' : '❌ Error');
    
    if (!reportTest.success) {
      console.log('Nota: El reporte puede fallar si no hay empleados o permisos');
    }
    
    console.log('\n🎉 Pruebas completadas!');
    
  } catch (error) {
    console.error('💥 Error durante las pruebas:', error);
  }
};

// Ejecutar pruebas si se llama directamente
if (typeof window !== 'undefined') {
  // En el navegador
  window.testEmpleadosAPI = testEmpleadosAPI;
  console.log('🔧 Función de prueba disponible como: window.testEmpleadosAPI()');
} else {
  // En Node.js
  testEmpleadosAPI();
}

export default testEmpleadosAPI;
