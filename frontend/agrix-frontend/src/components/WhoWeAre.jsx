import React from 'react';
import '../styles/WhoWeAre.css';
import ph5 from '../assets/3260443.png'
import ph6 from '../assets/3890937_black friday_cheap_discount_price_reduced_icon.png'
import ph7 from '../assets/2998144_eco_growth_plant_science_sprout_icon.png'

function WhoWeAre() {
  return (
    <section className="whoweare" id="who-we-are">
      <div className="whoweare-content">
        <span className="section-label">About Us</span>
        <div className="content">
        <h2>Who We Are!</h2>
        <p>
        At Agrix, we are pioneers in agricultural innovation, dedicated to empowering
         farmers with cutting-edge technology. Our mission is to optimize crop production,
          ensure fair market prices, and promote sustainable practices. By integrating smart
           tools and real-time data, we foster a thriving community of growers, paving the way for
            a greener, more prosperous future together.
        </p>
        
         </div>
      </div>
      <div className="whoweare-cards">
        <div className="card">
        <img src={ph7} alt="" />
          <h3>Grow Smarter: Boost Yields with Smart Insights</h3>
          <p>AI picks crops for your land, it predicts top prices, Pests get spotted fast</p>
        </div>
        <div className="card">
        <img src={ph6} alt="" />
          <h3>Sell Easier: Streamline Your Sales with Ease</h3>
          <p>List your crops fast. Buyers bid in real-time. Deliveries happen quick</p>
        </div>
        <div className="card">
        <img src={ph5} alt="" />
          <h3>Earn More: Maximize Profits with Confidence</h3>
          <p>Deals stay fair. Payments come secure. You earn big.</p>
        </div>
      </div>
    </section>
  );
}

export default WhoWeAre;