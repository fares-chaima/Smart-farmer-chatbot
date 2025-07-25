import React, { useState } from 'react';
import '../styles/Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false); // Fermer le menu mobile après le clic
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo" onClick={() => scrollToSection('home')}>AgriX</div>
      </div>
      <div className="navbar-center">
        <div className="nav-links">
          <a onClick={() => scrollToSection('who-we-are')}>About Us</a>
          <a onClick={() => scrollToSection('services')}>Services</a>
          <a onClick={() => scrollToSection('articles')}>Articles</a>
        </div>
      </div>
      <div className="navbar-right">
        <button className="contact-buttonn" onClick={() => scrollToSection('contact')}>
          Contact Us <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B3018" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}

export default Navbar;