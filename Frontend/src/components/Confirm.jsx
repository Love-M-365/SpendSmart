import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

export default function ConfirmTransaction() {
  const location = useLocation();
  const navigate = useNavigate();
  const transactionData = location.state?.transaction;
  const [showAlert, setShowAlert] = useState(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const handleConfirm = async () => {
  try {
    const response = await axios.post(
      `https://spendsmart-tkm2.onrender.com/api/transactions/add`,
      { ...transactionData, userId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    setShowAlert(true); // Show alert
    setTimeout(() => {
      setShowAlert(false);
      navigate('/dashboard'); // ⬅ Redirect after 3 seconds
    }, 3000);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to save transaction.');
  }
};


  if (!transactionData) return <p className="text-center mt-5">No transaction data found.</p>;

  return (
    <>
    
      <Navbar />
      {showAlert && (
        <div className="container " style={{marginTop:"5rem"}}>
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            Transaction confirmed and saved!
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowAlert(false)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}
      <div className="container confirm-container " style={{marginTop:"5rem",fontSize:"1.2rem",fontFamily:"Montserrat"}} >
        <div className="card shadow-lg p-4">
          <h2 className="text-center mb-4">Confirm Your Transaction</h2>
          <div className="row mb-3">
            <div className="col"><strong>Title:</strong> {transactionData.title}</div>
            <div className="col"><strong>Amount:</strong> ₹{Math.abs(transactionData.amount).toFixed(2)}</div>
          </div>
          <div className="row mb-3">
            <div className="col"><strong>Type:</strong> {transactionData.type}</div>
            <div className="col"><strong>Category:</strong> {transactionData.category}</div>
          </div>
          <div className="row mb-3">
            <div className="col"><strong>Payment Mode:</strong> {transactionData.paymentMode}</div>
            <div className="col"><strong>Paid To:</strong> {transactionData.paymentTo}</div>
          </div>
          {transactionData.contributors && transactionData.contributors.length > 0 && (
            <div className="mb-3">
              <strong>Contributors:</strong>
              <ul className="list-group list-group-flush">
                {transactionData.contributors.map((userId, idx) => (
                  <li key={idx} className="list-group-item">{userId}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-center mt-4">
            <button className="btn btn-success me-3" onClick={handleConfirm}>Confirm & Save</button>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
      </div>
    </>
  );
}
