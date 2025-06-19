import React, { useState, useRef ,useEffect } from 'react';
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
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [transactionId, setTransactionId] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate=useNavigate();
  const options = friends.map(friend => ({
    value: friend._id,
    label: friend.name,
  }));
  
  const handleChange = (selectedOptions) => {
    setSelectedContributors(selectedOptions || []);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      recognizeTextFromFile(file);
    }
  };
 
 
 
  useEffect(() => {
    const id = 'TXN-' + Math.floor(Math.random() * 1000000);
    setTransactionId(id);

    // Fetch friends list
    axios.get(`http://localhost:5000/api/users/${userId}/friends`)
      .then(res => {
        setFriends(res.data); // Assuming this response contains the friends list
      })
      .catch(err => {
        console.error('Failed to fetch friends:', err);
      });
  }, [userId]);

  const handleContributorSelection = (friendId) => {
    if (!selectedContributors.includes(friendId)) {
      setSelectedContributors([...selectedContributors, friendId]);
    }
  };

  const handleRemoveContributor = (friendId) => {
    setSelectedContributors(selectedContributors.filter(id => id !== friendId));
  };

 
 useEffect(() => {
    const id = 'TXN-' + Math.floor(Math.random() * 1000000);
    setTransactionId(id);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dividedAmount = selectedContributors.length > 0 
    ? totalAmount / (selectedContributors.length + 1)
    : 0;
  
  

    const transactionData = {
      transactionId,
      userId,
      contributors,
      paymentMode,
     
    };

    navigate('/confirm', {
      state: {
        transaction: {
          title,
          amount: dividedAmount > 0 ? dividedAmount : totalAmount,
          type: 'expense', 
          category:category,
          paymentMode,
          paymentTo:"unknown",
          contributors:selectedContributors,
          transactionId,
        },
      },
    });
    
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
  
      // Predict category from text
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


  return (
    <>
      <Navbar />
      <div className="container " style={{marginTop:"5rem"}}>
        <h3 className="mb-4 text-center text-primary">📄 Bill Scanner</h3>

        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <input
              type="file"
              className="form-control form-control-lg"
              accept="image/*"
              onChange={handleUpload}
              style={{ borderRadius: '10px' }}
            />
          </div>
        </div>

        <div className="row justify-content-center mb-4">
          <div className="col-md-4 d-flex justify-content-center">
            <button
              className="btn btn-primary btn-lg me-3"
              onClick={handleCameraClick}
              style={{ borderRadius: '10px' }}
            >
              📷 Open Camera
            </button>
            <button
              className="btn btn-success btn-lg"
              onClick={captureImage}
              style={{ borderRadius: '10px' }}
            >
              📸 Capture Image
            </button>
          </div>
        </div>

        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <video
              ref={videoRef}
              width="100%"
              height="auto"
              className="mb-3 border rounded shadow-lg"
              style={{ borderRadius: '10px' }}
            />
            <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
          </div>
        </div>

        <div className="mt-5">
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
        <select value={paymentMode} className="form-label" onChange={(e) => setPaymentMode(e.target.value)} required>
            <option value="">Select Payment Mode</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="other">Other</option>
          </select>
          <div className="container mt-3">
      <label className="form-label">Select Contributors</label>
      <Select
        isMulti
        options={options}
        value={selectedContributors}
        onChange={handleChange}
        className="mb-3"
      />

      
    </div>

          <button type="submit" className="btn btn-success" onClick={handleSubmit}>Add Transaction</button>
      </div>
    </>
  );
};

export default BillScanner;
