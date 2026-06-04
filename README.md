# GastoClaro — Backend API

**GastoClaro** es una app web de finanzas personales diseñada para ayudar a las personas a entender, controlar y mejorar el uso de su dinero. Este repositorio contiene el backend (API REST) que provee servicios de autenticación, gestión de gastos, metas de ahorro, deudas y administración de usuarios.

---

## 🚀 Tecnologías Principales (Stack)

- **Entorno:** Node.js (≥ 18)
- **Framework:** Express + TypeScript
- **Base de Datos:** PostgreSQL alojada en **Supabase**
- **Autenticación:** JWT + bcrypt
- **Validación:** Zod
- **Arquitectura:** Clean Architecture (4 capas)

---

## 📋 Requisitos Previos

1. Instalar [Node.js](https://nodejs.org/es/) (versión 18 o superior).
2. Tener una cuenta en [Supabase](https://supabase.com/) y crear un proyecto (PostgreSQL).
3. Obtener la cadena de conexión de la base de datos (`DATABASE_URL`).

---

## 🛠️ Setup Local (Paso a paso)

1. **Clonar el repositorio y entrar al directorio:**
   ```bash
   git clone <url-del-repo>
   cd backend_gastoclaro
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo de ejemplo y crea tu `.env` local (NUNCA comitees este archivo):
   ```bash
   cp .env.example .env
   ```
   **Explicación de variables:**
   - `PORT`: Puerto donde correrá el servidor (ej. `3001`).
   - `NODE_ENV`: `development` (local) o `production`.
   - `DATABASE_URL`: Cadena de conexión de PostgreSQL de Supabase.
   - `JWT_SECRET`: Clave secreta fuerte para firmar los tokens.
   - `JWT_EXPIRES_IN`: Tiempo de vida del token (ej. `7d`).

4. **Crear las tablas en Supabase:**
   Copia el contenido del archivo `src/infrastructure/database/migrations/001_create_tables.sql` y ejecútalo en el **SQL Editor** de tu panel de Supabase.

5. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```
   La API estará corriendo en: `http://localhost:3001`
   Swagger Docs disponibles en: `http://localhost:3001/api/v1/docs`

---

## 📜 Comandos Disponibles

| Comando | Acción |
|---|---|
| `npm run dev` | Inicia el servidor con recarga automática (ts-node-dev). |
| `npm run build` | Compila el código TypeScript al directorio `dist/`. |
| `npm start` | Inicia el servidor en producción desde `dist/index.js`. |
| `npm run lint` | Analiza el código con ESLint buscando errores. |
| `npm run format` | Formatea todo el código usando Prettier. |

---

## 🌐 Enlace de Despliegue (Deploy)

🔗 **API en Producción (Render / Railway):** `[Colocar aquí el link al hacer deploy]`

---

## 🏛️ Decisiones Técnicas (ADR)

| Decisión | Contexto | Por qué se eligió |
|---|---|---|
| **Clean Architecture** | Arquitectura del Backend | Separa responsabilidades en 4 capas (Domain, Application, Infrastructure, Interface). Hace el código altamente mantenible, testeable e independiente del framework o BD. |
| **JWT vs Sesiones** | API REST stateless | JWT escala mucho mejor horizontalmente y no requiere guardar estado ni consumir memoria en el servidor (como Redis o Memcached). |
| **Zod para validación** | Validar payloads (body, query) | Es type-safe, se integra nativamente con TypeScript y permite centralizar esquemas para devolver errores 400 detallados e informativos. |
| **UUID como PK** | IDs en la API de BD | Evita la enumeración maliciosa en la API (seguridad) y es altamente compatible con sistemas distribuidos y Supabase. |
| **NUMERIC para dinero** | Almacenamiento financiero | Los campos de moneda (`amount`, `target_amount`) usan `NUMERIC(12,2)` para garantizar precisión exacta y evitar errores de punto flotante de `float`. |
| **bcrypt salt ≥ 10** | Seguridad de contraseñas | Otorga suficiente costo computacional para resistir ataques de fuerza bruta al hashear contraseñas antes de insertarlas en la BD. |
| **PostgreSQL (pg)** | Capa de datos y consultas | Optamos por conectarnos nativamente con `pg` (en vez de un ORM pesado como Prisma) para mantener control total sobre las queries en la capa de Infrastructure y aplicar Clean Architecture estrictamente. |

---
*Desarrollado para la entrega final de UdeM.*
