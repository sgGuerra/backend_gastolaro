# AGENTS.md — Backend (GastoClaro)
> Guía operativa para construir, corregir y documentar el backend de GastoClaro
> cumpliendo **a raja tabla** la rúbrica del proyecto final (UdeM, 4 de junio 2026).

---

## 0. Contexto del proyecto

**GastoClaro** es una app web de finanzas personales. El backend expone una API REST
que permite a los usuarios gestionar sus gastos, metas, ahorros y deudas, con
autenticación JWT, roles (user / admin) y persistencia en PostgreSQL (Supabase).

**Stack obligatorio:**
- Node.js + Express + **TypeScript**
- PostgreSQL en **Supabase** (con `pg` o Prisma)
- Validación con **Zod**
- Autenticación con **JWT** + **bcrypt**

**Puntaje en juego:** 55 pts del backend (API 18 + BD 10 + JWT 10 + Protección 7 + Validaciones 10)
+ 5 Arquitectura + 5 Calidad + 5 Docs = **80 pts directos desde el backend**

---

## 1. Responsabilidades del backend (separación estricta)

### ✅ SÍ hace el backend
- Exponer API REST bajo `/api/v1/`
- Conectar a PostgreSQL real en Supabase
- Autenticar con JWT + bcrypt
- Proteger rutas con middleware centralizado
- Validar body / params / query con Zod
- Paginar y filtrar listados
- Separar lógica por capas (Clean Architecture)

### ❌ NO hace el backend
- No hardcodea datos en memoria (penalización -15 pts)
- No expone stack traces al cliente
- No comitea `.env` real (penalización -10 pts)
- No mezcla lógica de negocio en los controllers
- No usa `any` de forma generalizada (penalización -5 pts)

---

## 2. Recursos del dominio (GastoClaro)

Los **dos recursos principales** para cumplir la rúbrica son:

| Recurso | Ruta base | Descripción |
|---|---|---|
| `expenses` | `/api/v1/expenses` | Gastos del usuario |
| `goals` | `/api/v1/goals` | Metas de ahorro |

Recursos secundarios (también con CRUD, pero pueden ser más simples):

| Recurso | Ruta base |
|---|---|
| `savings` | `/api/v1/savings` |
| `debts` | `/api/v1/debts` |
| `users` (admin) | `/api/v1/users` |

> **Regla de rúbrica:** CRUD completo en ≥ 2 recursos + paginación con `{ data, meta }` en al menos 1.
> GastoClaro debe tenerlo en `expenses` y `goals` como mínimo.

---

## 3. Contrato de API (convenciones obligatorias)

### 3.1 Prefijo de rutas
```
/api/v1/<recurso>
```

### 3.2 Endpoints mínimos por recurso (ejemplo con `expenses`)

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/v1/expenses` | Crear gasto | ✅ |
| GET | `/api/v1/expenses` | Listar gastos (paginado + filtros) | ✅ |
| GET | `/api/v1/expenses/:id` | Detalle de un gasto | ✅ |
| PUT | `/api/v1/expenses/:id` | Editar gasto | ✅ |
| DELETE | `/api/v1/expenses/:id` | Eliminar gasto | ✅ |

Aplicar el mismo patrón para: `goals`, `savings`, `debts`.

### 3.3 Paginación + filtros (obligatorio en `expenses` y `goals`)

**Query params:**
- `page` (número, default: 1)
- `limit` (número, default: 10)
- `category` (string, opcional — para expenses)
- `status` (string, opcional — para goals: `active`, `completed`)
- `startDate` / `endDate` (ISO, opcional)

**Respuesta de lista:**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 45,
    "totalPages": 5
  }
}
```

> **Por qué esta estructura:** Es el estándar de facto para APIs REST paginadas.
> Permite al frontend saber cuántas páginas hay sin hacer una segunda consulta.
> La rúbrica lo exige explícitamente con `{ data, meta }`.

### 3.4 Códigos HTTP correctos (rúbrica los revisa)

| Situación | Código |
|---|---|
| Lectura / actualización exitosa | 200 |
| Creación exitosa | 201 |
| Eliminación exitosa | 204 |
| Error de validación | 400 |
| Sin token / token inválido / expirado | 401 |
| Sin permiso de rol | 403 |
| Recurso no encontrado | 404 |
| Error interno controlado | 500 |

---

## 4. Autenticación JWT (10 pts — no perder ninguno)

