import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Welcome.css";
import { useIsMobile } from "./useMobile";

// Assets imports
import pb from "../assets/pbwprb.png";
import coin from "../assets/coin.png";
import logo from "../assets/logo.png";
import welcome from '../assets/welcomepage3.png';
import dashboard from '../assets/dashboard.png';
import bills from '../assets/bills.jpg';
import ai from '../assets/aic.jpeg';
import piechrt from '../assets/piechart.jpeg';
import billsplit from '../assets/billsplit.jpeg';

// Components imports
import FeatureZigZag from "./Features";
import FeatureCarousel from "./FeatureCarousel";

export default function WelcomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  const handleNavLinkClick = () => {
    const nav = document.getElementById('navbarNav');
    if (nav && nav.classList.contains('show')) {
      nav.classList.remove('show');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Trigger coin deposit drop trigger
      if (window.scrollY > 120) {
        setScrolled(true);
      }
      // Trigger slide-in reveal container when scrolled down slightly
      if (window.scrollY > 280) {
        setIsVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="container-fluid p-0" style={{ backgroundColor: "#f8fafc" }}>
      {/* Centered Floating Pill Navbar */}
      <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
        <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
          <a className="navbar-brand d-flex align-items-center" href="#home">
            <img src={logo} style={{ maxHeight: "2rem", marginRight: "0.5rem" }} alt="Logo" />
            <span>Spend Smart</span>
          </a>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            style={{ border: "none" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2 gap-lg-4 text-center">
              <li className="nav-item">
                <a className="nav-link" href="#home" onClick={handleNavLinkClick}>Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#features" onClick={handleNavLinkClick}>Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact" onClick={handleNavLinkClick}>Contact</a>
              </li>
            </ul>
            <div className="d-flex flex-column flex-lg-row gap-2 align-items-center text-center">
              <Link to="/login" className="btn btn-premium-secondary btn-glow py-2 px-4" style={{ borderRadius: "20px", fontSize: "0.85rem" }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-premium-primary btn-glow py-2 px-4" style={{ borderRadius: "20px", fontSize: "0.85rem" }}>
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-wrapper" id="home">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6 text-center text-lg-start animate-entrance-left">
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-4" style={{ fontSize: "0.8rem", fontWeight: 700, border: "1px solid rgba(99, 102, 241, 0.25)" }}>
                INTRODUCING SPEND SMART v2.0
              </span>
              <h1 className="hero-title">
                Smarter Budgets.<br />Less Overhead.
              </h1>
              <p className="hero-subtitle">
                Track personal expenses, scan invoices with AI OCR classifiers, split splits seamlessly with your friends, and analyze cash allocations on a beautifully responsive dashboard.
              </p>
              <div className="hero-buttons d-flex gap-3 justify-content-center justify-content-lg-start">
                <Link to="/register" className="btn-premium-primary btn-glow text-decoration-none" style={{ borderRadius: "30px", padding: "0.85rem 2rem" }}>
                  Get Started Free
                </Link>
                <a href="#features" className="btn-premium-secondary btn-glow text-decoration-none" style={{ borderRadius: "30px", padding: "0.85rem 2rem" }}>
                  Learn More
                </a>
              </div>
            </div>
            <div className="col-lg-6 text-center animate-entrance-right">
              <img 
                src={dashboard} 
                className="img-fluid rounded-4" 
                style={{ 
                  maxWidth: "85%", 
                  filter: "drop-shadow(0 20px 40px rgba(99,102,241,0.08))",
                  border: "1px solid rgba(0,0,0,0.04)"
                }} 
                alt="Spend Smart Dashboard Preview" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Restored Scroll Reveal Slide-In Section */}
      <section className="scroll-reveal-section">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className={`col-lg-6 reveal-left ${isVisible ? 'active' : ''}`}>
              <h2 className="fw-bold mb-3" style={{ fontSize: "2.75rem", letterSpacing: "-1px" }}>
                Tired of Wondering Where Your Money Went?
              </h2>
              <p className="text-secondary fs-5" style={{ lineHeight: "1.7" }}>
                See where your money goes, set spending limits, and make smarter decisions. Our tools track all credit and debit allocations automatically.
              </p>
            </div>
            <div className={`col-lg-6 text-center reveal-right ${isVisible ? 'active' : ''}`}>
              <img 
                src={welcome} 
                className="img-fluid rounded-4" 
                style={{ 
                  maxWidth: "80%", 
                  boxShadow: "var(--shadow-xl)",
                  border: "1px solid var(--border-color)" 
                }} 
                alt="Mockup feature preview" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Savings Vault Deposit */}
      <section className="interactive-animation-section py-5">
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-md-8">
              <h2 className="fw-bold mb-2" style={{ fontSize: "2rem" }}>Vault Deposit</h2>
              <p className="text-secondary small">Scroll down to slide savings into your secure vault</p>
            </div>
          </div>
          
          <div className="interactive-playground">
            <div className={`coin-container ${scrolled ? "coin-drop" : ""}`}>
              <img src={coin} className="coin" alt="Coin" />
            </div>
            <div className={`piggy-container ${scrolled ? "piggy-pop" : ""}`}>
              <img src={pb} className="piggy" alt="Piggy Bank" />
            </div>
            <div className={`vault-description text-center ${scrolled ? "active" : ""}`}>
              <h4 className="fw-bold text-success">Secure Your Balance</h4>
              <p className="text-muted italic small mb-0">Your funds have slipped safely into your digital savings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modernized Grid Features Highlights */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-md-8">
              <h2 className="fw-bold display-6 mb-3">Core Integrations</h2>
              <p className="text-secondary fs-6">Spend Smart streamlines manual expense entries into frictionless triggers</p>
            </div>
          </div>

          <div className="row g-4 text-center">
            {/* Feature 1 */}
            <div className="col-lg-3 col-md-6">
              <div className="homepage-feature-card">
                <img src={bills} alt="Receipt Scan Icon" />
                <h5>Optical Scanner</h5>
                <p>Upload a receipt. Our built-in OCR reads metadata and amounts automatically in one click.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-lg-3 col-md-6">
              <div className="homepage-feature-card">
                <img src={billsplit} alt="Split Bills Icon" />
                <h5>Bill Splitter</h5>
                <p>Divide tabs with your split partners. Calculates shares and owed amounts dynamically.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-lg-3 col-md-6">
              <div className="homepage-feature-card">
                <img src={ai} alt="AI Icon" />
                <h5>AI Classifier</h5>
                <p>Categorizes bills into standard folders (groceries, transport, food, rents) using AI model mapping.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="col-lg-3 col-md-6">
              <div className="homepage-feature-card">
                <img src={piechrt} alt="Analytics Icon" />
                <h5>Dynamic Reports</h5>
                <p>Gain visual analytics and track budget allocations through responsive charts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Device Feature Showcases (Zigzag on desktop, Slider on mobile) */}
      <section className="py-5" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)" }}>
        <div className="container">
          {isMobile ? (
            <FeatureCarousel />
          ) : (
            <FeatureZigZag />
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="contact-card">
                <h2 className="contact-title text-center fw-bold">Let's Connect</h2>
                <p className="contact-description text-center">
                  Have questions about integrations or need help setting up? Send us a message!
                </p>
                <form onSubmit={(e) => e.preventDefault()} className="auth-form">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="modern-input-group">
                        <label className="modern-input-label" htmlFor="contact-name">Full Name</label>
                        <input type="text" className="modern-input" id="contact-name" placeholder="John Doe" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="modern-input-group">
                        <label className="modern-input-label" htmlFor="contact-email">Email Address</label>
                        <input type="email" className="modern-input" id="contact-email" placeholder="john@example.com" required />
                      </div>
                    </div>
                  </div>
                  <div className="modern-input-group">
                    <label className="modern-input-label" htmlFor="contact-message">Message</label>
                    <textarea className="modern-input" id="contact-message" rows="4" placeholder="Your questions..." required></textarea>
                  </div>
                  <button type="submit" className="auth-submit-btn py-3 mt-3">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center">
        <div className="container">
          <p className="mb-0">&copy; {new Date().getFullYear()} Spend Smart by Love Maggo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
