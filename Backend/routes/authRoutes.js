const express = require('express');
const { login, register } = require('../controllers/authController');
const { getAllBooks, searchBooks, addBook, editBook, upload } = require('../controllers/LibriaryBook'); 
const {getAllMembers,searchMembers} = require('../controllers/Member');

const router = express.Router();

// Định nghĩa các route cho đăng nhập và đăng ký
router.post('/login', login);
router.post('/register', register);

// Route cho quản lý sách
router.get('/Book', getAllBooks);
router.get('/search', searchBooks); 
router.post('/addBook', upload.single('image_link'), addBook); 
router.put('/edit/:book_code', upload.single('image_link'), editBook); 

//router cho thanh viên 
router.get('/getAllMembers',getAllMembers);
router.get('/searchMembers',searchMembers);

module.exports = router;
