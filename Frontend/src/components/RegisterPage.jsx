import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import register from '../assets/register.jpeg'
export default function Register() {
  const [form, setForm] = useState({
    name: '', age: '', phone: '', upiId: '', email: '',
    password: '', confirmPassword: '', gender: '', profession: ''
  });

  const [message, setMessage] = useState('');
  const navigate=useNavigate();
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setMessage("Passwords do not match");
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      setMessage(res.data.message);
      navigate('/dashboard')
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user._id);
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: '1100px', width: '100%' }}>
        <div className="row g-0">
          <div className="col-md-5 d-none d-md-block">
            <img
              src={register}
              alt="Register visual"
              className="img-fluid h-100 rounded-start"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-7 p-4">
            <h3 className="text-center mb-4">Create an Account</h3>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input name="name" className="form-control" placeholder="Full Name" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <input name="age" className="form-control" placeholder="Age" type="number" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <input name="phone" className="form-control" placeholder="Phone Number" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <input name="upiId" className="form-control" placeholder="UPI ID" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <input name="email" className="form-control" placeholder="Email ID" type="email" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <input name="profession" className="form-control" placeholder="Profession" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <input name="password" className="form-control" placeholder="Password" type="password" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <input name="confirmPassword" className="form-control" placeholder="Confirm Password" type="password" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <select name="gender" className="form-control" onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-success w-100 mt-3">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
