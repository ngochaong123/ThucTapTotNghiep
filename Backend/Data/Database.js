const mysql = require('mysql2');
const cron = require('node-cron');

// Kết nối tới MySQL
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

// Lịch trình chạy tự động (Cron job)
// Cập nhật trạng thái "Status" hàng ngày lúc 00:00
cron.schedule('0 0 * * *', () => {
  console.log('Running cron job to update returnBook Status...');
  
  const query = `
    UPDATE returnBook rb
    JOIN borrowBooks bb ON rb.borrowBooks_id = bb.borrowBooks_id
    SET rb.Status = CASE
      WHEN bb.returnDate < CURDATE() THEN 'Trễ hạn'
      ELSE 'Đã trả đúng hạn'
    END
    WHERE bb.returnDate IS NOT NULL;
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error updating returnBook Status:', err);
    } else {
      console.log(`Updated returnBook Status successfully. Rows affected: ${results.affectedRows}`);
    }
  });
});

module.exports = db;
