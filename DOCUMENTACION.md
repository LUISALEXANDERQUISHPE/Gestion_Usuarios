# Sistema de Autenticación con Next.js

Sistema de autenticación completo con Next.js 14+, JWT, Axios, Cookies y shadcn/ui.

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ Manejo de cookies seguras con `cookies-next`
- ✅ Interceptores de Axios para tokens automáticos
- ✅ Componentes UI con shadcn/ui y Tailwind CSS
- ✅ Protección de rutas
- ✅ TypeScript
- ✅ Validación de formularios

## 📁 Estructura del Proyecto

```
ape3-auth/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx       # Página de inicio de sesión
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Página protegida
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx           # Redireccionamiento inicial
│   ├── components/
│   │   └── ui/                # Componentes de shadcn/ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── label.tsx
│   ├── hooks/
│   │   └── useAuth.ts         # Hook personalizado de autenticación
│   ├── lib/
│   │   ├── api.ts             # Configuración de Axios
│   │   └── utils.ts           # Utilidades
│   ├── services/
│   │   └── authService.ts     # Servicio de autenticación
│   └── types/
│       └── index.ts           # Tipos TypeScript
├── .env.local                 # Variables de entorno
└── package.json
```

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**

Edita el archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://tu-api-backend.com
```

3. **Iniciar el servidor de desarrollo:**
```bash
npm run dev
```

## 🔐 Uso de la Autenticación

### Servicio de Autenticación (`authService`)

```typescript
import { authService } from '@/src/services/authService';

// Iniciar sesión
const response = await authService.login({ 
  email: 'usuario@ejemplo.com', 
  password: 'password123' 
});

// Cerrar sesión
authService.logout();

// Obtener token
const token = authService.getToken();

// Verificar autenticación
const isAuth = authService.isAuthenticated();

// Obtener usuario de cookie
const user = authService.getUser();

// Obtener rol del usuario
const role = authService.getRole();
```

### Hook useAuth

```typescript
import { useAuth } from '@/src/hooks/useAuth';

function MiComponente() {
  const { user, loading, login, logout, isAuthenticated, role } = useAuth();

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Hola {user?.email}</p>
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      ) : (
        <div>No autenticado</div>
      )}
    </div>
  );
}
```

## 🌐 API Configuration

El archivo `src/lib/api.ts` configura Axios con:

- **Base URL**: Configurada desde `.env.local`
- **Timeout**: 10 segundos
- **Interceptores de Request**: Agrega automáticamente el token JWT a todas las peticiones (excepto login)
- **Interceptores de Response**: Maneja errores 401/403 y redirige al login

### Ejemplo de uso de la API:

```typescript
import api from '@/src/lib/api';

// GET request
const getData = async () => {
  const response = await api.get('/ruta');
  return response.data;
};

// POST request
const postData = async (data) => {
  const response = await api.post('/ruta', data);
  return response.data;
};
```

## 🎨 Componentes UI

Los componentes están basados en shadcn/ui y están disponibles en `src/components/ui/`:

- `Button`: Botones con variantes
- `Card`: Tarjetas con header, content y footer
- `Input`: Campos de entrada
- `Label`: Etiquetas para formularios

## 📝 Formato de Respuesta de la API

El backend debe devolver la siguiente estructura en el endpoint `/auth/login`:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "role": "admin"
  }
}
```

## 🔒 Cookies Almacenadas

La aplicación almacena las siguientes cookies:

- `token`: JWT token de autenticación
- `user`: Datos del usuario (JSON)
- `role`: Rol del usuario

Configuración de cookies:
- **Max Age**: 7 días
- **Path**: /
- **SameSite**: lax

## 🚪 Rutas

- `/` - Redirige a `/login` o `/dashboard` según autenticación
- `/login` - Página de inicio de sesión
- `/dashboard` - Página protegida (requiere autenticación)

## 🛡️ Protección de Rutas

Las rutas protegidas verifican automáticamente:

```typescript
useEffect(() => {
  if (!loading && !isAuthenticated) {
    router.push('/login');
  }
}, [loading, isAuthenticated, router]);
```

## 🎨 Estilos

- **Tailwind CSS 4**: Para estilos
- **CSS Variables**: Para temas personalizables
- **Dark Mode**: Soportado

## 📦 Dependencias Principales

- `next`: Framework React
- `react` & `react-dom`: Biblioteca UI
- `axios`: Cliente HTTP
- `cookies-next`: Manejo de cookies
- `jwt-decode`: Decodificación de JWT
- `tailwindcss`: Estilos
- `@radix-ui/*`: Componentes primitivos
- `lucide-react`: Iconos

## 🔧 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## 🐛 Manejo de Errores

Los interceptores de Axios manejan automáticamente:

- **401 Unauthorized**: Token inválido o expirado → Limpia cookies y redirige a login
- **403 Forbidden**: Sin permisos → Limpia cookies y redirige a login

## 📖 Notas Adicionales

- El token JWT se envía automáticamente en el header `Authorization: Bearer <token>`
- Las cookies se limpian automáticamente cuando el token expira
- El sistema verifica la validez del token antes de cada petición
- Compatible con servidor de desarrollo y producción

## 🤝 Contribución

Para agregar nuevas rutas protegidas, simplemente usa el hook `useAuth` en tus componentes.

---

**Desarrollado con Next.js 14+ y TypeScript**
