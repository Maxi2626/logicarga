# LogiCarga

Plataforma web para empresas de transporte de carga. Conecta a la **empresa (administrador)** con sus **choferes/camioneros**: el administrador gestiona choferes, remitos, gastos y pagos, y cada chofer consulta sus viajes y pagos desde su propio panel.

> **Estado actual:** prototipo académico de frontend (demo), pensado para evolucionar a un producto comercial. No hay backend ni base de datos: los datos son de ejemplo y viven en memoria, por lo que **se reinician al recargar la página**. El login y el registro son simulados.

---

## Funcionalidades

### Sitio público
- Landing con descripción del producto, características y "¿Cómo funciona?".
- Registro con dos roles: **Camionero** (chofer/propietario) y **Administrador** (empresa).
- Inicio de sesión por rol y pantalla de verificación de email (simulada).
- Modo claro / oscuro.

### Panel del administrador (`/admin`)
| Sección | Ruta | Qué permite |
|---|---|---|
| Panel | `/admin` | Resumen: cantidad de choferes y remitos, total facturado y total de gastos. |
| Choferes | `/admin/drivers` | Alta, edición y baja de choferes: contacto, edad, antigüedad, camión, patente y vencimientos (ITV, carnet, sicofísico). |
| Remitos | `/admin/remitos` | Crear remitos, asignarlos a un chofer (origen, destino, mercadería, monto facturado) y cambiar su estado (*Asignado → En tránsito → Entregado*). |
| Gastos | `/admin/gastos` | Registrar gastos por remito y chofer (combustible, viáticos, mantenimiento, peajes, otros), con fotos de comprobantes. |
| Pagos | `/admin/pagos` | Registrar pagos a choferes en efectivo o cheque, con fecha desde la cual quedan disponibles. |
| Asistente | `/admin/ia` | Chat que responde consultas sobre los datos (resúmenes, vencimientos, remitos por estado, facturación, gastos). Funciona con reglas locales, no usa un modelo de IA externo. |

### Panel del chofer (`/dashboard`)
- Lista de sus remitos asignados.
- Sus pagos, separados en **disponibles** y **pendientes** según la fecha.
- Por ahora la sesión es simulada: siempre se muestra el chofer de ejemplo *Carlos Méndez*.

---

## Tecnologías

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 5](https://vitejs.dev/) (con SWC)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- [React Router](https://reactrouter.com/) para la navegación
- [TanStack Query](https://tanstack.com/query), [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [Recharts](https://recharts.org/), [Lucide](https://lucide.dev/) (íconos), [next-themes](https://github.com/pacocoursey/next-themes)
- [Vitest](https://vitest.dev/) + Testing Library para pruebas
- ESLint para análisis estático

Proyecto generado inicialmente con [Lovable](https://lovable.dev/).

---

## Requisitos previos

- [Node.js](https://nodejs.org/) **18 o superior** (recomendado 20 LTS)
- npm (incluido con Node.js). También hay un `bun.lockb`, así que opcionalmente puede usarse [Bun](https://bun.sh/).

Verificá las versiones instaladas:

```bash
node -v
npm -v
```

---

## Instalación y ejecución

1. **Clonar el repositorio** y entrar a la carpeta:

   ```bash
   git clone https://github.com/Maxi2626/logicarga.git
   cd logicarga
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

4. Abrir el navegador en **http://localhost:8080**

> **Si el servidor no inicia** y aparece el error `EAFNOSUPPORT` (el equipo no soporta IPv6), usá este comando en su lugar y abrí **http://127.0.0.1:8080**:
>
> ```bash
> npm run dev -- --host 127.0.0.1
> ```

---

## Cómo probarlo (modo demo)

No hace falta crear una cuenta real: los formularios no validan credenciales.

1. En la landing, entrá a **Iniciar sesión**.
2. Elegí el rol:
   - **Administrador** → te lleva a `/admin` (panel de la empresa).
   - **Camionero** → te lleva a `/dashboard` (panel del chofer).
3. Escribí cualquier email y contraseña y presioná **Iniciar sesión**.

También podés ir directo a las rutas `/admin`, `/admin/drivers`, `/admin/remitos`, `/admin/gastos`, `/admin/pagos`, `/admin/ia` y `/dashboard`.

Ejemplos para el **Asistente** (`/admin/ia`): *"resumen"*, *"cuántos choferes hay"*, *"vencimientos"*, *"remitos entregados"*, *"facturación"*, *"gastos"*.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente (puerto 8080). |
| `npm run build` | Genera la versión de producción en `dist/`. |
| `npm run build:dev` | Build en modo desarrollo. |
| `npm run preview` | Sirve localmente el build de producción. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run test` | Ejecuta las pruebas una vez con Vitest. |
| `npm run test:watch` | Ejecuta las pruebas en modo observación. |

---

## Estructura del proyecto

```
logicarga/
├── public/                 # Archivos estáticos (favicon, robots.txt)
├── src/
│   ├── assets/             # Logos
│   ├── components/         # Componentes propios (AdminShell, SiteHeader, Logo, ThemeToggle...)
│   │   └── ui/             # Componentes base de shadcn/ui
│   ├── hooks/              # Hooks reutilizables
│   ├── lib/
│   │   ├── store.tsx       # Estado global (Context) y datos de ejemplo
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx       # Landing
│   │   ├── Login.tsx · Register.tsx · VerifyEmail.tsx
│   │   ├── Dashboard.tsx   # Panel del chofer
│   │   └── admin/          # Panel, Drivers, Remitos, Gastos, Pagos, Asistente
│   ├── test/               # Configuración y pruebas
│   ├── App.tsx             # Rutas y proveedores
│   └── main.tsx            # Punto de entrada
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## Limitaciones conocidas y próximos pasos

- Sin backend: los datos se pierden al recargar la página.
- Login, registro y verificación de email son simulados (sin autenticación real ni protección de rutas).
- El panel del chofer usa un usuario fijo de ejemplo.
- El asistente responde con reglas predefinidas, no con IA generativa.
- Hoja de ruta hacia una versión comercial: base de datos y API, autenticación real con roles, aprobación de cuentas por el administrador, aislamiento multi-empresa (cada empresa ve solo sus datos), exportación de reportes y despliegue en producción.

---

## Equipo

Proyecto desarrollado por el **Grupo 5**:

- Pilla Maximiliano
- Arevalo Martin
