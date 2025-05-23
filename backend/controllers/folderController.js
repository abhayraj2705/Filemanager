import Folder from '../models/Folder.js';
import File from '../models/File.js';

// Create a folder
export const createFolder = async (req, res) => {
    try {
        console.log('Create folder request:', req.body);

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

        const savedFolder = await folder.save();
        console.log('Folder created:', savedFolder);
        res.status(201).json(savedFolder);
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ 
            message: 'Error creating folder',
            error: error.message 
        });
    }
};

// Get all folders
export const getFolders = async (req, res) => {
    try {
        const folders = await Folder.find()
            .populate('parent')
            .sort({ createdAt: -1 });
        res.json(folders);
    } catch (error) {
        console.error('Error fetching folders:', error);
        res.status(500).json({ 
            message: 'Error fetching folders',
            error: error.message 
        });
    }
};

// Get folder by ID
export const getFolderById = async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.id)
            .populate('parent');
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        res.json(folder);
    } catch (error) {
        console.error('Error fetching folder:', error);
        res.status(500).json({ 
            message: 'Error fetching folder',
            error: error.message 
        });
    }
};

// Delete folder
export const deleteFolder = async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.id);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        // Delete all files in the folder
        await File.deleteMany({ folderId: req.params.id });

        // Delete subfolders recursively
        const subFolders = await Folder.find({ parent: req.params.id });
        for (const subFolder of subFolders) {
            await File.deleteMany({ folderId: subFolder._id });
            await Folder.findByIdAndDelete(subFolder._id);
        }

        // Finally delete the folder itself
        await Folder.findByIdAndDelete(req.params.id);

        res.json({ message: 'Folder and its contents deleted successfully' });
    } catch (error) {
        console.error('Error deleting folder:', error);
        res.status(500).json({ 
            message: 'Error deleting folder',
            error: error.message 
        });
    }
};

// Update folder
export const updateFolder = async (req, res) => {
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
        console.error('Error updating folder:', error);
        res.status(500).json({ 
            message: 'Error updating folder',
            error: error.message 
        });
    }
};