import { Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRef, useState } from 'react';

const UploadButton = ({ currentFolder, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (currentFolder) {
        formData.append('folderId', currentFolder);
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/files/upload`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Upload failed');
        }

        const data = await response.json();
        console.log('Upload successful:', data);
        onUploadComplete();
    } catch (error) {
        console.error('Error uploading file:', error);
        // Add error handling UI feedback here
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
      <Button
        variant="contained"
        startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        Upload File
      </Button>
    </motion.div>
  );
};

export default UploadButton;