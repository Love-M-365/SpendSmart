import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setMessage('Login successful!');
      // Redirect to dashboard if needed
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div className="container mt-5" style={}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" className="form-control my-2" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" className="form-control my-2" placeholder="Password" onChange={handleChange} />
        <button className="btn btn-primary">Login</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
