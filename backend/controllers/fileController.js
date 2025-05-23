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