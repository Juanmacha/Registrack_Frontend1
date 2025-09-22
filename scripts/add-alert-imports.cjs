// Script para agregar importaciones de AlertService a archivos que las necesiten
const fs = require("fs");
const path = require("path");

// Función para agregar importación de AlertService
function addAlertServiceImport(content, filePath) {
  // Verificar si ya tiene la importación
  if (content.includes("AlertService") || content.includes("alertStandards")) {
    return { content, modified: false };
  }

  // Verificar si usa AlertService en el código
  if (!content.includes("AlertService.")) {
    return { content, modified: false };
  }

  // Calcular la ruta relativa al archivo de alertStandards
  const relativePath = calculateRelativePath(filePath);

  // Buscar la primera importación existente
  const importMatch = content.match(
    /^import\s+.*?from\s+['"`][^'"`]+['"`];?\s*$/m
  );

  if (importMatch) {
    // Agregar después de la primera importación
    const newImport = `import { AlertService } from '${relativePath}';`;
    const newContent = content.replace(
      importMatch[0],
      `${importMatch[0]}\n${newImport}`
    );
    return { content: newContent, modified: true };
  } else {
    // Agregar al inicio del archivo
    const newImport = `import { AlertService } from '${relativePath}';\n`;
    return { content: newImport + content, modified: true };
  }
}

// Función para calcular la ruta relativa
function calculateRelativePath(filePath) {
  const srcDir = path.join(__dirname, "..", "src");
  const relativePath = path.relative(
    path.dirname(filePath),
    path.join(srcDir, "shared", "styles", "alertStandards.js")
  );

  // Convertir separadores de Windows a Unix
  return relativePath.replace(/\\/g, "/");
}

// Función para procesar un archivo
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const result = addAlertServiceImport(content, filePath);

    if (result.modified) {
      fs.writeFileSync(filePath, result.content);
      console.log(`✅ Importación agregada: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Función para buscar archivos recursivamente
function findFiles(dir, extensions = [".js", ".jsx"]) {
  let files = [];

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (
        stat.isDirectory() &&
        !item.startsWith(".") &&
        item !== "node_modules"
      ) {
        files = files.concat(findFiles(fullPath, extensions));
      } else if (
        stat.isFile() &&
        extensions.some((ext) => item.endsWith(ext))
      ) {
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
  console.log("📦 Agregando importaciones de AlertService...\n");

  const srcDir = path.join(__dirname, "..", "src");
  const files = findFiles(srcDir);

  let updatedCount = 0;

  for (const file of files) {
    if (processFile(file)) {
      updatedCount++;
    }
  }

  console.log(
    `\n✨ Proceso completado. ${updatedCount} archivos actualizados con importaciones.`
  );
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { addAlertServiceImport, processFile, findFiles };




