import React, { useState, useEffect } from 'react';
import {
  FiSearch, FiArrowLeft, FiUser, FiCalendar,
  FiDollarSign, FiMapPin, FiMessageSquare,
  FiEdit2, FiTrash2, FiPlusCircle, FiGrid, FiPhone, FiMail, FiClock
} from 'react-icons/fi';
import { FaTractor, FaSeedling, FaWarehouse, FaHandsHelping } from 'react-icons/fa';
import '../styles/CreatePost.css';

const CreatePost = () => {
  // États principaux
  const [agView, setAgView] = useState('browse');
  const [agIsLoading, setAgIsLoading] = useState(true);
  const [agPosts, setAgPosts] = useState([]);
  const [agFilteredPosts, setAgFilteredPosts] = useState([]);
  const [agMyPosts, setAgMyPosts] = useState([]);
  const [agFormData, setAgFormData] = useState({
    title: '',
    description: '',
    category: 'labor',
    location: '',
    price: '',
    startDate: '',
    endDate: '',
    experience: 'any',
    contactPhone: '',
    contactEmail: ''
  });
  const [agEditingId, setAgEditingId] = useState(null);
  const [agSearchTerm, setAgSearchTerm] = useState('');
  const [agActiveCategory, setAgActiveCategory] = useState('all');
  const [agShowContactModal, setAgShowContactModal] = useState(false);
  const [agCurrentContact, setAgCurrentContact] = useState(null);
  const [agFormErrors, setAgFormErrors] = useState({});
  const [agApiError, setAgApiError] = useState('');

  // Données utilisateur
  const [agCurrentUser] = useState({
    id: '507f1f77bcf86cd799439012',
    name: 'Karim Bouzid',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    profession: 'Viticulteur',
    rating: 4.5,
    memberSince: '2019'
  });

  // Charger les posts depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      setAgIsLoading(true);
      setAgApiError('');
      try {
        // Fetch tous les posts
        const postsResponse = await fetch('http://localhost:3003/api/posts', {
          headers: { 'Content-Type': 'application/json' }
        });
        if (!postsResponse.ok) {
          throw new Error(`Erreur ${postsResponse.status}: ${await postsResponse.text()}`);
        }
        const postsData = await postsResponse.json();
        setAgPosts(postsData);
        setAgFilteredPosts(postsData);

        // Fetch mes posts
        const myPostsResponse = await fetch('http://localhost:3003/api/posts/my', {
          headers: {
            'Content-Type': 'application/json',
            'User-ID': agCurrentUser.id // Send userId in header
          }
        });
        if (!myPostsResponse.ok) {
          throw new Error(`Erreur ${myPostsResponse.status}: ${await myPostsResponse.text()}`);
        }
        const myPostsData = await myPostsResponse.json();
        setAgMyPosts(myPostsData);
      } catch (error) {
        console.error('Erreur de chargement des données:', error);
        setAgApiError(error.message);
      } finally {
        setAgIsLoading(false);
      }
    };

    fetchData();
  }, [agCurrentUser.id]);

  // Filtrer les posts
  useEffect(() => {
    let filtered = agView === 'myPosts' ? [...agMyPosts] : [...agPosts];

    if (agActiveCategory !== 'all') {
      filtered = filtered.filter(post => post.category === agActiveCategory);
    }

    if (agSearchTerm) {
      const term = agSearchTerm.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.description.toLowerCase().includes(term) ||
        post.location.toLowerCase().includes(term) ||
        post.user.name.toLowerCase().includes(term)
      );
    }

    setAgFilteredPosts(filtered);
  }, [agSearchTerm, agActiveCategory, agView, agPosts, agMyPosts]);

  // Valider le formulaire
  const validateForm = () => {
    const errors = {};
    if (!agFormData.title.trim()) errors.title = 'Titre requis';
    if (!agFormData.description.trim()) errors.description = 'Description requise';
    if (agFormData.description.length > 150) errors.description = 'Description trop longue (150 caractères maximum)';
    if (!agFormData.location.trim()) errors.location = 'Localisation requise';
    if (!agFormData.price.trim()) errors.price = 'Prix requis';
    if (agFormData.startDate && agFormData.endDate && new Date(agFormData.endDate) < new Date(agFormData.startDate)) {
      errors.endDate = 'La date de fin doit être après la date de début';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (agFormData.contactEmail && !emailRegex.test(agFormData.contactEmail)) {
      errors.contactEmail = 'Email invalide';
    }
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (agFormData.contactPhone && !phoneRegex.test(agFormData.contactPhone)) {
      errors.contactPhone = 'Téléphone invalide';
    }
    setAgFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumettre le formulaire (créer ou modifier un post)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setAgIsLoading(true);
    setAgApiError('');

    try {
      const url = agEditingId
        ? `http://localhost:3003/api/posts/${agEditingId}`
        : 'http://localhost:3003/api/posts';
      const method = agEditingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-ID': agCurrentUser.id // Send userId in header
        },
        body: JSON.stringify(agFormData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }

      const newPost = await response.json();

      if (agEditingId) {
        setAgMyPosts(agMyPosts.map(post => (post.id === agEditingId ? newPost : post)));
      } else {
        setAgMyPosts([newPost, ...agMyPosts]);
        setAgPosts([newPost, ...agPosts]);
      }

      resetForm();
      setAgView('myPosts');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setAgApiError(error.message);
    } finally {
      setAgIsLoading(false);
    }
  };

  // Supprimer un post
  const handleDelete = async (postId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    setAgIsLoading(true);
    setAgApiError('');

    try {
      const response = await fetch(`http://localhost:3003/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'User-ID': agCurrentUser.id // Send userId in header
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }

      setAgMyPosts(agMyPosts.filter(post => post.id !== postId));
      setAgPosts(agPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setAgApiError(error.message);
    } finally {
      setAgIsLoading(false);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setAgFormData({
      title: '',
      description: '',
      category: 'labor',
      location: '',
      price: '',
      startDate: '',
      endDate: '',
      experience: 'any',
      contactPhone: '',
      contactEmail: ''
    });
    setAgEditingId(null);
    setAgFormErrors({});
  };

  // Gérer le contact
  const handleContactClick = (post) => {
    setAgCurrentContact({
      name: post.user.name,
      phone: post.contactPhone || 'Non fourni',
      email: post.contactEmail || 'Non fourni',
      avatar: post.user.avatar
    });
    setAgShowContactModal(true);
  };

  // Icônes de catégorie
  const renderCategoryIcon = (category) => {
    switch (category) {
      case 'labor': return <FaHandsHelping className="ag-category-icon" />;
      case 'equipment': return <FaTractor className="ag-category-icon" />;
      case 'land': return <FaSeedling className="ag-category-icon" />;
      case 'services': return <FaWarehouse className="ag-category-icon" />;
      default: return <FaHandsHelping className="ag-category-icon" />;
    }
  };

  // Afficher un post
  const renderPost = (post) => (
    <article key={post.id} className="ag-post">
      <div className="ag-post-header">
        <div className="ag-author-info">
          <div className="ag-author-avatar">
            <img src={post.user.avatar} alt={post.user.name} />
            {post.user.rating && (
              <span className="ag-user-rating">{post.user.rating}</span>
            )}
          </div>
          <div>
            <h3>{post.user.name}</h3>
            <span className="ag-author-profession">{post.user.profession}</span>
            <div className="ag-post-meta">
              <span className="ag-post-date">{new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
              <span className="ag-post-views"><FiClock /> {post.views} vues</span>
            </div>
          </div>
        </div>

        {post.userId === agCurrentUser.id && agView === 'myPosts' && (
          <div className="ag-post-actions">
            <button
              onClick={() => {
                setAgFormData({
                  title: post.title,
                  description: post.description,
                  category: post.category,
                  location: post.location,
                  price: post.price,
                  startDate: post.startDate || '',
                  endDate: post.endDate || '',
                  experience: post.experience || 'any',
                  contactPhone: post.contactPhone || '',
                  contactEmail: post.contactEmail || ''
                });
                setAgEditingId(post.id);
                setAgView('create');
              }}
              className="ag-edit-btn"
              aria-label="Modifier"
            >
              <FiEdit2 />
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className="ag-delete-btn"
              aria-label="Supprimer"
            >
              <FiTrash2 />
            </button>
          </div>
        )}
      </div>

      <div className="ag-post-content">
        <div className="ag-post-category">
          {renderCategoryIcon(post.category)}
          <span>
            {post.category === 'labor' ? 'Main d\'œuvre' :
             post.category === 'equipment' ? 'Matériel' :
             post.category === 'land' ? 'Terrains' : 'Services'}
          </span>
        </div>
        <h4>{post.title}</h4>
        <p>{post.description}</p>

        <div className="ag-post-details">
          <div className="ag-detail">
            <FiMapPin /> <span>{post.location}</span>
          </div>
          <div className="ag-detail">
            <FiDollarSign /> <span>{post.price}</span>
          </div>
          {post.startDate && (
            <div className="ag-detail">
              <FiCalendar />
              <span>
                {new Date(post.startDate).toLocaleDateString('fr-FR')}
                {post.endDate && ` - ${new Date(post.endDate).toLocaleDateString('fr-FR')}`}
              </span>
            </div>
          )}
          {post.experience && post.experience !== 'any' && (
            <div className="ag-detail">
              <FiUser />
              <span>
                {post.experience === 'beginner' ? 'Débutant accepté' :
                 post.experience === 'intermediate' ? 'Expérience requise' : 'Expert requis'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="ag-post-footer">
        <div className="ag-post-stats">
          {post.applications > 0 && (
            <span className="ag-applications-count">{post.applications} candidature{post.applications > 1 ? 's' : ''}</span>
          )}
        </div>
        <button
          className="ag-contact-btn"
          onClick={() => handleContactClick(post)}
          aria-label="Contacter"
        >
          <FiMessageSquare /> Contacter
        </button>
      </div>
    </article>
  );

  // Afficher le squelette de chargement
  const renderSkeletonLoader = () => (
    <div className="ag-posts-container">
      {[1, 2, 3].map((i) => (
        <article key={i} className="ag-post ag-skeleton-loader">
          <div className="ag-skeleton-header"></div>
          <div className="ag-skeleton-content">
            <div className="ag-skeleton-line ag-short"></div>
            <div className="ag-skeleton-line ag-medium"></div>
            <div className="ag-skeleton-line ag-long"></div>
            <div className="ag-skeleton-line ag-short"></div>
          </div>
          <div className="ag-skeleton-footer"></div>
        </article>
      ))}
    </div>
  );

  return (
    <div className="ag-platform">
      {/* Afficher les erreurs API */}
      {agApiError && (
        <div className="ag-error-notification">
          <p>{agApiError}</p>
          <button onClick={() => setAgApiError('')}>Fermer</button>
        </div>
      )}

      {/* Modal de contact */}
      {agShowContactModal && (
        <div className="ag-modal-overlay" onClick={() => setAgShowContactModal(false)}>
          <div className="ag-modal-content" onClick={e => e.stopPropagation()}>
            <div className="ag-modal-contact-header">
              <img src={agCurrentContact?.avatar} alt={agCurrentContact?.name} className="ag-modal-contact-avatar" />
              <h3>Contacter {agCurrentContact?.name}</h3>
            </div>
            <div className="ag-contact-info">
              <div className="ag-contact-item">
                <div className="ag-contact-icon"><FiPhone /></div>
                <div>
                  <div className="ag-contact-label">Téléphone</div>
                  <div className="ag-contact-value">{agCurrentContact?.phone}</div>
                </div>
              </div>
              <div className="ag-contact-item">
                <div className="ag-contact-icon"><FiMail /></div>
                <div>
                  <div className="ag-contact-label">Email</div>
                  <div className="ag-contact-value">{agCurrentContact?.email}</div>
                </div>
              </div>
            </div>
            <button
              className="ag-modal-close-btn"
              onClick={() => setAgShowContactModal(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* En-tête */}
      <header className="ag-platform-header">
        <div className="ag-header-content">
          <div className="ag-header-title">
            <h1>Services Agricoles</h1>
            <p>Connectez-vous avec les professionnels du secteur</p>
          </div>
          <div className="ag-header-actions">
            {agView === 'myPosts' ? (
              <button onClick={() => setAgView('browse')} className="ag-header-btn">
                <FiGrid /> Parcourir
              </button>
            ) : (
              <button onClick={() => setAgView('myPosts')} className="ag-header-btn">
                <FiUser /> Mes annonces
              </button>
            )}
            {agView !== 'create' && (
              <button
                onClick={() => {
                  resetForm();
                  setAgView('create');
                }}
                className="ag-header-btn ag-primary"
              >
                <FiPlusCircle /> Créer
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="ag-platform-main">
        {agIsLoading && agView !== 'create' ? (
          renderSkeletonLoader()
        ) : agView === 'create' ? (
          <div className="ag-create-post-container">
            <div className="ag-create-post-header">
              <button
                onClick={() => setAgView(agEditingId ? 'myPosts' : 'browse')}
                className="ag-back-btn"
              >
                <FiArrowLeft /> Retour
              </button>
              <h2>{agEditingId ? 'Modifier une annonce' : 'Créer une annonce'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="ag-post-form">
              <div className="ag-form-group">
                <label>Titre*</label>
                <input
                  type="text"
                  value={agFormData.title}
                  onChange={(e) => setAgFormData({ ...agFormData, title: e.target.value })}
                  required
                  placeholder="Titre de votre annonce"
                  className={agFormErrors.title ? 'ag-error' : ''}
                />
                {agFormErrors.title && <span className="ag-error-message">{agFormErrors.title}</span>}
              </div>

              <div className="ag-form-group">
                <label>Description*</label>
                <textarea
                  value={agFormData.description}
                  onChange={(e) => setAgFormData({ ...agFormData, description: e.target.value })}
                  required
                  placeholder="Décrivez en détail votre annonce (150 caractères max)"
                  rows="5"
                  className={agFormErrors.description ? 'ag-error' : ''}
                />
                {agFormErrors.description && <span className="ag-error-message">{agFormErrors.description}</span>}
              </div>

              <div className="ag-form-row">
                <div className="ag-form-group">
                  <label>Catégorie*</label>
                  <select
                    value={agFormData.category}
                    onChange={(e) => setAgFormData({ ...agFormData, category: e.target.value })}
                    required
                  >
                    <option value="labor">Main d'œuvre</option>
                    <option value="equipment">Matériel</option>
                    <option value="land">Terrains</option>
                    <option value="services">Services</option>
                  </select>
                </div>

                <div className="ag-form-group">
                  <label>Localisation*</label>
                  <input
                    type="text"
                    value={agFormData.location}
                    onChange={(e) => setAgFormData({ ...agFormData, location: e.target.value })}
                    required
                    placeholder="Localisation"
                    className={agFormErrors.location ? 'ag-error' : ''}
                  />
                  {agFormErrors.location && <span className="ag-error-message">{agFormErrors.location}</span>}
                </div>
              </div>

              <div className="ag-form-row">
                <div className="ag-form-group">
                  <label>Prix*</label>
                  <input
                    type="text"
                    value={agFormData.price}
                    onChange={(e) => setAgFormData({ ...agFormData, price: e.target.value })}
                    required
                    placeholder="Prix ou salaire proposé"
                    className={agFormErrors.price ? 'ag-error' : ''}
                  />
                  {agFormErrors.price && <span className="ag-error-message">{agFormErrors.price}</span>}
                </div>

                {agFormData.category === 'labor' && (
                  <div className="ag-form-group">
                    <label>Expérience requise</label>
                    <select
                      value={agFormData.experience}
                      onChange={(e) => setAgFormData({ ...agFormData, experience: e.target.value })}
                    >
                      <option value="any">Tous niveaux</option>
                      <option value="beginner">Débutant</option>
                      <option value="intermediate">Intermédiaire</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="ag-form-row">
                <div className="ag-form-group">
                  <label>Date de début</label>
                  <input
                    type="date"
                    value={agFormData.startDate}
                    onChange={(e) => setAgFormData({ ...agFormData, startDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="ag-form-group">
                  <label>Date de fin</label>
                  <input
                    type="date"
                    value={agFormData.endDate}
                    onChange={(e) => setAgFormData({ ...agFormData, endDate: e.target.value })}
                    min={agFormData.startDate || new Date().toISOString().split('T')[0]}
                    className={agFormErrors.endDate ? 'ag-error' : ''}
                  />
                  {agFormErrors.endDate && <span className="ag-error-message">{agFormErrors.endDate}</span>}
                </div>
              </div>

              <div className="ag-form-row">
                <div className="ag-form-group">
                  <label>Téléphone de contact</label>
                  <input
                    type="tel"
                    value={agFormData.contactPhone}
                    onChange={(e) => setAgFormData({ ...agFormData, contactPhone: e.target.value })}
                    placeholder="+213 6 12 34 56 78"
                    className={agFormErrors.contactPhone ? 'ag-error' : ''}
                  />
                  {agFormErrors.contactPhone && <span className="ag-error-message">{agFormErrors.contactPhone}</span>}
                </div>

                <div className="ag-form-group">
                  <label>Email de contact</label>
                  <input
                    type="email"
                    value={agFormData.contactEmail}
                    onChange={(e) => setAgFormData({ ...agFormData, contactEmail: e.target.value })}
                    placeholder="contact@exemple.com"
                    className={agFormErrors.contactEmail ? 'ag-error' : ''}
                  />
                  {agFormErrors.contactEmail && <span className="ag-error-message">{agFormErrors.contactEmail}</span>}
                </div>
              </div>

              <div className="ag-form-actions">
                <button
                  type="submit"
                  className="ag-primary-btn"
                  disabled={agIsLoading}
                >
                  {agIsLoading ? (
                    <span className="ag-loading-spinner"></span>
                  ) : agEditingId ? (
                    'Mettre à jour'
                  ) : (
                    'Publier'
                  )}
                </button>

                <button
                  type="button"
                  className="ag-secondary-btn"
                  onClick={() => setAgView(agEditingId ? 'myPosts' : 'browse')}
                  disabled={agIsLoading}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        ) : agView === 'myPosts' ? (
          <div className="ag-my-posts-view">
            <div className="ag-user-profile-header">
              <div className="ag-profile-info">
                <div className="ag-profile-avatar-container">
                  <img src={agCurrentUser.avatar} alt={agCurrentUser.name} className="ag-profile-avatar" />
                  <span className="ag-user-rating">{agCurrentUser.rating}</span>
                </div>
                <div>
                  <h2>{agCurrentUser.name}</h2>
                  <p className="ag-user-profession">{agCurrentUser.profession}</p>
                  <div className="ag-user-meta">
                    <span className="ag-member-since">Membre depuis {agCurrentUser.memberSince}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setAgView('create');
                }}
                className="ag-create-btn"
              >
                <FiPlusCircle /> Nouvelle annonce
              </button>
            </div>

            <div className="ag-posts-container">
              {agFilteredPosts.length > 0 ? (
                agFilteredPosts.map(post => renderPost(post))
              ) : (
                <div className="ag-empty-posts">
                  <div className="ag-empty-icon">
                    <FiEdit2 size={48} />
                  </div>
                  <h3>Vous n'avez pas encore publié d'annonces</h3>
                  <p>Créez votre première annonce pour commencer à trouver des partenaires</p>
                  <button
                    onClick={() => {
                      resetForm();
                      setAgView('create');
                    }}
                    className="ag-create-btn"
                  >
                    <FiPlusCircle /> Créer une annonce
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="ag-browse-view">
            <div className="ag-search-filter-container">
              <div className="ag-search-container">
                <div className="ag-search-bar">
                  <FiSearch className="ag-search-icon" />
                  <input
                    type="text"
                    placeholder="Rechercher des annonces..."
                    className="ag-search-input"
                    value={agSearchTerm}
                    onChange={(e) => setAgSearchTerm(e.target.value)}
                  />
                  {agSearchTerm && (
                    <button
                      className="ag-clear-search"
                      onClick={() => setAgSearchTerm('')}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div className="ag-category-filters">
                <button
                  className={agActiveCategory === 'all' ? 'ag-active' : ''}
                  onClick={() => setAgActiveCategory('all')}
                >
                  Toutes
                </button>
                <button
                  className={agActiveCategory === 'labor' ? 'ag-active' : ''}
                  onClick={() => setAgActiveCategory('labor')}
                >
                  <FaHandsHelping /> Main d'œuvre
                </button>
                <button
                  className={agActiveCategory === 'equipment' ? 'ag-active' : ''}
                  onClick={() => setAgActiveCategory('equipment')}
                >
                  <FaTractor /> Matériel
                </button>
                <button
                  className={agActiveCategory === 'land' ? 'ag-active' : ''}
                  onClick={() => setAgActiveCategory('land')}
                >
                  <FaSeedling /> Terrains
                </button>
                <button
                  className={agActiveCategory === 'services' ? 'ag-active' : ''}
                  onClick={() => setAgActiveCategory('services')}
                >
                  <FaWarehouse /> Services
                </button>
              </div>
            </div>

            <div className="ag-posts-container">
              {agFilteredPosts.length > 0 ? (
                agFilteredPosts.map(post => renderPost(post))
              ) : (
                <div className="ag-no-results">
                  <div className="ag-no-results-icon">
                    <FiSearch size={48} />
                  </div>
                  <h3>Aucune annonce correspondante</h3>
                  <p>Modifiez vos critères de recherche</p>
                  <button
                    onClick={() => {
                      setAgSearchTerm('');
                      setAgActiveCategory('all');
                    }}
                    className="ag-reset-filters-btn"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreatePost;