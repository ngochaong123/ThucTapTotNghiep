const express = require('express');
const { login, register } = require('../controllers/authController');
const { getAllBooks, searchBooks, addBook, editBook, DeleteBook, bookUpload } = require('../controllers/LibriaryBook');
const { getAllMembers, searchMembers, addMember, editMember, DeleteMember, memberUpload } = require('../controllers/Member');
const { getUser, editUser, uploadUser } = require('../controllers/User');

const router = express.Router();

// Route cho quản lý tài khoản
router.post('/login', login);
router.post('/register', register);

// Route cho quản lý sách
router.get('/Book', getAllBooks); 
router.get('/search', searchBooks); 
router.post('/addBook', bookUpload.single('image_link'), addBook);
router.delete('/deleteBook/:book_code', DeleteBook);
router.put('/editBook/:book_code', bookUpload.single('image_link'), editBook); 

// Route cho quản lý thành viên
router.get('/Members', getAllMembers); 
router.get('/searchMembers', searchMembers); 
router.post('/addMember', memberUpload.single('avatar_link'), addMember);
router.delete('/deleteMember/:member_code', DeleteMember);
router.put('/editMember/:member_code', memberUpload.single('avatar_link'), editMember); 

// Route cho quản lý tài khoản cá nhân
router.get('/getUser', getUser);
router.put('/editUser', uploadUser.single('avatar_user'), editUser);

module.exports = router;
