const dotenv = require('dotenv');
const mysql = require('mysql');

dotenv.config();

let pool;

function createPool() {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB,
    connectionLimit: 10 // número máximo de conexões no pool
  });

  pool.on('connection', function (connection) {
    console.log('Nova conexão ao banco de dados foi estabelecida.');
  });

  pool.on('error', function (err) {
    console.error('Erro no pool de conexões ao banco de dados:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Conexão perdida. Tentando reconectar...');
      createPool(); // Tentar reconectar
    } else {
      throw err;
    }
  });
}

createPool();

module.exports = pool;
