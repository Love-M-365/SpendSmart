import React from 'react'
import { Link } from 'react-router-dom';
export default function Navbar() {
  return (
    <div>
       <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm px-4" style={{margin:"0rem"}}>
              <Link className="navbar-brand" to="/">Spend Smart</Link>
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/transactions">Transaction History</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/balance">Balance</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/friends">Friends</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/support">Support</Link></li>
                </ul>
              </div>
            </nav>
    </div>
  )
}
