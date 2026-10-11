import dns from "node:dns";
import { Pool } from "pg";

dns.setDefaultResultOrder("ipv4first");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },

  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 45000,
  statement_timeout: 20000,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err.message);
});

export default pool;
