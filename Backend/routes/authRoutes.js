const express = require('express');
const { login, register } = require('../controllers/authController');
const { getAllBooks, searchBooks, addBook,updateBook , upload } = require('../controllers/LibriaryBook');

const router = express.Router();

// login
router.post('/login', login);
router.post('/register', register);

// library
router.get('/Book', getAllBooks);
router.get('/search', searchBooks);
router.post('/addBook', upload.single('image_link'), addBook);  // Sử dụng multer để upload ảnh
router.put('/Book/:book_code', upload.single('avatar'), updateBook);

module.exports = router;
