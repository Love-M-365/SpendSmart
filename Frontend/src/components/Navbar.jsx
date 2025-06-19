import React from 'react'
import { Link,useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import NotificationBell from './NotificationBell';
export default function Navbar() {
  const navigate=useNavigate();
  return (
    <div>
       <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm px-4" style={{margin:"0rem"}}>
              <Link className="navbar-brand" to="/"><img src={logo} style={{height:"2rem",width:"2rem"}}></img></Link>
              <div className="collapse navbar-collapse">


                <ul className="navbar-nav ms-auto">
                  
                  <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                  {/* <li className="nav-item"><Link className="nav-link" to="/transactions">Transaction History</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/balance">Balance</Link></li> */}
                   
                  <li className="nav-item"><Link className="nav-link" to="/friends">Friends</Link></li>

                  <li className="nav-item"><Link className="nav-link" to="/analytics">Analytics</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/support">Support</Link></li>
                 
                  <li>
                  <button
  className="btn btn-outline-danger ms-auto"
  onClick={() => {
    localStorage.clear();
    navigate('/login');
  }}>
  Logout
</button>
</li>
                </ul>
              </div>
            </nav>
    </div>
  )
}
