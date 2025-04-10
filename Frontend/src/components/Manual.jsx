import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

export default function AddTransaction() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [contributors, setContributors] = useState([]);
  const [paymentMode, setPaymentMode] = useState('');
  const [paymentTo, setPaymentTo] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [transactionId, setTransactionId] = useState('');

  // Generate unique transaction ID
  const generateTransactionId = () => {
    const id = 'TXN-' + Math.floor(Math.random() * 1000000);
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

    try {
      const response = await axios.post('/api/transactions', transactionData);
      alert('Transaction added successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction!');
    }
  };

  // Generate transaction ID when the component loads
  React.useEffect(() => {
    generateTransactionId();
  }, []);

  return (
    <>
    <Navbar></Navbar>
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Add a Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6 mb-3">
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Title of Expense</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
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
              />
            </div>

            {/* Payment Mode */}
           
          </div>

          {/* Right Column */}
          <div className="col-md-6 mb-3">
            {/* Contributors */}


            {/* Payment To */}
            <div className="form-group">
              <label className="form-label">Payment To</label>
              <input
                type="text"
                className="form-control"
                value={paymentTo}
                onChange={(e) => setPaymentTo(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <input
                type="text"
                className="form-control"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contributors</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter contributor"
                onBlur={handleContributorsChange}
              />
              <ul className="list-unstyled mt-2">
                {contributors.map((contributor, index) => (
                  <li key={index} className="d-flex justify-content-between align-items-center">
                    {contributor}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveContributor(contributor)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Hidden Transaction ID */}
            <input type="hidden" value={transactionId} />

            {/* Submit Button */}
            
          </div>
          <div className="text-center">
              <button type="submit" className="btn btn-primary w-50">
                Add Transaction
              </button>
            </div>
        </div>
      </form>
    </div>
    </>
  );
}
