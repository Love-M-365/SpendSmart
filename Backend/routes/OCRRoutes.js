const express = require('express');
const router = express.Router();
const Tesseract = require('tesseract.js');

router.post('/scan', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const imageBuffer = Buffer.from(imageBase64, 'base64');

    const { data } = await Tesseract.recognize(imageBuffer, 'eng');
    res.json({ text: data.text });
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ error: 'OCR failed' });
  }
});

module.exports = router;


