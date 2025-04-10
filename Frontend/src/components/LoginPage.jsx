import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
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
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      setMessage('Login successful');
      // Redirect to dashboard or homepage
      navigate('/dashboard'); // Update path as needed
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Login</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            name="email"
            className="form-control"
            placeholder="Email"
            type="email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="password"
            className="form-control"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-primary w-100">Login</button>
      </form>
      <p className="text-center mt-3">
        Don't have an account?{' '}
        <Link to="/register" className="text-decoration-none">
          Register here
        </Link>
      </p>
    </div>
  );
}
