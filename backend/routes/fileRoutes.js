import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { uploadFile, getFiles, deleteFile } from '../controllers/fileController.js';

const router = express.Router();

// Configure Cloudinary for file upload
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'filemanager',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']
  }
});

const upload = multer({ storage: storage });

// Routes
router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.delete('/:id', deleteFile);

export default router;