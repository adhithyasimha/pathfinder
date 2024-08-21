const sharp = require('sharp');
const fs = require('fs');

const inputPath = '/Users/adhithya/naksh/public/textures/luna/moon.tif';
const outputPath = '/Users/adhithya/naksh/public/textures/luna/moon.jpg';

sharp(inputPath, { limitInputPixels: 1e9 }) // Set the pixel limit to 1 billion pixels
  .toFormat('jpeg')
  .toFile(outputPath, (err, info) => {
    if (err) {
      console.error('Error converting image:', err);
    } else {
      console.log('Image converted successfully:', info);
    }
  });