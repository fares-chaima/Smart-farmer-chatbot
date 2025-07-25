import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Ajout de Link pour le lien de connexion
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/Register.css';
import farmerImage from '../assets/22.jpg';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation côté client
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    // Séparer fullName en firstName et lastName
    const [firstName, ...lastNameArr] = formData.fullName.trim().split(' ');
    const lastName = lastNameArr.join(' ') || ''; // Gérer le cas où il n'y a qu'un prénom

    try {
      // Envoyer la requête POST à l'endpoint signup
    const response = await axios.post('http://localhost:5000/api/auth/signup', {
  firstName,
  lastName,
  email: formData.email,
  password: formData.password,
  phoneNumber: formData.phone,
  location: formData.location,
});
     

      // Si le backend renvoie un token (optionnel, selon votre implémentation)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      // Rediriger vers le tableau de bord
      navigate('/dashboard');
    } catch (err) {
      console.error('Erreur:', err.response);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <div className="signup-page">
      <Navbar />
      <div className="signup-container">
        <div className="signup-content">
          <h1 className="signup-title">Sign Up</h1>
          <p className="signup-subtitle">Enter your details below to create your account and get started.</p>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleRegister} className="signup-form">
            {/* Ligne 1 : Full Name et Email */}
            <div className="signup-form-row">
              <div className="signup-form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="signup-form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Ligne 2 : Password et Confirm Password */}
            <div className="signup-form-row">
              <div className="signup-form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="signup-form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Ligne 3 : Phone Number et Location */}
            <div className="signup-form-row">
              <div className="signup-form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="signup-form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="signup-form-buttons">
              <button type="button" className="signup-cancel-button" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </button>
              <button type="submit" className="signup-confirm-button" disabled={isLoading}>
                {isLoading ? 'Inscription...' : 'Confirm'}
              </button>
            </div>
            <p className="signup-login-link">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
        <div className="signup-image">
          <div className="signup-circle-overlay"></div>
          <img src={farmerImage} alt="Farmer with vegetables" />
        </div>
      </div>
    </div>
  );
}

export default Register;