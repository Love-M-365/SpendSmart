import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import loginImg from "../assets/lp.jpg";
import './loginpage.css';
import logo from '../assets/logo.png';
import { API_BASE } from '../api';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, form);
      setMessage('Login successful');
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user._id);
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card row g-0">
        {/* Left Image column */}
        <div className="col-md-6 d-none d-md-block auth-image-col">
          <img src={loginImg} alt="Login" className="auth-image" />
        </div>

        {/* Right Form column */}
        <div className="col-md-6 auth-form-container">
          <div className="text-center mb-4">
            <img src={logo} alt="logo" style={{ height: "4.5rem", width: "4.5rem", marginBottom: "1rem" }} />
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to manage your budget</p>
          </div>

          {message && (
            <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} rounded-3`} role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="modern-input-group">
              <label className="modern-input-label" htmlFor="email-input">Email Address</label>
              <input
                id="email-input"
                type="email"
                placeholder="name@example.com"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="modern-input-group">
              <label className="modern-input-label" htmlFor="password-input">Password</label>
              <input
                id="password-input"
                type="password"
                placeholder="••••••••"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="auth-redirect-text">
            Don't have an account?{' '}
            <Link to="/register" className="auth-redirect-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