### 4.1 Endpoints de auth

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/v1/auth/register` | Registro de usuario |
| POST | `/api/v1/auth/login` | Login, retorna JWT |

### 4.2 Reglas estrictas

- Contraseñas: **bcrypt** con salt rounds ≥ 10. Nunca texto plano.
- JWT firmado con `JWT_SECRET` desde `.env` (nunca hardcodeado).
- JWT con **expiración** (`expiresIn: '7d'` o similar).
- Token inválido o expirado → **401**.
- El payload del JWT debe incluir: `{ id, email, role }`.

> **Por qué JWT y no sesiones:** JWT es stateless, no requiere almacenamiento en servidor,
> escala horizontalmente y es el estándar para APIs REST modernas consumidas por SPAs.
> Las sesiones server-side requieren un store compartido (Redis, etc.) que añade complejidad.

### 4.3 Roles

| Rol | Descripción |
|---|---|
| `user` | Usuario estándar — accede solo a sus propios datos |
| `admin` | Administrador — puede ver y gestionar todos los usuarios |

---

## 5. Protección de rutas (7 pts — middleware centralizado)

### 5.1 Middleware `authenticate`

```typescript
// Leer Authorization: Bearer <token>
// Si falta → 401
// Si inválido/expirado → 401
// Si válido → inyectar req.user = { id, email, role }
```

### 5.2 Middleware `authorize(...roles)`

```typescript
// Verificar req.user.role está en roles permitidos
// Si no → 403
```

### 5.3 Cobertura mínima

- Todos los endpoints `POST / PUT / DELETE` de recursos financieros → `authenticate`
- `GET /api/v1/users` (listado admin) → `authenticate` + `authorize('admin')`
- `DELETE /api/v1/users/:id` → `authenticate` + `authorize('admin')`

> **Por qué middleware centralizado y no verificar en cada controller:**
> Evita duplicación de código, garantiza consistencia y facilita cambios futuros.
> Si la lógica de auth cambia, se modifica en un solo lugar.

---

## 6. Validaciones con Zod (10 pts)

### 6.1 Qué validar

| Tipo | Qué validar |
|---|---|
| `body` | Campos requeridos, tipos, formatos (email, fechas ISO, amounts positivos) |
| `params` | `id` válido (UUID) |
| `query` | `page` y `limit` numéricos, `startDate`/`endDate` ISO válidos |

### 6.2 Schemas Zod por recurso

**Auth:**
```typescript
// register: name (string), email (email), password (min 8), role? ('user'|'admin')
// login: email (email), password (string)
```

**Expenses:**
```typescript
// category (string), description (string), amount (positive number),
// date (ISO date), payment_method (string)
```

**Goals:**
```typescript
// title (string), description? (string), target_amount (positive),
// current_amount? (≥0), deadline (ISO date), status? ('active'|'completed')
```

**Savings:**
```typescript
// name (string), amount (positive), source (string), date (ISO date)
```

**Debts:**
```typescript
// creditor (string), amount (positive), interest_rate (≥0),
// monthly_payment (positive), due_date (ISO date), status ('active'|'paid')
```

### 6.3 Formato de error de validación (400)

```json
{
  "message": "Validation error",
  "details": [
    { "field": "amount", "message": "Must be a positive number" },
    { "field": "date", "message": "Must be a valid ISO date" }
  ]
}
```

> **Por qué `details` por campo:** El frontend puede mostrar el error exactamente
> junto al campo que lo causó, sin tener que parsear un string genérico.
> Esto es lo que la rúbrica llama "mensaje descriptivo".

### 6.4 Regla: nunca exponer stack trace

```typescript
// ❌ MAL
res.status(500).json({ error: err.stack })

// ✅ BIEN
res.status(500).json({ message: 'Internal server error' })
```

---

## 7. Base de datos — PostgreSQL en Supabase (10 pts)

### 7.1 Tablas y relaciones (≥2 tablas con FK)

```
users (tabla principal)
  ↑ FK user_id
expenses, goals, savings, debts, recommendations
```

### 7.2 Schema mínimo

```sql
-- users
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
name        TEXT NOT NULL
email       TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL
role        TEXT NOT NULL DEFAULT 'user'  -- 'user' | 'admin'
profile_type TEXT
created_at  TIMESTAMPTZ DEFAULT now()
updated_at  TIMESTAMPTZ DEFAULT now()

-- expenses
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
category    TEXT NOT NULL
description TEXT
amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0)
date        DATE NOT NULL
payment_method TEXT
created_at  TIMESTAMPTZ DEFAULT now()
updated_at  TIMESTAMPTZ DEFAULT now()

