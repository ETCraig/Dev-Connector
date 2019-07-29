const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

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

//Serve Static Assets
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server is working on port ${PORT}`));