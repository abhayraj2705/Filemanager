import File from '../models/File.js';

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            console.error('No file received');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('Processing file:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path
        });

        const file = new File({
            name: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            folderId: req.body.folderId || null
        });

        const savedFile = await file.save();
        console.log('File saved successfully:', savedFile);
        
        res.status(201).json(savedFile);
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ 
            message: 'Error uploading file',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Add the missing function exports
export const getFiles = async (req, res) => {
    try {
        const { folderId } = req.query;
        const query = folderId ? { folderId } : {};
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

export const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        await File.findByIdAndDelete(req.params.id);
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ 
            message: 'Error deleting file',
            error: error.message 
        });
    }
};