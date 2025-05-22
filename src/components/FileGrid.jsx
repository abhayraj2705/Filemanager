import { Grid, Typography, Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import FileCard from './FileCard';
import UploadButton from './UploadButton';
import { useState } from 'react';

const FileGrid = ({ files, onDelete, currentFolder, onUploadComplete }) => {
  const [viewType, setViewType] = useState('grid');

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewType(newView);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        gap: 2,
        flexWrap: { xs: 'wrap', sm: 'nowrap' }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Typography 
            variant="h5" 
            component="h2"
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            {currentFolder ? 'Folder Contents' : 'All Files'}
          </Typography>
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={handleViewChange}
            size="small"
          >
            <ToggleButton value="grid">
              <Tooltip title="Grid View">
                <GridViewIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="list">
              <Tooltip title="List View">
                <ListIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <UploadButton currentFolder={currentFolder} onUploadComplete={onUploadComplete} />
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <motion.div
          layout
          transition={{ duration: 0.3 }}
        >
          {viewType === 'grid' ? (
            <Grid container spacing={3}>
              <AnimatePresence mode="popLayout">
                {files.map((file) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={file._id}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FileCard file={file} onDelete={onDelete} viewType={viewType} />
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          ) : (
            <Box>
              <AnimatePresence mode="popLayout">
                {files.map((file) => (
                  <motion.div
                    key={file._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FileCard file={file} onDelete={onDelete} viewType={viewType} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>
          )}
        </motion.div>
      </Box>
    </Box>
  );
};

export default FileGrid;