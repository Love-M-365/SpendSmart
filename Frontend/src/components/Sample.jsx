import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './sample.css';
import { motion } from "framer-motion";

import goalImg from '../assets/goal.jpg';
import expenseImg from '../assets/track.jpg';
import analyzeImg from '../assets/analyse.jpg';
import budgetImg from '../assets/bugett.jpg';
import splitImg from '../assets/friends.jpg';

const steps = [
  { title: "Set Your Goals", image: goalImg, description: "Monthly or long-term targets." },
  { title: "Track Expenses", image: expenseImg, description: "Log income & expenses." },
  { title: "Analyze Spending", image: analyzeImg, description: "Visual spending insights." },
  { title: "Stay On Budget", image: budgetImg, description: "Avoid overspending easily." },
  { title: "Split Bills with Friends", image: splitImg, description: "Easily divide shared expenses." }
];

const WelcomeSteps = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center g-4">
        {steps.map((step, index) => (
          <motion.div
            className="col-12 col-sm-6 col-md-4 col-lg-2"
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div
              className="step-card-image big"
              style={{
                backgroundImage: `url(${step.image})`,
              }}
            >
              <div className="overlay-text-bottom">
                <h6 className="fw-bold text-white mb-1">{step.title}</h6>
                <p className="text-light small m-0">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeSteps;
