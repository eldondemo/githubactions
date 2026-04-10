const { Pool } = require("pg");

function createPool(config = {}) {
  return new Pool({
    host: process.env.PGHOST || "localhost",
    port: process.env.PGPORT || 5432,
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    database: process.env.PGDATABASE || "testdb",
    ...config,
  });
}

async function migrate(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

async function addUser(pool, name, email) {
  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  return result.rows[0];
}

async function getUser(pool, id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function listUsers(pool) {
  const result = await pool.query("SELECT * FROM users ORDER BY id");
  return result.rows;
}

async function deleteUser(pool, id) {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0] || null;
}

module.exports = { createPool, migrate, addUser, getUser, listUsers, deleteUser };
