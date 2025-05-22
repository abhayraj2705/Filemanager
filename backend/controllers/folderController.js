import Folder from '../models/Folder.js';
import File from '../models/File.js';
import { promises as fs } from 'fs';

// Create a folder
const createFolder = async (req, res) => {
    try {
        // Check if folder name is provided
        if (!req.body.name) {
            return res.status(400).json({ message: 'Folder name is required' });
        }

        // Check if folder already exists in the same parent
        const existingFolder = await Folder.findOne({
            name: req.body.name,
            parent: req.body.parentId || null
        });

        if (existingFolder) {
            return res.status(400).json({ message: 'Folder already exists' });
        }

        const folder = new Folder({
            name: req.body.name,
            parent: req.body.parentId || null
        });
        await folder.save();
        res.status(201).json(folder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all folders
const getFolders = async (req, res) => {
    try {
        const folders = await Folder.find()
            .populate('parent')
            .sort({ createdAt: -1 });
        res.json(folders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get folder by ID
const getFolderById = async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.id)
            .populate('parent');
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        res.json(folder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete folder recursively
const deleteFilesInFolder = async (folderId) => {
    const files = await File.find({ folderId });
    for (const file of files) {
        try {
            await fs.unlink(file.path);
            await File.findByIdAndDelete(file._id);
        } catch (error) {
            console.error(`Error deleting file ${file.name}:`, error);
        }
    }
};

// Delete folder
const deleteFolder = async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.id);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        // Delete all files in the folder
        await deleteFilesInFolder(req.params.id);

        // Delete subfolders recursively
        const subFolders = await Folder.find({ parent: req.params.id });
        for (const subFolder of subFolders) {
            await deleteFilesInFolder(subFolder._id);
            await Folder.findByIdAndDelete(subFolder._id);
        }

        // Finally delete the folder itself
        await Folder.findByIdAndDelete(req.params.id);

        res.json({ message: 'Folder and its contents deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update folder
const updateFolder = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ message: 'Folder name is required' });
        }

        // Check if folder with new name already exists
        const existingFolder = await Folder.findOne({
            name: req.body.name,
            parent: req.body.parentId || null,
            _id: { $ne: req.params.id }
        });

        if (existingFolder) {
            return res.status(400).json({ message: 'Folder name already exists' });
        }

        const folder = await Folder.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                parent: req.body.parentId || null
            },
            { new: true }
        );
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        res.json(folder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export all functions
export {
    createFolder,
    getFolders,
    getFolderById,
    deleteFolder,
    updateFolder
};