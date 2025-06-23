import 'bootstrap/dist/css/bootstrap.min.css';
import './featuresMobile.css';
import screen1 from "../assets/dashboard.png";
import screen2 from "../assets/billsplit.png";
import screen3 from "../assets/AIFeature.png";
import React, { useEffect } from "react";
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
    image: screen3,
  },
  {
    title: "Split Bills with Friends",
    description: "Easily split expenses with friends, track who owes what, and avoid awkward money talks with smart share tracking.",
    image: screen2,
  },
];

export default function FeatureCarousel() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="container py-5">
      <h1 className="text-center fw-bold mb-5">Explore Our Key Features</h1>

      <div
  id="featureCarousel"
  className="carousel slide"
  data-bs-ride="carousel"
  data-bs-interval="3000"
>

        <div className="carousel-inner">
          {features.map((feature, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-center text-center text-md-start px-3 px-md-5">
                <img
                  src={feature.image}
                  className="img-fluid rounded shadow mb-4 mb-md-0"
                  alt={feature.title}
                  style={{ maxHeight: "350px", width: "100%", maxWidth: "500px", objectFit: "cover" }}
                  data-aos="fade-up"
                />
                <div className="ms-md-5 mt-3 mt-md-0" data-aos="fade-up">
                  <h2 className="fw-bold">
                    {feature.title}
                    {feature.title.includes("AI") && (
                      <span className="badge bg-warning text-dark ms-2">AI Powered</span>
                    )}
                  </h2>
                  <p className="text-muted mt-3">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#featureCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#featureCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  );
}
