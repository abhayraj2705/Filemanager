import { Card, CardContent, CardActions, Typography, IconButton, Box, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useState } from 'react';

const FileCard = ({ file, onDelete, viewType = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) return <ImageIcon sx={{ fontSize: viewType === 'grid' ? 40 : 24 }} />;
    if (file.type === 'application/pdf') return <PictureAsPdfIcon sx={{ fontSize: viewType === 'grid' ? 40 : 24 }} />;
    return <InsertDriveFileIcon sx={{ fontSize: viewType === 'grid' ? 40 : 24 }} />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const truncateFileName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const nameWithoutExt = name.slice(0, -(extension.length + 1));
    const truncatedName = nameWithoutExt.slice(0, maxLength - 3) + '...';
    return `${truncatedName}.${extension}`;
  };

  const handleDownload = () => {
    window.open(`${import.meta.env.VITE_API_URL}/${file.path}`, '_blank');
  };

  const handleDelete = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/files/${file._id}`, {
        method: 'DELETE',
      });
      onDelete();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  if (viewType === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card
          sx={{
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            p: 2,
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': { boxShadow: 3 }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flex: 1, 
            gap: 2,
            minWidth: 0 // Important for text truncation
          }}>
            {getFileIcon()}
            
            {/* Responsive file name column */}
            <Box sx={{ 
              flexBasis: isMobile ? '40%' : isTablet ? '30%' : '25%',
              minWidth: 0 // Important for text truncation
            }}>
              <Tooltip title={file.name}>
                <Typography 
                  noWrap 
                  sx={{ 
                    fontWeight: 500,
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}
                >
                  {truncateFileName(file.name, isMobile ? 15 : 25)}
                </Typography>
              </Tooltip>
            </Box>

            {/* Hide file type on mobile */}
            {!isMobile && (
              <Typography 
                sx={{ 
                  flex: isTablet ? 0.5 : 1,
                  color: 'text.secondary',
                  display: 'block',
                  minWidth: 0,
                  fontSize: isTablet ? '0.875rem' : '1rem'
                }}
                noWrap
              >
                {file.type.split('/')[1].toUpperCase()}
              </Typography>
            )}

            {/* File size - always visible but condensed on mobile */}
            <Typography 
              sx={{ 
                width: isMobile ? 60 : 100,
                color: 'text.secondary',
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                textAlign: 'right'
              }}
            >
              {formatFileSize(file.size)}
            </Typography>

            {/* Hide date on mobile */}
            {!isMobile && (
              <Typography 
                sx={{ 
                  width: isTablet ? 120 : 180,
                  color: 'text.secondary',
                  fontSize: isTablet ? '0.75rem' : '0.875rem',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {formatDate(file.createdAt)}
              </Typography>
            )}
          </Box>

          {/* Actions */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            ml: 2,
            flexShrink: 0 // Prevent actions from shrinking
          }}>
            <IconButton 
              size={isMobile ? "small" : "medium"} 
              onClick={handleDownload}
            >
              <DownloadIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <IconButton 
              size={isMobile ? "small" : "medium"} 
              onClick={handleDelete} 
              color="error"
            >
              <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Box>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ 
        type: "tween", 
        duration: 0.2 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        sx={{ 
          position: 'relative',
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: 3
          }
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            backgroundColor: 'action.hover'
          }}
        >
          {getFileIcon()}
        </Box>
        <CardContent>
          <Tooltip title={file.name} placement="top">
            <Typography 
              noWrap 
              sx={{ 
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            >
              {truncateFileName(file.name)}
            </Typography>
          </Tooltip>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ display: 'block', mt: 0.5 }}
          >
            {(file.size / 1024).toFixed(2)} KB
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <IconButton 
                  size="small" 
                  onClick={handleDownload}
                  sx={{ mr: 0.5 }}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={handleDelete} 
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </motion.div>
            )}
          </AnimatePresence>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default FileCard;