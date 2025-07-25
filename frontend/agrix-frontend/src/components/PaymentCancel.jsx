import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';
import '../styles/Payment.css';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        const data = await response.json();
        setOrderDetails(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const handleContinue = () => {
    localStorage.removeItem('pendingOrder');
    navigate('/cart');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="payment-cancel-container">
      <FiXCircle className="cancel-icon" size={64} />
      <h2>Payment Cancelled</h2>
      <p>You have cancelled your payment.</p>

      {orderDetails && (
        <div className="order-info">
          <p>Order ID: {orderId}</p>
          <p>Total: ${orderDetails.totalPrice.toFixed(2)}</p>
        </div>
      )}

      <div className="action-buttons">
        <button
          onClick={handleContinue}
          className="return-to-cart"
        >
          Return to Cart
        </button>
        <button
          onClick={() => navigate('/')}
          className="continue-shopping"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;