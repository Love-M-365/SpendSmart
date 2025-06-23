import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const BillScanner = () => {
  const [extractedText, setExtractedText] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('scanned bill');
  const [friends, setFriends] = useState([]);
  const [selectedContributors, setSelectedContributors] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [paymentMode, setPaymentMode] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [transactionId, setTransactionId] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  
  const options = friends.map(friend => ({
    value: friend._id,
    label: friend.name,
  }));

  const handleChange = (selectedOptions) => {
    setSelectedContributors(selectedOptions || []);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) recognizeTextFromFile(file);
  };

  useEffect(() => {
    const id = 'TXN-' + Math.floor(Math.random() * 1000000);
    setTransactionId(id);

    axios.get(`https://spendsmart-tkm2.onrender.com/api/users/${userId}/friends`)
      .then(res => setFriends(res.data))
      .catch(err => console.error('Failed to fetch friends:', err));
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dividedAmount =
      selectedContributors.length > 0
        ? totalAmount / (selectedContributors.length + 1)
        : 0;
    


    try {
      // Loop through contributors and create owed notifications
      await Promise.all(
        selectedContributors.map(async (contributorId) => {
          await axios.post(`https://spendsmart-tkm2.onrender.com/api/notifications`, {
            user: contributorId.value,           // Receiver
            person: userId,       // Sender
            amount: dividedAmount,
            category:category,
            message: `You owe ₹${dividedAmount.toFixed(2)} to your ${contributorId.label}`,
            status: "owed"
          });
        })
      );
  
      console.log("Notifications sent successfully.");
    } catch (error) {
      console.error("Error creating notifications:", error.message);
    }
    navigate('/confirm', {
      state: {
        transaction: {
          title,
          amount: dividedAmount > 0 ? dividedAmount : totalAmount,
          type: 'expense',
          category,
          paymentMode,
          paymentTo: 'unknown',
          contributors: selectedContributors.map(c => c.value),
          transactionId,
        },
      },
    });
  };

  const handleCameraClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  facingMode: { ideal: "environment" }
},
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Failed to access camera:', error);
    }
  };

  const captureImage = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current.toBlob(blob => recognizeTextFromFile(blob), 'image/jpeg');
  };

  const recognizeTextFromFile = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://spendsmart-tkm2.onrender.com/api/ocr`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setExtractedText(result.text);
      setTotalAmount(result.amount);

      const categoryRes = await fetch('http://127.0.0.1:5001/predict-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: result.text }),
      });

      const categoryData = await categoryRes.json();
      setCategory(categoryData.category);
    } catch (error) {
      console.error('Error sending image or text to backend:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: '5rem' }}>
        <h3 className="mb-4 text-center text-primary">📄 Bill Scanner</h3>

        {/* File Upload */}
        <div className="row justify-content-center mb-4 px-2">
          <div className="col-12 col-md-6">
            <input
              type="file"
              className="form-control form-control-lg"
              accept="image/*"
              onChange={handleUpload}
              style={{ borderRadius: '10px' }}
            />
          </div>
        </div>

        {/* Camera Buttons */}
        <div className="row justify-content-center mb-4 px-2">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-center align-items-center gap-2">
            <button
              className="btn btn-primary btn-lg w-100 w-md-auto"
              onClick={handleCameraClick}
              style={{ borderRadius: '10px' }}
            >
              📷 Open Camera
            </button>
            <button
              className="btn btn-success btn-lg w-100 w-md-auto"
              onClick={captureImage}
              style={{ borderRadius: '10px' }}
            >
              📸 Capture Image
            </button>
          </div>
        </div>

        {/* Video Preview */}
        <div className="row justify-content-center mb-4 px-2">
          <div className="col-12 col-md-8">
            <video
              ref={videoRef}
              width="100%"
              height="auto"
              className="mb-3 border rounded shadow-lg"
              style={{ borderRadius: '10px' }}
              playsInline
  autoPlay
  muted
            />
            <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
          </div>
        </div>

        {/* Extracted Info */}
        <div className="mt-5 px-2">
          <h5 className="text-dark">Extracted Text:</h5>
          <pre
            className="bg-light p-3 border rounded"
            style={{ maxHeight: '300px', overflowY: 'auto' }}
          >
            {extractedText}
          </pre>

          <h5 className="mt-4 text-dark">Transaction Details</h5>
          <div className="border p-3 rounded bg-light shadow-sm">
            <h6>Total Amount: <span className="text-success">₹{totalAmount}</span></h6>
            <h6>Category: <span className="text-info">{category}</span></h6>
          </div>
        </div>

        {/* Payment & Contributors */}
        <div className="row justify-content-center px-2 mt-4">
          <div className="col-12 col-md-6">
            <label className="form-label">Select Payment Mode</label>
            <select
              value={paymentMode}
              className="form-select mb-3"
              onChange={(e) => setPaymentMode(e.target.value)}
              required
            >
              <option value="">Select Payment Mode</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="other">Other</option>
            </select>

            <label className="form-label">Select Contributors</label>
            <Select
              isMulti
              options={options}
              value={selectedContributors}
              onChange={handleChange}
              className="mb-3"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="text-center my-4">
          <button type="submit" className="btn btn-success px-4 py-2" onClick={handleSubmit}>
            Add Transaction
          </button>
        </div>
      </div>
    </>
  );
};

export default BillScanner;
