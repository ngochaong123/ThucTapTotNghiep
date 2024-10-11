const db = require('../Data/Database');

// Trong authController.js
const login = (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra xem có đủ dữ liệu đăng nhập hay không
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin.' });
  }

  // Truy vấn dữ liệu từ bảng users
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.execute(query, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Lỗi server.', error: err });
    }

    // Kiểm tra xem có tìm thấy người dùng không
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }

    // Lấy dữ liệu người dùng và trả về
    const user = results[0]; // Kết quả đầu tiên trong mảng
    return res.status(200).json({ 
      success: true, // Thêm thuộc tính success
      message: 'Đăng nhập thành công.',
      user: {
        id: user.id,
        username: user.username,
      }
    });
  });
};


// API đăng ký
const register = (req, res) => {
  const { username, email, password } = req.body;

  // Kiểm tra nếu thông tin bị thiếu
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin." });
  }

  // Truy vấn để thêm người dùng mới vào cơ sở dữ liệu
  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.execute(query, [username, email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Lỗi server." });
    }

    return res.status(200).json({ success: true, message: "Đăng ký thành công!" });
  });
};

// Xuất hàm
module.exports = { login ,register };
