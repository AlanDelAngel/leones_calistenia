const mysql = require('mysql2/promise'); // Use the promise version
require('dotenv').config();

const pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: `/cloudsql/${process.env.DB_HOST}`, // Cloud SQL Connection
    connectionLimit: 10
  });

module.exports = pool;
