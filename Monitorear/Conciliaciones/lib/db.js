import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Utiliza esto si estás utilizando Azure SQL o si necesitas encriptar la conexión
    trustServerCertificate: true, // Cambia esto según tus necesidades
  },
  requestTimeout: 240000, // Tiempo de espera de las solicitudes en milisegundos (60 segundos)

};

let pool;

export async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}
