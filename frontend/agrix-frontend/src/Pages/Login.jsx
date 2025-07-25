import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Login.css';
import farmerImage from '../assets/22.jpg';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Stocker le token dans le localStorage
      localStorage.setItem('token', response.data.token);
      
      // Stocker les infos utilisateur si nécessaire
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Rediriger vers le dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la connexion');
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <div className="login-content">
          <h1 className="login-title">Welcome back !</h1>
          <p className="login-subtitle">Log in to unlock all data & insights.</p>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-options">
              <label>
                <input type="checkbox" name="remember" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">Forgot your password?</Link>
            </div>
            <button type="submit" className="login-button">Login</button>
            <p className="register-link">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </form>
        </div>
        <div className="login-image">
          <div className="circle-overlay"></div>
          <img src={farmerImage} alt="Farmer with vegetables" />
        </div>
      </div>
    </div>
  );
}

export default Login;