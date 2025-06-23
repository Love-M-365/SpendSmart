import React, { useEffect, useState } from 'react';
import { Modal, Button, Toast, ToastContainer } from 'react-bootstrap';

function NotificationBell({ onMarkPaid }) {
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [view, setView] = useState('unpaid'); // 'unpaid' or 'paid'
  const apiUrl = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem("userId");

  const handleMarkAsPaid = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/api/notifications/mark-paid/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok) {
        setToastMsg('✅ Marked as paid');
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
      const res = await fetch(`${apiUrl}/api/notifications/${userId}`);
      const data = await res.json();

      setNotifications(data.notifications);
      const unpaidCount = data.notifications.filter(n => n.status !== 'paid').length;
      setCount(unpaidCount);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Optional: Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const getIcon = (status) => {
    if (status === 'owed') return '';
    if (status === 'due') return '';
    if (status === 'paid') return '';
    return '';
  };

  const filteredNotifications = notifications.filter(n =>
    view === 'unpaid' ? n.status !== 'paid' : n.status === 'paid'
  );

  return (
    <>
      <div className="position-relative">
        <button className="btn btn-light position-relative" onClick={handleShow}>
          <i className="bi bi-bell fs-4"></i>
          {count > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {count}
            </span>
          )}
        </button>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3 d-flex gap-2 justify-content-center">
            <Button variant={view === 'unpaid' ? 'primary' : 'outline-primary'} onClick={() => setView('unpaid')}>
              Unpaid
            </Button>
            <Button variant={view === 'paid' ? 'success' : 'outline-success'} onClick={() => setView('paid')}>
              Paid
            </Button>
          </div>

          {filteredNotifications.length > 0 ? (
            <ul className="list-group">
              {filteredNotifications.map((notif, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{getIcon(notif.status)} {notif.message}</span>
                  {notif.status !== 'paid' && (
                    <button className="btn btn-sm btn-success" onClick={() => handleMarkAsPaid(notif._id)}>
                      Mark Paid
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted">No {view} notifications.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="light">
          <Toast.Body>{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default NotificationBell;
