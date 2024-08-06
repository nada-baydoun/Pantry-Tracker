// apps/components/CameraCapture.js

import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { uploadImageToFirebase } from '../utils/firebase'; // Adjust path if necessary

const CameraCapture = ({ open, onClose, onPhotoCaptured }) => {
  const [photo, setPhoto] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const webcamRef = useRef(null);

  const capture = () => {
    setCapturing(true);
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
    setCapturing(false);
  };

  const handleRetake = () => {
    setPhoto(null);
    setCapturing(false);
  };

  const handleKeep = async () => {
    if (photo) {
      const downloadURL = await uploadImageToFirebase(photo);
      onPhotoCaptured(downloadURL);
      setPhoto(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Take a Photo</DialogTitle>
      <DialogContent>
        {capturing ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            {photo ? (
              <Box textAlign="center">
                <img src={photo} alt="Captured" style={{ width: '100%', maxHeight: '400px' }} />
                <Box mt={2}>
                  <Button variant="contained" onClick={handleRetake}>Retake</Button>
                  <Button variant="contained" onClick={handleKeep} style={{ marginLeft: '10px' }}>Keep</Button>
                </Box>
              </Box>
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
              />
            )}
            {!photo && (
              <Box mt={2} textAlign="center">
                <Button variant="contained" onClick={capture}>Capture</Button>
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CameraCapture;
