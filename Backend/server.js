const express = require('express');
const cors = require('cors'); 
const path = require('path');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const app = express();

// Middleware
app.use(cors());

app.use('/Book', express.static(path.join(__dirname, 'Public', 'Book')));

app.use(bodyParser.json());

app.use('/', authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});