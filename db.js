const mysql = require('mysql2/promise'); // Use the promise version
require('dotenv').config();

const pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: `/cloudsql/${process.env.DB_HOST}`, // SQL Connection | <host: process.env.DB_LOCAL_HOST> | <socketPath: `/cloudsql/${process.env.DB_HOST}`>
    connectionLimit: 10
  });

module.exports = pool;