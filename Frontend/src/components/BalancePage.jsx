import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BalancePage() {
  const [transactions, setTransactions] = useState([]);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [balanceType, setBalanceType] = useState('cash'); // 'cash' or 'bank'
  const [balanceHistory, setBalanceHistory] = useState([]);

  // Fetching transactions based on the userId from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in local storage
    const fetchTransactions = async () => {
      try {
        // Fetch transactions for the logged-in user
        const response = await axios.get(`/api/transactions/${userId}`);
        setTransactions(response.data);
        setBalanceHistory(response.data); // Assuming transaction history needs to be displayed as well
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);
 
  // Calculate current balances based on transactions
  const calculateBalance = (paymentMode) => {
    let balance = 0;
    transactions.forEach((transaction) => {
      if (transaction.paymentMode === paymentMode) {
        balance += transaction.amount;
      }
    });
    return balance;
  };

  // Handle adding money to balance
  const handleAddMoney = async (e) => {
    e.preventDefault();

    if (amountToAdd <= 0 || isNaN(amountToAdd)) {
      alert('Please enter a valid amount.');
      return;
    }

    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
    const newTransaction = {
      userId: userId,
      amount: parseFloat(amountToAdd),
      paymentMode: balanceType,
      date: new Date().toISOString(),
    };

    try {
      // Post the new transaction to the backend
      await axios.post('/api/transactions/add', newTransaction);

      // Update transaction list in the frontend
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);

      // Update balance history as well
      setBalanceHistory((prevHistory) => [...prevHistory, newTransaction]);

      setAmountToAdd(''); // Clear input field after adding money
    } catch (error) {
      console.error('Error adding money:', error);
      alert('Failed to add money.');
    }
  };

  const cashBalance = calculateBalance('cash');
  const bankBalance = calculateBalance('bank');

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Balance Page</h2>

      <div className="row mb-4">
        {/* Cash Balance */}
        <div className="col-md-6 mb-3">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5>Cash Balance</h5>
            </div>
            <div className="card-body">
              <p><strong>₹{cashBalance}</strong></p>
            </div>
          </div>
        </div>

        {/* Bank Balance */}
        <div className="col-md-6 mb-3">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5>Bank Balance</h5>
            </div>
            <div className="card-body">
              <p><strong>₹{bankBalance}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Form to Add Money */}
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleAddMoney}>
            <div className="form-group">
              <label htmlFor="balanceType">Select Balance Type</label>
              <select
                className="form-control"
                id="balanceType"
                value={balanceType}
                onChange={(e) => setBalanceType(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
              </select>
            </div>

            <div className="form-group mt-3">
              <label htmlFor="amountToAdd">Amount to Add</label>
              <input
                type="number"
                className="form-control"
                id="amountToAdd"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-success mt-3 w-100">
              Add Money
            </button>
          </form>
        </div>

        {/* Balance History */}
        <div className="col-md-6">
          <h4>Balance History</h4>
          <div className="list-group">
            {balanceHistory.map((transaction, index) => (
              <div className="list-group-item" key={index}>
                <p>
                  <strong>{transaction.paymentMode === 'cash' ? 'Cash' : 'Bank'}</strong> | 
                  ₹{transaction.amount} | {new Date(transaction.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
