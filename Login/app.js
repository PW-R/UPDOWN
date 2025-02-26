const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// ใช้ middleware
app.use(cors());  // อนุญาตให้มีการเชื่อมต่อจาก frontend
app.use(bodyParser.json());  // ใช้ body-parser เพื่อแปลงข้อมูล JSON

// Route สำหรับการล็อกอิน
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log(`Login attempt with username: ${username}, password: ${password}`);  // แจ้งเตือนใน console

    // ตัวอย่างข้อมูลผู้ใช้ (สามารถเปลี่ยนเป็นฐานข้อมูลจริงได้)
    const users = [
        { username: 'admin', password: '123456', role: 'admin' },
        { username: 'user', password: 'password', role: 'user' }
    ];

    // ค้นหาผู้ใช้จากข้อมูลที่ให้
    const user = users.find(user => user.username === username);

    // ตรวจสอบการเข้าสู่ระบบ
    if (user && user.password === password) {
        console.log(`Login successful for user: ${username} with role: ${user.role}`);  // แจ้งเตือนเมื่อล็อกอินสำเร็จ
        res.json({
            success: true,
            message: 'Login successful!',
            role: user.role,
        });
    } else {
        console.log(`Login failed for user: ${username}. Invalid credentials.`);  // แจ้งเตือนเมื่อล็อกอินล้มเหลว
        res.json({
            success: false,
            message: 'Invalid username or password',
        });
    }
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
