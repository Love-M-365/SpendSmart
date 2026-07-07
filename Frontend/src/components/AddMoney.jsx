import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { CreditCard, DollarSign } from 'lucide-react';

export default function AddMoney() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [receivedFrom, setReceivedFrom] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const id = 'CREDIT-' + Math.floor(Math.random() * 1000000);
    setTransactionId(id);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate('/confirm', {
      state: {
        transaction: {
          title,
          amount: parseFloat(amount),
          type: 'income', 
          category: 'credits',
          paymentMode,
          paymentTo: 'me',
          contributors: [],
          transactionId,
        },
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: "6.5rem", marginBottom: "3rem", maxWidth: "600px" }}>
        <div className="premium-card">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-2" style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "var(--success)"
            }}>
              <DollarSign size={28} />
            </div>
            <h3 className="fw-bold m-0" style={{ fontSize: "1.5rem" }}>Add Money</h3>
            <p className="text-muted small">Record an income transaction to add credits to your balance</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="modern-input-group">
              <label className="modern-input-label">Title / Description</label>
              <input
                type="text"
                className="modern-input"
                placeholder="e.g. Monthly Salary, Pocket Money, Rent Reimbursement"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="modern-input-group">
              <label className="modern-input-label">Amount (INR)</label>
              <input
                type="number"
                className="modern-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="modern-input-group">
                  <label className="modern-input-label">Payment Mode</label>
                  <select
                    className="modern-input"
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
              </div>
              <div className="col-md-6">
                <div className="modern-input-group">
                  <label className="modern-input-label">Received From</label>
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="e.g. Mom, Boss, Client Name"
                    value={receivedFrom}
                    onChange={(e) => setReceivedFrom(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn bg-success" style={{
              background: "linear-gradient(135deg, var(--success), #059669)",
              boxShadow: "0 4px 14px var(--success-glow)"
            }}>
              <CreditCard size={18} />
              <span>Confirm & Add Money</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
