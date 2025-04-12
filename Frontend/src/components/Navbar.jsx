import React from 'react'
import { Link } from 'react-router-dom';
export default function Navbar() {
  return (
    <div>
       <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm px-4" style={{margin:"0rem"}}>
              <Link className="navbar-brand" to="/">Spend Smart</Link>
              <div className="collapse navbar-collapse">


                <ul className="navbar-nav ms-auto">
                <button class="notify-button">
  <svg class="icon" viewBox="0 0 24 24">
    <path d="M12 24c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6.36-6v-5c0-3.07-1.63-5.64-4.5-6.32V6a1.5 1.5 0 10-3 0v.68c-2.87.68-4.5 3.25-4.5 6.32v5l-1.99 2v1h16v-1l-2.01-2z"/>
  </svg>
  <span class="notify-dot"></span>
</button>

                  <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                  {/* <li className="nav-item"><Link className="nav-link" to="/transactions">Transaction History</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/balance">Balance</Link></li> */}
                  <li className="nav-item"><Link className="nav-link" to="/friends">Friends</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/support">Support</Link></li>
                </ul>
              </div>
            </nav>
    </div>
  )
}
