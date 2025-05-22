import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, useMediaQuery, Toolbar } from '@mui/material';
import Navbar from './components/Navbar';
import FileGrid from './components/FileGrid';
import FolderTree from './components/FolderTree';
import axios from 'axios';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#0a1929',
      paper: '#1a2027',
    },
  },
});

// Create a separate component for the app content
function AppContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);

  const fetchData = async () => {
    try {
      const axiosConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        timeout: 5000 // 5 seconds timeout
      };

      const [filesRes, foldersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/files${currentFolder ? `?folderId=${currentFolder}` : ''}`, axiosConfig),
        axios.get(`${import.meta.env.VITE_API_URL}/api/folders`, axiosConfig)
      ]);

      console.log('Files response:', filesRes.data);
      console.log('Folders response:', foldersRes.data);

      setFiles(filesRes.data);
      setFolders(foldersRes.data);
    } catch (error) {
      console.error('Error fetching data:', {
        message: error.message,
        response: error.response?.data,
        config: error.config?.url
      });
    }
  };

  const handleLogoClick = () => {
    setCurrentFolder(null);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [currentFolder]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        onLogoClick={handleLogoClick}
        folders={folders}
        currentFolder={currentFolder}
        setCurrentFolder={setCurrentFolder}
      />
      <Toolbar />
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1,
        gap: 0,
        overflow: 'hidden',
        mt: 0
      }}>
        <AnimatePresence mode="wait">
          {!isMobile && (
            <motion.div
              initial={{ x: -240, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -240, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              style={{ 
                width: 240,
                borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                height: 'calc(100vh - 64px)',
                position: 'fixed',
                top: 64,
                left: 0
              }}
            >
              <FolderTree 
                folders={folders}
                currentFolder={currentFolder}
                setCurrentFolder={setCurrentFolder}
                onUpdate={fetchData}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Box sx={{ 
          flexGrow: 1, 
          p: 3,
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          ml: !isMobile ? '240px' : 0
        }}>
          <FileGrid 
            files={files}
            onDelete={fetchData}
            currentFolder={currentFolder}
            onUploadComplete={fetchData}
          />
        </Box>
      </Box>
    </Box>
  );
}

// Main App component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
