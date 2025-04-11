import React, { useState, useEffect, useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import { Sun, Moon, DollarSign, CreditCard, TrendingUp, Calendar, Plus } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, description: "Paid Rent", amount: 500, date: "2025-04-01" },
    { id: 2, description: "Grocery Shopping", amount: 150, date: "2025-04-03" },
    { id: 3, description: "Electricity Bill", amount: 100, date: "2025-04-04" },
    { id: 4, description: "Movie Night", amount: 50, date: "2025-04-07" },
  ]);
  const [sortKey, setSortKey] = useState("date");
  const [filterText, setFilterText] = useState("");
  const [newTransaction, setNewTransaction] = useState({ description: "", amount: "", date: "" });
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [budget, setBudget] = useState(1000);
  const [showAddForm, setShowAddForm] = useState(false);

  // Dark mode toggle effect
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Filter and sort transactions based on state
  const filteredTransactions = transactions
    .filter((txn) => txn.description.toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "amount") return b.amount - a.amount;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // Calculate total spent
  const totalSpent = useMemo(() => filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0), [filteredTransactions]);

  // Current month transactions
  const currentMonth = new Date().getMonth();
  const currentMonthTransactions = filteredTransactions.filter((txn) => new Date(txn.date).getMonth() === currentMonth);
  const currentMonthTotal = currentMonthTransactions.reduce((sum, txn) => sum + txn.amount, 0);

  // Pie chart data
  const pieData = {
    labels: filteredTransactions.map((txn) => txn.description),
    datasets: [
      {
        data: filteredTransactions.map((txn) => txn.amount),
        backgroundColor: [
          "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#6366F1",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Pie chart options
  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: darkMode ? "#E5E7EB" : "#374151",
          font: { size: 12 },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "#374151" : "#FFFFFF",
        titleColor: darkMode ? "#E5E7EB" : "#374151",
        bodyColor: darkMode ? "#E5E7EB" : "#374151",
        borderColor: darkMode ? "#4B5563" : "#E5E7EB",
        borderWidth: 1,
        padding: 12,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Handle new transaction form submission
  const handleAddTransaction = (e) => {
    e.preventDefault();
    const { description, amount, date } = newTransaction;
    if (!description || !amount || !date) return;

    const newTxn = {
      id: transactions.length + 1,
      description,
      amount: parseFloat(amount),
      date,
    };

    setTransactions([newTxn, ...transactions]);
    setNewTransaction({ description: "", amount: "", date: "" });
    setShowAddForm(false);
  };

  // Handle transaction deletion
  const handleDelete = (id) => {
    setTransactions(transactions.filter((txn) => txn.id !== id));
  };

  return (
    <div className="container-fluid bg-light dark:bg-dark">
      <div className="container py-5">
        {/* Header */}
        <motion.div
          className="d-flex justify-content-between align-items-center mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="d-flex align-items-center gap-3">
            <CreditCard className="w-6 h-6 text-primary" />
            <h1 className="display-4 text-primary">Expense Tracker</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="btn btn-light p-2 rounded-circle"
          >
            {darkMode ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-dark" />}
          </button>
        </motion.div>

        {/* Main Content */}
        <div className="row">
          {/* Left Column */}
          <div className="col-lg-8">
            {/* Budget Section */}
            <motion.div
              className="card shadow-lg mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="card-body">
                <h5 className="card-title text-primary mb-4 d-flex align-items-center gap-2">
                  <DollarSign className="w-5 h-5 text-success" />
                  Monthly Budget
                </h5>
                <input
                  type="number"
                  placeholder="Enter your budget"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="form-control mb-4"
                />
                <div className="progress mb-3" style={{ height: "20px" }}>
                  <div
                    className={`progress-bar ${totalSpent <= budget ? "bg-success" : "bg-danger"}`}
                    role="progressbar"
                    style={{ width: `${Math.min((totalSpent / budget) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <span>Spent: ₹{totalSpent}</span>
                  <span>Budget: ₹{budget}</span>
                </div>
              </div>
            </motion.div>

            {/* Pie Chart Section */}
            <motion.div
              className="card shadow-lg mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="card-body">
                <h5 className="card-title text-primary mb-4 d-flex align-items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-info" />
                  Expense Distribution
                </h5>
                <div className="h-75">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="col-lg-4">
            {/* Monthly Summary Section */}
            <motion.div
              className="card shadow-lg mb-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="card-body">
                <h5 className="card-title text-primary mb-4 d-flex align-items-center gap-2">
                  <Calendar className="w-5 h-5 text-warning" />
                  Monthly Summary
                </h5>
                <p className="display-4 text-info">₹{currentMonthTotal}</p>
                <p className="text-muted">This month so far</p>
              </div>
            </motion.div>

            {/* Add Transaction Button */}
            <motion.div
              className="d-flex justify-content-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn btn-success rounded-circle p-3"
              >
                <Plus className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Add Transaction Form */}
        {showAddForm && (
          <motion.div
            className="card shadow-lg mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="card-body">
              <h5 className="card-title text-primary mb-4">Add Transaction</h5>
              <form onSubmit={handleAddTransaction}>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    className="form-control"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Add Transaction
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
