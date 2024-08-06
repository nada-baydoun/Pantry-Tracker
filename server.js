// const express = require('express');
// const fetch = require('node-fetch');
// const cors = require('cors');
// const { createCanvas, loadImage } = require('canvas');
// const cocoSsd = require('@tensorflow-models/coco-ssd');
// require('@tensorflow/tfjs-node');

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());

// app.post('/upload', async (req, res) => {
//   const { imageUrl } = req.body;
//   try {
//     const model = await cocoSsd.load();
//     const response = await fetch(imageUrl);
//     const buffer = await response.buffer();
//     const image = await loadImage(buffer);
//     const canvas = createCanvas(image.width, image.height);
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(image, 0, 0, image.width, image.height);
//     const predictions = await model.detect(canvas);
    
//     if (predictions.length > 0) {
//       const recognizedItemName = predictions[0].class;
//       res.json({ recognizedItemName });
//     } else {
//       res.status(400).json({ error: 'No objects detected' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Failed to process image' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
