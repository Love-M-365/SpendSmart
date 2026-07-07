import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="ss-navbar-wrapper glass-morphic">
      <div className="ss-navbar-left">
        <Link to="/" className="ss-navbar-brand">
          <img src={logo} alt="logo" />
          <span>Spend Smart</span>
        </Link>
      </div>

      <div className={`ss-navbar-menu ${menuOpen ? 'ss-open' : ''}`}>
        <Link to="/dashboard" className={isActive('/dashboard')} onClick={closeMenu}>Dashboard</Link>
        <Link to="/friends" className={isActive('/friends')} onClick={closeMenu}>Friends</Link>
        <Link to="/payments" className={isActive('/payments')} onClick={closeMenu}>Payments</Link>
        <Link to="/underconstruction" className={isActive('/underconstruction')} onClick={closeMenu}>Support</Link>
        <button className="ss-navbar-logout" onClick={handleLogout}>Logout</button>
      </div>

      <div className={`ss-navbar-hamburger ${menuOpen ? 'ss-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
        <div className="ss-line"></div>
        <div className="ss-line"></div>
        <div className="ss-line"></div>
      </div>
    </nav>
  );
}

