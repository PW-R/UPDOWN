import express from 'express';
import cors from 'cors';
import fs from 'fs/promises'; 
import path from 'path';
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const FILES_DIR = path.join(__dirname, '..', 'testData');  // โฟลเดอร์ที่ใช้เก็บไฟล์

app.use(cors());
app.use(express.json());

// ตรวจสอบโฟลเดอร์ data
async function createDataDir() {
    try {
        await fs.mkdir(FILES_DIR, { recursive: true });
        console.log("Data directory created or already exists.");
    } catch (err) {
        console.error("Error creating data directory:", err);
    }
}

createDataDir();

// ดึงรายการไฟล์จากเซิร์ฟเวอร์
app.get("/files", async (req, res) => {
    try {
        const files = await fs.readdir(FILES_DIR);
        res.json(files);
    } catch (err) {
        console.error("Error reading files:", err);
        res.status(500).json({ message: "Error reading files" });
    }
});

app.get("/download/:filename", async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(FILES_DIR, filename);

    
    if (filename.includes("..") || filename.includes("/")) {
        return res.status(400).json({ message: "Invalid filename" });
    }

    try {
        await fs.access(filePath, fs.constants.F_OK);
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error("Error downloading file:", err);
                res.status(500).json({ message: "Error downloading file" });
            }
        });
    } catch (err) {
        console.error("File not found:", err);
        res.status(404).json({ message: "File not found" });
    }
});

app.delete("/delete/:filename", async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(FILES_DIR, filename);
    console.log("Attempting to delete:", filePath);
    
    // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
    try {
        await fs.access(filePath);
    } catch (err) {
        return res.status(404).json({ message: "File not found" });
    }
    
    // ลบไฟล์ด้วย
    try {
        await fs.unlink(filePath);
        res.json({ message: "File deleted successfully" });
    } catch (err) {
        console.error("Error deleting file:", err);
        res.status(500).json({ message: "Error deleting file" });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});