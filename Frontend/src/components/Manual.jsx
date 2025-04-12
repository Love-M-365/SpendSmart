import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

import { useNavigate } from 'react-router-dom';
export default function AddTransaction() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [contributors, setContributors] = useState([]);
  const [paymentMode, setPaymentMode] = useState('');
  const [paymentTo, setPaymentTo] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [transactionId, setTransactionId] = useState('');
  const [selected, setSelected] = useState(null);
const navigate = useNavigate();
const categories = [
  { id: 'garments', label: 'Garments', icon: '👕' },
  { id: 'dairy', label: 'Dairy', icon: '🧀' },
  { id: 'groceries', label: 'Groceries', icon: '🥡' },
  { id: 'food', label: 'Food', icon: '🍜' },
  { id: 'beverage', label: 'Beverage', icon: '🍷' },
  { id: 'dailyneed', label: 'Daily Need', icon: '🪥' },
  { id: 'beautywellness', label: 'Beauty and Wellness', icon: '❣' },
  { id: 'stationary', label: 'Stationary', icon: '📚' },
  { id: 'vegetable', label: 'Vegetable', icon: '🍄‍🟫' },
  { id: 'fruits', label: 'Fruits', icon: '🍓' },
  { id: 'travel', label: 'Travel', icon: '🛺' },
  { id: 'rent', label: 'Rent', icon: '🏚' },
  { id: 'subscription', label: 'Subscription', icon: '👑' },
  { id: 'electronics', label: 'Electronics', icon: '📱' },
  { id: 'furniture', label: 'Furniture', icon: '🛌🏼' },
  { id: 'allowance', label: 'Allowance', icon: '💰' },
  { id: 'salary', label: 'Salary', icon: '💳' },
  { id: 'profit', label: 'Profit', icon: '💹' },
  { id: 'other', label: 'Other', icon: '🪙' }
];

  useEffect(() => {
    const id = 'TXN-' + Math.floor(Math.random() * 1000000);
    setTransactionId(id);
  }, []);

  const handleContributorsChange = (e) => {
    const value = e.target.value.trim();
    if (value && !contributors.includes(value)) {
      setContributors([...contributors, value]);
    }
    e.target.value = '';
  };

  const handleRemoveContributor = (contributor) => {
    setContributors(contributors.filter(item => item !== contributor));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transactionData = {
      transactionId,
      userId,
      title,
      category,
      amount,
      contributors,
      paymentMode,
      paymentTo,
    };

    navigate('/confirm', {
      state: {
        transaction: {
          title,
          amount,
          type: 'expense', 
          category,
          paymentMode,
          paymentTo,
          contributors,
          transactionId,
        },
      },
    });
    
  };

  return (
    <>
      <Navbar />
      <div className="form-container" style={{marginTop:"6rem"}}>
        <h2>Add New Transaction</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div className="category-grid">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`category-card ${selected === cat.id ? 'selected' : ''}`}
                
                onClick={() => {
                  setSelected(cat.id);
                  setCategory(cat.label);
                }}
              >
                <span className="icon">{cat.icon}</span>
                <span className="label">{cat.label}</span>
              </div>
            ))}
          </div>

          <input
            type="text"
            placeholder="Contributor (press Enter to add)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleContributorsChange(e);
              }
            }}
          />
          <div className="contributor-list">
            {contributors.map((contributor) => (
              <span key={contributor} className="contributor-tag">
                {contributor}
                <button type="button" onClick={() => handleRemoveContributor(contributor)}>×</button>
              </span>
            ))}
          </div>

          <input
            type="text"
            placeholder="Payment To"
            value={paymentTo}
            onChange={(e) => setPaymentTo(e.target.value)}
          />

          <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} required>
            <option value="">Select Payment Mode</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="other">Other</option>
          </select>

          <button type="submit" className="submit-btn">Add Transaction</button>
        </form>
      </div>
    </>
  );
}
