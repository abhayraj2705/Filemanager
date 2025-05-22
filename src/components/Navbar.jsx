import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Container, 
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FolderIcon from '@mui/icons-material/Folder';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = ({ onLogoClick, folders, currentFolder, setCurrentFolder }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFolderClick = (folderId) => {
    setCurrentFolder(folderId);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: '100%',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
            >
              <IconButton 
                edge="start" 
                color="inherit" 
                sx={{ mr: 2 }}
                onClick={onLogoClick}
              >
                <FolderIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </motion.div>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 600,
                letterSpacing: '0.5px',
                cursor: 'pointer'
              }}
              onClick={onLogoClick}
            >
              File Manager
            </Typography>
            {isMobile && (
              <IconButton 
                color="inherit" 
                onClick={() => setDrawerOpen(true)}
                edge="end"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
            borderLeft: '1px solid rgba(255, 255, 255, 0.12)'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Folders
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItem 
            button 
            onClick={() => {
              onLogoClick();
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>
              <FolderIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="All Files" />
          </ListItem>
          <AnimatePresence>
            {folders.map((folder) => (
              <motion.div
                key={folder._id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ListItem 
                  button
                  selected={currentFolder === folder._id}
                  onClick={() => handleFolderClick(folder._id)}
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
      </Drawer>
    </>
  );
};

export default Navbar;