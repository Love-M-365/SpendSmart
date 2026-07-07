import React, { useState, useEffect } from "react";
import { Moon, Sun, PlusCircle, QrCode, CreditCard } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";
import mt from '../assets/moneyt.png';
import WelcomeSteps from "./Sample";
import NotificationBell from "./NotificationBell";
import { Dropdown } from 'react-bootstrap';
import { API_BASE } from "../api";

const LIGHT_COLORS = ['#818cf8', '#f87171', '#34d399', '#fbbf24', '#a78bfa'];
const DARK_COLORS = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

const ExpenseTracker = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("All");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const fetchTransactions = async () => {
    try {
      if (!userId) return console.error("User ID not found in localStorage.");
      const res = await axios.get(`${API_BASE}/transactions/${userId}`);
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Theme Sync effect
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const filteredTransactions = [...(
    filterType === "All"
      ? transactions
      : filterType === "Income"
      ? transactions.filter((t) => t.amount > 0)
      : transactions.filter((t) => t.amount < 0)
  )].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalBalance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const income = transactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expense = -transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);

  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ].filter(d => d.value > 0);

  const categoryData = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => {
      const category = t.category || "Others";
      const existing = acc.find((item) => item.category === category);
      if (existing) {
        existing.amount += Math.abs(t.amount);
      } else {
        acc.push({ category, amount: Math.abs(t.amount) });
      }
      return acc;
    }, []);

  const themeColors = darkMode ? DARK_COLORS : LIGHT_COLORS;

  return (
    <div className="dashboard-container">
      <Navbar />
      
      {/* Top Header Panel */}
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ marginTop: "1rem" }}>
        <button
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={20} className="text-warning" /> : <Moon size={20} className="text-primary" />}
        </button>
        <NotificationBell onMarkPaid={fetchTransactions} />
      </div>

      {income === 0 && expense === 0 ? (
        <div className="container d-flex flex-column justify-content-center align-items-center px-3 text-center" style={{ minHeight: "70vh" }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-100"
          >
            <h1 className="display-5 fw-bold mb-2">Spend Smart</h1>
            <p className="lead fs-5 text-secondary">Your journey to smarter financial habits starts here. 🎯</p>
          </motion.div>
           
          <WelcomeSteps />
         
          <motion.img
            src={mt}
            alt="Smart Money"
            className="img-fluid my-4"
            style={{ maxWidth: "160px", width: "100%" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          />
        </div>
      ) : (
        <div>
          {/* Metric Cards Section */}
          <div className="balance-cards">
            <div className="metric-card balance">
              <h5>Total Balance</h5>
              <p style={{ color: "var(--text-primary)" }}>₹{totalBalance.toFixed(2)}</p>
            </div>
            <div className="metric-card income">
              <h5>Total Income</h5>
              <p style={{ color: "var(--success)" }}>+ ₹{income.toFixed(2)}</p>
            </div>
            <div className="metric-card expense">
              <h5>Total Expense</h5>
              <p style={{ color: "var(--danger)" }}>- ₹{expense.toFixed(2)}</p>
            </div>
          </div>

          {/* Charts Analysis Section */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="chart-wrapper h-100">
                <h4 className="chart-title">Income vs Expenses</h4>
                <div style={{ width: "100%", height: 280 }}>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={90}
                          innerRadius={40}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={themeColors[index % themeColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">No data available</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="chart-wrapper h-100">
                <h4 className="chart-title">Expenses by Category</h4>
                <div style={{ width: "100%", height: 280 }}>
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer>
                      <BarChart data={categoryData}>
                        <XAxis dataKey="category" stroke="var(--text-secondary)" tickLine={false} />
                        <YAxis stroke="var(--text-secondary)" tickLine={false} />
                        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                        <Legend />
                        <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={themeColors[index % themeColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">No expenses recorded</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons Panel */}
      <div className="top-buttons">
        <button onClick={() => navigate('/manual')} className="action-card-btn">
          <PlusCircle />
          <span>Add Expense</span>
        </button>
        <button onClick={() => navigate('/scan')} className="action-card-btn">
          <QrCode />
          <span>Scan Bill</span>
        </button>
        <button onClick={() => navigate('/addmoney')} className="action-card-btn">
          <CreditCard />
          <span>Add Income</span>
        </button>
      </div>

      {/* Filter and Transactions Panel */}
      <div className="d-flex justify-content-between align-items-center mb-4 filter-dropdown">
        <h4 className="m-0" style={{ fontSize: "1.25rem", fontWeight: 700 }}>Transaction History</h4>
        <Dropdown onSelect={(eventKey) => setFilterType(eventKey)}>
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            Filter: {filterType}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            <Dropdown.Item eventKey="Income">Income</Dropdown.Item>
            <Dropdown.Item eventKey="Expense">Expense</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Transactions list */}
      <div className="transaction-container">
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-muted py-4">No transactions match your filter.</p>
        ) : (
          filteredTransactions.map((t) => (
            <motion.div
              key={t._id || t.id}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="transaction-card"
              style={{
                borderLeftColor: t.amount > 0 ? "var(--success)" : "var(--danger)"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h5 className="transaction-title">{t.title}</h5>
                <span className="transaction-meta">
                  {new Date(t.createdAt || t.date).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                  })} • <span className="badge bg-secondary-subtle text-secondary-emphasis">{t.category}</span>
                </span>
              </div>
              <div 
                className="transaction-amount" 
                style={{ color: t.amount > 0 ? "var(--success)" : "var(--danger)" }}
              >
                {t.amount > 0 ? "+" : "-"} ₹{Math.abs(t.amount).toFixed(2)}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
