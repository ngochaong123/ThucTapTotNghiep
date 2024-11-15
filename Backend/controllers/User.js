const db = require('../Data/Database'); // Database connection
const multer = require('multer'); // For file uploads
const path = require('path'); // For path operations
const fs = require('fs'); // For file operations
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '..', 'Public', 'User');
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    }
});

const uploadUser = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // Giới hạn kích thước tệp tối đa là 1MB
  fileFilter: (req, file, cb) => {
      cb(null, true); // Cho phép tất cả các tệp
  }
});

const getUser = (req, res) => {
  db.query('SELECT * FROM users LIMIT 1', (err, results) => {
    if (err) {
      console.error('Error fetching user information:', err);
      return res.status(500).json({ error: 'Failed to fetch user information' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update avatar path if it exists
    const user = results[0];
    if (user.avatar_user) {
      user.avatar_user = `/User/${user.avatar_user}`; // Set path for avatar image
    }
    
    // Return the user data with the updated avatar path
    res.status(200).json(user);
  });
};

const editUser = (req, res) => {
  const { user_code, username, full_name, password, email, age, phone_number, country } = req.body;
  const new_avatar_link = req.file ? req.file.filename : null;

  // Kiểm tra nếu thiếu thông tin
  if ( !user_code || !username || !full_name || !password || !email || !phone_number || !country) {
    return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  // Bắt đầu câu truy vấn 
  let query = `
    UPDATE users 
    SET user_code = ?, username = ?, full_name = ?, password = ?, email = ?, age = ?, phone_number = ?, country = ?
  `;
  const params = [user_code ,username, full_name, password, email, age, phone_number, country];

  // Nếu có ảnh đại diện, thêm vào câu truy vấn
  if (new_avatar_link) {
    query += `, avatar_user = ?`;
    params.push(new_avatar_link);
  }
 
  // Thêm điều kiện `WHERE id = 1`
  query += ` WHERE id = 1`;

  // Thực hiện câu truy vấn
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi cập nhật thông tin người dùng:', err);
      return res.status(500).json({ error: 'Không thể cập nhật thông tin người dùng.' });
    }

    // Kiểm tra nếu không có bản ghi nào được cập nhật
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng để cập nhật.' });
    }

    res.status(200).json({ message: 'Thông tin người dùng đã được cập nhật thành công.' });
  });
};

module.exports = { getUser, editUser, uploadUser };
