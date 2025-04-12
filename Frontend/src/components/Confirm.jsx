import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

export default function ConfirmTransaction() {
  const location = useLocation();
  const navigate = useNavigate();
  const transactionData = location.state?.transaction;

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/transactions/add',
        { ...transactionData, userId },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert('Transaction confirmed and saved!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save transaction.');
    }
  };

  if (!transactionData) return <p className="text-center mt-5">No transaction data found.</p>;

  return (
    <>
      <Navbar />
      <div className="container confirm-container " style={{marginTop:"5rem",fontSize:"1.2rem",fontFamily:"Montserrat"}} >
        <div className="card shadow-lg p-4">
          <h2 className="text-center mb-4">Confirm Your Transaction</h2>
          <div className="row mb-3">
            <div className="col"><strong>Title:</strong> {transactionData.title}</div>
            <div className="col"><strong>Amount:</strong> ₹{transactionData.amount}</div>
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
