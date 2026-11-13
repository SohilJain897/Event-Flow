
const mysql = require("mysql2/promise");
const fs = require("fs");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 4000,

  ssl: process.env.DB_SSL_CA
    ? {
        ca: fs.readFileSync(process.env.DB_SSL_CA),
        rejectUnauthorized: true,
      }
    : undefined,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
