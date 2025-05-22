import File from '../models/File.js';
import { promises as fs } from 'fs';

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
        res.status(400).json({ message: error.message });
    }
};

// Get all files
const getFiles = async (req, res) => {
    try {
        const query = req.query.folderId ? { folderId: req.query.folderId } : {};
        const files = await File.find(query).sort({ createdAt: -1 });
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a file
const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Delete the physical file
        await fs.unlink(file.path);
        // Delete the database entry
        await File.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { uploadFile, getFiles, deleteFile };