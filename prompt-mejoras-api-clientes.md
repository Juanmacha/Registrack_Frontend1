# 🚀 Prompt para Implementar Mejoras en la API de Clientes

## 📋 Contexto del Proyecto

Estoy trabajando en una API REST para gestión de servicios legales (Registrack) que maneja usuarios, clientes, empresas y solicitudes de servicios. Actualmente tengo un problema en el flujo de registro de clientes:

**Problema actual:**
- Los usuarios se registran solo con datos básicos (nombre, apellido, email, documento)
- Los datos adicionales del cliente (marca, empresa, etc.) se completan solo cuando hacen una solicitud
- Esto causa inconsistencias y datos incompletos en la gestión de clientes

**Objetivo:**
Implementar un sistema de perfil de cliente gradual que permita:
1. Registro inicial con datos básicos
2. Completar perfil del cliente de forma progresiva
3. Actualizar datos del cliente durante las solicitudes
4. Validar estado del perfil antes de crear solicitudes

## 🔌 Endpoints a Implementar

### 1. Completar Perfil del Cliente
```http
PUT /api/gestion-clientes/:id/completar-perfil
```

**Body:**
```json
{
  "marca": "string",
  "tipo_persona": "string",
  "empresa": {
    "nombre": "string",
    "nit": "string",
    "tipo_empresa": "string",
    "direccion": "string",
    "telefono": "string",
    "correo": "string"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Perfil completado exitosamente",
  "data": {
    "cliente": {
      "id_cliente": 1,
      "id_usuario": 1,
      "marca": "MiMarca",
      "tipo_persona": "Jurídica",
      "estado": true,
      "usuario": {
        "nombre": "Juan",
        "apellido": "Pérez",
        "correo": "juan@example.com"
      },
      "empresas": [
        {
          "id_empresa": 1,
          "nombre": "Mi Empresa SAS",
          "nit": "900123456-1",
          "tipo_empresa": "Sociedad por Acciones Simplificada"
        }
      ]
    }
  }
}
```

### 2. Obtener Estado del Perfil
```http
GET /api/gestion-clientes/estado-perfil
```

**Respuesta:**
```json
{
  "perfil_completo": false,
  "datos_faltantes": ["marca", "empresa"],
  "progreso": 60,
  "cliente": {
    "id_cliente": 1,
    "marca": "Pendiente",
    "tipo_persona": "Pendiente",
    "empresa": null
  }
}
```

### 3. Obtener Mi Perfil Completo
```http
GET /api/gestion-clientes/mi-perfil
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "cliente": {
      "id_cliente": 1,
      "id_usuario": 1,
      "marca": "MiMarca",
      "tipo_persona": "Jurídica",
      "estado": true,
      "usuario": {
        "nombre": "Juan",
        "apellido": "Pérez",
        "correo": "juan@example.com",
        "tipo_documento": "CC",
        "documento": "12345678"
      },
      "empresas": [
        {
          "id_empresa": 1,
          "nombre": "Mi Empresa SAS",
          "nit": "900123456-1",
          "tipo_empresa": "Sociedad por Acciones Simplificada",
          "direccion": "Calle 123 #45-67",
          "telefono": "3001234567",
          "correo": "empresa@example.com"
        }
      ]
    }
  }
}
```

### 4. Actualizar Cliente
```http
PUT /api/gestion-clientes/:id/actualizar
```

**Body:**
```json
{
  "marca": "string",
  "tipo_persona": "string",
  "estado": true
}
```

### 5. Obtener Historial de Cliente
```http
GET /api/gestion-clientes/:id/historial
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "historial": [
      {
        "fecha": "2024-01-15T10:30:00.000Z",
        "accion": "Perfil completado",
        "campos_actualizados": ["marca", "tipo_persona", "empresa"],
        "usuario": "Juan Pérez"
      }
    ]
  }
}
```

## 🔧 Modificaciones en Endpoints Existentes

### Modificar Sistema de Solicitudes
```http
POST /api/gestion-solicitudes/crear/:servicio
```

