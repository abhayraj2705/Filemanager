import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { uploadFile, getFiles, deleteFile } from '../controllers/fileController.js';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'filemanager',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', '*'],
        transformation: [{ quality: 'auto' }]
    }
});

// Configure multer with error handling
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 1
    }
}).single('file');

// Wrap upload middleware in error handler
const handleUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({
                message: 'File upload error',
                error: err.message
            });
        } else if (err) {
            console.error('Unknown upload error:', err);
            return res.status(500).json({
                message: 'Unknown upload error',
                error: err.message
            });
        }
        next();
    });
};

router.post('/upload', handleUpload, uploadFile);
router.get('/', getFiles);
router.delete('/:id', deleteFile);

export default router;