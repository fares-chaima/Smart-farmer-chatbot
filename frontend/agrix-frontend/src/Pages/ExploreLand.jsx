import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandCard from '../components/LandCard';
import NavBbar from '../components/NavBbar';
import '../styles/explore-lands.css';

export default function ExploreLand() {
  const [isLoading, setIsLoading] = useState(true);
  const [publicLands, setPublicLands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
  });
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState('');
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  // Fetch all lands initially
  const fetchAllLands = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/a/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch lands: ${response.statusText}`);
      }

      const data = await response.json();
      const mappedLands = data.map((item, index) => ({
        id: index + 1,
        title: item.titre || 'Untitled Land',
        description: item.description || 'No description available',
        area: item.area || '0 ha',
        price: item.prix?.raw || 0,
        location: item.location || 'Unknown Location',
        contact: item.contact || 'contact@example.com | 1234567890',
        image: item.image || '/default-land.jpg',
      }));

      setPublicLands(mappedLands);
      setSearchError('');
    } catch (error) {
      console.error('Error fetching lands:', error);
      setPublicLands([]);
      setSearchError('Failed to load lands. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Search lands based on search term
  const searchLands = async (query) => {
    if (!query.trim()) {
      fetchAllLands();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/search_location/?query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle case when no results found
      if (data.message === "Aucune location trouvée.") {
        setPublicLands([]);
        setSearchError('No lands found matching your search.');
        return;
      }

      // Handle error response
      if (data.error) {
        throw new Error(data.error);
      }

      const mappedLands = data.map((item, index) => ({
        id: index + 1,
        title: item.titre || 'Untitled Land',
        description: item.description || 'No description available',
        area: item.area || '0 ha',
       price: item.prix?.raw || item.prix || 0,
        location: item.location || 'Unknown Location',
        contact: item.contact || 'contact@example.com | 1234567890',
        image: item.image || '/default-land.jpg',
      }));
console.log("Search results:", mappedLands);
      setPublicLands(mappedLands);
      setSearchError('');
    } catch (error) {
      console.error('Error searching lands:', error);
      setSearchError(error.message);
      setPublicLands([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllLands();
  }, []);

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchLands(searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const filteredLands = publicLands.filter((land) => {
    const matchesFilters =
      (!filters.location ||
        land.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.minPrice || land.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || land.price <= Number(filters.maxPrice)) &&
      (!filters.minArea ||
        parseFloat(land.area.split(' ')[0]) >= Number(filters.minArea));

    return matchesFilters;
  });

  const handleContactClick = (contactInfo) => {
    setSelectedContact(contactInfo);
    setShowContactModal(true);
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
    });
    setSearchTerm('');
    fetchAllLands();
  };

  const uniqueLocations = [...new Set(publicLands.map((land) => land.location))];

  return (
    <div className="explore-page-container">
      <div className="explore-banner">
        <div className="explore-banner-content">
          <h1>Explore Available Lands</h1>
          <p>Discover properties for sale or rent across various regions</p>
        </div>
      </div>
      <NavBbar />

      <div className="explore-page-header">
        <div className="explore-header-left">
          <h1 className="explore-page-title">
            <svg
              className="explore-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="8"
                r="3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Available Lands
            <span className="explore-lands-count">
              {filteredLands.length} {filteredLands.length !== 1 ? 'lands' : 'land'}
            </span>
          </h1>
        </div>
        <div className="explore-header-right">
          <button className="explore-nav-button" onClick={() => navigate('/my-lands')}>
            <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="8" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            My Lands
          </button>
        </div>
      </div>

      <div className="explore-page-controls">
        <div className="explore-search-wrapper">
          
         
          <input
            type="text"
            placeholder="Search by location, culture, climate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="explore-page-search"
          />
          {searchTerm && (
            <button
              className="explore-clear-search"
              onClick={() => {
                setSearchTerm('');
                fetchAllLands();
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <button
            className="explore-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="explore-filters-panel">
          <h3 className="explore-filters-title">Filter Lands</h3>
          <div className="explore-filter-group">
            <label>Location</label>
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className="explore-filter-group">
            <label>Min Price (€)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
          </div>
          <div className="explore-filter-group">
            <label>Max Price (€)</label>
            <input
              type="number"
              placeholder="∞"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </div>
          <div className="explore-filter-group">
            <label>Min Area (ha/m²)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minArea}
              onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
            />
          </div>
          <div className="explore-filter-actions">
            <button className="explore-apply-filters">Apply Filters</button>
            <button className="explore-reset-filters" onClick={resetFilters}>
              Reset All
            </button>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="explore-contact-modal">
          <div className="explore-contact-modal-content">
            <h3 className="explore-contact-modal-title">Contact Information</h3>
            <button
              className="explore-modal-close-icon"
              onClick={() => setShowContactModal(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="explore-contact-details">
              {selectedContact.split('|').map((item, index) => (
                <div key={index} className="explore-contact-item">
                  {item.trim().match(/^\d/) ? (
                    <>
                      <span className="explore-contact-item-icon">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <a href={`tel:${item.trim()}`}>{item.trim()}</a>
                    </>
                  ) : (
                    <>
                      <span className="explore-contact-item-icon">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22 6l-10 7L2 6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <a href={`mailto:${item.trim()}`}>{item.trim()}</a>
                    </>
                  )}
                </div>
              ))}
            </div>
            <button
              className="explore-modal-close-button"
              onClick={() => setShowContactModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="explore-loading-container">
          <div className="explore-loading-spinner"></div>
          <p className="explore-loading-text">
            {searchTerm ? 'Searching lands...' : 'Loading available lands...'}
          </p>
        </div>
      ) : (
        <div className="explore-page-grid">
          {searchError ? (
            <div className="explore-error-message">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 9v4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 17h.01"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>{searchError}</p>
              <button onClick={fetchAllLands} className="explore-retry-button">
                Retry
              </button>
            </div>
          ) : filteredLands.length > 0 ? (
            filteredLands.map((land) => (
              <div key={land.id} className="land-card-wrapper">
                <LandCard land={land} showActions={false} />
                <button
                  className="explore-owner-contact-btn"
                  onClick={() => handleContactClick(land.contact)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Contact
                </button>
              </div>
            ))
          ) : (
            <div className="no-lands-message">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="10"
                  r="3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>No lands match your search/filter criteria.</p>
              <button onClick={resetFilters} className="explore-clear-filters-button">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}