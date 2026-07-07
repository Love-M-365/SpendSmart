import React, { useEffect, useState } from 'react';
import { Modal, Button, Toast, ToastContainer } from 'react-bootstrap';
import { Bell, Check, AlertTriangle } from 'lucide-react';
import { API_BASE } from '../api';

function NotificationBell({ onMarkPaid }) {
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [view, setView] = useState('unpaid'); // 'unpaid' or 'paid'
  const userId = localStorage.getItem("userId");

  const handleMarkAsPaid = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/mark-paid/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok) {
        setToastMsg('✅ Marked as paid successfully');
        setShowToast(true);
        setNotifications(prev => prev.map(n =>
          n._id === id ? { ...n, status: 'paid' } : n
        ));
      } else {
        setToastMsg(data.error || 'Something went wrong');
        setShowToast(true);
      }
      if (onMarkPaid) {
        onMarkPaid();
      }
    } catch (err) {
      console.error('🔥 Exception in handleMarkAsPaid:', err.message);
    }
  };

  const fetchNotifications = async () => {
    try {
      if (!userId) return;
      const res = await fetch(`${API_BASE}/notifications/${userId}`);
      const data = await res.json();

      setNotifications(data.notifications || []);
      const unpaidCount = (data.notifications || []).filter(n => n.status !== 'paid').length;
      setCount(unpaidCount);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const filteredNotifications = notifications.filter(n =>
    view === 'unpaid' ? n.status !== 'paid' : n.status === 'paid'
  );

  return (
    <>
      <div className="position-relative">
        <button 
          className="btn position-relative d-flex align-items-center justify-content-center" 
          onClick={handleShow}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-sm)",
            transition: "all 0.2s ease"
          }}
        >
          <Bell size={20} style={{ color: "var(--text-primary)" }} />
          {count > 0 && (
            <span 
              className="position-absolute translate-middle badge rounded-pill bg-danger"
              style={{
                top: "10px",
                right: "-2px",
                fontSize: "0.75rem",
                padding: "0.25em 0.5em"
              }}
            >
              {count}
            </span>
          )}
        </button>
      </div>

      <Modal show={showModal} onHide={handleClose} centered className="notification-modal">
        <Modal.Header closeButton style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }}>
          <Modal.Title style={{ fontWeight: 700, fontSize: "1.25rem" }}>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "var(--bg-app)", color: "var(--text-primary)", padding: "1.5rem" }}>
          <div className="mb-4 d-flex gap-2 justify-content-center">
            <Button 
              variant={view === 'unpaid' ? 'primary' : 'outline-primary'} 
              onClick={() => setView('unpaid')}
              style={{ borderRadius: "10px", fontWeight: 600, padding: "0.5rem 1.25rem" }}
            >
              Unpaid
            </Button>
            <Button 
              variant={view === 'paid' ? 'success' : 'outline-success'} 
              onClick={() => setView('paid')}
              style={{ borderRadius: "10px", fontWeight: 600, padding: "0.5rem 1.25rem" }}
            >
              Paid
            </Button>
          </div>

          {filteredNotifications.length > 0 ? (
            <div className="d-flex flex-column gap-2" style={{ maxHeight: "350px", overflowY: "auto" }}>
              {filteredNotifications.map((notif, index) => (
                <div 
                  key={index} 
                  className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-card shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    transition: "var(--transition-smooth)"
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: notif.status === 'paid' ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                        color: notif.status === 'paid' ? "var(--success)" : "var(--warning)"
                      }}
                    >
                      {notif.status === 'paid' ? <Check size={18} /> : <AlertTriangle size={18} />}
                    </div>
                    <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-primary)" }}>{notif.message}</span>
                  </div>
                  {notif.status !== 'paid' && (
                    <button 
                      className="btn btn-sm btn-success px-3 py-1.5" 
                      onClick={() => handleMarkAsPaid(notif._id)}
                      style={{ borderRadius: "8px", fontWeight: 600 }}
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <p className="m-0 fs-6">No {view} notifications.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)" }}>
          <Button variant="secondary" onClick={handleClose} style={{ borderRadius: "10px", fontWeight: 600 }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="light">
          <Toast.Body style={{ fontWeight: 600 }}>{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default NotificationBell;