-- goals
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
title       TEXT NOT NULL
description TEXT
target_amount  NUMERIC(12,2) NOT NULL CHECK (target_amount > 0)
current_amount NUMERIC(12,2) DEFAULT 0 CHECK (current_amount >= 0)
deadline    DATE NOT NULL
status      TEXT NOT NULL DEFAULT 'active'  -- 'active' | 'completed'
created_at  TIMESTAMPTZ DEFAULT now()
updated_at  TIMESTAMPTZ DEFAULT now()

-- savings
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
name        TEXT NOT NULL
amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0)
source      TEXT
date        DATE NOT NULL
created_at  TIMESTAMPTZ DEFAULT now()
updated_at  TIMESTAMPTZ DEFAULT now()

-- debts
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
creditor    TEXT NOT NULL
amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0)
interest_rate NUMERIC(5,2) DEFAULT 0
monthly_payment NUMERIC(12,2)
due_date    DATE
status      TEXT NOT NULL DEFAULT 'active'  -- 'active' | 'paid'
created_at  TIMESTAMPTZ DEFAULT now()
updated_at  TIMESTAMPTZ DEFAULT now()
```

> **Por qué UUID y no serial/integer:** UUID evita enumeración de IDs en la API
> (seguridad), es compatible con Supabase por defecto y funciona bien en sistemas
> distribuidos. Es el tipo recomendado por Supabase para PKs.

> **Por qué NUMERIC(12,2) para montos:** Evita errores de punto flotante que ocurren
> con `float` o `double`. Para dinero, la precisión exacta es crítica.

### 7.3 Regla de acceso a datos (RLS + backend)
- Cada query de recursos financieros debe filtrar por `user_id = req.user.id`
- El admin puede omitir ese filtro en rutas de administración

---

## 8. Clean Architecture — 4 capas estrictas (5 pts)

```
src/
├── domain/
│   ├── entities/          # Tipos/interfaces de negocio (Expense, Goal, User...)
│   └── repositories/      # Interfaces de repositorios (IExpenseRepository...)
├── application/
│   ├── use-cases/         # Lógica de negocio (CreateExpense, ListExpenses...)
│   └── dtos/              # Data Transfer Objects (CreateExpenseDto...)
├── infrastructure/
│   ├── database/          # Conexión a Supabase/pg
│   └── repositories/      # Implementaciones concretas de los repositorios
└── interface/
    ├── controllers/       # Reciben req, llaman use-case, retornan res
    ├── routes/            # Definición de rutas + middlewares
    └── middlewares/       # authenticate, authorize, validateBody, errorHandler
