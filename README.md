# 🏢 RegistrackFrontend - Sistema de Gestión de Marcas y Servicios

## 📋 Descripción General

**RegistrackFrontend** es una aplicación web desarrollada en React que proporciona un sistema completo de gestión para empresas especializadas en servicios de marcas, incluyendo certificación, renovación, oposición, cesión y ampliación de alcance. La aplicación está diseñada para manejar tanto la gestión administrativa interna como la interacción con clientes.

## 🚀 Características Principales

### 🎯 Funcionalidades del Sistema
- **Gestión de Usuarios**: Sistema de roles (Administrador, Empleado, Cliente) con permisos granulares
- **Gestión de Servicios**: 7 tipos de servicios especializados en marcas
- **Sistema de Citas**: Calendario interactivo para programar citas con clientes
- **Gestión de Pagos**: Control de transacciones y estados de pago
- **Dashboard Administrativo**: Panel completo con estadísticas y reportes
- **Sistema de Sincronización**: Actualización en tiempo real entre componentes
- **Responsive Design**: Optimizado para todos los dispositivos

### 🛠️ Tecnologías Utilizadas
- **Frontend**: React 18.3.1 + Vite 6.3.5
- **Estilos**: Tailwind CSS 3.4.17 + Bootstrap 5.3.7
- **Gráficas**: Chart.js 4.5.0 + React-Chartjs-2
- **Calendario**: FullCalendar 6.1.17
- **Formularios**: Formik 2.4.6 + Yup 1.6.1
- **Alertas**: SweetAlert2 11.22.2
- **Testing**: Jest 29.7.0 + React Testing Library
- **Iconos**: React Icons 5.5.0 + Lucide React 0.522.0

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 16.0 o superior
- npm 7.0 o superior

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Navegar al directorio
cd Registrack_Frontend1

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Vista previa del build
npm run lint         # Linter de código
npm test             # Tests unitarios
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con cobertura
```

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios
```
src/
├── features/                    # Funcionalidades principales
│   ├── auth/                   # Autenticación y autorización
│   ├── dashboard/              # Panel administrativo
│   └── landing/                # Página principal
├── shared/                     # Componentes compartidos
│   ├── components/             # Componentes reutilizables
│   ├── layouts/                # Layouts base
│   └── utils/                  # Utilidades compartidas
├── utils/                      # Servicios y utilidades centrales
│   ├── hooks/                  # Hooks personalizados
│   ├── mockData.js             # Datos mock centralizados
│   └── mockDataService.js      # Servicios de datos
└── routes/                     # Configuración de rutas
```

### Sistema de Datos Centralizado
El proyecto utiliza un sistema centralizado de datos mock que incluye:
- **Usuarios**: 6 usuarios con diferentes roles
- **Empleados**: 6 empleados con información completa
- **Clientes**: 8 clientes con datos empresariales
- **Ventas**: 15 ventas en proceso y finalizadas
- **Pagos**: 12 pagos con diferentes estados
- **Citas**: 8 citas programadas
- **Servicios**: 7 servicios disponibles
- **Roles**: 3 roles con permisos granulares

## 👥 Sistema de Roles y Permisos

### Roles Disponibles

#### 🔑 Administrador
- **Acceso**: Completo al sistema
- **Permisos**: Todas las operaciones CRUD en todos los módulos
- **Funcionalidades**: Gestión de usuarios, empleados, clientes, ventas, pagos, citas, roles, reportes y configuración

#### 👨‍💼 Empleado
- **Acceso**: Dashboard con permisos limitados
- **Permisos**: Gestión de clientes y servicios, lectura de reportes
- **Restricciones**: No puede gestionar usuarios, empleados, roles o configuración

#### 👤 Cliente
- **Acceso**: Solo página principal
- **Permisos**: Consulta de sus propios procesos y pagos, creación de citas
- **Restricciones**: No puede acceder al dashboard administrativo

### Credenciales de Prueba

#### Administradores
- **Email**: `juan.perez@example.com` | **Contraseña**: `123456`
- **Email**: `laura.torres@example.com` | **Contraseña**: `securepass`
- **Email**: `santiago.guerrero@example.com` | **Contraseña**: `santi123`

#### Empleados
- **Email**: `maria.garcia@example.com` | **Contraseña**: `empleado123`
- **Email**: `carlos.rodriguez@example.com` | **Contraseña**: `carlos123`

#### Clientes
- **Email**: `carlos.lopez@example.com` | **Contraseña**: `cliente123`
- **Email**: `ana.martinez@example.com` | **Contraseña**: `ana123`

## 🎨 Servicios Disponibles

### 1. Búsqueda de Antecedentes
- Búsqueda de marcas existentes
- Verificación de disponibilidad
- Análisis de conflictos

### 2. Certificación de Marca
- Proceso de certificación oficial
- Documentación requerida
- Seguimiento de estado

### 3. Renovación de Marca
- Renovación de marcas existentes
- Actualización de datos
- Proceso simplificado

### 4. Presentación de Oposición
- Oposición a marcas en trámite
- Documentación legal
- Seguimiento del proceso

### 5. Cesión de Marca
- Transferencia de propiedad
- Documentación notarial
- Actualización de registros

### 6. Ampliación de Alcance
- Extensión de cobertura
- Nuevas clases de productos
- Actualización de registro

### 7. Respuesta a Trámites
- Respuesta a requerimientos oficiales
- Documentación complementaria
- Seguimiento de plazos

## 🔄 Sistema de Sincronización

### Características
- **Actualización en Tiempo Real**: Los cambios se reflejan inmediatamente en todas las vistas
- **Notificaciones Automáticas**: Sistema de notificación centralizado
- **Hooks Especializados**: `useSalesSync`, `useEmployeesSync`, `useClientsSync`
- **DataChangeNotifier**: Servicio centralizado para notificar cambios

### Componentes Sincronizados
- Tabla de ventas en proceso
- Página "Mis Procesos"
- Dashboard administrativo
- Gestión de citas
- Sistema de pagos

## 📱 Diseño Responsivo

### Breakpoints Implementados
- **Móviles**: 320px - 480px
- **Tablets**: 481px - 768px
- **Laptops**: 769px - 1024px
- **Desktop**: 1025px - 1440px
- **Pantallas Grandes**: 1441px+

### Características Responsivas
- **Gráficas Adaptativas**: Tamaños optimizados por dispositivo
- **Tablas con Scroll**: Navegación horizontal en móviles
- **Sidebar Inteligente**: Se colapsa en móviles, se expande en hover
- **Formularios Optimizados**: Campos apilados en móviles
- **Modales Responsivos**: Tamaños adaptativos con scroll

## 🧪 Testing

### Configuración
El proyecto incluye configuración completa de testing con:
- **Jest**: Framework de testing
- **React Testing Library**: Testing de componentes
- **Coverage**: Cobertura de código configurada

### Comandos de Testing
```bash
npm test                    # Ejecutar todos los tests
npm run test:watch         # Tests en modo watch
npm run test:coverage      # Tests con cobertura
npm run test:ci            # Tests para CI/CD
```

### Cobertura Objetivo
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## 🎯 Funcionalidades Avanzadas

### Sistema de Alertas
- **SweetAlert2**: Alertas modernas y personalizables
- **Tipos**: Éxito, error, advertencia, información, confirmación
- **Especializadas**: Login, registro, eliminación, validación
- **Responsive**: Adaptadas a todos los dispositivos

### Gestión de Formularios
- **Formik + Yup**: Validación robusta
- **Validaciones Centralizadas**: Servicio de validación unificado
- **Campos Responsivos**: Adaptación automática por dispositivo
- **Feedback Visual**: Estados de validación claros

### Sistema de Exportación
- **Excel**: Exportación a archivos .xlsx
- **PDF**: Generación de documentos PDF
- **Datos Filtrados**: Exportación de datos específicos
- **Formato Personalizado**: Configuración de columnas

## 📊 Estado del Proyecto

### ✅ Funcionalidades Completadas
- [x] Sistema de autenticación y autorización
- [x] Gestión completa de usuarios, empleados y clientes
- [x] Sistema de citas con calendario interactivo
- [x] Gestión de ventas y servicios
- [x] Sistema de pagos y transacciones
- [x] Dashboard administrativo completo
- [x] Diseño responsive para todos los dispositivos
- [x] Sistema de sincronización en tiempo real
- [x] Validaciones centralizadas
- [x] Sistema de alertas personalizado
- [x] Testing configurado y funcional

### 🔄 En Desarrollo
- [ ] Optimizaciones de performance
- [ ] Tests unitarios adicionales
- [ ] Documentación de API
- [ ] Mejoras de accesibilidad

### 🎯 Próximas Funcionalidades
- [ ] Dark mode
- [ ] Notificaciones push
- [ ] Integración con APIs reales
- [ ] Sistema de reportes avanzado
- [ ] Auditoría de acciones

## 🚨 Solución de Problemas

### Problemas Comunes

#### Error de Importación
```bash
# Verificar que las rutas de importación sean correctas
grep -r "import.*mockDataService" src/
```

#### Problemas de Sincronización
```bash
# Verificar logs en la consola del navegador
# Buscar mensajes que empiecen con [DataChangeNotifier]
```

#### Problemas de Responsive
```bash
# Verificar que el CSS responsive esté importado
# Revisar las clases de Tailwind utilizadas
```

### Comandos de Diagnóstico
```bash
# Verificar dependencias
npm audit

