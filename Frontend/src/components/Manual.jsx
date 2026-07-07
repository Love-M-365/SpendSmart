import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api';

export default function AddTransaction() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [paymentTo, setPaymentTo] = useState('');
  const [userId] = useState(localStorage.getItem('userId') || '');
  const [transactionId, setTransactionId] = useState('');
  const [friends, setFriends] = useState([]);
  const [selectedContributors, setSelectedContributors] = useState([]);
  const navigate = useNavigate();

  const categories = [
    { id: 'Garments', label: 'Garments', icon: '👕' },
    { id: 'Dairy', label: 'Dairy', icon: '🧀' },
    { id: 'Groceries', label: 'Groceries', icon: '🥡' },
    { id: 'Food', label: 'Food', icon: '🍜' },
    { id: 'Beverage', label: 'Beverage', icon: '🍷' },
    { id: 'Daily Need', label: 'Daily Need', icon: '🪥' },
    { id: 'Beauty and Wellness', label: 'Beauty and Wellness', icon: '❣' },
    { id: 'Stationery', label: 'Stationery', icon: '📚' },
    { id: 'Vegetable', label: 'Vegetable', icon: '🍄‍🟫' },
    { id: 'Fruits', label: 'Fruits', icon: '🍓' },
    { id: 'Travel', label: 'Travel', icon: '🛺' },
    { id: 'Rent', label: 'Rent', icon: '🏚' },
    { id: 'Subscription', label: 'Subscription', icon: '👑' },
    { id: 'Electronics', label: 'Electronics', icon: '📱' },
    { id: 'Furniture', label: 'Furniture', icon: '🛌🏼' },
    { id: 'Allowance', label: 'Allowance', icon: '💰' },
    { id: 'Salary', label: 'Salary', icon: '💳' },
    { id: 'Profit', label: 'Profit', icon: '💹' },
    { id: 'Other', label: 'Other', icon: '🪙' }
  ];

  const options = friends.map(friend => ({
    value: friend._id,
    label: friend.name,
  }));
  
  const handleChange = (selectedOptions) => {
    setSelectedContributors(selectedOptions || []);
  };

  useEffect(() => {
    const id = 'TXN-' + Math.floor(Math.random() * 1000000);
    setTransactionId(id);

    // Fetch friends list
    axios.get(`${API_BASE}/users/${userId}/friends`)
      .then(res => {
        setFriends(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch friends:', err);
      });
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dividedAmount = selectedContributors.length > 0 
      ? amount / (selectedContributors.length + 1)
      : 0;
    
    try {
      // Loop through contributors and create owed notifications
      await Promise.all(
        selectedContributors.map(async (contributorId) => {
          await axios.post(`${API_BASE}/notifications`, {
            user: contributorId.value,           // Receiver
            person: userId,       // Sender
            amount: dividedAmount,
            category,
            message: `You owe ₹${dividedAmount.toFixed(2)} to your friend ${localStorage.getItem('userName') || 'Friend'}`,
            status: "owed"
          });
        })
      );
  
      console.log("Notifications sent successfully.");
    } catch (error) {
      console.error("Error creating notifications:", error.message);
    }
  
    // Navigate to confirmation page with transaction data
    navigate('/confirm', {
      state: {
        transaction: {
          title,
          amount: dividedAmount > 0 ? dividedAmount : amount,
          type: 'expense', 
          category,
          paymentMode,
          paymentTo,
          contributors: selectedContributors.map(c => c.value),
          transactionId,
        },
      },
    });
  };

  // Custom styling override for React Select component
  const customSelectStyles = {
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
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'var(--bg-app)',
      borderRadius: '8px',
      border: '1px solid var(--border-color)'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'var(--text-primary)'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'var(--danger)',
      '&:hover': {
        backgroundColor: 'var(--danger-glow)',
        color: 'var(--danger)'
      }
    })
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: "6.5rem", marginBottom: "3rem", maxWidth: "680px" }}>
        <div className="premium-card">
          <h2 className="mb-4 text-center" style={{ fontWeight: 800 }}>Add New Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="modern-input-group">
                  <label className="modern-input-label">Title / Description</label>
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="e.g. Dinner, Rent, Uber"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
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
              </div>
            </div>

            <div className="mb-3">
              <label className="modern-input-label">Category</label>
              <div className="category-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                gap: "10px",
                maxHeight: "220px",
                overflowY: "auto",
                padding: "8px",
                border: "1px solid var(--border-color)",
                borderRadius: "14px",
                backgroundColor: "var(--bg-input)",
                marginBottom: "1.25rem"
              }}>
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`category-card ${category === cat.id ? 'selected' : ''}`}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      backgroundColor: category === cat.id ? "rgba(37,99,235,0.15)" : "var(--bg-card)",
                      border: category === cat.id ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{cat.icon}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "4px" }}>{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="modern-input-label">Select Contributors (To split bill)</label>
              <Select
                isMulti
                options={options}
                value={selectedContributors}
                onChange={handleChange}
                styles={customSelectStyles}
                placeholder="Type friend's name..."
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="modern-input-group">
                  <label className="modern-input-label">Payment To</label>
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="Store/Person Name"
                    value={paymentTo}
                    onChange={(e) => setPaymentTo(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="modern-input-group">
                  <label className="modern-input-label">Payment Mode</label>
                  <select 
                    className="modern-input" 
                    value={paymentMode} 
                    onChange={(e) => setPaymentMode(e.target.value)} 
                    required
                  >
                    <option value="">Select Mode</option>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-premium-primary w-100 mt-3" style={{ padding: "0.85rem" }}>
              Add Transaction
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
