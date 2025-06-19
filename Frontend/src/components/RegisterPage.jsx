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
    <div className="container d-flex align-items-center justify-content-center min-vh-100 ">
      <div className="card shadow p-4 bg-light" style={{ maxWidth: '1100px', width: '100%' }}>
        <div className="row g-0">
          <div className="col-md-5 d-none d-md-block">
            <img
              src={register}
              alt="Register visual"
              className="img-fluid h-100 rounded-start"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-7 ">
          
            {message && <div className="alert alert-info">{message}</div>}
             <form onSubmit={handleSubmit} className ="form">
    
    

    <div className="container">
      <h3>
        Create an account
    </h3>
      <div className="row mb-3">
         <div className="col-md-6"><input type="text" placeholder="Full Name" name="name"  onChange={handleChange} required/></div>
         <div className="col-md-6"> <input type="number" placeholder="Age" name="age"  onChange={handleChange} required/></div>
   
      </div>
      <div className="row mb-3">
         <div className="col-md-6"><input type="number" placeholder="Phone Number" name="phone"  onChange={handleChange} required/></div>
         <div className="col-md-6"> <input type="text" placeholder=" UPI ID" name="upiId"  onChange={handleChange} required/></div>
   
      </div>
      <div className="row mb-3">
         <div className="col-md-6">
          <select  name='gender' onChange={handleChange} required>
            <option selected>Gender</option>
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="prefernottosay">Prefer not to say</option>
          </select>
         </div>
         <div className="col-md-6"> <input type="text" placeholder="Profession" name="profession" onChange={handleChange} required/></div>
   
      </div>
    
    <input type="email" placeholder="Email" name="email"  onChange={handleChange} required/>
     <input type="password" placeholder="Password" name="password"  onChange={handleChange} required/>
     <input type="password" placeholder="Confirm Password" onChange={handleChange} name="confirmPassword"/>
     </div>
    <button className="oauthButton">
                    Continue
                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5"></path><path d="m13 17 5-5-5-5"></path></svg>
                </button>
                
</form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