**Lógica mejorada:**
1. Si el cliente ya existe → Actualizar datos faltantes
2. Si el cliente no existe → Crear nuevo cliente básico
3. Si la empresa ya existe → Asociar cliente existente
4. Si la empresa no existe → Crear nueva empresa

## 📝 Implementación Técnica

### 1. Controlador de Clientes
```javascript
// src/controllers/cliente.controller.js

const completarPerfilCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { marca, tipo_persona, empresa } = req.body;
    
    // Buscar cliente existente
    const cliente = await Cliente.findByPk(id, {
      include: [Usuario, Empresa]
    });
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }
    
    // Actualizar datos del cliente
    await cliente.update({
      marca: marca || cliente.marca,
      tipo_persona: tipo_persona || cliente.tipo_persona
    });
    
    // Crear o actualizar empresa si se proporciona
    if (empresa) {
      let empresaCliente;
      
      // Buscar empresa existente por NIT
      empresaCliente = await Empresa.findOne({
        where: { nit: empresa.nit }
      });
      
      if (empresaCliente) {
        // Actualizar empresa existente
        await empresaCliente.update(empresa);
      } else {
        // Crear nueva empresa
        empresaCliente = await Empresa.create(empresa);
      }
      
      // Asociar cliente con empresa
      await cliente.setEmpresa(empresaCliente);
    }
    
    // Obtener cliente actualizado
    const clienteActualizado = await Cliente.findByPk(id, {
      include: [Usuario, Empresa]
    });
    
    res.json({
      success: true,
      message: 'Perfil completado exitosamente',
      data: {
        cliente: clienteActualizado
      }
    });
    
  } catch (error) {
    console.error('Error al completar perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

const obtenerEstadoPerfil = async (req, res) => {
  try {
    const { id_usuario } = req.user;
    
    const cliente = await Cliente.findOne({
      where: { id_usuario },
      include: [Usuario, Empresa]
    });
    
    if (!cliente) {
      return res.json({
        perfil_completo: false,
        datos_faltantes: ['marca', 'tipo_persona', 'empresa'],
        progreso: 0,
        cliente: null
      });
    }
    
    const datosFaltantes = [];
    let progreso = 0;
    
    // Verificar datos del cliente
    if (!cliente.marca || cliente.marca === 'Pendiente') {
      datosFaltantes.push('marca');
    } else {
      progreso += 25;
    }
    
    if (!cliente.tipo_persona || cliente.tipo_persona === 'Pendiente') {
      datosFaltantes.push('tipo_persona');
    } else {
      progreso += 25;
    }
    
    // Verificar datos de la empresa
    if (!cliente.empresas || cliente.empresas.length === 0) {
      datosFaltantes.push('empresa');
    } else {
      const empresa = cliente.empresas[0];
      if (!empresa.nombre || empresa.nombre === 'Pendiente') {
        datosFaltantes.push('empresa.nombre');
      } else {
        progreso += 25;
      }
      
      if (!empresa.nit || empresa.nit === 'Pendiente') {
        datosFaltantes.push('empresa.nit');
      } else {
        progreso += 25;
      }
    }
    
    res.json({
      perfil_completo: datosFaltantes.length === 0,
      datos_faltantes: datosFaltantes,
      progreso: progreso,
      cliente: {
        id_cliente: cliente.id_cliente,
        marca: cliente.marca,
        tipo_persona: cliente.tipo_persona,
        empresa: cliente.empresas && cliente.empresas.length > 0 ? cliente.empresas[0] : null
      }
    });
    
  } catch (error) {
    console.error('Error al obtener estado del perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

const obtenerMiPerfil = async (req, res) => {
  try {
    const { id_usuario } = req.user;
    
    const cliente = await Cliente.findOne({
      where: { id_usuario },
      include: [Usuario, Empresa]
    });
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: {
        cliente: cliente
      }
    });
    
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { marca, tipo_persona, estado } = req.body;
    
    const cliente = await Cliente.findByPk(id, {
      include: [Usuario, Empresa]
    });
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado'
      });
    }
    
    // Actualizar datos del cliente
    await cliente.update({
      marca: marca || cliente.marca,
      tipo_persona: tipo_persona || cliente.tipo_persona,
      estado: estado !== undefined ? estado : cliente.estado
    });
    
    // Obtener cliente actualizado
    const clienteActualizado = await Cliente.findByPk(id, {
      include: [Usuario, Empresa]
    });
    
    res.json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: {
        cliente: clienteActualizado
      }
    });
    
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

const obtenerHistorialCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
    const historial = await HistorialCliente.findAll({
      where: { id_cliente: id },
      include: [Usuario],
      order: [['fecha_accion', 'DESC']]
    });
    
    res.json({
      success: true,
      data: {
        historial: historial
      }
    });
    
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
```

### 2. Modificar Controlador de Solicitudes
```javascript
// src/controllers/solicitudes.controller.js

const crearSolicitud = async (req, res) => {
  try {
    const { servicio } = req.params;
    const datosSolicitud = req.body;
    const { id_usuario } = req.user;
    
    // Buscar o crear cliente
    let cliente = await Cliente.findOne({
      where: { id_usuario },
      include: [Usuario, Empresa]
    });
    
    if (!cliente) {
      // Crear cliente básico
      cliente = await Cliente.create({
        id_usuario,
        marca: datosSolicitud.marca || 'Pendiente',
        tipo_persona: datosSolicitud.tipo_persona || 'Pendiente',
        estado: true
      });
    } else {
      // Actualizar datos del cliente si se proporcionan
      const datosActualizacion = {};
      
      if (datosSolicitud.marca && datosSolicitud.marca !== 'Pendiente') {
        datosActualizacion.marca = datosSolicitud.marca;
      }
      if (datosSolicitud.tipo_persona && datosSolicitud.tipo_persona !== 'Pendiente') {
        datosActualizacion.tipo_persona = datosSolicitud.tipo_persona;
      }
      
      if (Object.keys(datosActualizacion).length > 0) {
        await cliente.update(datosActualizacion);
      }
    }
    
    // Buscar o crear empresa
    let empresa;
    if (datosSolicitud.nit || datosSolicitud.nombre_empresa) {
      empresa = await Empresa.findOne({
        where: { nit: datosSolicitud.nit }
      });
      
      if (!empresa) {
        empresa = await Empresa.create({
          nombre: datosSolicitud.nombre_empresa || 'Pendiente',
          nit: datosSolicitud.nit || 'Pendiente',
          tipo_empresa: datosSolicitud.tipo_empresa || 'Sociedad por Acciones Simplificada',
          direccion: datosSolicitud.direccion_empresa,
          telefono: datosSolicitud.telefono_empresa,
          correo: datosSolicitud.correo_empresa
        });
      }
      
      // Asociar cliente con empresa
      await cliente.setEmpresa(empresa);
    }
    
    // Resto de la lógica de creación de solicitud...
    
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
```

### 3. Nuevas Rutas
```javascript
// src/routes/cliente.routes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {
  completarPerfilCliente,
  obtenerEstadoPerfil,
  obtenerMiPerfil,
  actualizarCliente,
  obtenerHistorialCliente
} = require('../controllers/cliente.controller');

// Rutas protegidas
router.put('/:id/completar-perfil', authMiddleware, completarPerfilCliente);
router.get('/estado-perfil', authMiddleware, obtenerEstadoPerfil);
router.get('/mi-perfil', authMiddleware, obtenerMiPerfil);
router.put('/:id/actualizar', authMiddleware, actualizarCliente);
router.get('/:id/historial', authMiddleware, obtenerHistorialCliente);

module.exports = router;
```

## 🔧 Validaciones Requeridas

### 1. Validación de Datos
```javascript
const { body, validationResult } = require('express-validator');

const validarCompletarPerfil = [
  body('marca').optional().isString().isLength({ min: 2, max: 100 }),
  body('tipo_persona').optional().isIn(['Natural', 'Jurídica']),
  body('empresa.nombre').optional().isString().isLength({ min: 2, max: 100 }),
  body('empresa.nit').optional().isString().isLength({ min: 8, max: 20 }),
  body('empresa.tipo_empresa').optional().isString(),
  body('empresa.direccion').optional().isString(),
  body('empresa.telefono').optional().isString(),
  body('empresa.correo').optional().isEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos de validación incorrectos',
        details: errors.array()
      });
    }
    next();
  }
];
```

