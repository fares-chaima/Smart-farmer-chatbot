import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import '../styles/Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState('details');
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    saveInfo: false,
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [processing, setProcessing] = useState(false);

  const product = location.state?.product || {
    _id: 'prod_123',
    name: 'Sample Product',
    price: 299.99,
    photo: '',
    seller: 'Default Seller',
  };

  useEffect(() => {
    console.log('Product received:', product);
    if (location.pathname === '/payment/success') {
      setStep('success');
    } else if (location.pathname === '/payment/failed') {
      setStep('failed');
      setErrors({ payment: 'Paiement annulé ou échoué' });
    }
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateShippingForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nom complet requis';
    if (!formData.email.trim()) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.address.trim()) newErrors.address = 'Adresse requise';
    if (!formData.city.trim()) newErrors.city = 'Ville requise';
    if (!formData.zip.trim()) newErrors.zip = 'Code postal requis';
    if (!formData.country) newErrors.country = 'Veuillez sélectionner un pays';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = () => {
    const newErrors = {};
    if (paymentMethod === 'creditCard') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Numéro de carte requis';
      else if (!/^\d{16}$/.test(formData.cardNumber.trim())) newErrors.cardNumber = 'Numéro de carte invalide';
      if (!formData.cardName.trim()) newErrors.cardName = 'Nom requis';
      if (!formData.expiry.trim()) newErrors.expiry = 'Date d\'expiration requise';
      else if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) newErrors.expiry = 'Format MM/AA requis';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV requis';
      else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'CVV invalide';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayNow = async () => {
    if (!validatePaymentForm()) return;

    setProcessing(true);
    setStep('processing');

    const orderData = {
      items: [{
        _id: product._id,
        name: product.name,
        quantity,
        price: product.price,
        photo: product.photo,
      }],
      shippingAddress: {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        country: formData.country,
      },
      paymentMethod,
      itemsPrice: parseFloat(total),
      taxPrice: parseFloat(tax),
      shippingPrice: shipping,
      totalPrice: parseFloat(grandTotal),
    };

    console.log('Sending orderData:', JSON.stringify(orderData, null, 2));

    try {
      const response = await fetch('http://localhost:5008/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderData }),
      });

      const data = await response.json();
      console.log('Backend response:', data);

      if (data.success) {
        if (data.paymentMethod === 'paypal') {
          window.location.href = data.approvalUrl;
        } else {
          setStep('success');
        }
      } else {
        setStep('failed');
        setErrors({ payment: data.error || 'Paiement échoué' });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setStep('failed');
      setErrors({ payment: 'Erreur réseau. Veuillez réessayer.' });
    } finally {
      setProcessing(false);
    }
  };

  const handleShippingContinue = () => {
    if (validateShippingForm()) {
      setStep('payment');
    }
  };

  const price = product.price;
  const total = (price * quantity).toFixed(2);
  const shipping = 5.99;
  const tax = (price * quantity * 0.1).toFixed(2);
  const grandTotal = (parseFloat(total) + shipping + parseFloat(tax)).toFixed(2);

  const progressPercentage = {
    details: 25,
    shipping: 50,
    payment: 75,
    processing: 90,
    success: 100,
    failed: 100,
  }[step];

  return (
    <div className="pay-page premium">
      <div className="pay-header">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (step === 'details' ? navigate('/material') : setStep('details'))}
          className="pay-back-btn"
        >
          <FiArrowLeft /> {step === 'details' ? 'Retour au marché' : 'Retour'}
        </motion.button>
        <div className="pay-progress-bar">
          <div className="pay-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      {step === 'details' && (
        <motion.div
          key="details"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="pay-step-container"
        >
          <h2>Résumé de la commande</h2>
          <div className="pay-product-card">
            <div className="pay-product-image-container">
              <img
                src={product.photo ? `http://localhost:5000${product.photo}` : 'https://via.placeholder.com/150'}
                alt={product.name}
              />
              <div className="pay-quantity-badge">{quantity}</div>
            </div>
            <div className="pay-product-info">
              <h3>{product.name}</h3>
              <p className="pay-product-description">Produit frais de {product.seller}</p>
              <div className="pay-price-section">
                <span className="pay-price">{price.toFixed(2)} DA/kg</span>
                <div className="pay-quantity-controls">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <button onClick={() => setQuantity((q) => q + 1)}>+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="pay-summary-card">
            <h3>Résumé de la commande</h3>
            <div className="pay-summary-row">
              <span>Sous-total</span>
              <span>{total} DA</span>
            </div>
            <div className="pay-summary-row">
              <span>Livraison</span>
              <span>{shipping.toFixed(2)} DA</span>
            </div>
            <div className="pay-summary-row">
              <span>Taxe</span>
              <span>{tax} DA</span>
            </div>
            <div className="pay-summary-row pay-grand-total">
              <span>Total</span>
              <span>{grandTotal} DA</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep('shipping')}
            className="pay-continue-btn"
          >
            Continuer vers l'expédition
          </motion.button>
        </motion.div>
      )}

      {step === 'shipping' && (
        <motion.div
          key="shipping"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="pay-step-container"
        >
          <h2>Informations d'expédition</h2>
          <div className="pay-form-grid">
            <div className="pay-form-group">
              <label>Nom complet</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
              {errors.name && <span className="pay-error">{errors.name}</span>}
            </div>
            <div className="pay-form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
              />
              {errors.email && <span className="pay-error">{errors.email}</span>}
            </div>
            <div className="pay-form-group pay-full-width">
              <label>Adresse</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St"
              />
              {errors.address && <span className="pay-error">{errors.address}</span>}
            </div>
            <div className="pay-form-group">
              <label>Ville</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Alger"
              />
              {errors.city && <span className="pay-error">{errors.city}</span>}
            </div>
            <div className="pay-form-group">
              <label>Code postal</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="16000"
              />
              {errors.zip && <span className="pay-error">{errors.zip}</span>}
            </div>
            <div className="pay-form-group">
              <label>Pays</label>
              <select name="country" value={formData.country} onChange={handleChange}>
                <option value="">Sélectionner un pays</option>
                <option value="DZ">Algérie</option>
                <option value="US">États-Unis</option>
                <option value="UK">Royaume-Uni</option>
                <option value="CA">Canada</option>
              </select>
              {errors.country && <span className="pay-error">{errors.country}</span>}
            </div>
          </div>

          <div className="pay-form-actions">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep('details')}
              className="pay-back-btn"
            >
              Retour
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShippingContinue}
              className="pay-continue-btn"
            >
              Continuer vers le paiement
            </motion.button>
          </div>
        </motion.div>
      )}

      {step === 'payment' && (
        <motion.div
          key="payment"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="pay-step-container"
        >
          <h2>Méthode de paiement</h2>
          <div className="pay-payment-methods">
            <div className="pay-method-tabs">
              <button
                className={paymentMethod === 'creditCard' ? 'pay-active' : ''}
                onClick={() => setPaymentMethod('creditCard')}
              >
                Carte de crédit
              </button>
              <button
                className={paymentMethod === 'paypal' ? 'pay-active' : ''}
                onClick={() => setPaymentMethod('paypal')}
              >
                PayPal
              </button>
            </div>

            {paymentMethod === 'creditCard' && (
              <div className="pay-credit-card-form">
                <div className="pay-form-group">
                  <label>Numéro de carte</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && <span className="pay-error">{errors.cardNumber}</span>}
                </div>
                <div className="pay-form-group">
                  <label>Nom sur la carte</label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                  {errors.cardName && <span className="pay-error">{errors.cardName}</span>}
                </div>
                <div className="pay-form-grid pay-half-width">
                  <div className="pay-form-group">
                    <label>Date d'expiration</label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      placeholder="MM/AA"
                    />
                    {errors.expiry && <span className="pay-error">{errors.expiry}</span>}
                  </div>
                  <div className="pay-form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                    />
                    {errors.cvv && <span className="pay-error">{errors.cvv}</span>}
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="pay-paypal-form">
                <p>Vous serez redirigé vers PayPal pour compléter votre paiement.</p>
                <p>Montant total : {grandTotal} DA</p>
              </div>
            )}
          </div>

          <div className="pay-order-summary">
            <h3>Résumé de la commande</h3>
            <div className="pay-summary-row">
              <span>Sous-total</span>
              <span>{total} DA</span>
            </div>
            <div className="pay-summary-row">
              <span>Livraison</span>
              <span>{shipping.toFixed(2)} DA</span>
            </div>
            <div className="pay-summary-row">
              <span>Taxe</span>
              <span>{tax} DA</span>
            </div>
            <div className="pay-summary-row pay-grand-total">
              <span>Total</span>
              <span>{grandTotal} DA</span>
            </div>
          </div>

          <div className="pay-form-actions">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep('shipping')}
              className="pay-back-btn"
            >
              Retour
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayNow}
              disabled={processing}
              className="pay-now-btn"
            >
              {processing ? 'Traitement...' : `Payer maintenant ${grandTotal} DA`}
            </motion.button>
          </div>
        </motion.div>
      )}

      {step === 'processing' && (
        <motion.div
          key="processing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pay-processing-container"
        >
          <div className="pay-processing-animation">
            <div className="pay-circle-loader"></div>
          </div>
          <h2>Traitement de votre paiement</h2>
          <p>Veuillez patienter pendant que nous traitons votre transaction</p>
          <div className="pay-processing-details">
            <div className="pay-detail">
              <span>Montant :</span>
              <span>{grandTotal} DA</span>
            </div>
            <div className="pay-detail">
              <span>Méthode de paiement :</span>
              <span>{paymentMethod === 'creditCard' ? 'Carte de crédit' : 'PayPal'}</span>
            </div>
          </div>
        </motion.div>
      )}

      {step === 'success' && (
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pay-result-container pay-success"
        >
          <div className="pay-result-icon">
            <FiCheckCircle />
          </div>
          <h2>Paiement réussi !</h2>
          <p className="pay-confirmation-message">
            Merci pour votre achat. Votre commande a été confirmée.
          </p>
          <div className="pay-order-details">
            <h3>Détails de la commande</h3>
            <div className="pay-detail">
              <span>Produit :</span>
              <span>{product.name}</span>
            </div>
            <div className="pay-detail">
              <span>Quantité :</span>
              <span>{quantity} kg</span>
            </div>
            <div className="pay-detail">
              <span>Total payé :</span>
              <span>{grandTotal} DA</span>
            </div>
            <div className="pay-detail">
              <span>Méthode de paiement :</span>
              <span>{paymentMethod === 'creditCard' ? 'Carte de crédit' : 'PayPal'}</span>
            </div>
            <div className="pay-detail">
              <span>Livraison estimée :</span>
              <span>{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="pay-shipping-info">
            <h3>Expédition à</h3>
            <p>{formData.name}</p>
            <p>{formData.address}</p>
            <p>{formData.city}, {formData.zip}</p>
            <p>{formData.country}</p>
          </div>
          <div className="pay-action-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/material')}
              className="pay-continue-shopping-btn"
            >
              Continuer les achats
            </motion.button>
          </div>
        </motion.div>
      )}

      {step === 'failed' && (
        <motion.div
          key="failed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pay-result-container pay-failed"
        >
          <div className="pay-result-icon">
            <FiXCircle />
          </div>
          <h2>Échec du paiement</h2>
          <p className="pay-error-message">
            {errors.payment || 'Nous n\'avons pas pu traiter votre paiement. Veuillez réessayer.'}
          </p>
          <div className="pay-action-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep('payment')}
              className="pay-try-again-btn"
            >
              Réessayer
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Payment;