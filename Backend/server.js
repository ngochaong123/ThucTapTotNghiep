const express = require('express');
const cors = require('cors'); // Import cors
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors()); 

app.use(bodyParser.json());

app.use('/', authRoutes);

const PORT =  5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
