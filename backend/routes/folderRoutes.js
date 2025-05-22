import express from 'express';
import * as folderController from '../controllers/folderController.js';

const router = express.Router();

// Routes
router.post('/', folderController.createFolder);
router.get('/', folderController.getFolders);
router.get('/:id', folderController.getFolderById);
router.delete('/:id', folderController.deleteFolder);
router.put('/:id', folderController.updateFolder);

export default router;