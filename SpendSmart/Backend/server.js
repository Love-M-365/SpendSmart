const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(express.json({ limit: '10mb' })); // Allow large base64 payloads
app.use(express.urlencoded({ extended: true }));

app.post('/api/ocr', upload.single('image'), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;

    const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
    const amount = extractTotal(text);
    const category = predictCategory(text);

    res.json({ text, amount, category });
  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

const extractTotal = (text) => {
  const lines = text.split('\n');
  let totalAmount = '';
  let fallbackAmount = '';

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].toLowerCase();

    // Skip misleading lines
    if (/subtotal|coupon|round off|platform fee|packaging|delivery|tax/i.test(line)) continue;

    // Look for exact 'total' mentions
    if (/total/i.test(line)) {
      const match = line.match(/(?:₹|rs\.?)?\s*[\d,]+\.\d{0,2}|\d+/gi);
      if (match) {
        const cleaned = match[match.length - 1].replace(/[^\d.,]/g, ''); // Allow commas and dots
        // Remove commas, then return the cleaned amount
        const amount = cleaned.replace(/,/g, '');
        if (!isNaN(amount)) {
          totalAmount = amount;
          break;
        }
      }
    }

    // Fallback - line with only numbers might be the total
    if (!fallbackAmount && /^\d{2,6}$/.test(line.trim())) {
      fallbackAmount = line.trim();
    }
  }

  return totalAmount || fallbackAmount || '';
};

const predictCategory = (text) => {
  // Dummy logic (replace with ML model if needed)
  if (text.toLowerCase().includes('food')) return 'Food';
  if (text.toLowerCase().includes('uber') || text.toLowerCase().includes('ola')) return 'Transport';
  return 'Others';
};

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
