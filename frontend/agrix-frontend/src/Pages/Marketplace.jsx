import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBbar from '../components/NavBbar';
import '../styles/Marketplace.css';
import ph from '../assets/200.png';
import axios from 'axios';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: '',
    price: '',
    seller: '',
    location: '',
    image: null
  });
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Charger les produits au montage du composant
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProducts(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des produits');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedProduct(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du produit');
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleBuyNow = (product) => {
    navigate('/payment', { 
      state: { 
        product: product,
        type: 'buy' 
      } 
    });
  };

  // Gestion de l'ajout de produit
  const openAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  const closeAddProductModal = () => {
    setIsAddProductModalOpen(false);
    setNewProduct({ 
      name: '', 
      quantity: '', 
      price: '', 
      seller: '', 
      location: '',
      image: null 
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageUpload = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('quantity', newProduct.quantity);
      formData.append('price', newProduct.price);
      formData.append('seller', newProduct.seller);
      formData.append('location', newProduct.location);
      if (newProduct.image) {
        formData.append('photo', newProduct.image);
      }

      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Ajouter le nouveau produit à la liste
      setProducts([...products, response.data.data]);
      closeAddProductModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout du produit');
    }
  };

  if (isLoading) {
    return <div className="loading">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="marketplace">
      <NavBbar />
      <div className="marketplace-content">
        {/* Bannière */}
        <div className="banner">
          <div className="banner-text">
            <h1>Buy, sell, and trade easily on AgriX marketplace!</h1>
            <p className="banner-subtitle">Fresh products directly from local farmers</p>
            <button className="explore-btn">Explore Now</button>
          </div>
          <div className="banner-image">
            <img src={ph} alt="Banner" />
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="search-barr">
          <button className="add-product-btn" onClick={openAddProductModal}>
            <svg className="plus-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </button>
          <div className="search-containerr">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              placeholder="Search products..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <h3>{products.length}+</h3>
            <p>Products</p>
          </div>
          <div className="stat-card">
            <h3>10+</h3>
            <p>Farmers</p>
          </div>
          <div className="stat-card">
            <h3>100%</h3>
            <p>Organic</p>
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <img 
                  src={product.photo ? `http://localhost:5000${product.photo}` : 'https://via.placeholder.com/150'} 
                  alt={product.name} 
                  className="product-image" 
                />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">${product.price}/kg</p>
                  <div className="product-rating">
                    <span>★★★★★</span> 
                    <button 
                      className="view-details-btn"
                      onClick={() => openModal(product._id)} 
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No products found matching your search.</p>
            </div>
          )}
        </div>

        {/* Modale des détails du produit */}
        {selectedProduct && (
          <div className="product-modal">
            <div className="modal-overlay" onClick={closeModal}></div>
            <div className="modal-content">
              <button className="close-modal" onClick={closeModal}>
                ×
              </button>
              
              <div className="modal-body">
                <div className="modal-image">
                  <img 
                    src={selectedProduct.photo ? `http://localhost:5000${selectedProduct.photo}` : 'https://via.placeholder.com/150'} 
                    alt={selectedProduct.name} 
                  />
                </div>
                
                <div className="modal-details">
                  <h2>{selectedProduct.name}</h2>
                  <div className="detail-item">
                    <span className="detail-label">Product:</span>
                    <span>Freshly harvested {selectedProduct.name.toLowerCase()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Quantity:</span>
                    <span>{selectedProduct.quantity}kg</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Price:</span>
                    <span>${selectedProduct.price}/kg</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Seller:</span>
                    <span>{selectedProduct.seller}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span>{selectedProduct.location}</span>
                  </div>
                  
                  <div className="modal-actions">
                    <button 
                      className="buy-now-btn"
                      onClick={() => handleBuyNow(selectedProduct)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {isAddProductModalOpen && (
          <div className="product-modall">
            <div className="modall-overlay" onClick={closeAddProductModal}></div>
            <div className="modall-content">
              <h2>Add Product</h2>
              <div className="modall-body">
                <div className="modall-image">
                  <label htmlFor="image-upload" className="modall-image-label">
                    {newProduct.image ? (
                      <img 
                        src={URL.createObjectURL(newProduct.image)} 
                        alt="Preview" 
                        className="modall-uploaded-image"
                      />
                    ) : (
                      <>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span>Add Photo</span>
                      </>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="modall-image-input"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <div className="modall-details">
                  <div className="detaill-item">
                    <label>Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="detaill-item">
                    <label>Quantity (kg)</label>
                    <input
                      type="number"
                      name="quantity"
                      value={newProduct.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="detaill-item">
                    <label>Price ($/kg)</label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="detaill-item">
                    <label>Seller ID</label>
                    <input
                      type="text"
                      name="seller"
                      value={newProduct.seller}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="detaill-item">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={newProduct.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modall-actions">
                <button onClick={handleAddProduct} className="modall-confirm-btn">
                  Confirm
                </button>
                <button onClick={closeAddProductModal} className="modall-cancel-btn">
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

export default Marketplace;