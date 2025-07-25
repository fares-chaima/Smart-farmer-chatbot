import React from 'react';
import '../styles/Contact.css';

function Contact() {
  return (
    <section className="contact-us-section" id="contact">
      <div className="contact-us-header">
      <span className="contact-us-label">Contact</span>
        <h2>Contact Us : We’re Here to Help</h2>
        <p>Got questions? Reach us anytime. We support you fast.</p>
      </div>
      <form className="contact-us-form">
        <div className="contact-us-form-row">
          <div className="contact-us-form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="" />
          </div>
          <button type="submit" className="contact-us-send-button">Send</button>
        </div>
        <div className="contact-us-form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" placeholder=""></textarea>
        </div>
      </form>
    </section>
  );
}

export default Contact;