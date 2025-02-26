import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5002;

// ใช้ middleware
app.use(cors());
app.use(bodyParser.json());

// ให้ Express เสิร์ฟไฟล์จาก downloadFrontend
app.use('/downloadFrontend', express.static(path.join(__dirname, '../downloadFrontend')));

// เสิร์ฟ index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route สำหรับการล็อกอิน
app.get('/downloadFrontend/download.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'downloadFrontend', 'download.html'));
});


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

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
