#!/usr/bin/env node

/**
 * Script de verificación para la migración de mock data
 * Verifica que todos los componentes usen la data mock centralizada
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logBold(message) {
  log(`${message}`, 'bold');
}

// Función para leer archivos de forma segura
function readFileSafely(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

// Función para buscar patrones en archivos
function searchPatternInFile(filePath, patterns) {
  const content = readFileSafely(filePath);
  if (!content) return [];
  
  const results = [];
  patterns.forEach(pattern => {
    if (content.includes(pattern)) {
      results.push(pattern);
    }
  });
  
  return results;
}

// Función para verificar imports problemáticos
function checkProblematicImports(filePath) {
  const problematicPatterns = [
    'getFromStorage',
    'setToStorage',
    'getServicios',
    'getVentasEnProceso',
    'getVentasFinalizadas',
    'getUsuarios',
    'getClientes',
    'getEmpleados',
    'getPagos',
    'getCitas',
    'getRolesPermisos'
  ];
  
  return searchPatternInFile(filePath, problematicPatterns);
}

// Función para verificar imports correctos
function checkCorrectImports(filePath) {
  const correctPatterns = [
    'mockDataService',
    'UserService',
    'ClientService',
    'SaleService',
    'ServiceService',
    'EmployeeService',
    'PaymentService',
    'AppointmentService',
    'RoleService'
  ];
  
  return searchPatternInFile(filePath, correctPatterns);
}

// Función para verificar si un archivo es un componente React
function isReactComponent(filePath) {
  return filePath.endsWith('.jsx') || filePath.endsWith('.js');
}

// Función para verificar si un archivo es un servicio
function isService(filePath) {
  return filePath.includes('services/') || filePath.includes('service');
}

// Función principal de verificación
function verifyMockDataMigration() {
  logBold('\n🔍 VERIFICACIÓN DE MIGRACIÓN DE MOCK DATA\n');
  
  const srcPath = path.join(__dirname, '..', 'src');
  const issues = [];
  const successes = [];
  const warnings = [];
  
  // Recorrer todos los archivos en src
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (isReactComponent(filePath) || isService(filePath)) {
        const relativePath = path.relative(process.cwd(), filePath);
        
        // Verificar imports problemáticos
        const problematicImports = checkProblematicImports(filePath);
        const correctImports = checkCorrectImports(filePath);
        
        if (problematicImports.length > 0) {
          issues.push({
            file: relativePath,
            problematic: problematicImports,
            correct: correctImports
          });
        } else if (correctImports.length > 0) {
          successes.push({
            file: relativePath,
            imports: correctImports
          });
        } else if (isService(filePath)) {
          warnings.push({
            file: relativePath,
            message: 'Servicio sin imports de mockDataService detectados'
          });
        }
      }
    });
  }
  
  try {
    walkDir(srcPath);
  } catch (error) {
    logError(`Error al recorrer el directorio: ${error.message}`);
    return;
  }
  
  // Mostrar resultados
  if (issues.length === 0) {
    logSuccess('No se encontraron imports problemáticos');
  } else {
    logError(`Se encontraron ${issues.length} archivos con imports problemáticos:`);
    issues.forEach(issue => {
      logError(`  📁 ${issue.file}`);
      logError(`     ❌ Imports problemáticos: ${issue.problematic.join(', ')}`);
      if (issue.correct.length > 0) {
        logInfo(`     ✅ Imports correctos: ${issue.correct.join(', ')}`);
      }
    });
  }
  
  if (successes.length > 0) {
    logSuccess(`\n${successes.length} archivos usando correctamente mockDataService:`);
    successes.forEach(success => {
      logSuccess(`  📁 ${success.file}`);
      logInfo(`     ✅ Imports: ${success.imports.join(', ')}`);
    });
  }
  
  if (warnings.length > 0) {
    logWarning(`\n${warnings.length} servicios sin imports detectados:`);
    warnings.forEach(warning => {
      logWarning(`  📁 ${warning.file}`);
      logInfo(`     ℹ️  ${warning.message}`);
    });
  }
  
  // Resumen final
  logBold('\n📊 RESUMEN DE VERIFICACIÓN');
  logInfo(`Total de archivos verificados: ${issues.length + successes.length + warnings.length}`);
  logSuccess(`Archivos con imports correctos: ${successes.length}`);
  logError(`Archivos con imports problemáticos: ${issues.length}`);
  logWarning(`Servicios sin imports detectados: ${warnings.length}`);
  
  if (issues.length === 0) {
    logSuccess('\n🎉 ¡Migración completada exitosamente!');
    logInfo('Todos los componentes están usando la data mock centralizada.');
  } else {
    logError('\n⚠️  Se encontraron problemas que requieren atención.');
    logInfo('Revisa los archivos listados arriba y actualiza sus imports.');
  }
  
  logBold('\n' + '='.repeat(50));
}

// Ejecutar verificación
verifyMockDataMigration(); 