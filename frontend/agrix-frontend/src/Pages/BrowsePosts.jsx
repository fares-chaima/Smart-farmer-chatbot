import React, { useState, useEffect } from 'react';
import { 
  FiSearch, FiMessageSquare, FiUser, 
  FiCalendar, FiDollarSign, FiMapPin, FiAward, FiTool
} from 'react-icons/fi';
import '../styles/BrowsePosts.css';

const BrowsePosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactInfo, setContactInfo] = useState('');

  useEffect(() => {
    // Simuler un chargement d'annonces
    const demoPosts = [
      {
        id: 1,
        postType: 'request',
        category: 'labor',
        title: 'Recherche responsable de culture viticole',
        description: 'Domaine viticole de 50ha recherche responsable de culture expérimenté.',
        location: 'Bordeaux, France',
        startDate: '2023-11-01',
        salary: '€45K annuel',
        experience: 'expert',
        author: 'Domaine Les Vignes',
        date: '2023-09-15',
        contact: 'hr@domaine-les-vignes.fr'
      },
      {
        id: 2,
        postType: 'offer',
        category: 'equipment',
        title: 'Moissonneuse-batteuse à louer',
        description: 'Matériel récent (2021) disponible à la location avec opérateur.',
        location: 'Champagne-Ardenne',
        startDate: '2023-09-20',
        endDate: '2023-10-30',
        salary: '€850/jour',
        equipmentType: 'Moissonneuse-batteuse',
        author: 'AgriLocation Pro',
        date: '2023-09-10',
        contact: 'contact@agrilocation-pro.com'
      }
    ];
    
    setPosts(demoPosts);
    setFilteredPosts(demoPosts);
  }, []);

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

  const handleContact = (contact) => {
    setContactInfo(contact);
    setShowContactModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const renderPostDetails = (post) => {
    switch(post.category) {
      case 'labor':
        return (
          <>
            <div className="detail">
              <FiDollarSign /> <strong>Salaire</strong> {post.salary}
            </div>
            <div className="detail">
              <FiAward /> <strong>Expérience</strong> {post.experience === 'expert' ? 'Expert' : 'Intermédiaire'}
            </div>
          </>
        );
      case 'equipment':
        return (
          <>
            <div className="detail">
              <FiTool /> <strong>Équipement</strong> {post.equipmentType}
            </div>
            <div className="detail">
              <FiDollarSign /> <strong>Tarif</strong> {post.salary}
            </div>
          </>
        );
      case 'land':
        return (
          <>
            <div className="detail">
              <FiMapPin /> <strong>Superficie</strong> {post.area}
            </div>
            <div className="detail">
              <FiDollarSign /> <strong>Prix</strong> {post.salary}
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
              <FiDollarSign /> <strong>Tarif</strong> {post.salary}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="browse-posts-container">
      {showContactModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Coordonnées</h3>
            <p>Email: {contactInfo}</p>
            <div className="modal-actions">
              <button className="primary-btn" onClick={() => setShowContactModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="search-section">
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Rechercher des annonces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-tabs">
          <button 
            className={activeTab === 'all' ? 'active' : ''}
            onClick={() => setActiveTab('all')}
          >
            Toutes
          </button>
          <button 
            className={activeTab === 'offer' ? 'active' : ''}
            onClick={() => setActiveTab('offer')}
          >
            Offres
          </button>
          <button 
            className={activeTab === 'request' ? 'active' : ''}
            onClick={() => setActiveTab('request')}
          >
            Demandes
          </button>
        </div>
      </div>

      <div className="posts-feed">
        {filteredPosts.length === 0 ? (
          <div className="no-results">
            <p>Aucune annonce trouvée</p>
            <button onClick={() => {
              setSearchTerm('');
              setActiveTab('all');
            }}>
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          filteredPosts.map(post => (
            <article key={post.id} className="fb-style-post">
              <div className="post-header">
                <div className="author-info">
                  <div className="author-avatar">
                    <FiUser size={24} />
                  </div>
                  <div>
                    <h3>{post.author}</h3>
                    <div className="post-meta">
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="post-content">
                <h4>{post.title}</h4>
                <p>{post.description}</p>
                
                <div className="post-details">
                  <div className="detail">
                    <FiMapPin /> <strong>Localisation</strong> {post.location}
                  </div>
                  {renderPostDetails(post)}
                  {post.startDate && (
                    <div className="detail">
                      <FiCalendar /> <strong>Disponibilité</strong> {formatDate(post.startDate)} {post.endDate && `- ${formatDate(post.endDate)}`}
                    </div>
                  )}
                </div>
              </div>

              <div className="post-footer">
                <button 
                  className="contact-btn"
                  onClick={() => handleContact(post.contact)}
                >
                  <FiMessageSquare /> Contacter
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowsePosts;