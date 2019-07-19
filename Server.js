const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server is working on port ${PORT}`));