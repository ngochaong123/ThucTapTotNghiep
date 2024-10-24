const express = require('express');
const { login, register } = require('../controllers/authController');
const { getAllBooks, searchBooks, addBook, editBook, upload } = require('../controllers/LibriaryBook'); // Đảm bảo rằng bạn đã sửa tên controller đúng cách

const router = express.Router();

// Định nghĩa các route cho đăng nhập và đăng ký
router.post('/login', login);
router.post('/register', register);

// Route cho quản lý sách
router.get('/Book', getAllBooks);
router.get('/search', searchBooks); 
router.post('/addBook', upload.single('image_link'), addBook); 
router.put('/edit/:book_code', upload.single('image_link'), editBook); 

module.exports = router;
