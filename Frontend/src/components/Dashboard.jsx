
import React, { useState } from "react";
import { Moon, Sun, PlusCircle, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#0088FE", "#FF6384"];

const ExpenseTracker = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: 1, title: "Groceries", amount: -40, date: "2024-04-01", category: "Food" },
    { id: 2, title: "Salary", amount: 1000, date: "2024-04-02", category: "Income" },
    { id: 3, title: "Book", amount: -20, date: "2024-04-03", category: "Education" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ title: "", amount: "", date: "", category: "" });
  const [filterType, setFilterType] = useState("All");

  const filteredTransactions = filterType === "All"
    ? transactions
    : filterType === "Income"
    ? transactions.filter(t => t.amount > 0)
    : transactions.filter(t => t.amount < 0);

  const totalBalance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expense = -transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);

  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

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
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ color: "#007bff" }}>Expense Tracker</h2>
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

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Balance", value: `$${totalBalance}`, color: "#6c757d" },
          { label: "Income", value: `+ $${income}`, color: "#28a745" },
          { label: "Expense", value: `- $${expense}`, color: "#dc3545" }
        ].map((card, i) => (
          <div key={i} style={{
            flex: 1,
            padding: "1rem",
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

      {/* Pie Chart */}
      <div style={{ background: darkMode ? "#343a40" : "#fff", padding: "1rem", borderRadius: "8px", marginBottom: "2rem" }}>
        <h5 style={{ textAlign: "center" }}>Income vs Expense</h5>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Add Transaction Buttons */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        {["Manual", "QR Code", "Add Money"].map((label, i) => (
          <button key={i}
            onClick={() => label === "Manual" && setShowModal(true)}
            style={{
              flex: 1,
              padding: "0.75rem",
              border: "none",
              borderRadius: "8px",
              background: "#007bff",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer"
            }}>{label}</button>
        ))}
      </div>

      {/* Filter Toggle */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <button onClick={() => setFilterType("All")} style={{ marginRight: "0.5rem" }}>All</button>
        <button onClick={() => setFilterType("Income")} style={{ marginRight: "0.5rem" }}>Income</button>
        <button onClick={() => setFilterType("Expense")}>Expense</button>
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
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <div>
              <strong>{t.title}</strong> <br />
              <small>{t.date} - {t.category}</small>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{
                marginRight: "1rem",
                fontWeight: "bold",
                color: t.amount > 0 ? "#28a745" : "#dc3545"
              }}>
                {t.amount > 0 ? "+" : "-"}${Math.abs(t.amount)}
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
