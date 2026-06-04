import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno locales
dotenv.config({ path: path.join(__dirname, '.env') });

const RECORDS_PER_TABLE = 100;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const toMoney = (min: number, max: number): string => {
  const value = Math.random() * (max - min) + min;
  return value.toFixed(2);
};

const randomDateRecent = (maxDaysAgo: number): Date => {
  const date = new Date();
  const days = Math.floor(Math.random() * (maxDaysAgo + 1));
  date.setDate(date.getDate() - days);
  return date;
};

const randomDateFuture = (maxDaysAhead: number): Date => {
  const date = new Date();
  const days = Math.floor(Math.random() * (maxDaysAhead + 1));
  date.setDate(date.getDate() + days);
  return date;
};

const pick = <T>(values: T[]): T => values[Math.floor(Math.random() * values.length)];

const buildUser = (index: number, passwordHash: string) => ({
  name: `Usuario Seed ${index + 1}`,
  email: `seed_user_${Date.now()}_${index + 1}@gastoclaro.test`,
  password_hash: passwordHash,
  role: index === 0 ? 'admin' : 'user',
  profile_type: 'standard'
});

const main = async () => {
  const client = await pool.connect();
  try {
    console.log('Iniciando seed de la base de datos...');
    
    await client.query('BEGIN');

    await client.query('TRUNCATE debts, savings, goals, expenses, users RESTART IDENTITY CASCADE');

    console.log(`Generando ${RECORDS_PER_TABLE} usuarios...`);
    const passwordHash = await bcrypt.hash('Password123!', 10);
    const insertedUsers: string[] = [];

    for (let i = 0; i < RECORDS_PER_TABLE; i++) {
      const user = buildUser(i, passwordHash);
      const res = await client.query(
        `INSERT INTO users (name, email, password_hash, role, profile_type)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [user.name, user.email, user.password_hash, user.role, user.profile_type]
      );
      insertedUsers.push(res.rows[0].id as string);
    }
    console.log(`✅ ${RECORDS_PER_TABLE} usuarios insertados.`);

    console.log(`Generando ${RECORDS_PER_TABLE} gastos...`);
    const expenseCategories = ['Alimentación', 'Transporte', 'Entretenimiento', 'Hogar', 'Salud', 'Educación', 'Otros'];
    const paymentMethods = ['Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Transferencia'];

    for (let i = 0; i < RECORDS_PER_TABLE; i++) {
      await client.query(
        `INSERT INTO expenses (user_id, category, description, amount, date, payment_method)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          pick(insertedUsers),
          pick(expenseCategories),
          `Compra ${i + 1}`,
          toMoney(10, 1500),
          randomDateRecent(60),
          pick(paymentMethods)
        ]
      );
    }
    console.log(`✅ ${RECORDS_PER_TABLE} gastos insertados.`);

    console.log(`Generando ${RECORDS_PER_TABLE} metas...`);
    for (let i = 0; i < RECORDS_PER_TABLE; i++) {
      const target = Number(toMoney(500, 10000));
      const current = Math.random() > 0.5 ? Number(toMoney(0, target)) : 0;

      await client.query(
        `INSERT INTO goals (user_id, title, description, target_amount, current_amount, deadline, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          pick(insertedUsers),
          `Meta ${i + 1}`,
          `Descripción de meta ${i + 1}`,
          target.toFixed(2),
          current.toFixed(2),
          randomDateFuture(365),
          current >= target ? 'completed' : 'active'
        ]
      );
    }
    console.log(`✅ ${RECORDS_PER_TABLE} metas insertadas.`);

    console.log(`Generando ${RECORDS_PER_TABLE} ahorros...`);
    const savingSources = ['Sueldo', 'Venta', 'Regalo', 'Inversión', 'Otros'];
    for (let i = 0; i < RECORDS_PER_TABLE; i++) {
      await client.query(
        `INSERT INTO savings (user_id, name, amount, source, date)
         VALUES ($1, $2, $3, $4, $5)`,
        [pick(insertedUsers), `Ahorro ${i + 1}`, toMoney(50, 3000), pick(savingSources), randomDateRecent(90)]
      );
    }
    console.log(`✅ ${RECORDS_PER_TABLE} ahorros insertados.`);

    console.log(`Generando ${RECORDS_PER_TABLE} deudas...`);
    const debtStatuses = ['active', 'paid'];
    for (let i = 0; i < RECORDS_PER_TABLE; i++) {
      await client.query(
        `INSERT INTO debts (user_id, creditor, amount, interest_rate, monthly_payment, due_date, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          pick(insertedUsers),
          `Acreedor ${i + 1}`,
          toMoney(100, 20000),
          toMoney(0, 25),
          toMoney(50, 1000),
          randomDateFuture(730),
          pick(debtStatuses)
        ]
      );
    }
    console.log(`✅ ${RECORDS_PER_TABLE} deudas insertadas.`);

    await client.query('COMMIT');
    console.log('🎉 Seed completado exitosamente.');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en el seed:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

main();
