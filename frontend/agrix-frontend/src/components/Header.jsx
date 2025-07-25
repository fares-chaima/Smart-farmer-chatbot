import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import ph1 from '../assets/04.jpg';
import ph2 from '../assets/01.png';
import ph3 from '../assets/03.png';

function Header() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
     <header id="home">
    <section className="header">
      <div className="header-contentt">
        <h1>Smart agricultural solutions for a sustainable future.</h1>
        <p>
          Agrix leverages technology to help farmers optimize crops,
          predict prices, and detect diseases. With smart tools, we
          enhance resource management. Our platform provides real-time
          insights to improve yields and reduce waste. By empowering farmers
          with data-driven solutions, we aim to transform agriculture. Together,
          let's cultivate a sustainable and prosperous future.
        </p>
        <button className="header-buttonn" onClick={handleGetStarted}>
          Get Started Now{' '}
          <svg
            className="arrow-icon"
            width="40"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0B3018"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="header-images">
        <img src={ph1} alt="Main agricultural field" className="main-image" />
        <div className="small-images">
          <img src={ph2} alt="Field view" className="small-image" />
          <img src={ph3} alt="Farmer working" className="small-image" />
        </div>
      </div>
    </section>
    </header>
  );
}

export default Header;