const express = require('express');
const { login, register } = require('../controllers/authController');
const { getAllBooks, searchBooks, addBook, editBook, DeleteBook, categories, location, language, bookUpload } = require('../controllers/LibriaryBook');
const { getAllMembers, searchMembers, addMember, editMember, DeleteMember, memberUpload } = require('../controllers/Member');
const { getAllBorrowBooks, getMemberByCode, getBookByCode, addborrowBook, ChangeBorrowBook, deleteBorrowBook} = require('../controllers/BorrowdBooks');
const { getUser, editUser, uploadUser } = require('../controllers/User');
const { OverduePenaltyChart, quantityBooksChart, genderRatio, borrowedBooksByCategory, registrationTrends,revenueGrowth, memberRegistrationGrowth, bookCountByMonth, memberBorrowGrowth, profitGrowth} = require('../controllers/chart');
const { downloadExcel } = require('../controllers/DowloandData');
const {getAllreturnBooks, getStatuses, calculatePenaltyForAll, getUniqueFee, returnBooks} = require('../controllers/returnBooks')

const router = express.Router();

// Route cho quản lý tài khoản
router.post('/login', login);
router.post('/Register', register); 

// Route cho quản lý sách
router.get('/Book', getAllBooks); 
router.get('/search', searchBooks); 
router.get('/categories', categories); 
router.get('/location', location); 
router.get('/language', language); 
router.post('/addBook', bookUpload.single('image_link'), addBook);
router.delete('/deleteBook/:book_code', DeleteBook);
router.put('/editBook/:book_code', bookUpload.single('image_link'), editBook); 

// Route cho quản lý thành viên
router.get('/Members', getAllMembers); 
router.get('/searchMembers', searchMembers); 
router.post('/addMember', memberUpload.single('avatar_link'), addMember);
router.delete('/deleteMember/:member_code', DeleteMember);
router.put('/editMember/:member_code', memberUpload.single('avatar_link'), editMember); 

//Route cho mượn sách
router.get('/BorrowBooks',getAllBorrowBooks);
router.get('/getMemberByCode/:member_code',getMemberByCode);
router.get('/getBookByCode/:book_code',getBookByCode);
router.post('/addborrowBook',addborrowBook); 
router.post('/ChangeBorrowBook',ChangeBorrowBook);
router.delete('/deleteBorrowBook/:id',deleteBorrowBook);

// Route trả sách
router.get('/getAllreturnBooks',getAllreturnBooks);
router.get('/getStatuses',getStatuses);
router.get('/getUniqueFee',getUniqueFee);
router.post('/calculatePenaltyForAll',calculatePenaltyForAll);
router.delete('/returnBooks/:id',returnBooks); 

//Router chart
router.get('/OverduePenaltyChart',OverduePenaltyChart);
router.get('/quantityBooksChart',quantityBooksChart);
router.get('/genderRatio',genderRatio);
router.get('/borrowedBooksByCategory',borrowedBooksByCategory);
router.get('/registrationTrends',registrationTrends); 

// Router cho dữ liệu so sánh tháng cũ và tháng mới
router.get('/revenueGrowth',revenueGrowth);
router.get('/memberRegistrationGrowth',memberRegistrationGrowth);
router.get('/bookCountByMonth',bookCountByMonth);
router.get('/memberBorrowGrowth',memberBorrowGrowth);
router.get('/profitGrowth',profitGrowth);
 
// Router dowloand data
router.get('/downloadExcel',downloadExcel);

// Route cho quản lý tài khoản cá nhân 
router.get('/getUser', getUser);
router.put('/editUser', uploadUser.single('avatar_user'), editUser);

module.exports = router;
