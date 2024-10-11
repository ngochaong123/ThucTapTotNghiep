const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'library_management'
});

db.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

module.exports = db;
