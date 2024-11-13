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
  const { user_code, username, full_name, password, email, age, phone_number, country, avatar_user } = req.body;
  const new_avatar_link = req.file ? req.file.filename : null;

  // Kiểm tra xem có trường nào bị thiếu không
  if (!user_code || !username || !full_name || !password || !email || !age || !phone_number || !country) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
  }

  // Cập nhật thông tin người dùng trong cơ sở dữ liệu
  const updateSql = `
      UPDATE users 
      SET 
          username = ?, 
          user_code = ?,
          full_name = ?, 
          password = ?, 
          email = ?, 
          age = ?, 
          phone_number = ?, 
          country = ?, 
          avatar_user = COALESCE(?, avatar_user) 
      WHERE user_code = ? 
  `;

  const values = [username, full_name, password, email, age, phone_number, country, new_avatar_link, user_code];

  db.query(updateSql, values, (err, result) => {
      if (err) {
          console.error('Error updating user:', err);
          return res.status(500).json({ error: 'Error updating user', details: err });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
      }

      // Xoá ảnh đại diện cũ nếu có ảnh mới
      if (new_avatar_link && avatar_user) {
          const oldAvatarPath = path.join(__dirname, '../Public/User/', avatar_user);
          fs.unlink(oldAvatarPath, (unlinkErr) => {
              if (unlinkErr) console.error('Error deleting old avatar:', unlinkErr);
          });
      }

      res.status(200).json({ message: 'Người dùng đã được cập nhật thành công' }); 
  });
};


module.exports = { getUser, editUser, uploadUser };
