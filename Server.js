const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

//Define Routes
app.use('/api/users', require('./routes/api/Users'));
app.use('/api/auth', require('./routes/api/Auth'));
app.use('/api/profile', require('./routes/api/Profile'));
app.use('/api/posts', require('./routes/api/Posts'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server is working on port ${PORT}`));