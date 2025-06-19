import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function NotificationBell() {
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);

  // Simulated API call (replace with your actual backend URL)
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications/notifications'); 
      const data = await res.json();
      setNotifications(data.notifications);
      setCount(data.notifications.length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleShow = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="position-relative">
      <button className="btn btn-light position-relative" onClick={handleShow}>
        <i className="bi bi-bell fs-4"></i>
        {count > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {count}
          </span>
        )}
      </button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notifications.length > 0 ? (
            <ul className="list-group">
              {notifications.map((notif, index) => (
  <li key={index} className="list-group-item">
    {notif.message}
  </li>
))}

            </ul>
          ) : (
            <p>No new notifications.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NotificationBell;
