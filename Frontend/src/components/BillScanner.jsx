import React, { useState, useRef } from 'react';
import Navbar from './Navbar';

const BillScanner = () => {
  const [extractedText, setExtractedText] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [category, setCategory] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      recognizeTextFromFile(file);
    }
  };

  const handleCameraClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use rear camera for mobile
      });

      // Set the video stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // Ensure autoplay works on mobile devices
      }
    } catch (error) {
      console.error('Failed to access camera:', error);
    }
  };

  const captureImage = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current.toBlob((blob) => {
      recognizeTextFromFile(blob);
    }, 'image/jpeg');
  };

  const recognizeTextFromFile = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/ocr', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Server OCR Result:', result);

      setExtractedText(result.text);
      setTotalAmount(result.amount);
      setCategory(result.category);

      sendToBackend(result.amount, result.category);
    } catch (error) {
      console.error('Error sending image to backend:', error);
    }
  };

  const extractTotal = (text) => {
    const lines = text.split('\n');
    let totalAmount = '';
    let fallbackAmount = '';

    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].toLowerCase();

      if (/subtotal|coupon|round off|platform fee|packaging|delivery|tax/i.test(line)) continue;

      if (/total/i.test(line)) {
        const match = line.match(/(?:₹|rs\.?)?\s*[\d,]+\.\d{0,2}|\d+/gi);
        if (match) {
          const cleaned = match[match.length - 1].replace(/[^\d.,]/g, ''); // Allow commas and dots
          const amount = cleaned.replace(/,/g, '');
          if (!isNaN(amount)) {
            totalAmount = amount;
            break;
          }
        }
      }

      if (!fallbackAmount && /^\d{2,6}$/.test(line.trim())) {
        fallbackAmount = line.trim();
      }
    }

    return totalAmount || fallbackAmount || '';
  };

  const sendToBackend = async (amount, category) => {
    const data = {
      amount,
      category,
    };

    console.log('Sending to backend:', data);

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log('Server response:', result);
    } catch (err) {
      console.error('Failed to send data:', err);
    }
  };

  return (
    <>
    <Navbar></Navbar>
    <div className="container mt-5">
      <h3 className="mb-4">📄 Bill Scanner</h3>

      <div className="mb-3">
        <input type="file" className="form-control" accept="image/*" onChange={handleUpload} />
      </div>

      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={handleCameraClick}>
          📷 Open Camera
        </button>
        <button className="btn btn-success" onClick={captureImage}>
          📸 Capture Image
        </button>
      </div>

      <div className="mb-3">
        <video ref={videoRef} width="100%" height="auto" className="mb-3 border" />
        <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
      </div>

      <h5>Extracted Text:</h5>
      <pre className="bg-light p-3 border rounded">{extractedText}</pre>

      <h6 className="mt-3">Total Amount: ₹{totalAmount}</h6>
      <h6>Category: {category}</h6>
    </div>
    </>
  );
};

export default BillScanner;
