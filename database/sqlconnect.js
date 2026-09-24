import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'MemberDB',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL');
    conn.release();
  }
});

export default pool;
