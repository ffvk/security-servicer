import { Pool, PoolClient } from 'pg';
import { DATABASE_URL } from '../config/config';

// 🧠 Helper for consistent timestamped logs
const log = (msg: string, ...args: any[]) => {
  console.log(`[${new Date().toISOString()}] 🪵 ${msg}`, ...args);
};

const createPool = (maxConnections: number): Pool => {
    console.log(DATABASE_URL,"sdgeryh")
  if (!DATABASE_URL || typeof DATABASE_URL !== 'string') {
    throw new Error('❌ DATABASE_URL must be a valid string in your config');
  }

  log('🟢 Initializing PostgreSQL connection pool...');
  log('🔗 Connection string (masked):', maskConnectionString(DATABASE_URL));

  const pool = new Pool({
    connectionString: DATABASE_URL,
    max: maxConnections,
    min: 0,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // 🔔 Connection events
  pool.on('connect', (client: PoolClient) => {
    log('✅ New client connected to PostgreSQL');
  });

  pool.on('acquire', () => {
    log('📤 Client acquired from pool');
  });

  pool.on('release', () => {
    log('📥 Client released back to pool');
  });

  pool.on('error', (err) => {
    log('❌ Unexpected PostgreSQL error:', err.message);
  });

  pool.on('end', () => {
    log('🔌 PostgreSQL pool has ended');
  });

  // 🕵️ Wrap query method with timing logs
  const originalQuery = pool.query.bind(pool);
  pool.query = async (text: string, params?: any[]) => {
    const start = Date.now();
    log('🕵️‍♂️ Executing query:', text.trim(), params || []);
    try {
      const res = await originalQuery(text, params);
      const duration = Date.now() - start;
      log(`✅ Query completed in ${duration}ms (${res.rowCount} rows)`);
      return res;
    } catch (err: any) {
      log('❌ Query error:', err.message);
      throw err;
    }
  };

  log('🚀 PostgreSQL pool created successfully.');
  return pool;
};

// 🛡️ Helper to safely mask password in connection string
function maskConnectionString(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    if (url.password) url.password = '****';
    return url.toString();
  } catch {
    return connectionString;
  }
}

export const pool = createPool(100);
export default pool;
