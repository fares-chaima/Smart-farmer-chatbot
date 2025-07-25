import React from 'react';
import '../styles/OurServices.css';
import cropRecommendation from '../assets/crop-recommendation.png';
import pestDetection from '../assets/pest-detection.png';
import pricePrediction from '../assets/price-prediction.png';

function OurServices() {
  return (
    <section className="our-services-section"  id="services">
      <div className="our-services-header">
        <span className="our-services-label">Services</span>
        <h2>Our Services : Tools for Your Success</h2>
        <p>
          Agrix transforms your farming experience—simplifying tasks, enhancing
          efficiency, and delivering outstanding results.
        </p>
      </div>
      <div className="our-services-cards">
        <div className="our-services-card">
          <img src={cropRecommendation} alt="Smart Crop Recommendation" className="our-services-card-image" />
          <h3>Smart Crop Recommendation</h3>
          <p>
            Agrix recommends the best crops, the right fertilizers and the ideal calendar to maximize your yields.
          </p>
        </div>
        <div className="our-services-card">
          <img src={pestDetection} alt="Pest & Disease Detection" className="our-services-card-image" />
          <h3>Pest & Disease Detection</h3>
          <p>
            Using AI and image analysis, quickly identify diseases and pests to protect your crops.
          </p>
        </div>
        <div className="our-services-card">
          <img src={pricePrediction} alt="Price Prediction" className="our-services-card-image" />
          <h3>Price Prediction</h3>
          <p>
            Agrix analyzes market trends and historical data to help you sell your crops at the best time.
          </p>
        </div>
      </div>
    </section>
  );
}

export default OurServices;