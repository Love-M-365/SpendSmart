import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleToggle = () => setIsNavCollapsed(!isNavCollapsed);
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm fixed-top">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img src={logo} alt="logo" style={{ height: "2rem", width: "2rem", marginRight: "0.5rem" }} />
        <span className="fw-bold">Spend Smart</span>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        onClick={handleToggle}
        aria-controls="navbarNav"
        aria-expanded={!isNavCollapsed ? true : false}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
        <ul className="navbar-nav ms-auto d-flex align-items-center gap-3">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/friends">Friends</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/analytics">Analytics</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/support">Support</Link>
          </li>

         
          <li className="nav-item">
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
