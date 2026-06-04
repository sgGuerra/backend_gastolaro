import { Pool } from 'pg';

/**
 * Pool de conexión a PostgreSQL (Supabase).
 * Lee DATABASE_URL desde las variables de entorno.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

/**
 * Verifica la conexión a la base de datos.
 */
export const testConnection = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW()');
    console.warn(`✅ Database connected: ${result.rows[0].now}`);
  } finally {
    client.release();
  }
};

export default pool;
