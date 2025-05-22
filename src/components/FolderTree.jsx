import { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const FolderTree = ({ folders, currentFolder, setCurrentFolder, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFolderName,
          parentId: currentFolder
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setNewFolderName('');
      setIsDialogOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleDeleteFolder = async (folderId, event) => {
    event.stopPropagation();
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/folders/${folderId}`, {
        method: 'DELETE',
      });
      if (currentFolder === folderId) {
        setCurrentFolder(null);
      }
      onUpdate();
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  return (
    <Box sx={{ 
      height: '100%',
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          New Folder
        </Button>
      </Box>
      <List sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '3px',
        }
      }}>
        <AnimatePresence>
          {folders.map((folder) => (
            <motion.div
              key={folder._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ListItem
                component="div"
                onClick={() => setCurrentFolder(folder._id)}
                selected={currentFolder === folder._id}
                sx={{
                  my: 0.5,
                  borderRadius: 1,
                  mx: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    '& .delete-btn': {
                      opacity: 1
                    }
                  }
                }}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={(e) => handleDeleteFolder(folder._id, e)}
                    size="small"
                    className="delete-btn"
                    sx={{ 
                      opacity: 0,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <FolderIcon color={currentFolder === folder._id ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText 
                  primary={folder.name}
                  primaryTypographyProps={{
                    noWrap: true
                  }}
                />
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>

      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '300px'
          }
        }}
      >
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setIsDialogOpen(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateFolder} 
            variant="contained"
            sx={{ textTransform: 'none' }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FolderTree;