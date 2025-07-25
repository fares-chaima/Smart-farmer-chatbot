import React, { useState, useRef } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaCamera, FaArrowLeft, FaSeedling, FaTractor, FaChartLine, FaStore } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    firstName: 'Ali',
    lastName: 'Ahmed',
    email: 'ali.ahmed@example.com',
    phone: '+212 612 345 678',
    address: '123 Farm Street, Agricultural Zone, Casablanca',
    birthDate: '1990-03-15',
    farmName: 'Green Fields Organic Farm',
    farmSize: '5',
    farmSizeUnit: 'hectares',
    farmType: 'Organic Vegetables',
    yearsFarming: '10',
    certification: 'Organic Certified (2020)',
    irrigationType: 'Drip irrigation',
    specialties: ['Tomatoes', 'Potatoes', 'Carrots'],
    joinedDate: '2015-06-10'
  });

  const [profileImage, setProfileImage] = useState(
    'https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL3BsYXlcLzBiN2Y0ZTliLWY1OWMtNDAyNC05ZjA2LWIzZGMxMjg1MGFiNy0xOTIwLTEwODAuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo4Mjh9fX0='
  );

  const [newSpecialty, setNewSpecialty] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditMode(false);
    // Add API call to save data here
    console.log('Updated data:', userData);
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !userData.specialties.includes(newSpecialty)) {
      setUserData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (index) => {
    setUserData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const goBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="profile-page-container">
      <div className="profile-main-container">
        <div className="profile-header-section">
          <button className="profile-back-btn" onClick={goBack}>
            <FaArrowLeft /> Back
          </button>
          <h1>Agricultural Profile</h1>
          <button 
            className={`profile-edit-btn ${editMode ? 'cancel-mode' : ''}`}
            onClick={() => setEditMode(!editMode)}
          >
            <FaEdit /> {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-content-grid">
          <div className="profile-personal-section">
            <div className="profile-picture-wrapper">
              <div className="profile-avatar-container">
                <img src={profileImage} alt="Profile" className="profile-avatar-img" />
                {editMode && (
                  <div className="profile-photo-overlay" onClick={triggerFileInput}>
                    <FaCamera className="profile-camera-icon" />
                    <span>Change Photo</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              {!editMode && (
                <div className="profile-status-container">
                  <span className="profile-status-badge verified-badge">Verified</span>
                  <span className="profile-status-badge member-badge">Member since {new Date(userData.joinedDate).getFullYear()}</span>
                </div>
              )}
            </div>

            {editMode ? (
              <form className="profile-form-container" onSubmit={handleSubmit}>
                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="profile-form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="profile-form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>Birth Date</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={userData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="profile-form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="profile-form-actions">
                  <button type="submit" className="profile-save-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details-container">
                <h2>{userData.firstName} {userData.lastName}</h2>
                <p className="profile-user-title">Professional Farmer</p>
                
                <div className="profile-detail-item">
                  <FaEnvelope className="profile-detail-icon" />
                  <span>{userData.email}</span>
                </div>
                
                <div className="profile-detail-item">
                  <FaPhone className="profile-detail-icon" />
                  <span>{userData.phone}</span>
                </div>
                
                <div className="profile-detail-item">
                  <FaMapMarkerAlt className="profile-detail-icon" />
                  <span>{userData.address}</span>
                </div>
                
                <div className="profile-detail-item">
                  <FaCalendarAlt className="profile-detail-icon" />
                  <span>Born {formatDate(userData.birthDate)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="profile-farm-section">
            <h3><FaSeedling /> Farm Information</h3>
            
            {editMode ? (
              <div className="profile-farm-form">
                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label>Farm Name</label>
                    <input
                      type="text"
                      name="farmName"
                      value={userData.farmName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="profile-form-group">
                    <label>Farm Size</label>
                    <div className="profile-input-group">
                      <input
                        type="number"
                        name="farmSize"
                        value={userData.farmSize}
                        onChange={handleInputChange}
                        min="0"
                        step="0.1"
                        required
                      />
                      <select 
                        name="farmSizeUnit" 
                        value={userData.farmSizeUnit}
                        onChange={handleInputChange}
                      >
                        <option value="hectares">hectares</option>
                        <option value="acres">acres</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label>Farming Type</label>
                    <select
                      name="farmType"
                      value={userData.farmType}
                      onChange={handleInputChange}
                    >
                      <option value="Organic Vegetables">Organic Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Grains">Grains</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Poultry">Poultry</option>
                      <option value="Mixed Farming">Mixed Farming</option>
                    </select>
                  </div>

                  <div className="profile-form-group">
                    <label>Years of Experience</label>
                    <input
                      type="number"
                      name="yearsFarming"
                      value={userData.yearsFarming}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>Certification</label>
                  <input
                    type="text"
                    name="certification"
                    value={userData.certification}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="profile-form-group">
                  <label>Irrigation System</label>
                  <select
                    name="irrigationType"
                    value={userData.irrigationType}
                    onChange={handleInputChange}
                  >
                    <option value="Drip irrigation">Drip irrigation</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Flood">Flood</option>
                    <option value="Center pivot">Center pivot</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="profile-farm-details">
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Farm Name:</span>
                  <span>{userData.farmName}</span>
                </div>
                
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Farm Size:</span>
                  <span>{userData.farmSize} {userData.farmSizeUnit}</span>
                </div>
                
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Farming Type:</span>
                  <span>{userData.farmType}</span>
                </div>
                
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Experience:</span>
                  <span>{userData.yearsFarming} years</span>
                </div>
                
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Certification:</span>
                  <span>{userData.certification || 'None'}</span>
                </div>
                
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Irrigation:</span>
                  <span>{userData.irrigationType}</span>
                </div>
              </div>
            )}
          </div>

          <div className="profile-specialties-section">
            <h3><FaTractor /> Agricultural Specialties</h3>
            <div className="profile-specialties-list">
              {userData.specialties.map((item, index) => (
                <div key={index} className="profile-specialty-item">
                  <span className="profile-specialty-badge">
                    {item}
                    {editMode && (
                      <button 
                        className="profile-remove-specialty"
                        onClick={() => handleRemoveSpecialty(index)}
                      >
                        ×
                      </button>
                    )}
                  </span>
                </div>
              ))}
              {editMode && (
                <div className="profile-add-specialty-form">
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    placeholder="Add new specialty"
                  />
                  <button 
                    type="button"
                    className="profile-add-specialty-btn"
                    onClick={handleAddSpecialty}
                    disabled={!newSpecialty.trim()}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-stats-section">
            <h3><FaChartLine /> Farming Statistics</h3>
            <div className="profile-stats-grid">
              <div className="profile-stat-card">
                <div className="profile-stat-number">24</div>
                <div className="profile-stat-label">Active Products</div>
              </div>
              <div className="profile-stat-card">
                <div className="profile-stat-number">15</div>
                <div className="profile-stat-label">Completed Transactions</div>
              </div>
              <div className="profile-stat-card">
                <div className="profile-stat-number">4.8/5</div>
                <div className="profile-stat-label">Customer Rating</div>
              </div>
              <div className="profile-stat-card">
                <div className="profile-stat-number">10</div>
                <div className="profile-stat-label">Regular Customers</div>
              </div>
            </div>
          </div>

          <div className="profile-actions-section">
            <h3><FaStore /> Quick Actions</h3>
            <div className="profile-action-buttons">
              <button 
                className="profile-action-btn primary-action"
                onClick={() => navigate('/add-product')}
              >
                Add New Product
              </button>
              <button 
                className="profile-action-btn secondary-action"
                onClick={() => navigate('/sales')}
              >
                View Sales History
              </button>
              <button 
                className="profile-action-btn tertiary-action"
                onClick={() => navigate('/messages')}
              >
                Check Messages
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;