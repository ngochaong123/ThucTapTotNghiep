const express = require('express');
const { login, register } = require('../controllers/authController');
const { getAllBooks, searchBooks  } = require('../controllers/LibriaryBook'); 

const router = express.Router();

// login
router.post('/login', login);

router.post('/register', register);

// library
router.get('/Book', getAllBooks);

router.get('/search', searchBooks);



module.exports = router;
