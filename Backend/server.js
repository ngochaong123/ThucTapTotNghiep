const express = require('express');
const cors = require('cors'); 
const path = require('path');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Phục vụ tệp tĩnh cho ảnh sách
app.use('/Book', express.static(path.join(__dirname, 'Public', 'Book')));
app.use('/Members', express.static(path.join(__dirname, 'Public', 'Members')));
app.use('/User', express.static(path.join(__dirname, 'Public', 'User')));

// Sử dụng routes
app.use('/', authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
