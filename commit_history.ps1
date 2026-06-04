# Script para generar commits pequeños y bien documentados paso a paso

Write-Host "Iniciando proceso de commits para GastoClaro Backend..." -ForegroundColor Green

# 1. Boilerplate y configuración base
git add package.json package-lock.json tsconfig.json eslint.config.mjs .prettierrc .gitignore .env.example
git commit -m "chore: setup initial Express + TypeScript backend with clean architecture" -m "- Configuración estricta de TypeScript`n- Herramientas de linting (ESLint + Prettier)`n- Instalación de dependencias (Express, Zod, pg, JWT, bcrypt)"

# 2. Infraestructura y base de datos
git add src/infrastructure/database/ src/index.ts src/app.ts src/types/express.d.ts
git commit -m "feat(db): implement PostgreSQL connection pool and migrations" -m "- Añadido pool de conexión usando pg`n- Script de migración con tablas (users, expenses, goals, savings, debts)`n- Entry point base del servidor Express"

# 3. Middlewares y utilidades
git add src/interface/middlewares/ src/domain/types/ src/application/dtos/shared.dto.ts
git commit -m "feat(api): implement core middlewares and pagination types" -m "- Auth middleware (JWT)`n- Authorize middleware (roles)`n- Validación con Zod (body, query, params)`n- Tipos globales de paginación"

# 4. Auth Module
git add src/domain/entities/user.entity.ts src/domain/repositories/user.repository.ts src/application/dtos/auth.dto.ts src/application/use-cases/auth/ src/infrastructure/repositories/user.repository.impl.ts src/interface/controllers/auth.controller.ts src/interface/routes/auth.routes.ts
git commit -m "feat(auth): implement user registration and login" -m "- Schemas de Zod para validación`n- Hasheo de contraseña con bcrypt`n- Generación de JWT`n- Capas de repositorio, use-cases y controlador"

# 5. Expenses Module
git add src/domain/entities/expense.entity.ts src/domain/repositories/expense.repository.ts src/application/dtos/expense.dto.ts src/infrastructure/repositories/expense.repository.impl.ts src/interface/controllers/expense.controller.ts src/interface/routes/expense.routes.ts
git commit -m "feat(expenses): implement full CRUD for expenses" -m "- Paginación y filtros por categoría/fecha`n- Validación con Zod`n- Operaciones vinculadas al user_id"

# 6. Goals Module
git add src/domain/entities/goal.entity.ts src/domain/repositories/goal.repository.ts src/application/dtos/goal.dto.ts src/infrastructure/repositories/goal.repository.impl.ts src/interface/controllers/goal.controller.ts src/interface/routes/goal.routes.ts
git commit -m "feat(goals): implement full CRUD for financial goals" -m "- Paginación y filtro por status`n- Validación con Zod`n- Operaciones vinculadas al user_id"

# 7. Savings & Debts Modules
git add src/domain/entities/saving.entity.ts src/domain/repositories/saving.repository.ts src/application/dtos/saving.dto.ts src/infrastructure/repositories/saving.repository.impl.ts src/interface/controllers/saving.controller.ts src/interface/routes/saving.routes.ts src/domain/entities/debt.entity.ts src/domain/repositories/debt.repository.ts src/application/dtos/debt.dto.ts src/infrastructure/repositories/debt.repository.impl.ts src/interface/controllers/debt.controller.ts src/interface/routes/debt.routes.ts
git commit -m "feat(finances): implement CRUD for savings and debts" -m "- Entidades separadas para Savings y Debts`n- Paginación soportada`n- Rutas protegidas"

# 8. Users Admin & Swagger Documentation
git add src/interface/controllers/user.controller.ts src/interface/routes/user.routes.ts src/infrastructure/config/swagger.ts README.md src/domain/entities/index.ts src/domain/repositories/index.ts src/domain/types/index.ts
git add src/app.ts
git commit -m "feat(admin): add user management and Swagger API docs" -m "- Rutas admin protegidas con verificación de rol`n- Configuración de swagger-ui-express`n- README actualizado a rúbrica final"

Write-Host "¡Todos los commits han sido generados exitosamente!" -ForegroundColor Green
Write-Host "Revisa tu log con 'git log' y luego ejecuta 'git push origin main'." -ForegroundColor Cyan
