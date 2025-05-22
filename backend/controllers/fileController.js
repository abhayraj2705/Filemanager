import File from '../models/File.js';
import { v2 as cloudinary } from 'cloudinary';

// Upload a file
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const file = new File({
            name: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            folderId: req.body.folderId || null
        });

        await file.save();
        res.status(201).json(file);
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ 
            message: 'Error uploading file',
            error: error.message 
        });
    }
};

// Get all files
const getFiles = async (req, res) => {
    try {
        const query = req.query.folderId ? { folderId: req.query.folderId } : {};
        const files = await File.find(query).sort({ createdAt: -1 });
        res.json(files);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ 
            message: 'Error fetching files',
            error: error.message 
        });
    }
};

// Delete a file
const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Extract public_id from Cloudinary URL
        const publicId = file.path.split('/').slice(-2).join('/').split('.')[0];
        
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);
        
        // Delete from database
        await File.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('File deletion error:', error);
        res.status(500).json({ 
            message: 'Error deleting file',
            error: error.message 
        });
    }
};

export { uploadFile, getFiles, deleteFile };