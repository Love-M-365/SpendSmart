import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Welcome.css";
import feature1 from "../assets/dashboard.png"
import feature2 from "../assets/feature2.png"
import feature3 from "../assets/feature3.png"
import feature4 from "../assets/feature4.png"
import pb from "../assets/pbwprb.png"
import coin from "../assets/coin.png"
import logo from "../assets/logo.png";
import welcome from '../assets/welcomepage3.png'
import bills from '../assets/bills.jpg'
import ai from '../assets/aic.jpeg'
import piechrt from '../assets/piechart.jpeg'
import billsplit from '../assets/billsplit.jpeg'
import { Link } from "react-router-dom";
import HoverExpandCard from "./Features";
import HoverExpandCardHorizontal from "./Features";

export default function WelcomePage() {
  const [isVisible, setIsVisible] = useState(false);
  
  const [scrolled, setScrolled] = useState(false);
   const images = [
    feature1,
    feature2,
    feature3,
    feature4,
  ];
  useEffect(() => {
    const handleScroll = () => {
      
     
      if (window.scrollY > 50) {
        setScrolled(true);
        setIsVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
   
      <div className="container-fluid p-0">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
  <a className="navbar-brand" href="#"><img src={logo} style={{maxHeight:"3rem",maxWidth:"3rem"}}></img></a>
  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <a className="nav-link active" href="#home">Home</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#features">Features</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#contact">Contact Us</a>
      </li>
    </ul>
    <div className="d-flex">
      <button className="btn btn-outline-light me-2 login-btn">
        <Link to="/login" style={{textDecoration:"none",color:"whitesmoke"}}>Login</Link></button>
      <button className="btn btn-primary register-btn">Register</button>
    </div>
  </div>
</nav>

    
        {/* Welcome Section */}
        
        <div id="trigger" className="reveal-section">
        <div className={`left-side ${isVisible ? 'slide-in-left' : ''}`}>
          
          <h1 style={{fontFamily:"Quicksand",fontSize:"3.8rem"}}>Tired of Wondering Where Your Money Went?</h1>
          <p>See where your money goes, set spending limits, and make smarter decisions </p>
        </div>
        <div className={`right-side ${isVisible ? 'slide-in-right' : ''}`}>
          <img src={welcome} style={{width:"40rem",height:"40rem"}} alt="Slide in" />
        </div>
      </div>
        <div className="text-center welcome-section" id="home">
       
       
       
          <div className={`coin-container ${scrolled ? "coin-drop" : ""}`}>
            <img src={coin} className="coin" alt="Coin" />
          </div>
          <div className={`piggy-container ${scrolled ? "piggy-pop" : ""}`}>
            <img src={pb} className="piggy" alt="Piggy Bank" />
          </div>
          
   
            
          
          <div className="description">
          
            <h1 className="fw-bold" style={{fontFamily:"Orbitron"}}>Welcome to <h1 style={{color:"green",fontSize:"4rem"}}>Spend Smart</h1></h1>
            <p className="lead">
              Manage your personal finances effectively with easy-to-use tracking and
              budgeting tools.
            </p>

          
          </div>
        
      </div>
    
        {/* Features Section */}
        <div className="container  my-5" id="features">
          <div className="row g-4  text-center">
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card p-3 shadow  feature-card">
                <img
                  src={bills}
                  className="mb-3"
                  alt="Feature Icon"
                  
                />
                <h5>Just scan, and we’ll handle the rest.</h5>
                <p>No more manual entries! With Spend Smart’s Bill Scan & Track feature, simply upload or snap a photo of your bills and receipts — our smart scanner will automatically extract the important details like amount, category, and date, and instantly add it to your expense list.</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card p-3 shadow  feature-card">
                <img
                  src={billsplit}
                  className="mb-3"
                  alt="Feature Icon"
                  
                />
                <h5>Effortless Bill Splitting</h5>
                <p>Streamline the process of dividing expenses among friends. Simply input your bills, and the system automatically calculates and distributes the amounts to each individual, eliminating manual calculations and ensuring accuracy.</p>
              </div>
            </div>
           
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card p-3 shadow  feature-card">
                <img
                  src={ai}
                  className="mb-3"
                  alt="Feature Icon"
                  
                />
                <h5>AI-Powered Categorization</h5>
                <p>Automatically organize scanned bill items into clear categories. This intelligent segregation provides detailed insights into spending patterns, empowering users with a comprehensive overview of their financial allocations.</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card p-3 shadow  feature-card">
                <img
                  src={piechrt}
                  className="mb-3"
                  alt="Feature Icon"
                  
                />
                <h5>Interactive Pie Chart Visualization</h5>
                <p>Gain a clear, visual representation of monthly expenses through an intuitive pie chart. This feature helps users track spending across categories, identify areas for optimization, and make informed financial decisions</p>
              </div>
            </div>
            {/* Add more feature cards here */}
           
          </div>
        </div>
    <div className="container mt-4">
      <div className="row gy-4">
        <div className="col-md-12">
          
          <HoverExpandCardHorizontal
            title="Smart Spending"
            image="https://via.placeholder.com/120"
            shortText="Manage money better."
            extraText="AI suggestions, trends, and daily tracking in one place."
          />
        </div>
        
      </div>
    </div>
        {/* Contact Section */}
        <div className="bg-light py-5" id="contact">
       
    <div className="container py-5">
      <div className="row shadow p-4 bg-light rounded">
        {/* Contact Form Section */}
        <div className="col-md-6">
          <h2 className="mb-3">Contact Us</h2>
          <p className="text-muted">
            If you have any questions or inquiries, please fill out the form or reach out via the contact information.
          </p>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" placeholder="Your Name" />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" placeholder="you@example.com" />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea className="form-control" id="message" rows="4" placeholder="Your Message"></textarea>
            </div>
            <button type="submit" className="btn btn-dark w-100">Send Message</button>
          </form>
        </div>

        {/* Contact Info Section */}
        <div className="col-md-6 mt-4 mt-md-0">
          <h4 className="mb-3">Contact Information</h4>
          <ul className="list-unstyled">
            <li className="mb-3">
              <i className="bi bi-telephone-fill me-2"></i> +1 234 567 890
            </li>
            <li className="mb-3">
              <i className="bi bi-envelope-fill me-2"></i> info@example.com
            </li>
            <li>
              <i className="bi bi-geo-alt-fill me-2"></i> 123 Example St, San Francisco, CA 94101
            </li>
          </ul>
        </div>
      </div>
    </div>
        </div>
    
        {/* Footer */}
        <footer className="bg-dark text-white text-center py-3">
          <p className="mb-0">&copy; {new Date().getFullYear()} Spend Smart. All rights reserved.</p>
        </footer>
      </div>
    
    
  );
}
