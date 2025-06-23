import React, { useEffect, useState } from "react";
import { Card, Container, Button, Spinner } from "react-bootstrap";
import { BsExclamationCircle, BsCheckCircle, BsClock } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./payment.css";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const PaymentCard = ({ payment, onMarkAsDone }) => {
  let icon, variant;

  switch (payment.status) {
    case "due":
      icon = <BsExclamationCircle color="red" size={20} />;
      variant = "danger";
      break;
    case "owed":
      icon = <BsClock color="orange" size={20} />;
      variant = "warning";
      break;
    case "paid":
    default:
      icon = <BsCheckCircle color="green" size={20} />;
      variant = "success";
      break;
  }

  return (
    <Card className="m-2" style={{ minWidth: "250px", maxWidth: "250px" }}>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
          {icon} <span className="ms-2">{payment.person?.name}</span>
        </Card.Title>
        <Card.Text>Amount: ₹{payment.amount}</Card.Text>
        <Card.Text>Status: {payment.status}</Card.Text>
        <Button variant={variant} onClick={() => onMarkAsDone(payment._id)}>
          Mark as Done
        </Button>
      </Card.Body>
    </Card>
  );
};

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userId"));
      

      const res = await axios.get(`${apiUrl}/api/notifications`);
      const allNotifications = res.data;

      // Filter notifications for this user only
      const userNotifications = allNotifications.filter(
        (n) => n.user?._id === user
      );

      setPayments(userNotifications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsDone = async (id) => {
    // TODO: Add logic to mark as done if needed
    console.log("Mark as done clicked for ID:", id);
  };

  return (
    <Container className="my-4">
      <h2>Your Payments</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="d-flex flex-wrap">
          {payments.map((payment) => (
            <PaymentCard
              key={payment._id}
              payment={payment}
              onMarkAsDone={handleMarkAsDone}
            />
          ))}
        </div>
      )}
    </Container>
  );
};

export default PaymentsList;
