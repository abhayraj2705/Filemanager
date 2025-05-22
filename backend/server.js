import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import fileRoutes from './routes/fileRoutes.js';
import folderRoutes from './routes/folderRoutes.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: ['https://filemanager-pja8.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize database connection
let isConnected = false;
const connectToDatabase = async () => {
    if (isConnected) return;
    await connectDB();
    isConnected = true;
};

// Root route
app.get('/', async (req, res) => {
    res.json({ 
        message: 'File Manager API is running',
        endpoints: {
            health: '/api/health',
            files: '/api/files',
            folders: '/api/folders'
        }
    });
});

// Health check route
app.get('/api/health', async (req, res) => {
    try {
        await connectToDatabase();
        res.json({ status: 'ok', message: 'Server is running' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Routes with database connection
app.use('/api/files', async (req, res, next) => {
    await connectToDatabase();
    return fileRoutes(req, res, next);
});

app.use('/api/folders', async (req, res, next) => {
    await connectToDatabase();
    return folderRoutes(req, res, next);
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

// Export the serverless function
export default app;