import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import '../styles/Payment.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Aucun ID de commande fourni');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching order with ID:', orderId);
        const response = await fetch(`http://localhost:5008/api/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('Response body:', text);
          throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const data = await response.json();
        console.log('Order data:', data);
        setOrderDetails(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(`Échec du chargement des détails de la commande: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleContinue = () => {
    localStorage.removeItem('pendingOrder');
    navigate('/material');
  };

  if (loading) {
    return <div className="pay-page premium">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="pay-page premium">
        <h2>Erreur</h2>
        <p>{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className="pay-continue-shopping-btn"
        >
          Retour au marché
        </motion.button>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="pay-page premium">
        <h2>Commande non trouvée</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className="pay-continue-shopping-btn"
        >
          Retour au marché
        </motion.button>
      </div>
    );
  }

  return (
    <div className="pay-page premium">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pay-result-container pay-success"
      >
        <div className="pay-result-icon">
          <FiCheckCircle size={64} />
        </div>
        <h2>Paiement réussi !</h2>
        <p className="pay-confirmation-message">
          Merci pour votre achat. Votre commande #{orderId} a été confirmée.
        </p>

        <div className="pay-order-details">
          <h3>Détails de la commande</h3>
          {orderDetails.items && Array.isArray(orderDetails.items) && orderDetails.items.length > 0 ? (
            orderDetails.items.map((item, index) => (
              <div key={index} className="pay-product-card">
                <div className="pay-product-image-container">
                  <img
                    src={item.photo ? `http://localhost:5000${item.photo}` : 'https://via.placeholder.com/150'}
                    alt={item.name}
                    className="pay-product-image"
                  />
                  <div className="pay-quantity-badge">{item.quantity}</div>
                </div>
                <div className="pay-product-info">
                  <h4>{item.name}</h4>
                  <p>Prix: {item.price.toFixed(2)} DA/kg</p>
                  <p>Quantité: {item.quantity} kg</p>
                </div>
              </div>
            ))
          ) : (
            <p>Aucun article trouvé dans la commande.</p>
          )}
          <div className="pay-detail">
            <span>Order ID:</span>
            <span>{orderId}</span>
          </div>
          <div className="pay-detail">
            <span>Total payé:</span>
            <span>{orderDetails.totalPrice.toFixed(2)} DA</span>
          </div>
          <div className="pay-detail">
            <span>Méthode de paiement:</span>
            <span>{orderDetails.paymentMethod === 'creditCard' ? 'Carte de crédit' : 'PayPal'}</span>
          </div>
          <div className="pay-detail">
            <span>Adresse de livraison:</span>
            <span>
              {orderDetails.shippingAddress?.name}, {orderDetails.shippingAddress?.address},{' '}
              {orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.zip},{' '}
              {orderDetails.shippingAddress?.country}
            </span>
          </div>
          <div className="pay-detail">
            <span>Livraison estimée:</span>
            <span>{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="pay-action-buttons">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="pay-continue-shopping-btn"
          >
            Continuer les achats
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;