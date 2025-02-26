const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser'); // ✅ Import body-parser

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from downloadFrontend
app.use('/downloadFrontend', express.static(path.join(__dirname, '../downloadFrontend')));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve download.html
app.get('/downloadFrontend/download.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../downloadFrontend', 'download.html')); // ✅ Fixed path
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt with username: ${username}, password: ${password}`);

    const users = [
        { username: 'admin', password: '123456', role: 'admin' },
        { username: 'user', password: 'password', role: 'user' }
    ];

    const user = users.find(user => user.username === username);

    if (user && user.password === password) {
        res.json({
            success: true,
            message: 'Login successful!',
            role: user.role,
        });
    } else {
        res.json({
            success: false,
            message: 'Invalid username or password',
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
