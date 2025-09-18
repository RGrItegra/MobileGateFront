# 🚗 MobileGateFront

Una aplicación web moderna para el sistema de pagos de estacionamiento, desarrollada con React y Vite.

## 📋 Descripción

Esta aplicación frontend permite a los usuarios gestionar pagos de estacionamiento de manera intuitiva y eficiente. Incluye funcionalidades como consulta de vehículos, cálculo de tarifas, procesamiento de pagos y confirmación de transacciones.

## 🚀 Características

- ✅ **Interfaz moderna y responsive** - Diseño optimizado para dispositivos móviles
- 🔍 **Consulta de vehículos** - Búsqueda por placa patente
- 💰 **Cálculo automático de tarifas** - Basado en tiempo de estacionamiento
- 💳 **Procesamiento de pagos** - Múltiples métodos de pago
- 📄 **Facturación electrónica** - Opción de generar facturas
- ⚡ **Animaciones de loading** - Feedback visual durante procesos
- 🔐 **Autenticación segura** - Sistema de login integrado

## 🛠️ Tecnologías

- **React 18.2.0** - Biblioteca principal para la UI
- **React Router DOM 6.16.0** - Navegación entre páginas
- **Vite 4.4.9** - Herramienta de build y desarrollo
- **Axios 1.5.0** - Cliente HTTP para APIs
- **CSS3** - Estilos personalizados y animaciones

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── ConfirmacionPago/ # Confirmación de transacciones
│   ├── Consulta/         # Búsqueda de vehículos
│   ├── Header/           # Cabecera de la aplicación
│   ├── Loading/          # Componente de carga
│   ├── Login/            # Autenticación de usuarios
│   ├── Settings/         # Configuraciones
│   ├── ValorAPagar/      # Cálculo de tarifas
│   ├── Welcome/          # Página de inicio
│   └── modals/           # Componentes modales
├── contexts/             # Contextos de React
│   └── LoadingContext.jsx # Manejo global de estados de carga
├── hooks/                # Custom hooks
├── services/             # Servicios y APIs
│   └── authService.js    # Servicio de autenticación
├── styles/               # Estilos CSS organizados por componente
└── App.jsx              # Componente principal
```

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd MobileGateFront
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📜 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción

## 🎯 Flujo de Usuario

1. **Inicio** - Página de bienvenida con búsqueda de vehículo
2. **Consulta** - Ingreso de placa patente para búsqueda
3. **Valor a Pagar** - Visualización de tarifa calculada
4. **Confirmación** - Selección de método de pago y facturación
5. **Procesamiento** - Animación de loading durante el pago
6. **Éxito** - Confirmación de transacción exitosa

## 🎨 Características de UI/UX

- **Diseño Mobile-First** - Optimizado para dispositivos móviles
- **Animaciones Fluidas** - Transiciones suaves entre estados
- **Feedback Visual** - Indicadores de carga y estados
- **Accesibilidad** - Componentes accesibles y semánticos
- **Responsive Design** - Adaptable a diferentes tamaños de pantalla

## 🔄 Gestión de Estado

La aplicación utiliza:
- **React Context** - Para el manejo global del estado de loading
- **useState/useEffect** - Para estado local de componentes
- **React Router** - Para el estado de navegación

## 🚀 Despliegue

Para construir la aplicación para producción:

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m '✨ feat: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Convenciones de Commit

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial limpio:

- `✨ feat:` - Nueva funcionalidad
- `🐛 fix:` - Corrección de bugs
- `📚 docs:` - Cambios en documentación
- `💄 style:` - Cambios de estilo (formato, etc.)
- `♻️ refactor:` - Refactorización de código
- `⚡ perf:` - Mejoras de rendimiento
- `✅ test:` - Agregar o corregir tests
- `🔧 chore:` - Tareas de mantenimiento

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

Desarrollado por el equipo de Itegra para Los Molinos.

---

⚡ **Desarrollado con React + Vite para máximo rendimiento**