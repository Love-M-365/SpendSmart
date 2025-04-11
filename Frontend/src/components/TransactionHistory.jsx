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

  // Format date as 'DD-MM-YYYY'
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Notification component
  const Notification = ({ status, amount }) => {
    const message = status === 'collect' 
      ? `You need to collect ₹${amount} from contributors.`
      : `You need to pay ₹${amount} to contributors.`;

    const bgColor = status === 'collect' ? 'bg-warning' : 'bg-success';
    const icon = status === 'collect' ? '💸' : '💵';

    return (
      <div className={`alert ${bgColor} text-white d-flex align-items-center`} role="alert">
        <span className="mr-2">{icon}</span>
        {message}
      </div>
    );
  };

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
                  {/* Notification for payment or collection */}
                  <Notification 
                    status={transaction.amount < 0 ? 'collect' : 'pay'} 
                    amount={Math.abs(transaction.amount)} 
                  />

                  <p><strong>Title:</strong> {transaction.title}</p>
                  <p><strong>Category:</strong> {transaction.category}</p>
                  <p><strong>Amount:</strong> ₹{transaction.amount}</p>
                  <p><strong>Payment Mode:</strong> {transaction.paymentMode}</p>
                  <p><strong>Payment To:</strong> {transaction.paymentTo}</p>
                  <p><strong>Date:</strong> {formatDate(transaction.date)}</p> {/* Date field */}

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
