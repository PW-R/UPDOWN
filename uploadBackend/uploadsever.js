import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = "uploads/";
const counterFile = "counter.txt";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const getNextId = () => {
    let id = 1;
    if (fs.existsSync(counterFile)) {
        id = parseInt(fs.readFileSync(counterFile, "utf8"), 10) + 1;
    }
    fs.writeFileSync(counterFile, id.toString()); // Save new ID
    return id;
};

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const idNumber = getNextId();
        const originalName = file.originalname.replace(/\s+/g, "_"); // Replace spaces with "_"
        const newFileName = `(${idNumber})-${originalName}`;
        cb(null, newFileName);
    },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "File upload failed!" });
    }
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({
        message: "File uploaded successfully!",
        fileId: req.file.filename, 
        fileUrl,
    });
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
