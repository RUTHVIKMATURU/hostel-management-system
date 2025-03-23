import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinaryConfig.js';
import Student from '../models/StudentModel.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload/:id', upload.single('profilePhoto'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const result = await cloudinary.uploader.upload_stream({ folder: "profilePhotos" }, async (error, result) => {
            if (error) return res.status(500).json({ error: error.message });

            const student = await Student.findByIdAndUpdate(req.params.id, { profilePhoto: result.secure_url }, { new: true });

            res.json(student);
        }).end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
