import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  // Example data
  const lastTransactions = [
    { title: 'Groceries', amount: -200, category: 'Food' },
    { title: 'Salary', amount: 5000, category: 'Income' },
    { title: 'Netflix', amount: -500, category: 'Entertainment' },
    { title: 'Friend Payback', amount: 700, category: 'Income' },
    { title: 'Electricity Bill', amount: -1200, category: 'Utilities' }
  ];

  // Savings emoji logic
  const totalIncome = 7000;
  const totalExpense = 3000;
  const savings = totalIncome - totalExpense;

  const savingsEmoji = savings > 8000 ? '💰' : savings > 0 ? '😊' : '😬';

  // Cash and Bank Balance (example)
  const cashBalance = 5000;
  const bankBalance = 15000;

  // Categorize expenses
  const expenseCategories = lastTransactions
    .filter(tx => tx.amount < 0)
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
      return acc;
    }, {});

  const pieData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        data: Object.values(expenseCategories),
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
        hoverOffset: 4
      }
    ]
  };

  return (
    <>
      {/* Navbar */}
      <Navbar></Navbar>

      {/* Main Content */}
      <div className="container mt-5" style={{ width: "80rem"}}>

        <h2 className="mb-4 text-center text-primary">Welcome</h2>

        {/* Top row */}
        <div className="row mb-4">
          {/* Scan Button */}
          <div className="col-md-4 text-center mb-3">
            <button className="btn btn-primary w-100 py-3 rounded-pill shadow-sm mb-3">
              <Link to="/scan" style={{ textDecoration: 'none', color: 'white' }}>📷 Scan to Store Expense</Link>
            </button>
            <button className="btn btn-success w-100 py-3 rounded-pill shadow-sm">
              <Link to="/manual" style={{ textDecoration: 'none', color: 'white' }}>Manually store expense</Link>
            </button>
          </div>
          

          {/* Savings Status */}
          <div className="col-md-4 mb-3">
            <div className="card p-4 shadow-sm rounded-lg">
              <h5 className="card-title text-muted">Savings Status</h5>
              <div className="display-4 text-center">{savingsEmoji}</div>
              <p className="mt-3 text-secondary text-center">Saved: ₹{savings}</p>
            </div>
          </div>

          {/* Balance Section with Cash and Bank Balance */}
          <div className="col-md-4 mb-3">
            <div className="card p-4 shadow-sm rounded-lg bg-light">
              <h5 className="card-title text-muted">Balance</h5>
              <p className="display-6 text-primary">Cash: ₹{cashBalance}</p>
              <p className="display-6 text-primary">Bank: ₹{bankBalance}</p>
              <p className="display-6 text-success">Total: ₹{cashBalance + bankBalance}</p>
            </div>
          </div>
        </div>
{/* Category-wise Expenses and Last 5 Transactions in a Single Row */}
<div className="row mb-4">
  {/* Category-wise Expenses Pie Chart */}
  <div className="col-md-6">
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        <h5>Category-wise Expenses</h5>
      </div>
      <div className="card-body text-center">
        <Pie data={pieData} />
      </div>
    </div>
  </div>

  {/* Last 5 Transactions */}
  <div className="col-md-6">
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        <h5>Last 5 Transactions</h5>
      </div>
      <ul className="list-group list-group-flush">
        {lastTransactions.map((tx, index) => (
          <li className="list-group-item d-flex justify-content-between" key={index}>
            <span>{tx.title}</span>
            <span className={tx.amount < 0 ? 'text-danger' : 'text-success'}>
              ₹{tx.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

      </div>
    </>
  );
}
