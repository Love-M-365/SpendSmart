import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import registerImg from '../assets/register.jpeg';
import logo from '../assets/logo.png';
import './loginpage.css';
import { API_BASE } from '../api';

export default function Register() {
  const [form, setForm] = useState({
    name: '', age: '', phone: '', upiId: '', email: '',
    password: '', confirmPassword: '', gender: '', profession: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setMessage("Passwords do not match");
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, form);
      setMessage(res.data.message || 'Registration successful');
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user._id);
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card row g-0" style={{ maxWidth: '1100px' }}>
        {/* Left Image column */}
        <div className="col-md-5 d-none d-md-block auth-image-col">
          <img
            src={registerImg}
            alt="Register visual"
            className="auth-image"
          />
        </div>

        {/* Right Form column */}
        <div className="col-md-7 auth-form-container">
          <div className="text-center mb-4">
            <img src={logo} alt="logo" style={{ height: "4rem", width: "4rem", marginBottom: "0.5rem" }} />
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join Spend Smart and start budgeting</p>
          </div>

          {message && (
            <div className={`alert ${message.includes('successful') || message.includes('created') ? 'alert-success' : 'alert-danger'} rounded-3`} role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="row">
              <div className="col-md-6">
                <div className="modern-input-group">
                  <label className="modern-input-label" htmlFor="name-input">Full Name</label>
                  <input id="name-input" type="text" placeholder="John Doe" name="name" onChange={handleChange} required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="modern-input-group">
                  <label className="modern-input-label" htmlFor="age-input">Age</label>
                  <input id="age-input" type="number" placeholder="21" name="age" onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="modern-input-group">
                  <label className="modern-input-label" htmlFor="phone-input">Phone Number</label>
                  <input id="phone-input" type="number" placeholder="9876543210" name="phone" onChange={handleChange} required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="modern-input-group">
                  <label className="modern-input-label" htmlFor="upi-input">UPI ID</label>
                  <input id="upi-input" type="text" placeholder="username@upi" name="upiId" onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="modern-input-group">
                  <label className="modern-input-label" htmlFor="gender-select">Gender</label>
                  <select id="gender-select" name="gender" onChange={handleChange} required defaultValue="">
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefernottosay">Prefer not to say</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="modern-input-group">
                  <label className="modern-input-label" htmlFor="profession-input">Profession</label>
                  <input id="profession-input" type="text" placeholder="Software Engineer" name="profession" onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="modern-input-group">
              <label className="modern-input-label" htmlFor="reg-email-input">Email Address</label>
              <input id="reg-email-input" type="email" placeholder="john@example.com" name="email" onChange={handleChange} required />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="modern-input-group">
                  <label className="modern-input-label" htmlFor="reg-pass-input">Password</label>
                  <input id="reg-pass-input" type="password" placeholder="••••••••" name="password" onChange={handleChange} required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="modern-input-group">
                  <label className="modern-input-label" htmlFor="reg-confirm-input">Confirm Password</label>
                  <input id="reg-confirm-input" type="password" placeholder="••••••••" name="confirmPassword" onChange={handleChange} required />
                </div>
              </div>
            </div>

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="auth-redirect-text">
            Already have an account?{" "}
            <Link to="/login" className="auth-redirect-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
