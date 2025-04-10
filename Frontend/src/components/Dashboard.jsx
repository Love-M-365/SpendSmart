import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // Example data
  const lastTransactions = [
    { title: 'Groceries', amount: -200 },
    { title: 'Salary', amount: 5000 },
    { title: 'Netflix', amount: -500 },
    { title: 'Friend Payback', amount: 700 },
    { title: 'Electricity Bill', amount: -1200 }
  ];

  // Savings emoji logic
  const totalIncome = 7000;
  const totalExpense = 3000;
  const savings = totalIncome - totalExpense;

  const savingsEmoji = savings > 2000 ? '💰' : savings > 0 ? '😊' : '😬';

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm px-4" style={{margin:"0rem"}}>
        <Link className="navbar-brand" to="/">Spend Smart</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/transactions">Transaction History</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/balance">Balance</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/friends">Friends</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/support">Support</Link></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid mt-5 " style={{width:"70rem"}} >

        <h2 className="mb-4 text-center">Welcome to Your Dashboard</h2>

        {/* Top row */}
        <div className="row mb-4">
          {/* Scan Button */}
          <div className="col-md-4 text-center mb-3">
            <button className="btn btn-success w-100 py-3">
             <Link to="/scan" style={{textDecoration:"none",color:"white"}}>📷 Scan to Store Expense</Link> 
            </button>
          </div>

          {/* Savings Status */}
          <div className="col-md-4 text-center mb-3">
            <div className="border p-4 rounded shadow-sm">
              <h5>Savings Status</h5>
              <div style={{ fontSize: '2.5rem' }}>{savingsEmoji}</div>
              <p className="mt-2">Saved: ₹{savings}</p>
            </div>
          </div>

          {/* Placeholder for balance or analytics */}
          <div className="col-md-4 text-center mb-3">
            <div className="border p-4 rounded shadow-sm bg-light">
              <h5>Balance</h5>
              <p className="display-6">₹{totalIncome - totalExpense}</p>
            </div>
          </div>
        </div>

        {/* Last 5 Transactions */}
        <div className="card shadow-sm">
          <div className="card-header">
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
    </>
  );
}
