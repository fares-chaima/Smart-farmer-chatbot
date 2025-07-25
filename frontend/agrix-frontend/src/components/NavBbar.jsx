import React, { useState, useEffect } from 'react';
import { FaUser, FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/NavBbar.css';

const NavBbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    navigate('/profile');
    setIsProfileDropdownOpen(false);
  };

  const handleSettingsClick = (e) => {
    e.preventDefault();
    navigate('/settings');
    setIsProfileDropdownOpen(false);
  };

  const handleSignOutClick = (e) => {
    e.preventDefault();
    console.log('User signed out');
    setIsProfileDropdownOpen(false);
    // Optionally, navigate to a login page or home: navigate('/login');
  };

  // Navigation handlers for navbar links
  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleChatClick = () => {
    navigate('/chat');
  };

  const handleLandRentalClick = () => {
    navigate('/my-lands');
  };

  const handleMarketplaceClick = () => {
    navigate('/marketplace');
  };

  const handleMaterialsClick = () => {
    navigate('/material');
  };

  const handleServicesClick = () => {
    navigate('/create');
  };

  // New handler for Delivery
  const handleDeliveryClick = () => {
    navigate('/livraison');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.user-info')) {
        setIsProfileDropdownOpen(false);
      }
      if (isDropdownOpen && !event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileDropdownOpen, isDropdownOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>AgriX</span>
      </div>
      <ul className="navbar-links">
        <li className="navbar-item" onClick={handleDashboardClick}>
          Dashboard
        </li>
        <li className="navbar-item" onClick={handleChatClick}>
          Plant Health
        </li>
        <li className="navbar-item" onClick={handleLandRentalClick}>
          Land Rental
        </li>
        <li className="navbar-item" onClick={handleDeliveryClick}>
          Delivery
        </li>
        <li
          className="navbar-item dropdown"
          onMouseEnter={toggleDropdown}
          onMouseLeave={toggleDropdown}
        >
          Marketplace
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li className="dropdown-item" onClick={handleMarketplaceClick}>
                Products
              </li>
              <li className="dropdown-item" onClick={handleMaterialsClick}>
                Materials
              </li>
              <li className="dropdown-item" onClick={handleServicesClick}>
                Services
              </li>
            </ul>
          )}
        </li>
      </ul>
      <div className="navbar-user">
        <div className="notification-icon">
          <FaBell />
          <span className="notification-badge">1</span>
        </div>
        <div
          className="user-info"
          onClick={toggleProfileDropdown}
          style={{ cursor: 'pointer' }}
        >
          <div className="profile-icon">
            <img
              src="https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL3BsYXlcLzBiN2Y0ZTliLWY1OWMtNDAyNC05ZjA2LWIzZGMxMjg1MGFiNy0xOTIwLTEwODAuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo4Mjh9fX0="
              alt="Profile"
            />
          </div>
          <span className="user-name">Ali Ahmed</span>
          {isProfileDropdownOpen && (
            <ul className="profile-dropdown-menu show">
              <li className="dropdown-item" onClick={handleProfileClick}>
                <FaUser /> Profile
              </li>
              <li className="dropdown-item" onClick={handleSettingsClick}>
                <FaCog /> Settings
              </li>
              <li className="dropdown-item" onClick={handleSignOutClick}>
                <FaSignOutAlt /> Sign Out
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBbar;