import API_CONFIG from '../../../shared/config/apiConfig';

/**
 * Servicio de API para gestión de clientes
 * Maneja las relaciones entre Usuario, Empresa y Cliente de forma inteligente
 */
class ClientesApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.endpoints = {
      CLIENTES: '/api/gestion-clientes',
      CLIENTE_BY_ID: (id) => `/api/gestion-clientes/${id}`,
      CLIENTE_REPORTE: '/api/gestion-clientes/reporte/excel'
    };
  }

  /**
   * Obtener token de autenticación del localStorage
   */
  getAuthToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }
    return token;
  }

  /**
   * Realizar petición HTTP con manejo de errores
   */
  async makeRequest(url, options = {}) {
    try {
      const token = this.getAuthToken();
      const defaultHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const config = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      };

      console.log(`🌐 [ClientesApiService] ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `Error HTTP ${response.status}`;
        let errorDetails = {};
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          errorDetails = errorData;
          console.error(`❌ [ClientesApiService] Error ${response.status} detalles:`, errorData);
        } catch (parseError) {
          const errorText = await response.text();
          console.error(`❌ [ClientesApiService] Error ${response.status} texto:`, errorText);
          errorMessage = errorText || errorMessage;
        }
        
        // Logging específico para errores 400
        if (response.status === 400) {
          console.error('❌ [ClientesApiService] Error 400 - Posibles causas:');
          console.error('   - El documento ya existe en la base de datos');
          console.error('   - El email ya está registrado');
          console.error('   - Datos faltantes o inválidos');
          console.error('   - Formato de datos incorrecto');
          console.error('   - Validaciones de la API fallidas');
        }
        
        // Logging específico para errores 500
        if (response.status === 500) {
          console.error('❌ [ClientesApiService] Error 500 - Posibles causas:');
          console.error('   - Error interno del servidor');
          console.error('   - Problema con la base de datos');
          console.error('   - Error en la lógica del backend');
          console.error('   - Datos enviados causan error en el servidor');
          console.error('❌ [ClientesApiService] Error 500 detalles:', errorMessage);
          console.error('❌ [ClientesApiService] Error 500 tipo:', typeof errorMessage);
          console.error('❌ [ClientesApiService] Error 500 JSON:', JSON.stringify(errorMessage, null, 2));
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ [ClientesApiService] Error en petición:`, error);
      throw error;
    }
  }

  /**
   * Crear clientes faltantes automáticamente para usuarios con rol cliente
   * Similar a la funcionalidad implementada en empleados
   */
  async crearClientesFaltantes(clientesExistentes) {
    try {
      console.log('🔄 [ClientesApiService] Verificando clientes faltantes...');
      
      // Obtener todos los usuarios con rol cliente (id_rol = 3)
      const usuariosResponse = await this.makeRequest(`${this.baseUrl}/api/usuarios`, { method: 'GET' });
      
      if (!usuariosResponse || !Array.isArray(usuariosResponse)) {
        console.warn('⚠️ [ClientesApiService] No se pudieron obtener usuarios para verificar clientes faltantes');
        return clientesExistentes;
      }
      
      const usuariosClientes = usuariosResponse.filter(usuario => usuario.id_rol === 3);
      console.log(`📊 [ClientesApiService] Usuarios con rol cliente encontrados: ${usuariosClientes.length}`);
      
      const clientesActualizados = [...clientesExistentes];
      let clientesCreados = 0;
      
      for (const usuario of usuariosClientes) {
        const clienteExistente = clientesExistentes.find(cliente => cliente.id_usuario === usuario.id_usuario);
        
        if (!clienteExistente) {
          console.log(`🔄 [ClientesApiService] Creando cliente faltante para usuario ${usuario.id_usuario} (${usuario.nombre} ${usuario.apellido})`);
          
          try {
            // Crear cliente automáticamente
            const nuevoCliente = await this.crearClienteAutomatico(usuario);
            if (nuevoCliente) {
              clientesActualizados.push(nuevoCliente);
              clientesCreados++;
            }
          } catch (error) {
            console.error(`❌ [ClientesApiService] Error al crear cliente automático para usuario ${usuario.id_usuario}:`, error);
          }
        }
      }
      
      if (clientesCreados > 0) {
        console.log(`✅ [ClientesApiService] Se crearon ${clientesCreados} clientes faltantes automáticamente`);
      } else {
        console.log('✅ [ClientesApiService] Todos los usuarios con rol cliente ya tienen cliente asociado');
      }
      
      return clientesActualizados;
    } catch (error) {
      console.error('❌ [ClientesApiService] Error al crear clientes faltantes:', error);
      return clientesExistentes; // Retornar clientes existentes si hay error
    }
  }

  /**
   * Crear cliente automáticamente para un usuario
   * Solo crea el registro de cliente, no el usuario (ya existe)
   */
  async crearClienteAutomatico(usuario) {
    try {
      console.log(`🔄 [ClientesApiService] Creando cliente automático para usuario ${usuario.id_usuario} (${usuario.nombre} ${usuario.apellido})`);
      
      // Intentar crear cliente solo con datos básicos primero
      const datosClienteBasico = {
        cliente: {
          id_usuario: usuario.id_usuario,
          marca: `${usuario.nombre} ${usuario.apellido}`,
          tipo_persona: 'Natural',
          estado: true,
          origen: 'directo'
        }
      };
      
      console.log('📤 [ClientesApiService] Datos del cliente automático (básico):', datosClienteBasico);
      
      try {
        // Intentar crear cliente sin empresa primero
        const response = await this.makeRequest(`${this.baseUrl}${this.endpoints.CLIENTES}`, {
          method: 'POST',
          body: JSON.stringify(datosClienteBasico)
        });
        
        console.log('✅ [ClientesApiService] Respuesta de creación automática (básica):', response);
        
        if (response && response.data && response.data.cliente) {
          console.log(`✅ [ClientesApiService] Cliente creado automáticamente (básico) para usuario ${usuario.id_usuario}`);
          return response.data.cliente;
        } else if (response && response.cliente) {
          console.log(`✅ [ClientesApiService] Cliente creado automáticamente (básico, formato alternativo) para usuario ${usuario.id_usuario}`);
          return response.cliente;
        }
      } catch (errorBasico) {
        console.warn(`⚠️ [ClientesApiService] Error al crear cliente básico, intentando con empresa:`, errorBasico.message);
        
        // Si falla el básico, intentar con empresa
        const datosClienteCompleto = {
          cliente: {
            id_usuario: usuario.id_usuario,
            marca: `${usuario.nombre} ${usuario.apellido}`,
            tipo_persona: 'Natural',
            estado: true,
            origen: 'directo'
          },
          empresa: {
            nombre: `${usuario.nombre} ${usuario.apellido} - Empresa`,
            nit: `temp-${usuario.documento}-${Date.now()}`,
            tipo_empresa: 'Persona Natural',
            direccion: 'Por definir',
            telefono: usuario.telefono || 'Por definir',
            correo: usuario.correo || 'Por definir'
          }
        };
        
        console.log('📤 [ClientesApiService] Datos del cliente automático (completo):', datosClienteCompleto);
        
        const response = await this.makeRequest(`${this.baseUrl}${this.endpoints.CLIENTES}`, {
          method: 'POST',
          body: JSON.stringify(datosClienteCompleto)
        });
        
        console.log('✅ [ClientesApiService] Respuesta de creación automática (completa):', response);
        
        if (response && response.data && response.data.cliente) {
          console.log(`✅ [ClientesApiService] Cliente creado automáticamente (completo) para usuario ${usuario.id_usuario}`);
          return response.data.cliente;
        } else if (response && response.cliente) {
          console.log(`✅ [ClientesApiService] Cliente creado automáticamente (completo, formato alternativo) para usuario ${usuario.id_usuario}`);
          return response.cliente;
        }
      }
      
      console.warn('⚠️ [ClientesApiService] Respuesta inesperada al crear cliente automático:', response);
      return null;
    } catch (error) {
      console.error(`❌ [ClientesApiService] Error al crear cliente automático:`, error);
      console.error(`❌ [ClientesApiService] Usuario que causó el error:`, usuario);
      console.error(`❌ [ClientesApiService] Error message:`, error.message);
      console.error(`❌ [ClientesApiService] Error stack:`, error.stack);
      
      // Si es un error 500, no fallar completamente, solo loggear y continuar
      if (error.message && error.message.includes('500')) {
        console.warn(`⚠️ [ClientesApiService] Error 500 al crear cliente automático para usuario ${usuario.id_usuario}, continuando sin crear cliente automático`);
        return null;
      }
      
      return null;
    }
  }

  /**
   * Obtener todos los clientes con información completa
   * La API devuelve información unificada de Usuario + Empresa + Cliente
   * Incluye creación automática de clientes faltantes
   */
  async getAllClientes() {
    try {
      console.log('📥 [ClientesApiService] Obteniendo todos los clientes...');
      
      const url = `${this.baseUrl}${this.endpoints.CLIENTES}`;
      const response = await this.makeRequest(url, { method: 'GET' });
      
      console.log('✅ [ClientesApiService] Respuesta completa de la API:', response);
      
      // Según la documentación actualizada, la API devuelve:
      // {
      //   "success": true,
      //   "message": "Clientes encontrados",
      //   "data": {
      //     "clientes": [...],
      //     "total": 1
      //   },
      //   "meta": {
      //     "filters": {
      //       "applied": "Todos los clientes",
      //       "available": "Use query parameters para filtrar por estado, tipo_persona, origen, etc."
      //     }
      //   }
      // }
      
      let clientesData = [];
      
      if (response && typeof response === 'object') {
        console.log('🔍 [ClientesApiService] Propiedades del objeto:', Object.keys(response));
        
        // Verificar si es una respuesta exitosa de la API
        if (response.success === true && response.data) {
          console.log('✅ [ClientesApiService] Respuesta exitosa de la API:', response.message);
          console.log('📊 [ClientesApiService] Total de clientes:', response.data.total);
          
          // La API devuelve los clientes en response.data.clientes
          clientesData = response.data.clientes || [];
          
          // Mostrar información de filtros aplicados
          if (response.meta && response.meta.filters) {
            console.log('🔍 [ClientesApiService] Filtros aplicados:', response.meta.filters.applied);
            console.log('🔍 [ClientesApiService] Filtros disponibles:', response.meta.filters.available);
          }
        } else if (response.error) {
          // Si hay un error real, manejarlo
          console.warn('⚠️ [ClientesApiService] Respuesta con error:', response);
          throw new Error(response.error || 'Error desconocido en la API');
        } else {
          // Buscar el array de clientes en diferentes propiedades posibles
          clientesData = response.data || response.clientes || response.results || [];
        }
      }
      
      // Asegurar que tenemos un array
      if (!Array.isArray(clientesData)) {
        console.warn('⚠️ [ClientesApiService] La respuesta no contiene un array de clientes:', clientesData);
        console.warn('⚠️ [ClientesApiService] Estructura de la respuesta:', JSON.stringify(response, null, 2));
        return [];
      }
      
      console.log('✅ [ClientesApiService] Array de clientes encontrado con', clientesData.length, 'elementos');
      
      // Crear clientes faltantes automáticamente
      const clientesConCreacionAutomatica = await this.crearClientesFaltantes(clientesData);
      
      // Transformar datos de la API al formato esperado por el frontend
      const clientesTransformados = clientesConCreacionAutomatica.map(cliente => {
        return this.transformarClienteCompleto(cliente);
      });
      
      console.log('✅ [ClientesApiService] Clientes transformados:', clientesTransformados);
      return clientesTransformados;
      
    } catch (error) {
      console.error('❌ [ClientesApiService] Error al obtener clientes:', error);
      throw new Error(`Error al obtener clientes: ${error.message}`);
    }
  }

  /**
   * Transformar datos del cliente de la API al formato esperado por el frontend
   * Incluye información completa de identificación (tipo_documento y documento)
   * Similar a la funcionalidad implementada en empleados
   */
  transformarClienteCompleto(cliente) {
    try {
      console.log('🔍 [ClientesApiService] Transformando cliente completo:', cliente);
      
      // Extraer datos del usuario (están en cliente.usuario)
      const usuario = cliente.usuario || {};
      
      // Extraer datos de la empresa (están en cliente.empresas[0])
      const empresa = cliente.empresas && cliente.empresas.length > 0 ? cliente.empresas[0] : {};
      
      console.log('🔍 [ClientesApiService] Usuario extraído:', usuario);
      console.log('🔍 [ClientesApiService] Empresa extraída:', empresa);
      console.log('🔍 [ClientesApiService] Cliente original:', cliente);
      
      // Verificar si el usuario tiene datos o si están en el cliente directamente
      const tieneUsuarioCompleto = usuario && (usuario.nombre || usuario.tipo_documento);
      const tieneEmpresaCompleta = empresa && (empresa.nombre || empresa.nit);
      
      console.log('🔍 [ClientesApiService] Tiene usuario completo:', tieneUsuarioCompleto);
      console.log('🔍 [ClientesApiService] Tiene empresa completa:', tieneEmpresaCompleta);
      
      return {
        id: cliente.id_cliente || cliente.id_usuario,
        id_cliente: cliente.id_cliente,
        id_usuario: cliente.id_usuario,
        id_empresa: empresa.id_empresa || cliente.id_empresa,
        
        // Datos del usuario (información personal) - usar datos disponibles
        tipoDocumento: (usuario && usuario.tipo_documento) || (cliente.tipo_documento) || 'N/A',
        documento: (usuario && usuario.documento) || (cliente.documento) || 'N/A',
        nombre: (usuario && usuario.nombre) || (cliente.nombre) || 'N/A',
        apellido: (usuario && usuario.apellido) || (cliente.apellido) || 'N/A',
        email: (usuario && usuario.correo) || (cliente.correo) || 'N/A',
        telefono: (usuario && usuario.telefono) || (cliente.telefono) || 'N/A',
        
        // Datos de la empresa
        nitEmpresa: empresa.nit || 'N/A',
        nombreEmpresa: empresa.nombre || 'N/A',
        direccionEmpresa: empresa.direccion || 'N/A',
        telefonoEmpresa: empresa.telefono || 'N/A',
        correoEmpresa: empresa.correo || empresa.email || 'N/A',
        ciudadEmpresa: empresa.ciudad || 'N/A',
        paisEmpresa: empresa.pais || 'N/A',
        tipoEmpresa: empresa.tipo_empresa || 'N/A',
        
        // Datos del cliente
        marca: cliente.marca || 'N/A',
        tipoPersona: cliente.tipo_persona || 'N/A',
        estado: cliente.estado ? 'Activo' : 'Inactivo',
        origen: cliente.origen || 'directo',
        
        // Metadatos
        fechaCreacion: cliente.fecha_creacion || new Date().toISOString(),
        fechaActualizacion: cliente.fecha_actualizacion || new Date().toISOString(),
        
        // Información adicional para debugging
        _debug: {
          tieneUsuarioCompleto,
          tieneEmpresaCompleta,
          estructuraOriginal: {
            usuario: usuario,
            empresa: empresa,
            cliente: cliente
          }
        }
      };
    } catch (error) {
      console.error('❌ [ClientesApiService] Error al transformar cliente:', error);
      console.error('❌ [ClientesApiService] Cliente que causó el error:', cliente);
      
      // Retornar estructura básica en caso de error
      return {
        id: cliente.id_cliente || cliente.id_usuario || 'N/A',
        id_cliente: cliente.id_cliente || 'N/A',
        id_usuario: cliente.id_usuario || 'N/A',
        id_empresa: 'N/A',
        tipoDocumento: 'N/A',
        documento: 'N/A',
        nombre: 'N/A',
        apellido: 'N/A',
        email: 'N/A',
        telefono: 'N/A',
        nitEmpresa: 'N/A',
        nombreEmpresa: 'N/A',
        direccionEmpresa: 'N/A',
        telefonoEmpresa: 'N/A',
        correoEmpresa: 'N/A',
        ciudadEmpresa: 'N/A',
        paisEmpresa: 'N/A',
        tipoEmpresa: 'N/A',
        marca: 'N/A',
        tipoPersona: 'N/A',
        estado: 'N/A',
        origen: 'N/A',
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        _error: error.message
      };
    }
  }

  /**
   * Obtener cliente por ID con información completa
   * Según la documentación: GET /api/gestion-clientes/:id devuelve información completa
   */
  async getClienteById(id) {
    try {
      console.log(`📥 [ClientesApiService] Obteniendo cliente con ID: ${id}`);
      
      const url = `${this.baseUrl}${this.endpoints.CLIENTE_BY_ID(id)}`;
      const response = await this.makeRequest(url, { method: 'GET' });
      
      console.log('✅ [ClientesApiService] Respuesta completa de la API:', response);
      
      // Según la documentación, la API devuelve:
      // {
      //   "success": true,
      //   "message": "Cliente encontrado",
      //   "data": {
      //     "cliente": {
      //       "id_cliente": 8,
      //       "id_usuario": 5,
      //       "marca": "MiMarcaEmpresarial",
      //       "tipo_persona": "Natural",
      //       "estado": true,
      //       "origen": "solicitud",
      //       "usuario": {...},
      //       "empresas": [...]
      //     }
      //   }
      // }
      
      let clienteData = response;
      
      if (response && typeof response === 'object' && response.success === true && response.data) {
        console.log('✅ [ClientesApiService] Respuesta exitosa de la API:', response.message);
        clienteData = response.data.cliente || response.data;
      }
      
      // Usar el método de transformación completa
      const clienteTransformado = this.transformarClienteCompleto(clienteData);
      
      console.log('✅ [ClientesApiService] Cliente transformado:', clienteTransformado);
      return clienteTransformado;
      
    } catch (error) {
      console.error(`❌ [ClientesApiService] Error al obtener cliente ${id}:`, error);
      throw new Error(`Error al obtener cliente: ${error.message}`);
    }
  }

  /**
   * Crear cliente completo (Usuario + Empresa + Cliente)
   * El frontend envía datos unificados, el servicio los separa correctamente
   */
  async createCliente(clienteData) {
    try {
      console.log('📤 [ClientesApiService] Creando cliente:', clienteData);
      
      // Transformar datos del frontend al formato esperado por la API
      // Primero crear el usuario
      const usuarioData = {
        tipo_documento: clienteData.tipoDocumento,
        documento: clienteData.documento,
        nombre: clienteData.nombre,
        apellido: clienteData.apellido,
        correo: clienteData.email,
        contrasena: 'TempPassword123!', // Contraseña temporal
        id_rol: 3 // Cliente
      };
      
      console.log('📤 [ClientesApiService] Datos del usuario a enviar:', usuarioData);
      console.log('📤 [ClientesApiService] Validando datos del usuario...');
      
      // Validar datos requeridos
      if (!usuarioData.tipo_documento || !usuarioData.documento || !usuarioData.nombre || !usuarioData.apellido || !usuarioData.correo || !usuarioData.contrasena) {
        throw new Error('Faltan datos requeridos para crear el usuario');
      }
      
      // Validar formato del documento (debe ser numérico)
      if (isNaN(usuarioData.documento)) {
        throw new Error('El documento debe ser numérico');
      }
      
      // Validar formato del email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(usuarioData.correo)) {
        throw new Error('El formato del email no es válido');
      }
      
      console.log('📤 [ClientesApiService] Creando usuario:', usuarioData);
      
      // Crear usuario primero
      try {
        console.log('🌐 [ClientesApiService] Enviando datos a la API:', JSON.stringify(usuarioData, null, 2));
        
        const usuarioResponse = await this.makeRequest(`${this.baseUrl}/api/usuarios/registrar`, {
          method: 'POST',
          body: JSON.stringify(usuarioData)
        });
        
        console.log('✅ [ClientesApiService] Usuario creado:', usuarioResponse);
        console.log('🔍 [ClientesApiService] Estructura de usuarioResponse:', JSON.stringify(usuarioResponse, null, 2));
        
        // Verificar la estructura de la respuesta del usuario
        let idUsuario;
        if (usuarioResponse && usuarioResponse.usuario && usuarioResponse.usuario.id_usuario) {
          idUsuario = usuarioResponse.usuario.id_usuario;
        } else if (usuarioResponse && usuarioResponse.id_usuario) {
          idUsuario = usuarioResponse.id_usuario;
        } else {
          console.error('❌ [ClientesApiService] No se pudo encontrar id_usuario en la respuesta:', usuarioResponse);
          throw new Error('No se pudo obtener el ID del usuario creado');
        }
        
        console.log('✅ [ClientesApiService] ID del usuario extraído:', idUsuario);
        
        // Ahora crear el cliente con el ID del usuario
        const datosParaEnviar = {
          cliente: {
            id_usuario: idUsuario,
            marca: clienteData.marca,
            tipo_persona: clienteData.tipoPersona,
            estado: clienteData.estado === 'Activo',
            origen: 'directo'
          },
          empresa: {
            nombre: clienteData.nombreEmpresa,
            nit: clienteData.nitEmpresa,
            direccion: clienteData.direccionEmpresa || '',
            telefono: clienteData.telefonoEmpresa || '',
            correo: clienteData.correoEmpresa || ''
          }
        };
        
        console.log('📤 [ClientesApiService] Datos transformados para API:', datosParaEnviar);
        
        const url = `${this.baseUrl}${this.endpoints.CLIENTES}`;
        const response = await this.makeRequest(url, {
          method: 'POST',
          body: JSON.stringify(datosParaEnviar)
        });
        
        console.log('✅ [ClientesApiService] Cliente creado:', response);
        
        // Transformar respuesta al formato esperado por el frontend
        const clienteCreado = {
          id: response.id_cliente || response.id_usuario,
          id_cliente: response.id_cliente,
          id_usuario: response.id_usuario,
          id_empresa: response.id_empresa,
          
          // Datos del usuario (usar datos del usuario creado)
          tipoDocumento: (usuarioResponse.usuario && usuarioResponse.usuario.tipo_documento) || usuarioResponse.tipo_documento || clienteData.tipoDocumento,
          documento: (usuarioResponse.usuario && usuarioResponse.usuario.documento) || usuarioResponse.documento || clienteData.documento,
          nombre: (usuarioResponse.usuario && usuarioResponse.usuario.nombre) || usuarioResponse.nombre || clienteData.nombre,
          apellido: (usuarioResponse.usuario && usuarioResponse.usuario.apellido) || usuarioResponse.apellido || clienteData.apellido,
          email: (usuarioResponse.usuario && usuarioResponse.usuario.correo) || usuarioResponse.correo || clienteData.email,
          telefono: (usuarioResponse.usuario && usuarioResponse.usuario.telefono) || usuarioResponse.telefono || clienteData.telefono,
          
          // Datos de la empresa
          nitEmpresa: response.nit || clienteData.nitEmpresa,
          nombreEmpresa: response.nombre_empresa || clienteData.nombreEmpresa,
          direccionEmpresa: response.direccion || clienteData.direccionEmpresa,
          telefonoEmpresa: response.telefono || clienteData.telefonoEmpresa,
          correoEmpresa: response.correo || clienteData.correoEmpresa,
          tipoEmpresa: response.tipo_empresa || 'N/A',
          
          // Datos del cliente
          marca: response.marca || clienteData.marca,
          tipoPersona: response.tipo_persona || clienteData.tipoPersona,
          estado: response.estado ? 'Activo' : 'Inactivo',
          origen: 'directo',
          
          // Metadatos
          fechaCreacion: response.fecha_creacion || new Date().toISOString(),
          fechaActualizacion: response.fecha_actualizacion || new Date().toISOString()
        };
        
        console.log('✅ [ClientesApiService] Cliente transformado:', clienteCreado);
        return clienteCreado;
        
      } catch (error) {
        console.error('❌ [ClientesApiService] Error al crear usuario:', error);
        console.error('❌ [ClientesApiService] Datos que causaron el error:', JSON.stringify(usuarioData, null, 2));
        
        // Si es un error 400, intentar obtener más detalles de la respuesta
        if (error.message.includes('400')) {
          console.error('❌ [ClientesApiService] Error 400 - Posibles causas:');
          console.error('   - El documento ya existe en la base de datos');
          console.error('   - El email ya está registrado');
          console.error('   - Datos faltantes o inválidos');
          console.error('   - Formato de datos incorrecto');
        }
        
        throw new Error(`Error al crear usuario: ${error.message}`);
      }
      
    } catch (error) {
      console.error('❌ [ClientesApiService] Error al crear cliente:', error);
      throw new Error(`Error al crear cliente: ${error.message}`);
    }
  }

  /**
   * Actualizar cliente completo (Usuario + Empresa + Cliente)
   */
  async updateCliente(id, clienteData) {
    try {
      console.log(`📤 [ClientesApiService] Actualizando cliente ${id}:`, clienteData);
      console.log(`📤 [ClientesApiService] ID del cliente a actualizar:`, id);
      console.log(`📤 [ClientesApiService] Tipo de ID:`, typeof id);
      
      // Transformar datos del frontend al formato esperado por la API
      const datosParaEnviar = {
        cliente: {
          marca: clienteData.marca,
          tipo_persona: clienteData.tipoPersona,
          estado: clienteData.estado === 'Activo'
        },
        empresa: {
          nombre: clienteData.nombreEmpresa,
          nit: clienteData.nitEmpresa,
          direccion: clienteData.direccionEmpresa || '',
          telefono: clienteData.telefonoEmpresa || '',
          correo: clienteData.correoEmpresa || '',
          ciudad: clienteData.ciudadEmpresa || '',
          pais: clienteData.paisEmpresa || ''
        },
        usuario: {
          tipo_documento: clienteData.tipoDocumento,
          documento: clienteData.documento,
          nombre: clienteData.nombre,
          apellido: clienteData.apellido,
          correo: clienteData.email,
          telefono: clienteData.telefono
        }
      };
      
      console.log('📤 [ClientesApiService] Datos transformados para API:', datosParaEnviar);
      
      const url = `${this.baseUrl}${this.endpoints.CLIENTE_BY_ID(id)}`;
      console.log('📤 [ClientesApiService] URL de actualización:', url);
      
      const response = await this.makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify(datosParaEnviar)
      });
      
      console.log('✅ [ClientesApiService] Cliente actualizado:', response);
      
      // Transformar respuesta al formato esperado por el frontend
      const clienteActualizado = {
        id: response.id_cliente || response.id_usuario,
        id_cliente: response.id_cliente,
        id_usuario: response.id_usuario,
        id_empresa: response.id_empresa,
        
        // Datos del usuario
        tipoDocumento: response.tipo_documento || clienteData.tipoDocumento,
        documento: response.documento || clienteData.documento,
        nombre: response.nombre || clienteData.nombre,
        apellido: response.apellido || clienteData.apellido,
        email: response.correo || clienteData.email,
        telefono: response.telefono || clienteData.telefono,
        
        // Datos de la empresa
        nitEmpresa: response.nit || clienteData.nitEmpresa,
        nombreEmpresa: response.nombre_empresa || clienteData.nombreEmpresa,
        direccionEmpresa: response.direccion || clienteData.direccionEmpresa,
        telefonoEmpresa: response.telefono_empresa || clienteData.telefonoEmpresa,
        correoEmpresa: response.correo_empresa || clienteData.correoEmpresa,
        ciudadEmpresa: response.ciudad_empresa || clienteData.ciudadEmpresa,
        paisEmpresa: response.pais_empresa || clienteData.paisEmpresa,
        
        // Datos del cliente
        marca: response.marca || clienteData.marca,
        tipoPersona: response.tipo_persona || clienteData.tipoPersona,
        estado: response.estado ? 'Activo' : 'Inactivo',
        
        // Metadatos
        fechaCreacion: response.fecha_creacion,
        fechaActualizacion: response.fecha_actualizacion
      };
      
      console.log('✅ [ClientesApiService] Cliente actualizado transformado:', clienteActualizado);
      return clienteActualizado;
      
    } catch (error) {
      console.error(`❌ [ClientesApiService] Error al actualizar cliente ${id}:`, error);
      throw new Error(`Error al actualizar cliente: ${error.message}`);
    }
  }

  /**
   * Cambiar estado del cliente
   * Según la documentación: PUT /api/gestion-clientes/:id actualiza el cliente
   */
  async changeClienteEstado(id, nuevoEstado) {
    try {
      console.log(`📤 [ClientesApiService] Cambiando estado del cliente ${id} a: ${nuevoEstado}`);
      
      const datosParaEnviar = {
        estado: nuevoEstado === 'Activo'
      };
      
      // Usar PUT en lugar de PATCH según la documentación
      const url = `${this.baseUrl}${this.endpoints.CLIENTE_BY_ID(id)}`;
      const response = await this.makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify(datosParaEnviar)
      });
      
      console.log('✅ [ClientesApiService] Estado del cliente cambiado:', response);
      return response;
      
    } catch (error) {
      console.error(`❌ [ClientesApiService] Error al cambiar estado del cliente ${id}:`, error);
      throw new Error(`Error al cambiar estado del cliente: ${error.message}`);
    }
  }

  /**
   * Eliminar cliente completo (Usuario + Empresa + Cliente)
   */
  async deleteCliente(id) {
    try {
      console.log(`📤 [ClientesApiService] Eliminando cliente ${id}`);
      
      const url = `${this.baseUrl}${this.endpoints.CLIENTE_BY_ID(id)}`;
      const response = await this.makeRequest(url, { method: 'DELETE' });
      
      console.log('✅ [ClientesApiService] Cliente eliminado:', response);
      return response;
      
    } catch (error) {
      console.error(`❌ [ClientesApiService] Error al eliminar cliente ${id}:`, error);
      throw new Error(`Error al eliminar cliente: ${error.message}`);
    }
  }

  /**
   * Eliminar cliente completo (cliente + usuario + empresa)
   * Similar a la funcionalidad implementada en empleados
   */
  async deleteClienteCompleto(id) {
    try {
      console.log(`🗑️ [ClientesApiService] Eliminando cliente completo con ID: ${id}`);
      
      // Primero obtener información del cliente para saber qué eliminar
      const clienteInfo = await this.getClienteById(id);
      
      if (!clienteInfo) {
        throw new Error('Cliente no encontrado');
      }
      
      console.log('🔍 [ClientesApiService] Información del cliente a eliminar:', clienteInfo);
      
      // Eliminar cliente
      const url = `${this.baseUrl}${this.endpoints.CLIENTE_BY_ID(id)}`;
      const response = await this.makeRequest(url, { method: 'DELETE' });
      
      console.log('✅ [ClientesApiService] Cliente eliminado:', response);
      
      // Intentar eliminar usuario asociado si existe
      if (clienteInfo.id_usuario) {
        try {
          await this.makeRequest(`${this.baseUrl}/api/usuarios/${clienteInfo.id_usuario}`, { 
            method: 'DELETE' 
          });
          console.log('✅ [ClientesApiService] Usuario asociado eliminado');
        } catch (error) {
          console.warn('⚠️ [ClientesApiService] No se pudo eliminar usuario asociado:', error.message);
        }
      }
      
      // Intentar eliminar empresa asociada si existe
      if (clienteInfo.id_empresa) {
        try {
          await this.makeRequest(`${this.baseUrl}/api/empresas/${clienteInfo.id_empresa}`, { 
            method: 'DELETE' 
          });
          console.log('✅ [ClientesApiService] Empresa asociada eliminada');
        } catch (error) {
          console.warn('⚠️ [ClientesApiService] No se pudo eliminar empresa asociada:', error.message);
        }
      }
      
      return {
        message: 'Cliente, usuario y empresa asociados eliminados correctamente',
        id_cliente_eliminado: id,
        id_usuario_eliminado: clienteInfo.id_usuario,
        id_empresa_eliminada: clienteInfo.id_empresa
      };
      
    } catch (error) {
      console.error('❌ [ClientesApiService] Error al eliminar cliente completo:', error);
      throw new Error(`Error al eliminar cliente completo: ${error.message}`);
    }
  }

  /**
   * Cambiar estado del cliente y usuario asociado
   * Similar a la funcionalidad implementada en empleados
   */
  async changeClienteState(id, nuevoEstado) {
    try {
      console.log(`🔄 [ClientesApiService] Cambiando estado del cliente ${id} a: ${nuevoEstado}`);
      
      // Actualizar estado del cliente
      const url = `${this.baseUrl}${this.endpoints.CLIENTE_BY_ID(id)}`;
      const response = await this.makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify({ estado: nuevoEstado })
      });
      
      console.log('✅ [ClientesApiService] Estado del cliente actualizado:', response);
      
      // Obtener información actualizada del cliente
      const clienteActualizado = await this.getClienteById(id);
      
      return clienteActualizado;
      
    } catch (error) {
      console.error('❌ [ClientesApiService] Error al cambiar estado del cliente:', error);
      throw new Error(`Error al cambiar estado del cliente: ${error.message}`);
    }
  }

  /**
   * Actualizar empresa asociada a un cliente
   * Según la documentación: PUT /api/gestion-clientes/:id/empresa
   */
  async updateEmpresaCliente(idCliente, empresaData) {
    try {
      console.log(`📤 [ClientesApiService] Actualizando empresa del cliente ${idCliente}:`, empresaData);
      
      // Validar que se proporcione el ID de la empresa
      if (!empresaData.id_empresa) {
        throw new Error('ID de empresa es requerido para actualizar');
      }
      
      // Preparar datos para enviar a la API
      const datosParaEnviar = {
        id_empresa: empresaData.id_empresa,
        direccion: empresaData.direccion || '',
        telefono: empresaData.telefono || '',
        email: empresaData.email || '',
        ciudad: empresaData.ciudad || '',
        pais: empresaData.pais || ''
      };
      
      console.log('📤 [ClientesApiService] Datos de empresa para enviar:', datosParaEnviar);
      
      const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.CLIENT_UPDATE_EMPRESA(idCliente)}`;
      const response = await this.makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify(datosParaEnviar)
      });
      
      console.log('✅ [ClientesApiService] Empresa actualizada:', response);
      
      // Transformar respuesta al formato esperado por el frontend
      if (response && response.data && response.data.cliente) {
        const clienteActualizado = this.transformarClienteCompleto(response.data.cliente);
        console.log('✅ [ClientesApiService] Cliente con empresa actualizada:', clienteActualizado);
        return clienteActualizado;
      }
      
      return response;
      
    } catch (error) {
      console.error(`❌ [ClientesApiService] Error al actualizar empresa del cliente ${idCliente}:`, error);
      throw new Error(`Error al actualizar empresa del cliente: ${error.message}`);
    }
  }

  /**
   * Actualizar usuario asociado a un cliente
   * Según la documentación: PUT /api/gestion-clientes/:id/usuario
   */
  async updateUsuarioCliente(idCliente, usuarioData) {
    try {
      console.log(`📤 [ClientesApiService] Actualizando usuario del cliente ${idCliente}:`, usuarioData);
      
      // Validar que se proporcione al menos un campo para actualizar
      const camposDisponibles = ['nombre', 'apellido', 'correo', 'tipo_documento', 'documento'];
      const camposEnviados = Object.keys(usuarioData).filter(key => usuarioData[key] !== undefined && usuarioData[key] !== '');
      
      if (camposEnviados.length === 0) {
        throw new Error('Debe proporcionar al menos un campo para actualizar');
      }
      
      // Preparar datos para enviar a la API
      const datosParaEnviar = {};
      camposEnviados.forEach(campo => {
        if (camposDisponibles.includes(campo)) {
          datosParaEnviar[campo] = usuarioData[campo];
        }
      });
      
      console.log('📤 [ClientesApiService] Datos de usuario para enviar:', datosParaEnviar);
      
      const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.CLIENT_UPDATE_USUARIO(idCliente)}`;
      const response = await this.makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify(datosParaEnviar)
      });
      
      console.log('✅ [ClientesApiService] Usuario actualizado:', response);
      
      // Transformar respuesta al formato esperado por el frontend
      if (response && response.data && response.data.cliente) {
        const clienteActualizado = this.transformarClienteCompleto(response.data.cliente);
        console.log('✅ [ClientesApiService] Cliente con usuario actualizado:', clienteActualizado);
        return clienteActualizado;
      }
      
      return response;
      
    } catch (error) {
      console.error(`❌ [ClientesApiService] Error al actualizar usuario del cliente ${idCliente}:`, error);
      throw new Error(`Error al actualizar usuario del cliente: ${error.message}`);
    }
  }

  /**
   * Descargar reporte de clientes en Excel
   */
  async downloadReporteExcel() {
    try {
      console.log('📥 [ClientesApiService] Descargando reporte Excel...');
      
      const token = this.getAuthToken();
      const url = `${this.baseUrl}${this.endpoints.CLIENTE_REPORTE}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }
      
      // Crear blob y descargar archivo
      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = 'reporte_clientes.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);
      
      console.log('✅ [ClientesApiService] Reporte Excel descargado');
      return { success: true, message: 'Reporte descargado exitosamente' };
      
    } catch (error) {
      console.error('❌ [ClientesApiService] Error al descargar reporte Excel:', error);
      throw new Error(`Error al descargar reporte: ${error.message}`);
    }
  }
}

// Crear instancia única del servicio
const clientesApiService = new ClientesApiService();

export default clientesApiService;
