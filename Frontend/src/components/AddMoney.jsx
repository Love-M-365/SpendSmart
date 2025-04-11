import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

export default function AddIncomeTransaction() {
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [contributors, setContributors] = useState([]);
  const [paymentMode, setPaymentMode] = useState('');
  const [receivedFrom, setReceivedFrom] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [transactionId, setTransactionId] = useState('');

  // Generate unique transaction ID
  const generateTransactionId = () => {
    const id = 'INC-' + Math.floor(Math.random() * 1000000);
    setTransactionId(id);
  };

  // Handle contributors input
  const handleContributorsChange = (e) => {
    const value = e.target.value;
    if (value && !contributors.includes(value)) {
      setContributors([...contributors, value]);
    }
  };

  const handleRemoveContributor = (contributor) => {
    setContributors(contributors.filter(item => item !== contributor));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const incomeData = {
      transactionId,
      userId,
      title,
      source,
      amount,
      contributors,
      paymentMode,
      receivedFrom,
    };

    try {
      const response = await axios.post('/api/income', incomeData);
      alert('Income transaction added successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error adding income transaction:', error);
      alert('Failed to add income transaction!');
    }
  };

  useEffect(() => {
    generateTransactionId();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: "5rem" }}>
        <h2 className="mb-4 text-center">Add an Income Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6 mb-3">
              {/* Title */}
              <div className="form-group">
                <label className="form-label">Title of Income</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter income title"
                />
              </div>

              {/* Source */}
              <div className="form-group">
                <label className="form-label">Source</label>
                <input
                  type="text"
                  className="form-control"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                  placeholder="Enter income source"
                />
              </div>

              {/* Amount */}
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="Enter amount received"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6 mb-3">
              {/* Received From */}
              <div className="form-group">
                <label className="form-label">Received From</label>
                <input
                  type="text"
                  className="form-control"
                  value={receivedFrom}
                  onChange={(e) => setReceivedFrom(e.target.value)}
                  required
                  placeholder="Enter who paid you"
                />
              </div>

              {/* Payment Mode */}
              <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select
                value={paymentMode}
                className="form-control"
                onChange={(e) => setPaymentMode(e.target.value)}
                required
              >
                <option value="">Select mode</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
              </select>
            </div>

          
               
              
            </div>
          </div>

          <div className="text-center mt-3">
            <button type="submit" className="btn btn-success">
              Add Income
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
