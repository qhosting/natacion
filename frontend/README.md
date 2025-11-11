# Frontend E-Learning Natación

Frontend React + Vite con PWA para la plataforma de e-learning.

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con la URL de tu API
nano .env

# Iniciar en desarrollo
npm run dev

# Build para producción
npm run build
```

## Variables de Entorno

```env
VITE_API_URL=http://localhost:3000/api
```

## Características

- PWA instalable
- Autenticación con JWT
- Sistema de roles (ALUMNO/ADMIN)
- Reproductor de video HLS con watermarking
- Protección de contenido
- Seguimiento de progreso
- Dashboard de administración

## Estructura

```
frontend/
├── public/
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── components/        # Componentes reutilizables
│   ├── context/           # Context API (Auth)
│   ├── pages/             # Páginas principales
│   │   └── admin/         # Páginas de administración
│   ├── services/          # Servicios API
│   ├── App.jsx            # Componente principal
│   ├── main.jsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── index.html
├── vite.config.js
└── package.json
```

## Protección de Contenido

### Watermarking Dinámico
Se superpone el email del usuario sobre los videos para disuadir la distribución no autorizada.

### Deshabilitar Clic Derecho
Los elementos de video e imagen tienen el menú contextual deshabilitado.

### Streaming HLS
Los videos se reproducen mediante HLS cuando está disponible, dificultando la descarga directa.

## PWA

La aplicación es una Progressive Web App:
- Instalable en dispositivos móviles y escritorio
- Service Worker para caché offline básico
- Manifiesto configurado con iconos y tema

## Desarrollo

```bash
npm run dev      # Servidor de desarrollo con hot reload
npm run build    # Build de producción
npm run preview  # Preview del build
```

## Producción

El build se genera en la carpeta `dist/` y puede servirse con cualquier servidor estático o CDN.