# Verificar linting
npm run lint

# Verificar tests
npm test

# Verificar build
npm run build
```

## 📚 Documentación Adicional

### Archivos de Documentación
- `ALERTAS_CITAS.md` - Guía del sistema de alertas para citas
- `CAMBIOS_AUTENTICACION.md` - Cambios en el sistema de autenticación
- `CONVENCIONES.md` - Convenciones de código del proyecto
- `GUIA_ALERTAS.md` - Guía completa de SweetAlert2
- `MOCK_DATA_GUIDE.md` - Guía del sistema de datos mock
- `ROLES_EMPLEADOS_GUIDE.md` - Guía del sistema de roles
- `TESTS_UNITARIOS_GUIDE.md` - Guía de testing

### Scripts de Utilidad
- `scripts/verify-mock-data-migration.js` - Verificación de migración de datos
- `scripts/add-alert-imports.cjs` - Script para agregar imports de alertas
- `scripts/fix-swal-modals.cjs` - Script para corregir modales

## 🤝 Contribución

### Guías de Contribución
1. **Fork** el repositorio
2. **Crear** una rama para la funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** un Pull Request

### Estándares de Código
- Usar **ESLint** para mantener consistencia
- Seguir las **convenciones** establecidas
- Escribir **tests** para nuevas funcionalidades
- Documentar **cambios importantes**

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Desarrollado por

**Equipo de Desarrollo RegistrackFrontend**
- **Versión**: 1.0.0
- **Última actualización**: 2025-01-27
- **Estado**: En desarrollo activo

---

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto:
- **Email**: soporte@registrack.com
- **Documentación**: Ver archivos .md en el directorio raíz
- **Issues**: Usar el sistema de issues de GitHub

---

*Este README se actualiza regularmente. Para la versión más reciente, consulta el repositorio.*
