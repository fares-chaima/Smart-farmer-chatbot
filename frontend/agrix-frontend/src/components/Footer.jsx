import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer-section"  id="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h3 className="footer-title">AgriX</h3>
          <p className="footer-description">
            Agrix drives a smart, innovative farming future. We connect farmers
            to opportunities. Our tools grow food and profits fast.
          </p>
          <div className="footer-social-icons">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <svg
                className="footer-social-icon"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="#0B3018"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.49v-1.71c-2.78.61-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.61.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.7.114 2.5.33 1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.59.67.49A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <svg
                className="footer-social-icon"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="#0B3018"
              >
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.06 1.81.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.36 1.06.42 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.17-.25 1.81-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.36-2.23.42-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.06-1.81-.25-2.23-.42-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.17-.42-.36-1.06-.42-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.06-1.17.25-1.81.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.36 2.23-.42 1.27-.06 1.65-.07 4.85-.07m0-2.16C8.76 0 8.35.01 7.07.07 5.77.13 4.81.34 3.99.65c-.84.33-1.55.77-2.26 1.48-.71.71-1.15 1.42-1.48 2.26-.31.82-.52 1.78-.58 3.08C-.01 8.75 0 9.16 0 12s.01 3.25.07 4.53c.06 1.3.27 2.26.58 3.08.33.84.77 1.55 1.48 2.26.71.71 1.42 1.15 2.26 1.48.82.31 1.78.52 3.08.58 1.28.06 1.69.07 4.53.07s3.25-.01 4.53-.07c1.3-.06 2.26-.27 3.08-.58.84-.33 1.55-.77 2.26-1.48.71-.71 1.15-1.42 1.48-2.26.31-.82.52-1.78.58-3.08.06-1.28.07-1.69.07-4.53s-.01-3.25-.07-4.53c-.06-1.3-.27-2.26-.58-3.08-.33-.84-.77-1.55-1.48-2.26-.71-.71-1.42-1.15-2.26-1.48-.82-.31-1.78-.52-3.08-.58C15.25.01 14.84 0 12 0z" />
                <path d="M12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                <circle cx="18.41" cy="5.59" r="1.44" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <svg
                className="footer-social-icon"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="#0B3018"
              >
                <path d="M18.24 4.15c.66.44 1.24.98 1.73 1.6-.64-.28-1.32-.47-2.04-.55-.58.62-1.27 1.12-2.07 1.46A3.64 3.64 0 0 0 8.9 10.6c0 .26.03.52.08.77A10.3 10.3 0 0 1 3.47 8.4a3.64 3.64 0 0 0 1.13 4.85 3.62 3.62 0 0 1-1.65-.46v.05a3.64 3.64 0 0 0 2.92 3.57 3.62 3.62 0 0 1-1.64.06 3.64 3.64 0 0 0 3.4 2.53A7.3 7.3 0 0 1 2 20.85a10.3 10.3 0 0 0 5.58 1.63c6.7 0 10.36-5.55 10.36-10.36 0-.16 0-.32-.01-.48.71-.52 1.33-1.16 1.82-1.9-.65.29-1.35.49-2.08.58z" />
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <svg
                className="footer-social-icon"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="#0B3018"
              >
                <path d="M23.5 6.2a3.1 3.1 0 0 0-2.18-2.18C19.36 3.5 12 3.5 12 3.5s-7.36 0-9.32.52A3.1 3.1 0 0 0 .5 6.2C0 8.16 0 12 0 12s0 3.84.52 5.8a3.1 3.1 0 0 0 2.18 2.18C4.64 20.5 12 20.5 12 20.5s7.36 0 9.32-.52a3.1 3.1 0 0 0 2.18-2.18C24 15.84 24 12 24 12s0-3.84-.52-5.8zM9.6 16.5V7.5l6.2 4.5-6.2 4.5z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-middle">
          <h3 className="footer-title footer-title-middle">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-right">
          <h3 className="footer-title footer-title-right">Reach Us</h3>
          <p className="footer-contact">
            Email: <a href="mailto:support@Agrix.com">support@Agrix.com</a>
            <br />
            Phone: +213 123 456 789
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Agrix. All rights reserved</p>
      </div>
    </footer>
  );
}

export default Footer;