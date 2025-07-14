# 🧪 GUÍA DE TESTS UNITARIOS

## 📋 **¿QUÉ SON LOS TESTS UNITARIOS?**

Los **tests unitarios** son pruebas automatizadas que verifican que cada parte individual (unidad) de tu código funcione correctamente de forma aislada.

### **🎯 Beneficios:**

1. **Detectar Errores Temprano** - Encuentras bugs antes de que lleguen a producción
2. **Refactorizar con Confianza** - Puedes cambiar código sabiendo que los tests te avisarán si algo se rompe
3. **Documentar Comportamiento** - Los tests sirven como documentación viva de cómo debe funcionar tu código
4. **Mejorar Diseño** - Te obligan a escribir código más modular y testeable

## 🚀 **CONFIGURACIÓN INICIAL**

### **1. Instalar Dependencias**
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event babel-jest jest-environment-jsdom identity-obj-proxy
```

### **2. Configuración de Jest**
El archivo `jest.config.js` ya está configurado con:
- Entorno jsdom para simular el navegador
- Mocks para librerías externas
- Configuración de coverage
- Transformaciones de Babel

### **3. Setup de Tests**
El archivo `src/setupTests.js` incluye:
- Mocks de localStorage
- Mocks de librerías externas (SweetAlert2, react-router-dom, etc.)
- Configuración global para tests

## 📝 **ESCRIBIENDO TESTS**

### **Estructura Básica:**
```javascript
describe('NombreDelServicio', () => {
  describe('nombreDelMetodo', () => {
    test('debe hacer algo específico', () => {
      // Arrange (Preparar)
      const input = 'test@example.com';
      
      // Act (Actuar)
      const result = ValidationService.isValidEmail(input);
      
      // Assert (Verificar)
      expect(result).toBe(true);
    });
  });
});
```

### **Patrón AAA (Arrange-Act-Assert):**
```javascript
test('debe validar email correcto', () => {
  // Arrange: Preparar datos de prueba
  const email = 'test@example.com';
  
  // Act: Ejecutar la función que queremos probar
  const isValid = ValidationService.isValidEmail(email);
  
  // Assert: Verificar que el resultado es el esperado
  expect(isValid).toBe(true);
});
```

## 🧪 **EJEMPLOS PRÁCTICOS**

### **1. Tests de Validación**
```javascript
describe('ValidationService', () => {
  test('debe validar emails correctos', () => {
    expect(ValidationService.isValidEmail('test@example.com')).toBe(true);
    expect(ValidationService.isValidEmail('usuario@dominio.co')).toBe(true);
  });

  test('debe rechazar emails incorrectos', () => {
    expect(ValidationService.isValidEmail('invalid-email')).toBe(false);
    expect(ValidationService.isValidEmail('test@')).toBe(false);
  });
});
```

### **2. Tests de Servicios**
```javascript
describe('UserService', () => {
  test('getByEmail debe encontrar usuario', () => {
    // Arrange
    const mockUsers = [
      { id: '1', email: 'juan@example.com' }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsers));
    
    // Act
    const user = UserService.getByEmail('juan@example.com');
    
    // Assert
    expect(user).toEqual(mockUsers[0]);
  });
});
```

### **3. Tests de Componentes React**
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('debe mostrar formulario de login', () => {
  render(<LoginForm />);
  
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
});

test('debe validar campos requeridos', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);
  
  const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
  await user.click(submitButton);
  
  expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
});
```

## 🎯 **BEST PRACTICES**

### **1. Nombres Descriptivos**
```javascript
// ❌ Mal
test('test1', () => {});

// ✅ Bien
test('debe validar email con formato correcto', () => {});
test('debe rechazar email sin @', () => {});
test('debe manejar email vacío', () => {});
```

### **2. Un Test por Comportamiento**
```javascript
// ❌ Mal - Múltiples assertions en un test
test('debe validar emails', () => {
  expect(ValidationService.isValidEmail('test@example.com')).toBe(true);
  expect(ValidationService.isValidEmail('invalid')).toBe(false);
  expect(ValidationService.isValidEmail('')).toBe(false);
});

// ✅ Bien - Un test por caso
test('debe validar email correcto', () => {
  expect(ValidationService.isValidEmail('test@example.com')).toBe(true);
});

test('debe rechazar email inválido', () => {
  expect(ValidationService.isValidEmail('invalid')).toBe(false);
});

test('debe manejar email vacío', () => {
  expect(ValidationService.isValidEmail('')).toBe(false);
});
```

