
import 'bootstrap/dist/css/bootstrap.min.css';
import './features.css';
import screen1 from "../assets/dashboard.png";
import screen2 from "../assets/billsplit.png";
import screen3 from "../assets/feature3.png";
import React, { useEffect }  from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

const features = [
  {
    title: "Insightful Dashboard & Analytics",
    description: "Get a complete overview of your finances with interactive pie charts, bar charts, and a categorized transaction list that keeps your spending in check.",
    image: screen1,
  },
  {
    title: "Smart Bill Scanning (OCR + AI)",
    description: "Upload a bill or receipt and let the system auto-detect the amount using OCR and categorize it intelligently using AI. Zero manual effort!",
    image: "/assets/ocr_ai.png",
  },
  {
    title: "Split Bills with Friends",
    description: "Easily split expenses with friends, track who owes what, and avoid awkward money talks with smart share tracking.",
    image: screen2,
  },
];
export default function FeatureZigZag() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="container py-5">
      <h1 className="text-center fw-bold mb-5">Explore Our Key Features</h1>
      {features.map((feature, index) => (
        <div
          className="row align-items-center my-5"
          key={index}
          data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
        >
          <div className={`col-md-6 ${index % 2 !== 0 ? 'order-md-2' : ''}`}>
            <img
              src={feature.image}
              alt={feature.title}
              className="img-fluid rounded shadow-lg"
              style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
            />
          </div>
          <div className={`col-md-6 ${index % 2 !== 0 ? 'order-md-1' : ''}`}>
            <h2 className="fw-bold mb-3">
              {feature.title}
              {feature.title.includes("AI") && (
                <span className="badge bg-warning text-dark ms-2">AI Powered</span>
              )}
            </h2>
            <p className="text-muted">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}