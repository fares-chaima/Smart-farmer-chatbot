import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBbar from '../components/NavBbar';
import '../styles/Material.css';
import ph from '../assets/55.png';

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    seller: '',
    location: '',
    photo: null,
    imagePreview: null, // For local preview
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/materials', {
          params: { search: searchTerm },
        });
        setMaterials(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch materials. Please try again.');
        console.error(err);
      }
    };
    fetchMaterials();
  }, [searchTerm]);

  const openModal = async (materialId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/materials/${materialId}`);
      setSelectedMaterial(response.data);
    } catch (err) {
      setError('Failed to fetch material details.');
      console.error(err);
    }
  };

  const closeModal = () => {
    setSelectedMaterial(null);
  };

  const handleBuyNow = (material) => {
    navigate('/payment', { state: { product: material, type: 'buy' } });
  };

  const handleBidNow = (material) => {
    navigate('/bid', { state: { product: material, type: 'bid' } });
  };

  const openAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  const closeAddProductModal = () => {
    setIsAddProductModalOpen(false);
    setNewProduct({ name: '', price: '', seller: '', location: '', photo: null, imagePreview: null });
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct({ ...newProduct, photo: file, imagePreview: imageUrl });
    }
  };

 const handleAddProduct = async () => {
  // Clear previous errors
  setError(null);

  // Validate inputs
  if (!newProduct.name || newProduct.name.trim() === '') {
    setError('Product name is required.');
    return;
  }
  if (!newProduct.price || isNaN(newProduct.price) || Number(newProduct.price) < 0) {
    setError('Price must be a valid number >= 0.');
    return;
  }
  if (!newProduct.seller || newProduct.seller.trim() === '') {
    setError('Seller name is required.');
    return;
  }
  if (!newProduct.location || newProduct.location.trim() === '') {
    setError('Location is required.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('name', newProduct.name.trim());
    formData.append('price', Number(newProduct.price));
    formData.append('seller', newProduct.seller.trim());
    formData.append('location', newProduct.location.trim());
    if (newProduct.photo) {
      formData.append('photo', newProduct.photo);
    }

    // Log FormData for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    const response = await axios.post('http://localhost:5000/api/materials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setMaterials([...materials, response.data]);
    closeAddProductModal();
    setError(null);
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to add product. Please try again.';
    setError(errorMessage);
    console.error('Error details:', err.response?.data);
  }
};
  // Rest of the component (render method) remains the same as in your original code
  return (
    <div className="material-marketplace">
      <NavBbar />
      <div className="material-content">
        <div className="material-banner">
          <div className="material-banner-text">
            <h1>Buy, sell, and trade easily on AgriX marketplace!</h1>
            <p className="material-banner-subtitle">Fresh products directly from local farmers</p>
            <button className="material-explore-btn">Explore Now</button>
          </div>
          <div className="material-banner-image">
            <img src={ph} alt="Banner" />
          </div>
        </div>

        <div className="material-search-bar">
          <button className="material-add-product-btn" onClick={openAddProductModal}>
            <svg className="material-plus-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </button>
          <div className="material-search-container">
            <svg className="material-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              className="material-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="material-stats-container">
          <div className="material-stat-card">
            <h3>{materials.length}+</h3>
            <p>Products</p>
          </div>
          <div className="material-stat-card">
            <h3>10+</h3>
            <p>Farmers</p>
          </div>
          <div className="material-stat-card">
            <h3>100%</h3>
            <p>Organic</p>
          </div>
        </div>

        {error && <div className="material-error">{error}</div>}

        <div className="material-product-grid">
          {materials.length > 0 ? (
            materials.map((material) => (
              <div key={material._id} className="material-product-card">
                <img
                  src={material.photo || 'https://via.placeholder.com/150'}
                  alt={material.name}
                  className="material-product-image"
                />
                <div className="material-product-info">
                  <h3 className="material-product-name">{material.name}</h3>
                  <p className="material-product-price">${material.price}/kg</p>
                  <div className="material-product-rating">
                    <span>★★★★★</span>
                    <button
                      className="material-view-details-btn"
                      onClick={() => openModal(material._id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="material-no-results">
              <p>No products found matching your search.</p>
            </div>
          )}
        </div>

        {selectedMaterial && (
          <div className="material-product-modal">
            <div className="material-modal-overlay" onClick={closeModal}></div>
            <div className="material-modal-content">
              <button className="material-close-modal" onClick={closeModal}>
                ×
              </button>
              <div className="material-modal-body">
                <div className="material-modal-image">
                  <img
                    src={selectedMaterial.photo || 'https://via.placeholder.com/150'}
                    alt={selectedMaterial.name}
                  />
                </div>
                <div className="material-modal-details">
                  <h2>{selectedMaterial.name}</h2>
                  <div className="material-detail-item">
                    <span className="material-detail-label">Product:</span>
                    <span>Freshly harvested {selectedMaterial.name.toLowerCase()}</span>
                  </div>
                  <div className="material-detail-item">
                    <span className="material-detail-label">Price:</span>
                    <span>{selectedMaterial.price} DA/kg</span>
                  </div>
                  <div className="material-detail-item">
                    <span className="material-detail-label">Seller:</span>
                    <span>{selectedMaterial.seller}</span>
                  </div>
                  <div className="material-detail-item">
                    <span className="material-detail-label">Location:</span>
                    <span>{selectedMaterial.location}</span>
                  </div>
                  <div className="material-modal-actions">
                    <button
                      className="material-buy-now-btn"
                      onClick={() => handleBuyNow(selectedMaterial)}
                    >
                      Buy Now
                    </button>
                    <button
                      className="material-bid-now-btn"
                      onClick={() => handleBidNow(selectedMaterial)}
                    >
                      Bid Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAddProductModalOpen && (
          <div className="material-product-modall">
            <div className="material-modall-overlay" onClick={closeAddProductModal}></div>
          <div className="material-modall-content">
  <h2>Add Product</h2>
  {error && <div className="material-error">{error}</div>}
  <div className="material-modall-body">
    <div className="material-modall-image">
      {newProduct.imagePreview ? (
        <img src={newProduct.imagePreview} alt="Uploaded" className="material-modall-uploaded-image" />
      ) : (
        <label htmlFor="image-upload" className="material-modall-image-label">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Add Photo</span>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="material-modall-image-input"
            onChange={handleImageUpload}
          />
        </label>
      )}
    </div>
    <div className="material-modall-details">
      <div className="material-detaill-item">
        <label>Product</label>
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          required
          placeholder="Enter product name"
          onBlur={() => {
            if (!newProduct.name || newProduct.name.trim() === '') {
              setError('Product name is required.');
            } else {
              setError(null);
            }
          }}
        />
      </div>
      <div className="material-detaill-item">
        <label>Price</label>
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          min="0"
          required
          placeholder="Enter price"
          onBlur={() => {
            if (!newProduct.price || isNaN(newProduct.price) || Number(newProduct.price) < 0) {
              setError('Price must be a valid number >= 0.');
            } else {
              setError(null);
            }
          }}
        />
      </div>
      <div className="material-detaill-item">
        <label>Seller</label>
        <input
          type="text"
          name="seller"
          value={newProduct.seller}
          onChange={handleInputChange}
          required
          placeholder="Enter seller name"
          onBlur={() => {
            if (!newProduct.seller || newProduct.seller.trim() === '') {
              setError('Seller name is required.');
            } else {
              setError(null);
            }
          }}
        />
      </div>
      <div className="material-detaill-item">
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={newProduct.location}
          onChange={handleInputChange}
          required
          placeholder="Enter location"
          onBlur={() => {
            if (!newProduct.location || newProduct.location.trim() === '') {
              setError('Location is required.');
            } else {
              setError(null);
            }
          }}
        />
      </div>
    </div>
  </div>
  <div className="material-modall-actions">
    <button onClick={handleAddProduct} className="material-modall-confirm-btn">
      Confirm
    </button>
    <button onClick={closeAddProductModal} className="material-modall-cancel-btn">
      Cancel
    </button>
  </div>
</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Material;