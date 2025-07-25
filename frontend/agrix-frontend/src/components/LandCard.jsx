import '../styles/land-card.css';

export default function LandCard({ land, onEdit, onDelete, onContact, showActions }) {
    return (
      <div className="land-card">
        
        <div className="land-content">
          <h3>{land.title}</h3>
          <p className="location">📍 {land.location}</p>
          <p className="description">{land.description}</p>
          <div className="land-details">
            <span>Area: {land.area}</span>
            <span>Price: {land.price.toLocaleString()} DZD</span>
          </div>
          {showActions && (
            <div className="land-actions">
              <button className="edit-btn" onClick={() => onEdit(land)}>
                <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit
              </button>
              <button className="contact-btn" onClick={() => onContact(land.contact)}>
                <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Contact
              </button>
              <button className="delete-btn" onClick={() => onDelete(land.id)}>
                <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
}