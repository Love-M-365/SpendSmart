import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { AlertCircle, CheckCircle, Clock, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./payment.css";
import axios from "axios";
import Navbar from "./Navbar";
import { API_BASE } from "../api";

const PaymentCard = ({ payment, currentUserId, onMarkAsDone }) => {
  let icon, badgeClass, iconColor;

  switch (payment.status) {
    case "due":
      icon = <AlertCircle size={20} className="text-danger" />;
      badgeClass = "bg-danger-subtle text-danger";
      break;
    case "owed":
      icon = <Clock size={20} className="text-warning" />;
      badgeClass = "bg-warning-subtle text-warning";
      break;
    case "paid":
    default:
      icon = <CheckCircle size={20} className="text-success" />;
      badgeClass = "bg-success-subtle text-success";
      break;
  }

  // Determine direction: Did the user send this or receive this?
  const isOwedToUser = payment.person?._id === currentUserId;

  return (
    <div className="card payment-grid-card border-0">
      <div className="card-body p-4 d-flex flex-column justify-content-between h-100">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="d-flex align-items-center gap-2">
              {icon}
              <strong style={{ color: "var(--text-primary)" }}>
                {isOwedToUser ? payment.user?.name : payment.person?.name}
              </strong>
            </span>
            <span className={`badge payment-status-badge ${badgeClass}`}>
              {payment.status}
            </span>
          </div>

          <div className="mb-4">
            <span className="text-secondary small d-block mb-1">AMOUNT</span>
            <strong className="fs-3 d-flex align-items-center gap-1" style={{ color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
              ₹{parseFloat(payment.amount || 0).toFixed(2)}
            </strong>
            <p className="text-secondary small mt-2 mb-0">{payment.message}</p>
          </div>
        </div>

        {payment.status !== "paid" && (
          <button 
            className="btn btn-premium-primary w-100 py-2" 
            onClick={() => onMarkAsDone(payment._id)}
          >
            Mark as Paid
          </button>
        )}
      </div>
    </div>
  );
};

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("userId");

  const fetchNotifications = async () => {
    try {
      if (!currentUserId) return;
      const res = await axios.get(`${API_BASE}/notifications`);
      const allNotifications = res.data;

      // Filter notifications for this user (either receiver or sender)
      const userNotifications = allNotifications.filter(
        (n) => n.user?._id === currentUserId || n.person?._id === currentUserId
      );

      setPayments(userNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUserId]);

  const handleMarkAsDone = async (id) => {
    try {
      await axios.put(`${API_BASE}/notifications/mark-paid/${id}`);
      // Refresh notifications list
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as paid:", error);
      alert("Failed to mark payment as paid.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5" style={{ marginTop: "5.5rem", marginBottom: "3rem" }}>
        <div className="d-flex flex-column mb-5">
          <h2 className="fw-bold m-0">💸 Tab Settlements</h2>
          <p className="text-muted m-0">Track and settle split balances with friends</p>
        </div>

        {loading ? (
          <div className="text-center my-5 p-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3">Loading split tabs...</p>
          </div>
        ) : (
          <div className="payments-container">
            {payments.length === 0 ? (
              <p className="text-center text-muted py-5 bg-card rounded-4 border">No split transactions recorded yet.</p>
            ) : (
              <div className="row g-4">
                {payments.map((payment) => (
                  <div className="col-12 col-md-6 col-lg-4" key={payment._id}>
                    <PaymentCard
                      payment={payment}
                      currentUserId={currentUserId}
                      onMarkAsDone={handleMarkAsDone}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentsList;
