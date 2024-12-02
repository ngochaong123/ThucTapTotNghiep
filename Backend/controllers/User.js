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
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
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
  const {user_code, username, full_name, password, email, age, phone_number, gender } = req.body;
  const new_avatar_link = req.file ? req.file.filename : null;

  // Kiểm tra nếu thiếu thông tin
  if (!user_code || !username || !full_name || !password || !email || !phone_number || !gender) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  // Truy vấn để lấy avatar cũ
  const sql = `SELECT avatar_user FROM users WHERE id = 1`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi khi tìm kiếm người dùng:', err);
      return res.status(500).json({ error: 'Lỗi khi tìm kiếm người dùng.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng với id này.' });
    }

    const old_avatar_link = results[0].avatar_user;

    // Cập nhật thông tin người dùng
    let updateSql = `
      UPDATE users 
      SET
        user_code = ?,
        username = ?, 
        full_name = ?, 
        password = ?, 
        email = ?, 
        age = ?, 
        phone_number = ?, 
        gender = ?
    `;

    const params = [user_code, username, full_name, password, email, age, phone_number, gender];

    // Nếu có ảnh đại diện mới, xử lý xóa ảnh cũ và cập nhật ảnh mới
    if (new_avatar_link) {
      updateSql += `, avatar_user = ?`;
      params.push(new_avatar_link);

      // Xóa ảnh cũ nếu có
      if (old_avatar_link) {
        const oldAvatarPath = path.resolve(__dirname, '..', 'Public', 'User', old_avatar_link);
        fs.unlink(oldAvatarPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Lỗi khi xóa ảnh đại diện cũ:', unlinkErr);
          }
        });
      }
    }
 
    // Thêm điều kiện `WHERE id = 1`
    updateSql += ` WHERE id = 1`;

    db.query(updateSql, params, (err, result) => {
      if (err) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', err);
        return res.status(500).json({ error: 'Lỗi khi cập nhật thông tin người dùng.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật.' });
      }

      res.status(200).json({ message: 'Thông tin người dùng đã được cập nhật thành công.' });
    });
  });
};

module.exports = { getUser, editUser, uploadUser };
