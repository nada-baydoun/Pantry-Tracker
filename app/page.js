'use client';
import GirlyTitle from './GirlyTitle';
import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { firestore, storage } from '../firebase';
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Camera } from 'react-camera-pro';
import {
  collection,
  query,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  orderBy,
  limit,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PageWrapper = styled.div`
  background-color: #FFF0F5;
  min-height: 100vh;
  padding: 20px;
`;

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 70%;
  height: 70%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const CameraWrapper = styled.div`
  position: relative;
  width: 80%;
  height: 80%;
`;

const Control = styled.div`
  position: absolute;
  right: -60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  box-sizing: border-box;
  z-index: 10;
`;

const StyledButton = styled(Button)`
  background-color: #FF69B4;
  color: white;
  &:hover {
    background-color: #FF1493;
  }
`;

const TakePhotoButton = styled(StyledButton)`
  background: url('https://img.icons8.com/ios/50/000000/compact-camera.png');
  background-position: center;
  background-size: 30px;
  width: 50px;
  height: 50px;
  border: solid 2px black;
  border-radius: 50%;
  margin-bottom: 10px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const ChangeFacingCameraButton = styled(StyledButton)`
  background: url(https://img.icons8.com/ios/50/000000/switch-camera.png);
  background-position: center;
  background-size: 20px;
  width: 30px;
  height: 30px;
  padding: 30px;
  &:disabled {
    opacity: 1;
    cursor: default;
  }
  @media (max-width: 400px) {
    padding: 30px 5px;
  }
`;

const ImagePreview = styled.div`
  width: 60px;
  height: 60px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  ${({ image }) =>
    image &&
    `
    background-image: url(${image});
  `}
  margin-bottom: 20px;
  @media (max-width: 400px) {
    width: 50px;
    height: 50px;
  }
`;

const CloseButton = styled(StyledButton)`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  z-index: 20;
  filter: invert(100%);
`;

const TitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled(Typography)`
  font-family: 'Pacifico', cursive;
  color: #FF69B4;
  font-weight: bold;
  font-size: 3rem;
`;

function ImagePreviewc({ image }) {
  return (
    <div
      style={{
        width: '60px',
        height: '60px',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: image && `url(${image})`,
        marginBottom: '20px',
      }}
    />
  );
}

const RecentImagePreview = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const InventoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ItemCard = styled.div`
  background-color: #FFB6C1;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const ItemName = styled(Typography)`
  font-family: 'Comic Sans MS', cursive;
  color: #8B008B;
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const ItemQuantity = styled(Typography)`
  font-family: 'Arial', sans-serif;
  color: #4B0082;
  margin-bottom: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 5px;
`;

const InventoryContainer = styled.div`
  border: 4px solid #FF69B4;
  border-radius: 20px;
  padding: 20px;
  margin-top: 30px;
  background-color: #FFF0F5;
  box-shadow: 0 0 15px rgba(255, 105, 180, 0.3);
`;

const InventoryTitle = styled(Typography)`
  font-family: 'Pacifico', cursive;
  color: #FF1493;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
`;

const StyledContainer = styled.div`
  border: 4px solid #FF69B4;
  border-radius: 20px;
  padding: 20px;
  margin-top: 30px;
  background-color: #FFF0F5;
  box-shadow: 0 0 15px rgba(255, 105, 180, 0.3);
`;


export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [recentImagePreview, setRecentImagePreview] = useState(null);
  const [recentImage, setRecentImage] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [recognizedObject, setRecognizedObject] = useState(null);
  //const canvasRef = useRef(null); // Reference for the canvas
  const [cocoSSDModel, setCocoSSDModel] = useState(null);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  //const [apiKey, setApiKey] = useState('');
  
  const API_KEY = 'AIzaSyADTRrYY3r_e9vtIiSJlP4zAr7e1Cdg0Nc';

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = docs.docs.map((doc) => ({
      name: doc.id,
      ...doc.data(),
    }));
    setInventory(inventoryList);
    await fetchRecentImage();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity - 1 <= 0) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { ...docSnap.data(), quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  const addItem = async (item, imageUrl = null) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    const timestamp = Date.now();
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { ...docSnap.data(), quantity: quantity + 1, imageUrl, timestamp });
    } else {
      //
      await setDoc(docRef, { quantity: 1, imageUrl, timestamp });
    }
    await updateInventory(); // This will also fetch the recent image
  };

  const fetchRecentImage = async () => {
    const snapshot = await getDocs(
      query(collection(firestore, 'inventory'), orderBy('timestamp', 'desc'), limit(1))
    );
    if (!snapshot.empty) {
      const recentItem = snapshot.docs[0].data();
      if (recentItem.imageUrl) {
        setRecentImage(recentItem.imageUrl);
      } else {
        setRecentImage(null);
      }
    } else {
      setRecentImage(null);
    }
  };

  useEffect(() => {
    updateInventory();
    initializeTensorFlowAndLoadModel();
  }, []);

  useEffect(() => {
    // Attempt to retrieve the API key from localStorage
    const storedApiKey = localStorage.getItem('AIzaSyADTRrYY3r_e9vtIiSJlP4zAr7e1Cdg0Nc');
    // if (storedApiKey) {
    //   setApiKey(storedApiKey);
    // }
  }, []);

  const initializeTensorFlowAndLoadModel = async () => {
    try {
      await tf.ready();
      console.log('TensorFlow.js initialized');
  
      // Load a more comprehensive COCO-SSD model
      const loadedModel = await cocossd.load({
        base: 'mobilenet_v2'
      });
      setCocoSSDModel(loadedModel);
      console.log('COCO-SSD model loaded successfully');
    } catch (error) {
      console.error('Error initializing TensorFlow.js or loading COCO-SSD model:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenDialog = (item) => {
    setItemToDelete(item);
    setDialogOpen(true);
  };
  const handleCloseDialog = async (confirm) => {
    if (confirm) {
      await deleteItem(itemToDelete);
    }
    setDialogOpen(false);
  };
  const handleAddItemFromCamera = () => {
    setCameraOpen(true);
  };

  const checkImageReady = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error checking image:', error);
      return false;
    }
  };

  const recognizeItem = async (imageElement) => {
    if (!cocoSSDModel) {
      console.error('COCO-SSD model not loaded');
      return null;
    }
  
    let tensor = null;
    try {
      tensor = tf.browser.fromPixels(imageElement);
      const predictions = await cocoSSDModel.detect(tensor);
      
      console.log('All predictions:', predictions);
  
      // Lower the confidence threshold to 0.2
      const confidentPredictions = predictions.filter(pred => pred.score > 0);
  
      console.log('Confident predictions:', confidentPredictions);
  
      if (confidentPredictions.length > 0) {
        // Return all confident predictions
        return confidentPredictions.map(pred => pred.class).join(', ');
      }
      
      return null;
    } catch (error) {
      console.error('Error recognizing item:', error);
      setError('Failed to recognize the item. Please try again.');
      return null;
    } finally {
      if (tensor) {
        tensor.dispose();
      }
    }
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const image = cameraRef.current.takePhoto();
        setCapturedImage(image);
        setIsLoadingImage(true);
        setError(null);
  
        const storageRef = ref(storage, `images/${Date.now()}.jpg`);
        await uploadString(storageRef, image, 'data_url');
        const imageUrl = await getDownloadURL(storageRef);
        
        const imgElement = new Image();
        imgElement.src = image;
        await new Promise((resolve, reject) => {
          imgElement.onload = resolve;
          imgElement.onerror = reject;
        });
  
        const recognizedItems = await recognizeItem(imgElement);
        console.log('Recognized items:', recognizedItems);
  
        setRecognizedObject(recognizedItems || 'Unknown Item');
        await addItem(recognizedItems || 'New Item', imageUrl);
        setRecentImagePreview(imageUrl);
      } catch (error) {
        console.error('Error processing image:', error);
        setError('Failed to process the image. Please try again.');
      } finally {
        setIsLoadingImage(false);
      }
    }
  };

  const handleCloseCamera = () => {
    setCameraOpen(false);
    setCapturedImage(null);
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleCloseImage = () => {
    setRecentImage(null);
  };

  const filteredInventory = inventory
    .filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => {
      if (filterOption === 'nameAsc') {
        return a.name.localeCompare(b.name);
      } else if (filterOption === 'nameDesc') {
        return b.name.localeCompare(a.name);
      } else if (filterOption === 'quantityAsc') {
        return a.quantity - b.quantity;
      } else if (filterOption === 'quantityDesc') {
        return b.quantity - a.quantity;
      }
      return 0;
    });


  const generateRecipe = async () => {
    setIsGeneratingRecipe(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const inventoryItems = inventory.map(item => item.name);
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
      
      const prompt = `Based on the following items: ${inventoryItems.join(', ')}, make a recipe using the items that are suitable for cooking. Ignore any non-edible items. Your output should look like this:

"Mixing (list all the items you want to mix comma separated), you can do a 😋the recipe name😋

The steps are the following:

Here enumerate all steps you want"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedRecipe = response.text;
      
      setRecipe(generatedRecipe);
    } catch (error) {
      console.error('Error generating recipe:', error);
      setError('Failed to generate recipe. Please try again.');
    } finally {
      setIsGeneratingRecipe(false);
    }
  };
  

    return (
      <PageWrapper>
        <GirlyTitle />
        <Box display="flex" flexDirection="column" alignItems="center">
          
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Item Name"
                type="text"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  addItem(itemName);
                  handleClose();
                }}
                color="primary"
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>
  
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete {itemToDelete}?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleCloseDialog(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={() => handleCloseDialog(true)} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
  
          <Modal open={cameraOpen} onClose={handleCloseCamera}>
            <Wrapper>
              <CameraWrapper>
                <CloseButton onClick={handleCloseCamera}>
                  <CloseIcon />
                </CloseButton>
                <Camera ref={cameraRef} aspectRatio="cover" numberOfCamerasCallback={setNumberOfCameras} />
                <Control>
                  <ImagePreview image={capturedImage} /> 
                  <TakePhotoButton onClick={handleCapture} />
                  <ChangeFacingCameraButton
                    disabled={numberOfCameras <= 1}
                    onClick={() => cameraRef.current?.switchCamera()}
                  />
                </Control>
              </CameraWrapper>
            </Wrapper>
          </Modal>
  
          <Box display="flex" gap={2} alignItems="center" marginBottom={3}>
            <StyledButton variant="contained" onClick={handleOpen}>
              Add New Item
            </StyledButton>
            <StyledButton variant="contained" onClick={handleAddItemFromCamera} startIcon={<CameraAltIcon />}>
              Add Item from Camera
            </StyledButton>
            <FormControl variant="outlined">
              <InputLabel>Filter</InputLabel>
              <Select
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
                label="Filter"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="nameAsc">Name Ascending</MenuItem>
                <MenuItem value="nameDesc">Name Descending</MenuItem>
                <MenuItem value="quantityAsc">Quantity Ascending</MenuItem>
                <MenuItem value="quantityDesc">Quantity Descending</MenuItem>
              </Select>
            </FormControl>
            <TextField
              variant="outlined"
              placeholder="Search"
              value={searchText}
              onChange={handleSearch}
              InputProps={{ startAdornment: <SearchIcon /> }}
            />
          </Box>

        {/* Box for the recent image preview */}
        
      <RecentImagePreview>
        {isLoadingImage && <CircularProgress size={30} />}
        {recentImage && <img src={recentImage} alt="Recent Item" />}
        <Typography variant="body1" mt={1}>
          {recognizedObject && <span>Recognized Item: {recognizedObject}</span>}
        </Typography>
        {error && (
          <Typography variant="body1" color="error" mt={1}>
            {error}
          </Typography>
        )}
      </RecentImagePreview>
    

      <StyledContainer>
          <InventoryTitle>
            InventorAI Items
          </InventoryTitle>
          <InventoryGrid>
            {filteredInventory.map(({ name, quantity, imageUrl }) => (
              <ItemCard key={name}>
                {imageUrl && <ItemImage src={imageUrl} alt={name} />}
                <ItemName>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </ItemName>
                <ItemQuantity>Quantity: {quantity}</ItemQuantity>
                <ButtonGroup>
                  <StyledButton onClick={() => addItem(name)} size="small">
                    <AddIcon />
                  </StyledButton>
                  <StyledButton onClick={() => removeItem(name)} size="small">
                    <RemoveIcon />
                  </StyledButton>
                  <StyledButton onClick={() => handleOpenDialog(name)} size="small">
                    <DeleteIcon />
                  </StyledButton>
                </ButtonGroup>
              </ItemCard>
            ))}
          </InventoryGrid>
        </StyledContainer>

        <StyledContainer>
    <Box width="100%" maxWidth="800px" border="1px solid #FF69B4" borderRadius={2} p={2} mt={4}>
          <Box bgcolor="#FFB6C1" p={2} borderRadius={2} mb={2}>
            <Typography variant="h4" color="#8B008B" textAlign="center" fontFamily="'Pacifico', cursive">
              Recipe Generator
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <StyledButton
              variant="contained"
              onClick={generateRecipe}
              disabled={isGeneratingRecipe}
            >
              {isGeneratingRecipe ? <CircularProgress size={24} /> : 'Generate a Recipe Now!'}
            </StyledButton>
          </Box>
          {recipe && (
            <Box bgcolor="#FFF0F5" p={2} borderRadius={2}>
              <Typography variant="body1" whiteSpace="pre-line" fontFamily="'Comic Sans MS', cursive" color="#8B008B">
                {recipe}
              </Typography>
            </Box>
          )}
        </Box>
        </StyledContainer>
      </Box>
     
    </PageWrapper>
  );
}