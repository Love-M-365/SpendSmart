import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Navbar from "./Navbar";
import GlitchText from './GlitchText';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";
import logo from '../assets/logo.png';
import mt from '../assets/moneyt.png';
import { BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import WelcomeSteps from "./Sample";
import NotificationBell from "./NotificationBell";
import { Dropdown } from 'react-bootstrap';
import ShinyText from "./GlitchText";
import BlurText from "./GlitchText";

const COLORS = [
 
  '#BA68C8', // Soft Purple
  
  '#E57373', // Muted Coral
  '#F06292', // Pinkish
];


const ExpenseTracker = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ title: "", amount: "", date: "", category: "" });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

  const fetchTransactions = async () => {
    try {
      if (!userId) return console.error("User ID not found in localStorage.");
      const res = await axios.get(`http://localhost:5000/api/transactions/${userId}`);
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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
  ];

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

  const handleAddTransaction = () => {
    if (!newTransaction.title || !newTransaction.amount || !newTransaction.date || !newTransaction.category) return;
    const newId = transactions.length ? transactions[transactions.length - 1].id + 1 : 1;
    setTransactions([...transactions, { ...newTransaction, id: newId, amount: +newTransaction.amount }]);
    setNewTransaction({ title: "", amount: "", date: "", category: "" });
    setShowModal(false);
  };

  return (
    <div className="dashboard-container" style={{
      background: darkMode ? "#1c1c1c" : "#f8f9fa",
      color: darkMode ? "#f8f9fa" : "#212529",
      minHeight: "100vh",
      padding: "2rem",
      transition: "all 0.3s ease",
    }}>
      <Navbar />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" ,marginTop:"4rem" }}>
        <button
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: darkMode ? "#ffc107" : "#007bff"
          }}
        >
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
        <NotificationBell onMarkPaid={fetchTransactions} />
      </div>

      {income === 0 && expense === 0 ? (
        
        <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 px-3 text-center">
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className=" w-100"
  >
  

<div style={{textAlign:"left"}}><h1 className="display-heading">
  <BlurText
  text="Spend Smart"
  delay={250}
  animateBy="words"
  direction="top"
  onAnimationComplete={handleAnimationComplete}
/>
</h1>
</div>


    <p className="lead fs-5">Your journey to smarter financial habits starts here. 🎯</p>
  </motion.div>
   
  <WelcomeSteps />
 


  <motion.img
    src={mt}
    alt="Smart Money"
    className="img-fluid my-4"
    style={{ maxWidth: "180px", width: "100%" }}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
  />
</div>

      ) : (
        <div>
          <div className="balance-cards" style={{ display: "flex", fontFamily: "Open Sans", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { label: "Balance", value: `₹${totalBalance.toFixed(2)}`, color: "#6c757d" },
              { label: "Income", value: `+ ₹${income}`, color: "#28a745" },
              { label: "Expense", value: `- ₹${expense.toFixed(2)}`, color: "#dc3545" }
            ].map((card, i) => (
              <div key={i} style={{
                flex: 1,
                padding: "1rem",
                fontSize: "2rem",
                background: darkMode ? "#343a40" : "#fff",
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}>
                <h5>{card.label}</h5>
                <p style={{ fontWeight: "bold", color: card.color }}>{card.value}</p>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-around flex-wrap mt-4">
            <div className="chart-wrapper" style={{ width: "45%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}

                    outerRadius={100}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
  formatter={(value) => `₹${value.toFixed(2)}`}
/>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-wrapper" style={{ width: "45%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={categoryData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip
  formatter={(value) => `₹${value.toFixed(2)}`}
/>

                  <Legend />
                  <Bar dataKey="amount" fill="#5dade2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Add Buttons */}
      <div className="top-buttons" style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button  onClick={() => navigate('/manual')} className="button-68" style={{ flex: 1 }}>Add Expense</button>
        <button onClick={() => navigate('/scan')} className="button-68" style={{ flex: 1 }}>Scan Your Bill</button>
        <button onClick={() => navigate('/addmoney')} className="button-68" style={{ flex: 1 }}>Add Money</button>
      </div>

     
    {/* Filter Dropdown */}
<div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
  <Dropdown onSelect={(eventKey) => setFilterType(eventKey)}>
    <Dropdown.Toggle variant="primary" id="dropdown-basic">
      {filterType}
    </Dropdown.Toggle>

    <Dropdown.Menu>
      <Dropdown.Item eventKey="All">All</Dropdown.Item>
      <Dropdown.Item eventKey="Income">Income</Dropdown.Item>
      <Dropdown.Item eventKey="Expense">Expense</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
</div>
      {/* Transactions */}
     <div className="transaction-container" style={{ maxWidth: "75rem", margin: "0 auto" }}>
  {filteredTransactions.map((t) => (
    <motion.div
      key={t.id}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="transaction-card"
      style={{
        background: darkMode ? "#2a2a2a" : "#ffffff",
        padding: "1.2rem 1.5rem",
        borderRadius: "12px",
        marginBottom: "1.2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: darkMode
          ? "0 4px 12px rgba(255,255,255,0.05)"
          : "0 4px 12px rgba(0,0,0,0.05)",
        borderLeft: `6px solid ${t.amount > 0 ? "#28a745" : "#dc3545"}`,
        fontFamily: "Inter, sans-serif"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h5 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600 }}>
          {t.title}
        </h5>
        <span style={{ fontSize: "0.85rem", color: darkMode ? "#ccc" : "#666" }}>
          {new Date(t.createdAt).toLocaleString("en-IN", {
  day: "2-digit",
  month: "short", // or "long" for full month name
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true
})} • {t.category}
        </span>
      </div>
      <div style={{ fontWeight: 600, fontSize: "1.1rem", color: t.amount > 0 ? "#28a745" : "#dc3545" }}>
        {t.amount > 0 ? "+" : "-"} ₹{Math.abs(t.amount).toFixed(2)}
      </div>
    </motion.div>
  ))}
</div>


      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#000",
            padding: "2rem", borderRadius: "8px", width: "90%", maxWidth: "400px"
          }}>
            <h4>Add Transaction</h4>
            {["title", "amount", "date", "category"].map((field, i) => (
              <input
                key={i}
                type={field === "amount" ? "number" : field === "date" ? "date" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newTransaction[field]}
                onChange={(e) => setNewTransaction({ ...newTransaction, [field]: e.target.value })}
                style={{
                  width: "100%", padding: "0.5rem", marginBottom: "0.75rem",
                  borderRadius: "6px", border: "1px solid #ccc"
                }}
              />
            ))}
            <div style={{ textAlign: "right" }}>
              <button onClick={() => setShowModal(false)} style={{ marginRight: "1rem" }}>Cancel</button>
              <button onClick={handleAddTransaction} style={{
                background: "#28a745", color: "#fff", padding: "0.5rem 1rem", border: "none", borderRadius: "6px"
              }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;
