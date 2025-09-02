# Sistema de Gestión de Autos - Frontend

Este es el frontend del Sistema de Gestión de Autos, desarrollado en React con Vite y conectado a un backend .NET.

## 🚀 Características

- **Autenticación JWT**: Sistema de login seguro
- **Gestión de Vehículos**: CRUD completo para vehículos
- **Gestión de Usuarios**: Administración de usuarios del sistema
- **Reservas y Alquileres**: Control de reservas y alquileres
- **Mantenimiento**: Seguimiento del estado de los vehículos
- **Inventario**: Control de stock y disponibilidad
- **Notificaciones**: Sistema de alertas y notificaciones
- **Servicios Adicionales**: Gestión de servicios complementarios

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework de CSS utilitario
- **React Router** - Enrutamiento de la aplicación
- **React Query** - Gestión de estado del servidor
- **Axios** - Cliente HTTP para llamadas a la API

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Backend .NET ejecutándose en `https://localhost:7057`

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   cd Frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la API**
   - Verificar que la URL de la API en `src/config/config.js` coincida con tu backend
   - Por defecto está configurado para `https://localhost:7057/api`

4. **Ejecutar la aplicación**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   - La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Login.jsx       # Componente de autenticación
│   ├── Dashboard.jsx   # Panel principal
│   ├── VehiculoList.jsx # Lista de vehículos
│   └── ProtectedRoute.jsx # Ruta protegida
├── contexts/           # Contextos de React
│   └── AuthContext.jsx # Contexto de autenticación
├── services/           # Servicios de API
│   ├── api.js         # Configuración de axios
│   ├── authService.js # Servicio de autenticación
│   ├── vehiculoService.js # Servicio de vehículos
│   ├── usuarioService.js # Servicio de usuarios
│   └── reservaService.js # Servicio de reservas
├── hooks/              # Hooks personalizados
│   └── useVehiculos.js # Hook para gestión de vehículos
└── App.jsx            # Componente principal
```

## 🔐 Autenticación

La aplicación utiliza JWT (JSON Web Tokens) para la autenticación:

- Los tokens se almacenan en `localStorage`
- Se incluyen automáticamente en todas las peticiones a la API
- Las rutas están protegidas y redirigen al login si no hay autenticación

## 📱 Rutas Disponibles

- `/login` - Página de inicio de sesión
- `/dashboard` - Panel principal (requiere autenticación)
- `/vehiculos` - Gestión de vehículos (requiere autenticación)
- `/usuarios` - Gestión de usuarios (requiere autenticación)
- `/reservas` - Gestión de reservas (requiere autenticación)
- `/alquileres` - Gestión de alquileres (requiere autenticación)

## 🎨 Personalización

### Estilos
- Los estilos utilizan Tailwind CSS
- Puedes personalizar los colores y temas en `tailwind.config.js`

### API
- Modifica la configuración en `src/config/api.js`
- Ajusta los endpoints según tu backend

## 🚨 Solución de Problemas

### Error de CORS
- Verifica que tu backend tenga CORS configurado para `http://localhost:5173`
- Revisa la configuración en `Program.cs` del backend

### Error de Conexión
- Asegúrate de que el backend esté ejecutándose
- Verifica la URL y puerto en la configuración de la API

### Problemas de Autenticación
- Verifica que el backend esté generando tokens JWT válidos
- Revisa la configuración de JWT en el backend

## 📝 Scripts Disponibles

- `npm run dev` - Ejecuta la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la versión de producción

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor crea un issue en el repositorio o contacta al equipo de desarrollo.
