const { Pool } = require("pg");
require("dotenv").config();

const conexion = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.DB_HOST || undefined,
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || undefined,
  user: process.env.DB_USER || undefined,
  password: process.env.DB_PASSWORD || undefined,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

module.exports = conexion;
