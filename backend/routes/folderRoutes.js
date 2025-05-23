import express from 'express';
import { 
    createFolder, 
    getFolders, 
    getFolderById, 
    deleteFolder, 
    updateFolder 
} from '../controllers/folderController.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        await createFolder(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        await getFolders(req, res);
    } catch (error) {
        next(error);
    }
});

router.route('/:id')
    .get(getFolderById)
    .delete(deleteFolder)
    .put(updateFolder);

export default router;