### **3. Mocks y Stubs**
```javascript
// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock de funciones externas
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));
```

### **4. Limpieza entre Tests**
```javascript
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
});

afterEach(() => {
  jest.clearAllMocks();
});
```

## 📊 **COVERAGE Y MÉTRICAS**

### **Ejecutar Tests con Coverage:**
```bash
npm run test:coverage
```

### **Umbrales de Coverage:**
- **Branches**: 70% - Cobertura de ramas condicionales
- **Functions**: 70% - Cobertura de funciones
- **Lines**: 70% - Cobertura de líneas de código
- **Statements**: 70% - Cobertura de declaraciones

## 🚀 **COMANDOS DISPONIBLES**

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en CI/CD
npm run test:ci
```

## 📁 **ESTRUCTURA DE TESTS**

```
src/
├── utils/
│   ├── __tests__/
│   │   ├── validationService.test.js
│   │   ├── mockDataService.test.js
│   │   └── alertService.test.js
│   ├── validationService.js
│   ├── mockDataService.js
│   └── alertService.js
├── features/
│   ├── auth/
│   │   ├── __tests__/
│   │   │   ├── authService.test.js
│   │   │   └── login.test.jsx
│   │   └── services/
│   └── dashboard/
└── setupTests.js
```

## 🎯 **TIPOS DE TESTS**

### **1. Unit Tests**
- Prueban una función o método específico
- Son rápidos y aislados
- No dependen de otros componentes

### **2. Integration Tests**
- Prueban la interacción entre componentes
- Verifican flujos completos
- Pueden usar mocks para servicios externos

### **3. Component Tests**
- Prueban componentes React
- Verifican renderizado y comportamiento
- Usan React Testing Library

## 🔧 **HERRAMIENTAS ÚTILES**

### **Jest Matchers:**
```javascript
expect(value).toBe(expected);           // Igualdad estricta
expect(value).toEqual(expected);        // Igualdad profunda
expect(value).toBeTruthy();             // Verdadero
expect(value).toBeFalsy();              // Falso
expect(value).toContain(item);          // Contiene elemento
expect(value).toHaveLength(length);     // Longitud específica
expect(fn).toHaveBeenCalled();          // Función fue llamada
expect(fn).toHaveBeenCalledWith(arg);  // Función llamada con argumento
```

### **React Testing Library:**
```javascript
// Queries
getByText('texto');           // Por texto
getByRole('button');          // Por rol
getByLabelText('Email');      // Por label
getByTestId('submit-btn');    // Por test-id

// Eventos
userEvent.click(button);
userEvent.type(input, 'texto');
userEvent.selectOptions(select, 'option');
```

## 🚨 **CASOS ESPECIALES**

### **Tests Asíncronos:**
```javascript
test('debe cargar datos del servidor', async () => {
  const user = userEvent.setup();
  
  render(<DataComponent />);
  
  await user.click(screen.getByRole('button'));
  
  await waitFor(() => {
    expect(screen.getByText('Datos cargados')).toBeInTheDocument();
  });
});
```

### **Tests con Promesas:**
```javascript
test('debe manejar errores de API', async () => {
  fetch.mockRejectedValueOnce(new Error('API Error'));
  
  render(<ApiComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Error al cargar datos')).toBeInTheDocument();
  });
});
```

## 📈 **MANTENIMIENTO DE TESTS**

### **1. Actualizar Tests con Cambios**
Cuando cambies el código, actualiza los tests correspondientes.

### **2. Refactorizar Tests**
Mantén los tests limpios y legibles.

### **3. Revisar Coverage**
Asegúrate de que los tests cubran el código crítico.

### **4. Automatizar**
Configura tests automáticos en CI/CD.

## 🎉 **CONCLUSIÓN**

Los tests unitarios son una herramienta fundamental para:
- **Calidad del código**
- **Confianza en refactorizaciones**
- **Documentación viva**
- **Detección temprana de errores**

¡Empieza con tests simples y ve expandiendo gradualmente! 