## 📊 Estructura de Base de Datos

### Tabla Clientes
```sql
CREATE TABLE clientes (
  id_cliente INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  marca VARCHAR(100) DEFAULT 'Pendiente',
  tipo_persona ENUM('Natural', 'Jurídica') DEFAULT 'Pendiente',
  estado BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
```

### Tabla Historial Clientes
```sql
CREATE TABLE historial_clientes (
  id_historial INT PRIMARY KEY AUTO_INCREMENT,
  id_cliente INT NOT NULL,
  accion VARCHAR(100) NOT NULL,
  campos_actualizados JSON,
  fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_usuario_accion INT,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
  FOREIGN KEY (id_usuario_accion) REFERENCES usuarios(id_usuario)
);
```

## 🎯 Beneficios del Sistema

### Para el Usuario:
- ✅ **Registro simple**: Solo datos básicos al registrarse
- ✅ **Completar gradualmente**: Puede completar su perfil cuando quiera
- ✅ **Validación inteligente**: Le dice qué datos faltan
- ✅ **Progreso visible**: Ve qué porcentaje de su perfil está completo

### Para el Sistema:
- ✅ **Datos consistentes**: Evita duplicados y datos inconsistentes
- ✅ **Flexibilidad**: Permite diferentes flujos de registro
- ✅ **Trazabilidad**: Historial de cambios del cliente
- ✅ **Validación robusta**: Verifica datos antes de crear solicitudes

### Para el Negocio:
- ✅ **Mejor UX**: Proceso más amigable para el usuario
- ✅ **Datos completos**: Información más precisa de los clientes
- ✅ **Análisis mejorado**: Mejor comprensión del perfil del cliente
- ✅ **Escalabilidad**: Fácil agregar nuevos campos de perfil

## 🚀 Orden de Implementación

1. **Semana 1**: Endpoints básicos de perfil de cliente
2. **Semana 2**: Modificar sistema de solicitudes
3. **Semana 3**: Endpoints de estado y validación
4. **Semana 4**: Testing y optimización

## 📝 Notas Importantes

- Mantener compatibilidad con el sistema actual
- Implementar validaciones robustas
- Agregar logging detallado para debugging
- Crear documentación actualizada
- Implementar tests unitarios y de integración

## 🔗 Ejemplos de Uso

### Completar Perfil de Cliente
```bash
curl -X PUT "http://localhost:3000/api/gestion-clientes/1/completar-perfil" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "marca": "MiMarcaEmpresarial",
    "tipo_persona": "Jurídica",
    "empresa": {
      "nombre": "Mi Empresa SAS",
      "nit": "900123456-1",
      "tipo_empresa": "Sociedad por Acciones Simplificada",
      "direccion": "Calle 123 #45-67",
      "telefono": "3001234567",
      "correo": "empresa@example.com"
    }
  }'
```

### Obtener Estado del Perfil
```bash
curl -X GET "http://localhost:3000/api/gestion-clientes/estado-perfil" \
  -H "Authorization: Bearer <TOKEN>"
```

### Obtener Mi Perfil
```bash
curl -X GET "http://localhost:3000/api/gestion-clientes/mi-perfil" \
  -H "Authorization: Bearer <TOKEN>"
```

### Actualizar Cliente
```bash
curl -X PUT "http://localhost:3000/api/gestion-clientes/1/actualizar" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "marca": "MiMarcaActualizada",
    "tipo_persona": "Natural",
    "estado": true
  }'
```

### Obtener Historial
```bash
curl -X GET "http://localhost:3000/api/gestion-clientes/1/historial" \
  -H "Authorization: Bearer <TOKEN>"
```

---

**Fecha de creación**: Enero 2024  
**Versión**: 1.0  
**Estado**: Listo para implementación
