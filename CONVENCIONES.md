# Convenciones del Proyecto RegistrackFrontend

## 📁 Estructura de Archivos

### Nomenclatura
- **Componentes**: PascalCase (ej: `FormularioBase.jsx`)
- **Archivos de servicios**: camelCase (ej: `authService.js`)
- **Carpetas**: kebab-case (ej: `gestion-ventas-servicios`)

### Organización
```
src/
├── features/           # Funcionalidades principales
│   ├── auth/          # Autenticación
│   ├── dashboard/     # Panel de administración
│   └── landing/       # Página principal
├── shared/            # Componentes compartidos
├── utils/             # Utilidades y constantes
└── routes/            # Configuración de rutas
```

## 🛣️ Rutas

### Convención
- **Rutas públicas**: kebab-case
- **Rutas de admin**: `/admin/` + kebab-case
- **Rutas de formularios**: `/formulario/` + kebab-case

### Ejemplos
```javascript
/pages/busqueda
/pages/presentacion-oposicion
/pages/cesion-marca
/admin/gestion-usuarios
/formulario/certificacion
```

## 📝 Nombres de Servicios

### Estandarizados
- "Búsqueda de Antecedentes"
- "Certificación de Marca"
- "Renovación de Marca"
- "Presentación de Oposición"
- "Cesión de Marca"
- "Ampliación de Alcance"

## 🔧 Imports

### Reglas
1. **Siempre usar rutas relativas**
2. **No usar rutas absolutas hardcodeadas**
3. **Usar alias cuando sea posible**

### Ejemplos Correctos
```javascript
import Component from '../components/Component';
import { SERVICIOS } from '../../utils/constants';
```

### Ejemplos Incorrectos
```javascript
import Component from "/Users/username/project/src/components/Component";
```

## 🎨 Estilos

### CSS Classes
- **Tailwind CSS** como framework principal
- **Bootstrap** para componentes específicos
- **Clases personalizadas** en camelCase

## 📊 Estados de Proceso

### Formato Estandarizado
```javascript
{
  id: "1",
  name: "Solicitud Recibida",
  order: 1,
  status_key: "recibida"
}
```

## 🔐 Autenticación

### Roles
- `admin`: Administrador del sistema
- `usuario`: Usuario regular
- `empleado`: Empleado de la empresa

## 📋 Tipos de Documento

### Estandarizados
- "Cédula de Ciudadanía"
- "Pasaporte"
- "DNI"
- "Tarjeta de Identidad"
- "NIT"

## 🚀 Scripts Disponibles

```bash
npm run dev      # Desarrollo
npm run build    # Producción
npm run lint     # Linting
npm run preview  # Vista previa
```

## 📝 Notas Importantes

1. **Mantener consistencia** en nombres y rutas
2. **Usar constantes** del archivo `utils/constants.js`
3. **Documentar cambios** importantes
4. **Seguir las convenciones** establecidas 