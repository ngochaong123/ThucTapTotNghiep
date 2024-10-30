const express = require('express');
const { login, register } = require('../controllers/authController');
const { getAllBooks, searchBooks, addBook, editBook, bookUpload } = require('../controllers/LibriaryBook');
const { getAllMembers, searchMembers, addMember,editMember, memberUpload } = require('../controllers/Member');

const router = express.Router();

// Route cho quản lý tài khoản
router.post('/login', login);
router.post('/register', register);

// Route cho quản lý sách
router.get('/Book', getAllBooks); 
router.get('/search', searchBooks); 
router.post('/addBook', bookUpload.single('image_link'), addBook);
router.put('/editBook/:book_code', bookUpload.single('image_link'), editBook); 

// Route cho quản lý thành viên
router.get('/Members', getAllMembers); 
router.get('/searchMembers', searchMembers); 
router.post('/addMember', memberUpload.single('avatar_link'), addMember);
router.put('/editMember/:member_code', memberUpload.single('avatar_link'), editMember); 

module.exports = router;
