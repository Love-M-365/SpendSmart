import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import login from "../assets/logopage.jpg"

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
      navigate('/dashboard');
      console.log(res);
      const { token, user } = res.data;
localStorage.setItem('token', token);
localStorage.setItem('userId', user._id);

    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };
  
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row shadow rounded overflow-hidden w-100" style={{ maxWidth: '900px' }}>
        {/* Left side with image */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src={login} // You can change this image
            alt="Login"
            className="img-fluid h-100 w-100 object-fit-cover"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Right side with form */}
        <div className="col-md-6 bg-white p-5">
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
      </div>
    </div>
  );
}
