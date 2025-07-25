import React, { useState, useEffect } from 'react';
import '../styles/Services.css';
import { 
  FiSearch, FiPlusCircle, FiMessageSquare, 
  FiShare2, FiBookmark, FiEdit2, FiTrash2,
  FiUser, FiCalendar, FiDollarSign, FiMapPin,
  FiAward, FiTool, FiClock, FiCheckCircle
} from 'react-icons/fi';

const Services = () => {
  // States for data
  const [formData, setFormData] = useState({
    postType: 'offer',
    category: 'labor',
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    salary: '',
    experience: 'any',
    equipmentType: '',
    area: '',
    leaseType: '',
    serviceType: ''
  });

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [editingPostId, setEditingPostId] = useState(null);
  const [currentUser] = useState('user123'); // Simulated logged-in user
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [savedPosts, setSavedPosts] = useState([]);

  // Load data
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Demo professional data
        const demoPosts = [
          {
            id: 1,
            userId: 'user123',
            postType: 'request',
            category: 'labor',
            title: 'Looking for vineyard cultivation manager',
            description: '50ha vineyard estate seeks experienced cultivation manager.',
            location: 'Bordeaux, France',
            startDate: '2023-11-01',
            salary: '€45K annual',
            experience: 'expert',
            author: 'Domaine Les Vignes',
            date: '2023-09-15',
            contact: 'hr@domaine-les-vignes.fr'
          },
          {
            id: 2,
            userId: 'user456',
            postType: 'offer',
            category: 'equipment',
            title: 'Combine harvester for rent',
            description: 'Recent equipment (2021) available for rent with operator.',
            location: 'Champagne-Ardenne',
            startDate: '2023-09-20',
            endDate: '2023-10-30',
            dailyRate: '€850/day',
            equipmentType: 'Combine harvester',
            author: 'AgriLocation Pro',
            date: '2023-09-10',
            contact: 'contact@agrilocation-pro.com'
          }
        ];
        setPosts(demoPosts);
        setFilteredPosts(demoPosts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts
  useEffect(() => {
    let filtered = posts;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(post => post.postType === activeTab);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.description.toLowerCase().includes(term) ||
        post.location.toLowerCase().includes(term)
      );
    }
    
    setFilteredPosts(filtered);
  }, [searchTerm, activeTab, posts]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingPostId) {
      // Update existing post
      setPosts(posts.map(post => 
        post.id === editingPostId ? { ...formData, id: editingPostId, userId: currentUser } : post
      ));
      setEditingPostId(null);
    } else {
      // Create new post
      const newPost = {
        id: Date.now(),
        ...formData,
        userId: currentUser,
        author: 'Your Company',
        date: new Date().toISOString().split('T')[0],
        contact: 'your@email.com'
      };
      
      setPosts([newPost, ...posts]);
    }
    
    // Reset form
    setFormData({
      postType: 'offer',
      category: 'labor',
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      salary: '',
      experience: 'any',
      equipmentType: '',
      area: '',
      leaseType: '',
      serviceType: ''
    });
  };

  // Edit post
  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setFormData({
      postType: post.postType,
      category: post.category,
      title: post.title,
      description: post.description,
      location: post.location,
      startDate: post.startDate || '',
      endDate: post.endDate || '',
      salary: post.salary || post.dailyRate || post.price || '',
      experience: post.experience || 'any',
      equipmentType: post.equipmentType || '',
      area: post.area || '',
      leaseType: post.leaseType || '',
      serviceType: post.serviceType || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete post confirmation
  const confirmDelete = (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  // Execute delete after confirmation
  const handleDelete = () => {
    setPosts(posts.filter(post => post.id !== postToDelete));
    setShowDeleteModal(false);
  };

  // Contact post author
  const handleContact = (contact) => {
    setContactInfo(contact);
    setShowContactModal(true);
  };

  // Save post to favorites
  const handleSave = (postId) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
    } else {
      setSavedPosts([...savedPosts, postId]);
    }
  };

  // Render category-specific fields
  const renderCategoryFields = () => {
    switch(formData.category) {
      case 'labor':
        return (
          <>
            <div className="form-group">
              <label>Required experience</label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              >
                <option value="any">All levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div className="form-group">
              <label>Salary*</label>
              <input 
                type="text" 
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                placeholder="Ex: €12/h, €2500/month"
                required
              />
            </div>
          </>
        );
      case 'equipment':
        return (
          <>
            <div className="form-group">
              <label>Equipment type*</label>
              <input 
                type="text" 
                value={formData.equipmentType}
                onChange={(e) => setFormData({...formData, equipmentType: e.target.value})}
                placeholder="Ex: Tractor, harvester"
                required
              />
            </div>
            <div className="form-group">
              <label>Rate*</label>
              <input 
                type="text" 
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                placeholder="Ex: €850/day"
                required
              />
            </div>
          </>
        );
      case 'land':
        return (
          <>
            <div className="form-group">
              <label>Area*</label>
              <input 
                type="text" 
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value})}
                placeholder="Ex: 30 hectares"
                required
              />
            </div>
            <div className="form-group">
              <label>Lease type*</label>
              <select
                value={formData.leaseType}
                onChange={(e) => setFormData({...formData, leaseType: e.target.value})}
                required
              >
                <option value="">Select...</option>
                <option value="seasonal">Seasonal</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price*</label>
              <input 
                type="text" 
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                placeholder="Ex: €300/ha/year"
                required
              />
            </div>
          </>
        );
      case 'services':
        return (
          <>
            <div className="form-group">
              <label>Service type*</label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                required
              >
                <option value="">Select...</option>
                <option value="consulting">Consulting</option>
                <option value="training">Training</option>
              </select>
            </div>
            <div className="form-group">
              <label>Rate*</label>
              <input 
                type="text" 
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                placeholder="Ex: €50/h"
                required
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Render post details based on category
  const renderPostDetails = (post) => {
    switch(post.category) {
      case 'labor':
        return (
          <>
            <div className="detail">
              <FiDollarSign /> <strong>Salary</strong> {post.salary}
            </div>
            <div className="detail">
              <FiAward /> <strong>Experience</strong> {post.experience}
            </div>
          </>
        );
      case 'equipment':
        return (
          <>
            <div className="detail">
              <FiTool /> <strong>Equipment</strong> {post.equipmentType}
            </div>
            <div className="detail">
              <FiDollarSign /> <strong>Rate</strong> {post.dailyRate || post.salary}
            </div>
          </>
        );
      case 'land':
        return (
          <>
            <div className="detail">
              <FiMapPin /> <strong>Area</strong> {post.area}
            </div>
            <div className="detail">
              <FiDollarSign /> <strong>Price</strong> {post.price || post.salary}
            </div>
          </>
        );
      case 'services':
        return (
          <>
            <div className="detail">
              <FiTool /> <strong>Service</strong> {post.serviceType}
            </div>
            <div className="detail">
              <FiDollarSign /> <strong>Rate</strong> {post.salary}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="professional-services">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this post?</p>
            <div className="modal-actions">
              <button className="secondary-button" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="primary-button" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Contact Information</h3>
            <p>Email: {contactInfo}</p>
            <div className="modal-actions">
              <button className="primary-button" onClick={() => setShowContactModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="services-banner">
        <h1>Agricultural Marketplace</h1>
        <p>Connect with professionals in your area</p>
      </div>

      <div className="services-layout">
        {/* Sidebar */}
        <aside className="services-sidebar">
          <div className="sidebar-card">
            <h3>{editingPostId ? 'Edit Post' : 'Create Post'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Post Type</label>
                <select
                  value={formData.postType}
                  onChange={(e) => setFormData({...formData, postType: e.target.value})}
                >
                  <option value="offer">Offer</option>
                  <option value="request">Request</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category*</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="labor">Labor</option>
                  <option value="equipment">Equipment</option>
                  <option value="land">Land</option>
                  <option value="services">Services</option>
                </select>
              </div>

              <div className="form-group">
                <label>Title*</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Post title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description*</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  placeholder="Detailed description"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location*</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="City, region"
                  required
                />
              </div>

              {renderCategoryFields()}

              <button type="submit" className="primary-button">
                <FiPlusCircle /> {editingPostId ? 'Update' : 'Create'}
              </button>

              {editingPostId && (
                <button 
                  type="button" 
                  className="secondary-button"
                  onClick={() => setEditingPostId(null)}
                  style={{ marginTop: '10px' }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          <div className="sidebar-card">
            <h3>Filter</h3>
            <div className="filter-options">
              <button 
                className={activeTab === 'all' ? 'active' : ''}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                className={activeTab === 'offer' ? 'active' : ''}
                onClick={() => setActiveTab('offer')}
              >
                Offers
              </button>
              <button 
                className={activeTab === 'request' ? 'active' : ''}
                onClick={() => setActiveTab('request')}
              >
                Requests
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="services-main">
          <div className="search-bar">
            <FiSearch />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="no-results">
              <p>No posts found</p>
              <button onClick={() => setSearchTerm('')}>
                Clear search
              </button>
            </div>
          ) : (
            <div className="posts-grid">
              {filteredPosts.map(post => (
                <article key={post.id} className="post-card">
                  <div className="post-header">
                    <span className={`post-type ${post.postType}`}>
                      {post.postType === 'offer' ? 'OFFER' : 'REQUEST'}
                    </span>
                    <span className="post-category">
                      {post.category.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    
                    <div className="post-details">
                      <div className="detail">
                        <FiMapPin /> <strong>Location</strong> {post.location}
                      </div>
                      {renderPostDetails(post)}
                    </div>
                  </div>
                  
                  <div className="post-footer">
                    <div className="post-meta">
                      <span className="author"><FiUser /> {post.author}</span>
                      <span className="date"><FiClock /> {post.date}</span>
                    </div>
                    <div className="post-actions">
                      <button 
                        className="action-button"
                        onClick={() => handleContact(post.contact)}
                      >
                        <FiMessageSquare /> Contact
                      </button>
                      
                      <button 
                        className={`action-button ${savedPosts.includes(post.id) ? 'saved' : ''}`}
                        onClick={() => handleSave(post.id)}
                      >
                        <FiBookmark /> {savedPosts.includes(post.id) ? 'Saved' : 'Save'}
                      </button>

                      {post.userId === currentUser && (
                        <>
                          <button 
                            className="action-button"
                            onClick={() => handleEdit(post)}
                          >
                            <FiEdit2 /> Edit
                          </button>
                          <button 
                            className="action-button danger"
                            onClick={() => confirmDelete(post.id)}
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Services;