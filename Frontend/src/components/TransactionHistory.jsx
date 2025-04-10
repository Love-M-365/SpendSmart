import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);

  // Fetching transactions on component load
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Replace with the correct API endpoint
        const response = await axios.get('/api/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        alert('Failed to load transaction history!');
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <div className="alert alert-info text-center">No transactions found!</div>
      ) : (
        <div className="row">
          {transactions.map((transaction, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h5>Transaction ID: {transaction.transactionId}</h5>
                </div>
                <div className="card-body">
                  <p><strong>Title:</strong> {transaction.title}</p>
                  <p><strong>Category:</strong> {transaction.category}</p>
                  <p><strong>Amount:</strong> ₹{transaction.amount}</p>
                  <p><strong>Payment Mode:</strong> {transaction.paymentMode}</p>
                  <p><strong>Payment To:</strong> {transaction.paymentTo}</p>
                  
                  <div>
                    <strong>Contributors:</strong>
                    <ul className="list-unstyled">
                      {transaction.contributors.map((contributor, idx) => (
                        <li key={idx} className="d-flex justify-content-between align-items-center">
                          {contributor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
