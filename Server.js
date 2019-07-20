const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect DB
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//Define Routes
app.use('/api/account', require('./routes/api/Account'));
app.use('/api/auth', require('./routes/api/Auth'));
app.use('/api/profile', require('./routes/api/Profile'));
app.use('/api/posts', require('./routes/api/Posts'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server is working on port ${PORT}`));