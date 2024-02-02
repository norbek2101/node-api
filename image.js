const express = require('express');
const path = require('path');


const app = express();

const router = express.Router();


app.use(express.json());


router.get('/:imageName', (req, res) => {
    const { imageName } = req.params;
    const imagePath = path.join(__dirname, '..', 'media', 'images', imageName);
  
    if (fileExists(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send('Image not found');
    }
  });


  function fileExists(filePath) {
    try {
      return fs.existsSync(filePath);
    } catch (err) {
      return false;
    }
  } 


  module.exports = router;
  