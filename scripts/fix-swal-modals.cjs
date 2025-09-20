// Script para estandarizar todas las alertas de SweetAlert2
const fs = require('fs');
const path = require('path');

// Función para buscar y reemplazar Swal.fire directo
function replaceSwalFire(content, filePath) {
  let modified = false;
  let newContent = content;

  // Patrón para encontrar Swal.fire con configuración
  const swalFirePattern = /Swal\.fire\(\s*\{([^}]+)\}\s*\)/g;
  
  // Reemplazar con el sistema estandarizado
  newContent = newContent.replace(swalFirePattern, (match, config) => {
    modified = true;
    
    // Extraer propiedades básicas
    const titleMatch = config.match(/title:\s*['"`]([^'"`]+)['"`]/);
    const textMatch = config.match(/text:\s*['"`]([^'"`]+)['"`]/);
    const iconMatch = config.match(/icon:\s*['"`]([^'"`]+)['"`]/);
    
    const title = titleMatch ? titleMatch[1] : '';
    const text = textMatch ? textMatch[1] : '';
    const icon = iconMatch ? iconMatch[1] : 'info';
    
    // Determinar el método de AlertService a usar
    let method = 'AlertService.info';
    switch (icon) {
      case 'success':
        method = 'AlertService.success';
        break;
      case 'error':
        method = 'AlertService.error';
        break;
      case 'warning':
        method = 'AlertService.warning';
        break;
      case 'question':
        method = 'AlertService.confirm';
        break;
      default:
        method = 'AlertService.info';
    }
    
    return `${method}("${title}", "${text}")`;
  });

  return { content: newContent, modified };
}

// Función para procesar un archivo
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = replaceSwalFire(content, filePath);
    
    if (result.modified) {
      fs.writeFileSync(filePath, result.content);
      console.log(`✅ Actualizado: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Función para buscar archivos recursivamente
function findFiles(dir, extensions = ['.js', '.jsx']) {
  let files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files = files.concat(findFiles(fullPath, extensions));
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error leyendo directorio ${dir}:`, error.message);
  }
  
  return files;
}

// Función principal
function main() {
  console.log('🔧 Estandarizando alertas de SweetAlert2...\n');
  
  const srcDir = path.join(__dirname, '..', 'src');
  const files = findFiles(srcDir);
  
  let updatedCount = 0;
  
  for (const file of files) {
    if (processFile(file)) {
      updatedCount++;
    }
  }
  
  console.log(`\n✨ Proceso completado. ${updatedCount} archivos actualizados.`);
  
  if (updatedCount > 0) {
    console.log('\n📝 Nota: Revisa los archivos actualizados para asegurar que las importaciones sean correctas.');
    console.log('   Asegúrate de importar AlertService donde sea necesario:');
    console.log('   import { AlertService } from "../shared/styles/alertStandards.js";');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { replaceSwalFire, processFile, findFiles };
