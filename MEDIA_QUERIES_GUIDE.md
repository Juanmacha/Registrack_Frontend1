# Guía de Media Queries Responsivas - Registrack

## 📱 Breakpoints Implementados

### 1. **Móviles Pequeños** (320px - 480px)
```css
@media (max-width: 480px) {
  /* Estilos específicos para móviles */
}
```

### 2. **Tablets** (481px - 768px)
```css
@media (min-width: 481px) and (max-width: 768px) {
  /* Estilos específicos para tablets */
}
```

### 3. **Tablets Grandes y Laptops** (769px - 1024px)
```css
@media (min-width: 769px) and (max-width: 1024px) {
  /* Estilos específicos para laptops */
}
```

### 4. **Laptops y Desktops** (1025px - 1440px)
```css
@media (min-width: 1025px) and (max-width: 1440px) {
  /* Estilos específicos para desktop */
}
```

### 5. **Pantallas Grandes** (1441px+)
```css
@media (min-width: 1441px) {
  /* Estilos específicos para pantallas grandes */
}
```

## 🎨 Clases CSS Disponibles

### Gráficas del Dashboard
```css
.dashboard-chart-container  /* Contenedor principal de gráficas */
.dashboard-chart           /* Gráfica individual */
```

**Tamaños responsivos:**
- Móvil: 280x280px
- Tablet: 350x350px
- Laptop: 400x400px
- Desktop: 450x450px
- Pantalla grande: 500x500px

### Tablas Responsivas
```css
.table-responsive          /* Contenedor de tabla con scroll */
.table-scroll             /* Scroll horizontal para tablas */
```

### Modales Responsivos
```css
.modal-responsive         /* Overlay del modal */
.modal-content-responsive /* Contenido del modal */
```

### Sidebar Responsivo
```css
.sidebar-responsive       /* Sidebar principal */
.sidebar-mobile          /* Sidebar para móviles */
.sidebar-tablet          /* Sidebar para tablets */
.sidebar-laptop          /* Sidebar para laptops */
.sidebar-desktop         /* Sidebar para desktop */
.sidebar-large           /* Sidebar para pantallas grandes */
```

### Cards Responsivas
```css
.card-responsive         /* Cards con efectos hover */
```

### Botones Responsivos
```css
.btn-responsive          /* Botones con efectos */
.btn-hover-responsive   /* Botones con hover específico */
```

## 🛠️ Utilidades Responsivas

### Clases de Visibilidad
```css
.hidden-mobile          /* Ocultar en móviles */
.mobile-only            /* Mostrar solo en móviles */
.hidden-tablet          /* Ocultar en tablets */
.tablet-only            /* Mostrar solo en tablets */
```

### Animaciones Responsivas
```css
.slide-in-mobile        /* Animación de deslizamiento para móviles */
.fade-in-tablet         /* Animación de fade para tablets */
```

### Efectos Hover
```css
.hover-responsive       /* Efectos hover solo en dispositivos con mouse */
```

## 📋 Ejemplos de Uso

### 1. Gráfica del Dashboard
```jsx
<div className="dashboard-chart-container">
  <div className="dashboard-chart">
    <Doughnut data={data} options={options} />
  </div>
</div>
```

### 2. Tabla Responsiva
```jsx
<div className="table-responsive">
  <table className="table-auto w-full">
    {/* Contenido de la tabla */}
  </table>
</div>
```

### 3. Modal Responsivo
```jsx
<div className="modal-responsive">
  <div className="modal-content-responsive">
    {/* Contenido del modal */}
  </div>
</div>
```

### 4. Card con Efectos
```jsx
<div className="card-responsive hover-responsive">
  <h3>Título</h3>
  <p>Contenido</p>
</div>
```

### 5. Botón Responsivo
```jsx
<button className="btn-responsive btn-hover-responsive bg-blue-600 text-white">
  Botón Responsivo
</button>
```

### 6. Contenido Condicional
```jsx
<div className="hidden-mobile">
  <p>Este contenido solo se muestra en pantallas grandes</p>
</div>

<div className="mobile-only">
  <p>Este contenido solo se muestra en móviles</p>
</div>
```

