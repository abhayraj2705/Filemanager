import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import fileRoutes from './routes/fileRoutes.js';
import folderRoutes from './routes/folderRoutes.js';
import path from 'path';

dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.vercel.app']
        : 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB Atlas
connectDB();

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/folders', folderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});