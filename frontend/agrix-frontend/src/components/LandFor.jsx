import { useState, useEffect } from 'react';
import '../styles/land-form.css';

export default function LandForm({ land, onSubmit, onCancel, darkMode }) {
  const [formData, setFormData] = useState({
    post_id: '',
    title: '',
    description: '',
    area: '',
    price: '',
    location: '',
    contact: '',
    image: ''
  });
  const [availableLands, setAvailableLands] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const isDelete = !land; // Delete mode when no land is provided

  useEffect(() => {
    if (land && !isDelete) {
      setFormData({
        post_id: land.post_id || '',
        title: land.title || land.titre || '',
        description: land.description || '',
        area: land.area || '',
        price: land.price || land.prix || '',
        location: land.location || '',
        contact: land.contact || '',
        image: land.image || ''
      });
    }
    // Fetch lands for delete dropdown
    if (isDelete) {
      const fetchLands = async () => {
        try {
          const response = await fetch('http://localhost:8000/b/');
          if (!response.ok) throw new Error('Failed to fetch lands');
          const data = await response.json();
          setAvailableLands(data.map(item => ({
            post_id: item.post_id,
            titre: item.titre
          })));
        } catch (error) {
          console.error('Error fetching lands:', error);
          setError('Impossible de charger les terrains pour la suppression.');
        }
      };
      fetchLands();
    }
  }, [land, isDelete]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isDelete) {
        // Delete mode
        if (!formData.post_id) {
          throw new Error('Veuillez sélectionner un terrain à supprimer.');
        }
        const response = await fetch(`http://localhost:8000/delete_post/${formData.post_id}/`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log('Suppression réussie:', data);
        onSubmit({ post_id: formData.post_id });
      } else {
        // Update mode
        const response = await fetch(`http://localhost:8000/update_post/${formData.post_id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titre: formData.title,
            description: formData.description,
            area: formData.area,
            prix: Number(formData.price),
            location: formData.location,
            contact: formData.contact,
            image: formData.image
          })
        });
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log('Mise à jour réussie:', data);
        onSubmit({
          post_id: formData.post_id,
          title: formData.title,
          description: formData.description,
          area: formData.area,
          price: Number(formData.price),
          location: formData.location,
          contact: formData.contact,
          image: formData.image
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message || 'Une erreur est survenue. Vérifiez que le serveur Django est en cours d\'exécution.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`land-form-modal ${darkMode ? 'dark-mode' : ''}`}>
      <div className="modal-overlay" onClick={onCancel}></div>
      
      <div className="modal-content">
        <button className="modal-close" onClick={onCancel}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <h2>{isDelete ? 'Supprimer un terrain' : 'Modifier le terrain'}</h2>
        
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isDelete ? (
            <div className="form-group">
              <label>Sélectionner le terrain à supprimer*</label>
              <select
                name="post_id"
                value={formData.post_id}
                onChange={handleChange}
                required
              >
                <option value="">Choisir un terrain</option>
                {availableLands.map(land => (
                  <option key={land.post_id} value={land.post_id}>
                    {land.titre} (ID: {land.post_id})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-grid">
              <div className="form-group">
                <label>ID du terrain</label>
                <input
                  name="post_id"
                  value={formData.post_id}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Titre*</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Titre descriptif du terrain"
                />
              </div>
              <div className="form-group">
                <label>Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Décrivez les caractéristiques du terrain"
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Superficie (ha)*</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 2.5"
                />
              </div>
              <div className="form-group">
                <label>Prix (DZD)*</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="Prix en dinars"
                />
              </div>
              <div className="form-group">
                <label>Localisation*</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Ville, Wilaya"
                />
                <small className="hint">Ex: Alger, Alger</small>
              </div>
              <div className="form-group">
                <label>Contact*</label>
                <input
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  placeholder="Email ou téléphone"
                />
                <small className="hint">Format: email@exemple.com | 0550123456</small>
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className={isDelete ? 'delete-btn' : 'submit-btn'}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Envoi en cours...
                </>
              ) : (
                isDelete ? 'Supprimer le terrain' : 'Mettre à jour'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}