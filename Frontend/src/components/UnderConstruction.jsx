import React from 'react';
import './UnderConstruction.css';
import Navbar from './Navbar';

const UnderConstruction = () => {
  return (
    <div>
        <Navbar></Navbar>

    <div className="under-construction">
      <div className="construction-box">
        <h1>🚧 Page Under Construction</h1>
        <p>We're working hard to bring this page to life. Stay tuned!</p>
        <div className="loader"></div>
      </div>
    </div>
    </div>
  );
};

export default UnderConstruction;
