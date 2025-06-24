import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Select from 'react-select';
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
  const [friends, setFriends] = useState([]);
  const [selectedContributors, setSelectedContributors] = useState([]);
  const navigate = useNavigate();

  const categories = [
    { id: 'Garments', label: 'Garments', icon: '👕' },
    { id: 'Dairy', label: 'Dairy', icon: '🧀' },
    { id: 'Groceries', label: 'Groceries', icon: '🥡' },
    { id: 'food', label: 'Food', icon: '🍜' },
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
    axios.get(`https://spendsmart-tkm2.onrender.com/api/users/${userId}/friends`)
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

  const handleRemoveContributor = (id) => {
  setSelectedContributors(prev => prev.filter(contributorId => contributorId !== id));
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const dividedAmount = selectedContributors.length > 0 
  ? amount / (selectedContributors.length + 1)
  : 0;

    
    const transactionData = {
      transactionId,
      userId,
      title,
      category,
      amount,
      contributors,
      paymentMode,
      paymentTo,
      dividedAmount,
    };

    try {
      // Loop through contributors and create owed notifications
      await Promise.all(
        selectedContributors.map(async (contributorId) => {
          await axios.post(`https://spendsmart-tkm2.onrender.com/api/notifications`, {
            user: contributorId.value,           // Receiver
            person: userId,       // Sender
            amount: dividedAmount,
            category,
            message: `You owe ₹${dividedAmount.toFixed(2)} to your ${contributorId.label}`,
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
          contributors:selectedContributors.map(c => c.value),
          transactionId,
        },
      },
    });
  }
  return (
    <>
      <Navbar />
      <div className="form-container" style={{ marginTop: "6rem" }}>
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
                className={`category-card ${category === cat.id ? 'selected' : ''}`}
                onClick={() => {
                  setCategory(cat.id);
                }}
              >
                <span className="icon">{cat.icon}</span>
                <span className="label">{cat.label}</span>
              </div>
            ))}
          </div>

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
