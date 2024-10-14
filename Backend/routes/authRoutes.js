const express = require('express');
const { login, register } = require('../controllers/authController');
const { getAllBooks } = require('../controllers/LibriaryBook'); 

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.get('/Book', getAllBooks);

module.exports = router;
