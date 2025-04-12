
import React, { useState , useEffect } from "react";
import { Moon, Sun, PlusCircle, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Legend } from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#0088FE", "#FF6384"];

const ExpenseTracker = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("All");
  // ✅ Fetch transactions on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in localStorage.");
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/transactions/${userId}`);
        setTransactions(res.data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions =
    filterType === "All"
      ? transactions
      : filterType === "Income"
      ? transactions.filter((t) => t.amount > 0)
      : transactions.filter((t) => t.amount < 0);

  const totalBalance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const income = transactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expense = -transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);

  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];
  const budgets = [
    { category: "Food", spent: 1800, limit: 2500 },
    { category: "Transport", spent: 700, limit: 1000 },
    { category: "Entertainment", spent: 1500, limit: 1200 },
  ];
  
  const navigate=useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ title: "", amount: "", date: "", category: "" });
  

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

  
  const handlebuttons = () =>{
    if (lable==="Add Expense"){
      
    }
  }
  const handleAddTransaction = () => {
    if (!newTransaction.title || !newTransaction.amount || !newTransaction.date || !newTransaction.category) return;
    const newId = transactions.length ? transactions[transactions.length - 1].id + 1 : 1;
    setTransactions([...transactions, { ...newTransaction, id: newId, amount: +newTransaction.amount }]);
    setNewTransaction({ title: "", amount: "", date: "", category: "" });
    setShowModal(false);
  };

  const handleDelete = (id) => setTransactions(transactions.filter(t => t.id !== id));

  return (

    <div style={{
      background: darkMode ? "#1c1c1c" : "#f8f9fa",
      color: darkMode ? "#f8f9fa" : "#212529",
      minHeight: "100vh",
      padding: "2rem",
      transition: "all 0.3s ease",
    }}>
      <Navbar></Navbar>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem",marginTop:"2rem" }}>
        
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: darkMode ? "#ffc107" : "#007bff"
          }}>
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>

      
      <div style={{ display: "flex",fontFamily:"Open Sans", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Balance", value: `₹${totalBalance}`, color: "#6c757d" },
          { label: "Income", value: `+ ₹${income}`, color: "#28a745" },
          { label: "Expense", value: `- ₹${expense}`, color: "#dc3545" }
        ].map((card, i) => (
          <div key={i} style={{
            flex: 1,
            padding: "1rem",
            fontSize:"2rem",
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

      
      {income === 0 && expense === 0 ? (
    <div className="flex items-center justify-center h-full text-center text-gray-500 text-lg" style={{fontFamily:"Orbitron"}}>
      <h1>👋 Welcome! <br></br>Start by adding your first transaction to see insights here.</h1>
    </div>
  ) : (
    <div className="d-flex justify-content-around flex-wrap mt-4">
  <div style={{ width: "45%", height: 300 }}>
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
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* Bar Chart */}
  <div style={{ width: "45%", height: 300 }}>
    <ResponsiveContainer>
      <BarChart data={categoryData}>
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#abeb34" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

  )}
  {/* Pie Chart */}
  
      {/* Add Transaction Buttons */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
       
          <button 
            onClick={()=>{
              navigate('/manual')
            }}
            style={{
              flex: 1,
              padding: "0.75rem",
              border: "none",
              borderRadius: "8px",
              background: "#007bff",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer"
            }}>Add Expense</button>
             <button 
           onClick={()=>{
            navigate('/scan')
          }}
            style={{
              flex: 1,
              padding: "0.75rem",
              border: "none",
              borderRadius: "8px",
              background: "#007bff",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer"
            }}>Scan Your Bill</button>
             <button 
            onClick={()=>{
              navigate('/addmoney')
            }}
            style={{
              flex: 1,
              padding: "0.75rem",
              border: "none",
              borderRadius: "8px",
              background: "#007bff",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer"
            }}>Add Money</button>
        
      </div>
    

      {/* Filter Toggle */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <button className="btn btn-success" onClick={() => setFilterType("All")} style={{ marginRight: "0.5rem" }}>All</button>
        <button className="btn btn-success" onClick={() => setFilterType("Income")} style={{ marginRight: "0.5rem" }}>Income</button>
        <button className="btn btn-success" onClick={() => setFilterType("Expense")}>Expense</button>
      </div>

      {/* Transactions */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTransactions.map((t) => (
          <li key={t.id} style={{
            background: darkMode ? "#2c2c2c" : "#fff",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "0.75rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize:"1.2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <div>
              <strong>{t.title}</strong> <br />
              <small>{new Date(t.createdAt).toLocaleString()}- {t.category}</small>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{
                marginRight: "1rem",
                fontWeight: "bold",
                color: t.amount > 0 ? "#28a745" : "#dc3545"
              }}>
                {t.amount > 0 ? "+" : "-"}₹{Math.abs(t.amount)}
              </span>
              <button onClick={() => handleDelete(t.id)} style={{
                background: "transparent",
                border: "none",
                color: "#dc3545",
                cursor: "pointer"
              }}><Trash2 size={18} /></button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex", alignItems: "center", justifyContent: "center"
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
