import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { CreditCard, DollarSign, ListChecks } from 'lucide-react';
import { API_BASE } from '../api';

export default function BalancePage() {
  const [transactions, setTransactions] = useState([]);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [balanceType, setBalanceType] = useState('cash'); // 'cash' or 'bank'
  const [balanceHistory, setBalanceHistory] = useState([]);

  // Fetching transactions based on the userId from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${API_BASE}/transactions/${userId}`);
        setTransactions(response.data);
        setBalanceHistory(response.data);
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

    const userId = localStorage.getItem('userId');
    const newTransaction = {
      userId: userId,
      amount: parseFloat(amountToAdd),
      paymentMode: balanceType,
      date: new Date().toISOString(),
    };

    try {
      await axios.post(`${API_BASE}/transactions/add`, newTransaction);
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
      setBalanceHistory((prevHistory) => [...prevHistory, newTransaction]);
      setAmountToAdd('');
    } catch (error) {
      console.error('Error adding money:', error);
      alert('Failed to add money.');
    }
  };

  const cashBalance = calculateBalance('cash');
  const bankBalance = calculateBalance('bank');

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: "6.5rem", marginBottom: "3rem" }}>
        <h2 className="mb-4 text-center fw-bold">Balance Overview</h2>

        {/* Balance Metric Boxes */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="premium-card text-center" style={{ borderLeft: "6px solid #6366f1" }}>
              <span className="text-secondary small d-block mb-1">CASH BALANCE</span>
              <strong className="fs-3 text-primary">₹{cashBalance.toFixed(2)}</strong>
            </div>
          </div>
          <div className="col-md-6">
            <div className="premium-card text-center" style={{ borderLeft: "6px solid #10b981" }}>
              <span className="text-secondary small d-block mb-1">BANK BALANCE</span>
              <strong className="fs-3 text-success">₹{bankBalance.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Add Money Form */}
          <div className="col-md-6">
            <div className="premium-card">
              <h4 className="mb-4 fw-bold d-flex align-items-center gap-2">
                <DollarSign className="text-success" /> Add Balance
              </h4>
              <form onSubmit={handleAddMoney} className="auth-form">
                <div className="modern-input-group">
                  <label className="modern-input-label">Balance Type</label>
                  <select
                    className="modern-input"
                    value={balanceType}
                    onChange={(e) => setBalanceType(e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>

                <div className="modern-input-group mt-3">
                  <label className="modern-input-label">Amount to Add (INR)</label>
                  <input
                    type="number"
                    className="modern-input"
                    placeholder="0.00"
                    value={amountToAdd}
                    onChange={(e) => setAmountToAdd(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-premium-primary w-100 mt-4">
                  <CreditCard size={16} /> Add Money
                </button>
              </form>
            </div>
          </div>

          {/* Balance History List */}
          <div className="col-md-6">
            <div className="premium-card">
              <h4 className="mb-4 fw-bold d-flex align-items-center gap-2">
                <ListChecks className="text-primary" /> Balance History
              </h4>
              <div className="d-flex flex-column gap-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {balanceHistory.length === 0 ? (
                  <p className="text-center text-muted py-4">No history transactions recorded.</p>
                ) : (
                  balanceHistory.map((transaction, index) => (
                    <div 
                      className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-card"
                      key={index}
                      style={{
                        backgroundColor: "var(--bg-card)",
                        borderColor: "var(--border-color)"
                      }}
                    >
                      <div>
                        <span className="badge bg-secondary-subtle text-secondary-emphasis" style={{ textTransform: "uppercase" }}>
                          {transaction.paymentMode === 'cash' ? 'Cash' : 'Bank'}
                        </span>
                        <span className="text-secondary small d-block mt-1">
                          {new Date(transaction.date || transaction.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <strong className={transaction.amount > 0 ? "text-success" : "text-danger"}>
                        {transaction.amount > 0 ? "+" : ""} ₹{parseFloat(transaction.amount || 0).toFixed(2)}
                      </strong>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
