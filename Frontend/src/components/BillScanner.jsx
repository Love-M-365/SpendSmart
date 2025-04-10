import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';

const BillScanner = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Start the camera
  const startCamera = async () => {
    if (videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert(`Failed to access camera: ${error.message}`);
      }
    }
  };

  // Capture a photo from the video stream
  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const video = videoRef.current;

      // Draw the current frame of the video on the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get the image data from the canvas
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);

      // Stop the camera stream
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);

      // Process the captured image
      processImage(imageData);
    }
  };

  // Process the uploaded image
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setCapturedImage(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Process the captured or uploaded image using Tesseract.js for text extraction
  const processImage = (imageData) => {
    setLoading(true);
    setExtractedText('');
    setHighlightedText('');

    // Preprocess the image to enhance OCR performance
    preprocessImage(imageData).then(preprocessedImageData => {
      // Use Tesseract.js to extract text from the preprocessed image
      Tesseract.recognize(
        preprocessedImageData,
        'eng',
        {
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,.-₹',
          logger: (m) => console.log(m), // Output progress to console
        }
      ).then(({ data: { text } }) => {
        setExtractedText(text);
        console.log("Extracted Text:", text); // Log extracted text to console
        highlightRupeeAmounts(text);
        setLoading(false);
      }).catch((error) => {
        console.error('Error extracting text from image:', error);
        setLoading(false);
      });
    });
  };

  // Preprocess image (e.g., convert to grayscale, increase contrast, etc.)
  const preprocessImage = async (imageData) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageData;
      img.onload = () => {
        // Create a canvas to manipulate the image
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        context.drawImage(img, 0, 0);

        // Apply preprocessing (convert to grayscale)
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          // Convert to grayscale
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg;

          // Apply thresholding to separate text from the background
          const threshold = 128;
          const gray = data[i];
          if (gray < threshold) {
            data[i] = data[i + 1] = data[i + 2] = 0; // Black
          } else {
            data[i] = data[i + 1] = data[i + 2] = 255; // White
          }
        }

        // Put the processed image back into the canvas
        context.putImageData(imageData, 0, 0);

        // Resolve the base64 of the preprocessed image
        resolve(canvas.toDataURL());
      };
      img.onerror = (err) => reject(err);
    });
  };

  // Highlight rupee amounts in the extracted text
  const highlightRupeeAmounts = (text) => {
    // Updated regex to handle rupee symbol with commas and decimals
    const regex = /₹\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
    const matches = [];
    let match;

    // Find all matches with the rupee symbol and commas
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[0]);
    }

    // If rupee amounts were found, highlight them
    if (matches.length > 0) {
      let highlightedText = text;
      matches.forEach((amount) => {
        const highlight = `<mark style="background-color: yellow; font-weight: bold;">${amount}</mark>`;
        highlightedText = highlightedText.replace(amount, highlight);
      });
      setHighlightedText(highlightedText);
    } else {
      setHighlightedText(text);
    }
  };

  // Ensure the camera starts after component has mounted
  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    }
  }, [isCameraActive]);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Bill Scanner</h2>

      {/* Buttons to toggle between camera and image upload */}
      <div className="text-center mb-4">
        {!isCameraActive ? (
          <>
            <button className="btn btn-primary me-2" onClick={() => setIsCameraActive(true)}>Start Camera</button>
            <button className="btn btn-secondary" onClick={() => fileInputRef.current.click()}>Upload Image</button>
          </>
        ) : (
          <div>
            <video ref={videoRef} width="100%" height="auto" style={{ border: '1px solid black' }}></video>
            <br />
            <button className="btn btn-success mt-3" onClick={capturePhoto}>Capture Photo</button>
          </div>
        )}
      </div>

      {/* Hidden file input for uploading an image */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*" 
        onChange={handleImageUpload} 
      />

      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>

      {capturedImage && (
        <div className="text-center my-3">
          <h5>Captured/Uploaded Image:</h5>
          <img src={capturedImage} alt="Captured/Uploaded" className="img-fluid" />
        </div>
      )}

      {loading && <div className="alert alert-info">Processing image...</div>}

      {highlightedText && (
        <div className="mt-4">
          <h5>Extracted Text (with Highlights):</h5>
          <div dangerouslySetInnerHTML={{ __html: highlightedText }} />
        </div>
      )}
    </div>
  );
};

export default BillScanner;