## 🎯 Casos de Uso Específicos

### Dashboard
- **Gráficas**: Se adaptan automáticamente según el tamaño de pantalla
- **Tablas**: Scroll horizontal en dispositivos pequeños
- **Sidebar**: Se colapsa en móviles, se expande en hover en desktop

### Landing Page
- **Hero Section**: Títulos y subtítulos se ajustan
- **Cards de servicios**: Grid responsivo
- **Navbar**: Menú hamburguesa en móviles

### Formularios
- **Campos**: Se apilan verticalmente en móviles
- **Botones**: Tamaños optimizados para touch
- **Modales**: Ancho adaptativo

## 🔧 Personalización

### Agregar Nuevos Breakpoints
```css
/* Breakpoint personalizado */
@media (min-width: 1200px) and (max-width: 1400px) {
  .mi-componente {
    /* Estilos específicos */
  }
}
```

### Crear Nuevas Clases Responsivas
```css
/* Clase personalizada */
.mi-clase-responsive {
  /* Estilos base */
}

@media (max-width: 480px) {
  .mi-clase-responsive {
    /* Estilos móvil */
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .mi-clase-responsive {
    /* Estilos tablet */
  }
}
```

## 📱 Testing Responsivo

### Herramientas Recomendadas
1. **Chrome DevTools**: Device toolbar
2. **Firefox**: Responsive Design Mode
3. **Safari**: Develop > Enter Responsive Design Mode

### Dispositivos de Prueba
- **Móviles**: iPhone SE, Samsung Galaxy
- **Tablets**: iPad, Samsung Tab
- **Laptops**: 13", 15"
- **Desktop**: 24", 27"

## 🚀 Mejores Prácticas

### 1. Mobile-First
```css
/* Empezar con estilos móviles */
.mi-componente {
  /* Estilos base (móvil) */
}

/* Luego agregar breakpoints */
@media (min-width: 768px) {
  .mi-componente {
    /* Estilos desktop */
  }
}
```

### 2. Contenido Condicional
```jsx
// Usar clases de visibilidad
<div className="hidden-mobile">
  <p>Contenido solo para desktop</p>
</div>
```

### 3. Imágenes Responsivas
```jsx
<img 
  src="/images/logo.png" 
  className="w-full h-auto max-w-md"
  alt="Logo"
/>
```

### 4. Texto Responsivo
```jsx
<h1 className="text-2xl md:text-4xl lg:text-6xl">
  Título Responsivo
</h1>
```

## 🎨 Animaciones y Transiciones

### Hover Solo en Desktop
```css
@media (hover: hover) {
  .mi-elemento:hover {
    transform: scale(1.05);
  }
}
```

### Animaciones Optimizadas
```css
/* Reducir animaciones si el usuario lo prefiere */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 📊 Performance

### Optimizaciones Implementadas
1. **Reduced Motion**: Respeta preferencias del usuario
2. **Hover Detection**: Solo aplica hover en dispositivos con mouse
3. **Efficient Transitions**: Transiciones optimizadas
4. **Print Styles**: Estilos específicos para impresión

### Monitoreo
- Usar Lighthouse para auditar performance
- Probar en dispositivos reales
- Optimizar imágenes para diferentes tamaños

## 🔮 Futuras Mejoras

### Dark Mode
```css
@media (prefers-color-scheme: dark) {
  .dark-mode-ready {
    background-color: #111827;
    color: white;
  }
}
```

### High Contrast
```css
@media (prefers-contrast: high) {
  .high-contrast {
    border-width: 2px;
  }
}
```

### Reduced Data
```css
@media (prefers-reduced-data: reduce) {
  .data-saving {
    /* Ocultar elementos no esenciales */
  }
}
```

## 📝 Notas Importantes

1. **Siempre probar en dispositivos reales**
2. **Considerar diferentes orientaciones** (portrait/landscape)
3. **Optimizar para touch** en dispositivos móviles
4. **Mantener consistencia** en la experiencia de usuario
5. **Documentar cambios** en componentes responsivos

---

*Esta guía se actualiza regularmente según las necesidades del proyecto.* 