import React from 'react'
import './codebg.css'
import coin from '../assets/coinimg.png'
export default function CoinBackground(){
  const coins = new Array(125).fill(0); // Number of coins you want

  return (
    <>
      {coins.map((_, index) => {
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const size = Math.random() * 40 + 100; // 30px to 70px

        return (
          <img
            key={index}
            src= {coin}
            alt="coin"

            className="bg-coin"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              opacity: 0.9,
            }}
          />
        );
      })}
    </>
  );
};
 
