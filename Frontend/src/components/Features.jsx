import React from "react";
import { Carousel } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './features.css';
import screen1 from "../assets/dashboard.png";
import screen2 from "../assets/feature2.png";
import screen3 from "../assets/feature3.png";

const ScreenshotCarousel = () => {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">📸 Feature Highlights</h2>
      <Carousel fade interval={3000}>
        <Carousel.Item>
          <img className="d-block w-100 rounded" src={screen1} alt="First slide" />
          <Carousel.Caption>
            <h5>Smart Dashboard</h5>
            <p>Track all your finances in one view.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100 rounded" src={screen2} alt="Second slide" />
          <Carousel.Caption>
            <h5>Split Expenses</h5>
            <p>Add friends & split costs fairly.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100 rounded" src={screen3} alt="Third slide" />
          <Carousel.Caption>
            <h5>Auto Bill Scanner</h5>
            <p>Upload bills & track expenses smartly.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default ScreenshotCarousel;
