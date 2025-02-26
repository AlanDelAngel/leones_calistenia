const mysql = require('mysql2/promise'); // Use the promise version
require('dotenv').config();

const pool = mysql.createPool({
    socketPath: `/cloudsql/${process.env.DB_HOST}`, // to switch between gcloud db and localhost see .env notes
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 50
  });

module.exports = pool;