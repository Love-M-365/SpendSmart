import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
export default function AddMoney() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [receivedFrom, setReceivedFrom] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [transactionId, setTransactionId] = useState('');
  const navigate = useNavigate();
    useEffect(() => {
    const id = 'CREDIT-' + Math.floor(Math.random() * 1000000);
    setTransactionId(id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const creditData = {
      transactionId,
      userId,
      title,
      category: 'credits',
      amount,
      contributors: [],
      paymentMode,
      paymentTo: '',
      receivedFrom,
    };

    navigate('/confirm', {
        state: {
          transaction: {
            title,
            amount,
            type: 'income', 
            category : 'credits',
            paymentMode,
            paymentTo:'me',
            contributors:['me'],
            transactionId,
          },
        },
      });
  };

  return (
    <>
      <Navbar />
      <div className="container " style={{ maxWidth: '600px', marginTop:"6rem" }}>
        <h3 className="text-center mb-4">💰 Add Money</h3>
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Salary, Pocket Money"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Payment Mode</label>
            <select
              className="form-select"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              required
            >
              <option value="">Select payment mode</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank Transfer</option>
              <option value="wallet">Wallet</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Received From</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Mom, Company Name"
              value={receivedFrom}
              onChange={(e) => setReceivedFrom(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Add Money
          </button>
        </form>
      </div>
    </>
  );
}
