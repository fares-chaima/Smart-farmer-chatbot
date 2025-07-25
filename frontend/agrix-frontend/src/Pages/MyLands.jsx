import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandCard from '../components/LandCard';
import LandForm from '../components/LandForm';
import LandFor from '../components/LandFor';
import NavBbar from '../components/NavBbar';
import '../styles/my-lands.css';

export default function MyLands() {
  const [isLoading, setIsLoading] = useState(true);
  const [lands, setLands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLand, setCurrentLand] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [filteredLands, setFilteredLands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    minArea: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLands = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/b/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const mappedLands = data.map((item, index) => ({
          id: item.post_id ? `land-${item.post_id}` : `land-${index + 1}`,
          post_id: item.post_id || index + 1,
          title: item.titre || 'Untitled Land',
          description: item.description || '',
          area: item.area || '0 ha',
          price: item.prix?.raw || item.prix || 0,
          location: item.location || 'Unknown',
          contact: item.contact || 'contact@example.com | 555-123-4567',
          tags: item.tags || ['land'],
          dateAdded: item.dateAdded || new Date().toISOString().split('T')[0]
        }));
        setLands(mappedLands);
        setFilteredLands(mappedLands);
      } catch (error) {
        console.error('Error fetching lands:', error);
        setError('Failed to load properties. Please try again.');
        setLands([]);
        setFilteredLands([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLands();
  }, []);

  useEffect(() => {
    const filtered = lands.filter(land => {
      const matchesSearch = land.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           land.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           land.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !filters.location || land.location === filters.location;
      const matchesMinPrice = !filters.minPrice || land.price >= Number(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || land.price <= Number(filters.maxPrice);
      const matchesMinArea = !filters.minArea || parseFloat(land.area) >= Number(filters.minArea);
      return matchesSearch && matchesLocation && matchesMinPrice && matchesMaxPrice && matchesMinArea;
    });
    setFilteredLands(filtered);
  }, [searchTerm, filters, lands]);

 const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (isDelete) {
      // Delete mode
      if (!formData.post_id) {
        setError('Veuillez sélectionner un terrain à supprimer.');
        setIsSubmitting(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:8000/delete_post/${formData.post_id}/`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
        }
        const result = await response.json();
        console.log('Suppression réussie:', result);
        onSubmit({ post_id: formData.post_id });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError(`Échec de la suppression: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Update mode
      if (!formData.post_id) {
        setError('ID du terrain manquant pour la mise à jour.');
        setIsSubmitting(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:8000/update_post/${formData.post_id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titre: formData.title,
            description: formData.description,
            area: formData.area,
            prix: Number(formData.price),
            location: formData.location,
            contact: formData.contact
            // Note: 'image' field is not sent as it’s not in the backend schema
          })
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
        }
        const result = await response.json();
        console.log('Mise à jour réussie:', result);
        onSubmit({
          post_id: formData.post_id,
          title: formData.title,
          description: formData.description,
          area: formData.area,
          price: Number(formData.price),
          location: formData.location,
          contact: formData.contact
         
        });
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        setError(`Échec de la mise à jour: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  const handleContactClick = (contactInfo) => {
    setSelectedContact(contactInfo);
    setShowContactModal(true);
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      minArea: ''
    });
    setSearchTerm('');
    setFilteredLands(lands);
  };

  const uniqueLocations = [...new Set(lands.map(land => land.location))];

  return (
    <div className={`my-lands-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="landing-banner">
        <div className="banner-content">
          <h1>Manage Your Land Properties</h1>
          <p>Edit or remove your agricultural properties</p>
        </div>
      </div>
      <NavBbar />
      <div className="my-lands-header">
        <div className="header-left">
          <h1 className="my-lands-title">
            <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12h6v10M2 10.6L12 2l10 8.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            My Properties
            <span className="lands-count">{lands.length} {lands.length !== 1 ? 'properties' : 'property'}</span>
          </h1>
        </div>
        <div className="header-right">
          <button
            className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          <button className="nav-button" onClick={() => navigate('/explorer')}>
            <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="8" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Explore
          </button>
        </div>
      </div>

      <div className="my-lands-controls">
        <div className="search-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search my properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="my-lands-search"
          />
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Filters
          </button>
        </div>
        <button
          className="delete-button"
          onClick={() => {
            setCurrentLand(null);
            setShowForm(true);
          }}
        >
          <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 6h18M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M9 6v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Delete Property
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {showFilters && (
        <div className="filters-panel">
          <h3 className="filters-section-title">Filter Properties</h3>
          <div className="filter-group">
            <label>Location</label>
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Min Price ($)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
          </div>
          <div className="filter-group">
            <label>Max Price ($)</label>
            <input
              type="number"
              placeholder="∞"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </div>
          <div className="filter-group">
            <label>Min Area (ha)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minArea}
              onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
            />
          </div>
          <div className="filter-actions">
            <button className="apply-filters" onClick={() => {}}>
              Apply Filters
            </button>
            <button className="reset-filters" onClick={resetFilters}>
              Reset All
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <LandFor
          land={currentLand}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          darkMode={darkMode}
          isDelete={!currentLand}
        />
      )}

      {showContactModal && (
        <div className="contact-modal">
          <div className="contact-modal-content">
            <h3 className="contact-modal-title">Contact Information</h3>
            <button className="modal-close-icon" onClick={() => setShowContactModal(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="contact-details">
              {selectedContact.split('|').map((item, index) => (
                <div key={index} className="contact-item">
                  {item.trim().match(/^\d/) ? (
                    <>
                      <span className="contact-item-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <a href={`tel:${item.trim()}`}>{item.trim()}</a>
                    </>
                  ) : (
                    <>
                      <span className="contact-item-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 6l-10 7L2 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <a href={`mailto:${item.trim()}`}>{item.trim()}</a>
                    </>
                  )}
                </div>
              ))}
            </div>
            <button
              className="modal-close-button"
              onClick={() => setShowContactModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your properties...</p>
        </div>
      ) : (
        <div className="my-lands-grid">
          {filteredLands.length > 0 ? (
            filteredLands.map((land, index) => (
              <LandCard
                key={land.id || index}
                land={{
                  ...land,
                  price: land.price || 0,
                  area: land.area || '0 ha'
                }}
                onEdit={() => {
                  setCurrentLand(land);
                  setShowForm(true);
                }}
                onDelete={async () => {
                  try {
                    const response = await fetch(`http://localhost:8000/delete_post/${land.post_id}/`, {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' }
                    });
                    if (!response.ok) throw new Error('Failed to delete');
                    const updatedLands = lands.filter(l => l.post_id !== land.post_id);
                    setLands(updatedLands);
                    setFilteredLands(updatedLands);
                  } catch (error) {
                    setError(`Failed to delete property: ${error.message}`);
                  }
                }}
                onContact={() => handleContactClick(land.contact)}
                showActions={true}
                darkMode={darkMode}
              />
            ))
          ) : (
            <div className="no-lands-message">
              <div className="no-lands-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12h6v10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>No Properties Found</h3>
              <p>Try modifying your search criteria or delete a property.</p>
              <button
                className="delete-button"
                onClick={() => {
                  setCurrentLand(null);
                  setShowForm(true);
                }}
              >
                <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 6h18M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M9 6v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete Property
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}