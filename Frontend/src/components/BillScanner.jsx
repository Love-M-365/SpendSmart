import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Upload, Camera, Sparkles, CheckCircle } from 'lucide-react';
import { API_BASE, AI_API_BASE } from '../api';

const BillScanner = () => {
  const [extractedText, setExtractedText] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('scanned bill');
  const [friends, setFriends] = useState([]);
  const [selectedContributors, setSelectedContributors] = useState([]);
  const [paymentMode, setPaymentMode] = useState('');
  const [userId] = useState(localStorage.getItem('userId') || '');
  const [transactionId, setTransactionId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      recognizeTextFromFile(e.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    const id = 'TXN-' + Math.floor(Math.random() * 1000000);
    setTransactionId(id);

    axios.get(`${API_BASE}/users/${userId}/friends`)
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
          await axios.post(`${API_BASE}/notifications`, {
            user: contributorId.value,           // Receiver
            person: userId,       // Sender
            amount: dividedAmount,
            category: category,
            message: `You owe ₹${dividedAmount.toFixed(2)} to your friend ${localStorage.getItem('userName') || 'Friend'}`,
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
      setCameraActive(true);
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
      alert('Unable to open camera, please upload a receipt file instead.');
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current.toBlob(blob => {
      // Stop video stream
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setCameraActive(false);
      
      recognizeTextFromFile(blob);
    }, 'image/jpeg');
  };

  const recognizeTextFromFile = async (file) => {
    setScanning(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE}/ocr`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setExtractedText(result.text || 'No text extracted.');
      setTotalAmount(result.amount || 0);

      const categoryRes = await fetch(`${AI_API_BASE}/predict-category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: result.text || '' }),
      });

      const categoryData = await categoryRes.json();
      setCategory(categoryData.category || 'Other');
    } catch (error) {
      console.error('Error sending image or text to backend:', error);
    } finally {
      setScanning(false);
    }
  };

  const selectSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'var(--bg-input)',
      borderColor: state.isFocused ? 'var(--primary)' : 'var(--border-color)',
      borderRadius: '14px',
      padding: '0.2rem',
      boxShadow: state.isFocused ? '0 0 0 4px var(--primary-glow)' : 'none',
      borderWidth: '1.5px',
      '&:hover': {
        borderColor: 'var(--primary)'
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '14px',
      boxShadow: 'var(--shadow-lg)'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? 'var(--primary)' 
        : state.isFocused 
        ? 'var(--bg-app)' 
        : 'transparent',
      color: state.isSelected ? '#ffffff' : 'var(--text-primary)',
      cursor: 'pointer'
    })
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: '6.5rem', marginBottom: '3.5rem', maxWidth: '800px' }}>
        <h3 className="mb-4 text-center" style={{ fontWeight: 800 }}>📄 Intelligent Bill Scanner</h3>
        <p className="text-center text-secondary mb-5">
          Scan receipts using OCR and auto-categorize expenses instantly using AI.
        </p>

        {/* Drag & Drop Upload Block */}
        {!cameraActive && (
          <div 
            className={`text-center p-5 border-2 rounded-4 mb-4 ${dragActive ? 'bg-primary-subtle border-primary' : 'bg-card border-dashed'}`}
            style={{
              cursor: 'pointer',
              backgroundColor: 'var(--bg-card)',
              borderColor: dragActive ? 'var(--primary)' : 'var(--border-color)',
              borderStyle: 'dashed',
              transition: 'var(--transition-smooth)'
            }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="d-none" 
              accept="image/*" 
              onChange={handleUpload} 
            />
            <Upload size={48} className="text-primary mb-3" />
            <h5 className="fw-bold mb-2">Drag & Drop receipt here</h5>
            <p className="text-muted small mb-0">or click to browse from files (PNG, JPG, PDF)</p>
          </div>
        )}

        {/* Open Camera triggers */}
        <div className="d-flex justify-content-center gap-3 mb-4">
          {!cameraActive ? (
            <button className="btn-premium-primary" onClick={handleCameraClick}>
              <Camera size={18} />
              <span>Capture via Camera</span>
            </button>
          ) : (
            <button className="btn-premium-danger" onClick={() => setCameraActive(false)}>
              <span>Close Camera</span>
            </button>
          )}
        </div>

        {/* Camera Viewfinder container */}
        {cameraActive && (
          <div className="row justify-content-center mb-4">
            <div className="col-12 col-md-10">
              <div className="scanner-viewfinder-container shadow-lg">
                <div className="scanner-viewfinder-overlay">
                  <div className="scanner-corner scanner-corner-tl"></div>
                  <div className="scanner-corner scanner-corner-tr"></div>
                  <div className="scanner-corner scanner-corner-bl"></div>
                  <div className="scanner-corner scanner-corner-br"></div>
                  <div className="scanner-laser-line"></div>
                </div>
                <video
                  ref={videoRef}
                  width="100%"
                  height="auto"
                  className="mb-0 border-0"
                  playsInline
                  autoPlay
                  muted
                  style={{ display: 'block', backgroundColor: '#000' }}
                />
                <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
              </div>
              <div className="text-center mt-3">
                <button className="btn-premium-primary btn-lg" onClick={captureImage}>
                  Capture Receipt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading / OCR Scanning status */}
        {scanning && (
          <div className="text-center p-5 premium-card mb-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Scanning...</span>
            </div>
            <h5 className="fw-bold m-0 text-primary">Processing Receipt Content</h5>
            <p className="text-secondary small m-0">Reading metadata via OCR & sorting category with AI...</p>
          </div>
        )}

        {/* Extracted content results */}
        {(extractedText || totalAmount || category) && !scanning && (
          <div className="premium-card mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Sparkles size={20} className="text-warning" />
              <h4 className="m-0" style={{ fontSize: '1.2rem', fontWeight: 700 }}>AI Extracted Information</h4>
            </div>
            
            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
                  <span className="text-secondary small d-block mb-1">TOTAL AMOUNT</span>
                  <span className="fw-bold text-success fs-4">₹{parseFloat(totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)' }}>
                  <span className="text-secondary small d-block mb-1">AI CATEGORY PREDICTION</span>
                  <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mt-1" style={{ fontWeight: 600 }}>{category || 'Undetermined'}</span>
                </div>
              </div>
            </div>

            <h5 className="text-secondary fs-6 mb-2">Recognized OCR Text:</h5>
            <pre
              className="p-3 border rounded-3 text-secondary"
              style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: 'var(--bg-input)', fontSize: '0.85rem', fontFamily: 'monospace' }}
            >
              {extractedText}
            </pre>
          </div>
        )}

        {/* Config Inputs Form */}
        {(extractedText || totalAmount || category) && !scanning && (
          <div className="premium-card">
            <h4 className="mb-4" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Finalize Transaction</h4>
            <form onSubmit={handleSubmit}>
              <div className="modern-input-group">
                <label className="modern-input-label">Bill Title</label>
                <input
                  type="text"
                  className="modern-input"
                  placeholder="e.g. Starbucks, Grocery store"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="modern-input-group">
                    <label className="modern-input-label">Payment Mode</label>
                    <select
                      value={paymentMode}
                      className="modern-input"
                      onChange={(e) => setPaymentMode(e.target.value)}
                      required
                    >
                      <option value="">Select Payment Mode</option>
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                      <option value="card">Card</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="modern-input-group">
                    <label className="modern-input-label">Split Bill With Friends</label>
                    <Select
                      isMulti
                      options={options}
                      value={selectedContributors}
                      onChange={handleChange}
                      styles={selectSelectStyles}
                      placeholder="Select contributors..."
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-premium-primary w-100 mt-3" style={{ padding: '0.85rem' }}>
                <CheckCircle size={18} />
                <span>Confirm & Add Expense</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default BillScanner;