```

### 8.1 Regla de dependencia (nunca romper esto)

```
interface → application → domain ← infrastructure
```

- ❌ Controller NO llama directamente al ORM/pg
- ❌ Use-case NO importa Express
- ✅ Controller llama use-case → use-case llama interfaz de repositorio → infrastructure implementa

> **Por qué Clean Architecture:** Permite cambiar la BD (de Supabase a otro proveedor)
> sin tocar la lógica de negocio. Permite testear use-cases sin levantar Express.
> La rúbrica lo exige explícitamente y vale 5 pts.

---

## 9. Variables de entorno

```env
# .env.example (comitear esto, NO el .env real)
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
```

---

## 10. Calidad del código (5 pts)

- TypeScript estricto: `"strict": true` en `tsconfig.json`
- Sin `any` generalizado (máx. 30% de tipos — penalización -5 pts si se supera)
- Sin `console.log` olvidados en producción (usar logger o eliminar)
- Prettier + ESLint configurados y sin warnings
- Funciones con una sola responsabilidad
- Nombres claros: `createExpense`, no `doThing`

---

## 11. Documentación (5 pts)

### README.md debe incluir:
- Descripción del proyecto (GastoClaro)
- Requisitos: Node ≥ 18, PostgreSQL en Supabase
- Setup local paso a paso
- Variables de entorno explicadas (con `.env.example`)
- Comandos: `npm run dev`, `npm run build`, `npm run lint`
- Link del deploy (Render / Railway)
- Decisiones técnicas documentadas (ver sección ADR)

### ADR — Registro de decisiones técnicas

Documentar en `docs/decisions/` o en el README:

| Decisión | Contexto | Por qué |
|---|---|---|
| JWT vs sesiones | API REST stateless | JWT escala mejor, no requiere store en servidor |
| Zod para validación | Validar body/params/query | Type-safe, integra con TypeScript, errores descriptivos |
| UUID como PK | IDs en la API | Evita enumeración, compatible con Supabase |
| NUMERIC para montos | Datos financieros | Precisión exacta, sin errores de punto flotante |
| Clean Architecture | Separación de capas | Testeable, mantenible, cambiable sin romper todo |
| bcrypt salt ≥ 10 | Seguridad de contraseñas | Costo computacional suficiente para resistir fuerza bruta |

---

## 12. Checklist "Definition of Done" — Backend

Antes de la sustentación, verificar **cada ítem**:

### TypeScript y arranque
- [ ] `tsconfig.json` presente con `"strict": true`
- [ ] Todos los archivos son `.ts`
- [ ] `npm run dev` arranca sin errores
- [ ] `npm run build` compila sin errores

### Base de datos
- [ ] Conectado a PostgreSQL real en Supabase (no memoria)
- [ ] ≥ 5 tablas: `users`, `expenses`, `goals`, `savings`, `debts`
- [ ] Todas con FK a `users`
- [ ] Tipos correctos: UUID, NUMERIC, TIMESTAMPTZ

### API REST
- [ ] CRUD completo en `expenses` (POST, GET, GET/:id, PUT/:id, DELETE/:id)
- [ ] CRUD completo en `goals` (POST, GET, GET/:id, PUT/:id, DELETE/:id)
- [ ] CRUD en `savings` y `debts`
- [ ] Paginación `{ data, meta }` en `expenses` y `goals`
- [ ] Filtros: `category`, `status`, `startDate`, `endDate`
- [ ] Verbos HTTP correctos en todos los endpoints
- [ ] Status codes correctos: 200, 201, 204, 400, 401, 403, 404, 500

### Autenticación JWT
- [ ] `POST /api/v1/auth/register` funciona
- [ ] `POST /api/v1/auth/login` retorna JWT con expiración
- [ ] Contraseñas con bcrypt (nunca texto plano)
- [ ] `JWT_SECRET` en `.env` (nunca hardcodeado)
- [ ] Token inválido/expirado → 401

### Protección de rutas
- [ ] Middleware `authenticate` centralizado
- [ ] Sin token → 401
- [ ] Token inválido → 401
- [ ] `GET /api/v1/users` solo para admin → 403 si no es admin
- [ ] Todos los POST/PUT/DELETE protegidos

### Validaciones
- [ ] Schemas Zod para todos los recursos
- [ ] Validación de body, params (UUID), query (page, limit)
- [ ] Errores 400 con `{ message, details: [{ field, message }] }`
- [ ] Sin stack trace expuesto
- [ ] Errores de BD capturados y traducidos

### Arquitectura y calidad
- [ ] 4 capas: domain / application / infrastructure / interface
- [ ] Controllers NO llaman ORM directamente
- [ ] Sin `any` generalizado
- [ ] Sin `console.log` olvidados
- [ ] ESLint/Prettier sin warnings

### Documentación y entrega
- [ ] `README.md` completo con setup y comandos
- [ ] `.env.example` presente
- [ ] `.env` real NO commiteado (verificar `.gitignore`)
- [ ] Repo público en GitHub
- [ ] Deploy accesible (Render / Railway)
- [ ] Link del deploy en el README

---

## 13. Plan de corrección (orden de diagnóstico)

Cuando algo falle, seguir este orden:

1. ¿`npm run dev` arranca? → revisar `tsconfig.json`, imports, tipos
2. ¿Conecta a Supabase? → revisar `DATABASE_URL` en `.env`, credenciales
3. ¿Auth funciona? → probar register/login con Postman/Thunder Client
4. ¿JWT tiene expiración? → decodificar token en jwt.io
5. ¿Middleware protege rutas? → probar sin token (debe dar 401)
6. ¿Ruta admin da 403 a user normal? → verificar middleware `authorize`
7. ¿Validaciones dan 400 con detalles? → enviar body inválido
8. ¿Paginación retorna `{ data, meta }`? → probar con `?page=1&limit=5`
9. ¿Controllers no tocan ORM directo? → revisar imports en `interface/controllers/`

---

## 14. Bonificaciones (opcionales)

- **Tests (+5 pts):** Priorizar: middleware `authenticate`, use-case `CreateExpense`, validaciones Zod
- **Filtros avanzados combinados (+2 pts):** Combinar `category` + `startDate` + `endDate` en `expenses`