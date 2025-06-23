import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="ss-navbar-wrapper">
      <div className="ss-navbar-left">
        <Link to="/" className="ss-navbar-brand">
          <img src={logo}  style={{width:"2rem",height:"2rem"}} alt="logo" />
          <span>Spend Smart</span>
        </Link>
      </div>

      <div className={`ss-navbar-menu ${menuOpen ? 'ss-open' : ''}`}>
        <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
        <Link to="/friends" onClick={closeMenu}>Friends</Link>
        <Link to="/underconstruction" onClick={closeMenu}>Support</Link>
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
