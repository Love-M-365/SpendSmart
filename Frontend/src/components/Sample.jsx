import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './sample.css';
import { motion } from "framer-motion";

const steps = [
  { title: "Set Your Goals", icon: "🎯", description: "Define monthly or long-term financial targets." },
  { title: "Track Expenses", icon: "📋", description: "Log your daily income & expenses easily." },
  { title: "Analyze Spending", icon: "📊", description: "Visualize habits with insightful analytics." },
  { title: "Get Smart Tips", icon: "💡", description: "AI-driven suggestions to boost your savings." },
  { title: "Stay On Budget", icon: "💰", description: "Monitor budgets and avoid overspending." }
];

const WelcomeSteps = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center g-4">
        {steps.map((step, index) => (
          <motion.div
            className="col-12 col-sm-6 col-md-4 col-lg-2 text-center step-card"
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="icon-circle mb-3">{step.icon}</div>
            <h5 className="fw-bold ">{step.title}</h5>
            <p className="text-muted small">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeSteps;
