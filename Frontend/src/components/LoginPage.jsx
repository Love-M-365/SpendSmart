import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import login from "../assets/lp.jpg";
import './loginpage.css';
import logo from '../assets/logo.png';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const apiUrl = import.meta.env.VITE_API_URL;
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, form);
      setMessage('Login successful');
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user._id);
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row login-container shadow rounded ">
        {/* Left Image */}
        <div className="col-md-6 p-0 d-none d-md-block">
          <img src={login} alt="Login"  className="img-fluid login-image" />
        </div>

        {/* Right Form */}
        <div className="col-md-6 p-4 ">
          {message && <div className="alert alert-info">{message}</div>}
          <form onSubmit={handleSubmit} className="form">
            <p className="welcome-text">
              Welcome, <span>sign in to continue</span>
            </p>
           <img src={logo} alt="logo" style={{ height: "9rem", width: "9rem",display:"block",marginLeft:"auto",marginRight:"auto" }} />

           

            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              required
            />

            <button className="oauthButton continue-btn" type="submit">
              Continue
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 17 5-5-5-5"></path>
                <path d="m13 17 5-5-5-5"></path>
              </svg>
            </button>
          </form>

          <p className="text-center mt-3">
            Don't have an account?{' '}
            <Link to="/register" className="text-decoration-none">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
