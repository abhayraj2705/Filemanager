import express from 'express';
import { 
    createFolder, 
    getFolders, 
    getFolderById, 
    deleteFolder, 
    updateFolder 
} from '../controllers/folderController.js';

const router = express.Router();

// Ensure all route handlers are defined before using them
router.route('/')
    .post(createFolder)
    .get(getFolders);

router.route('/:id')
    .get(getFolderById)
    .delete(deleteFolder)
    .put(updateFolder);

export default router;