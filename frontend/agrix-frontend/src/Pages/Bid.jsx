import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../styles/Bid.css';

const API_URL = 'http://localhost:3000';

const Bid = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  const socket = useRef(null);

  // Initial states
  const [bidAmount, setBidAmount] = useState('');
  const [currentPrice, setCurrentPrice] = useState(product?.price || 0); // Use product.price (number)
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [auctionStatus, setAuctionStatus] = useState('active');
  const [userId] = useState(() => {
    const storedId = localStorage.getItem('bidUserId');
    if (storedId) return storedId;
    const newId = 'user-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('bidUserId', newId);
    return newId;
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    socket.current = io(API_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });

    // Join product room
    const productId = product?._id;
    if (!productId) {
      setError('Invalid product ID');
      return;
    }
    socket.current.emit('joinProductRoom', productId);

    // Listen for new bids
    socket.current.on('newBid', (data) => {
      setBids((prevBids) => [
        ...prevBids,
        {
          amount: data.amount,
          createdAt: new Date(data.createdAt),
          buyer: data.buyerId === userId ? 'You' : `Bidder ${data.buyerId.slice(-4)}`,
        },
      ]);
      setCurrentPrice(data.amount);
    });

    // Listen for auction closure
    socket.current.on('auctionClosed', () => {
      setAuctionStatus('closed');
      setTimeLeft(0);
    });

    // Listen for timer updates
    socket.current.on('timerUpdate', (data) => {
      setTimeLeft(data.timeLeft);
      if (data.timeLeft <= 0) {
        setAuctionStatus('closed');
      }
    });

    // Fetch existing bids and auction status
    const fetchBidsAndStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/bids?productId=${productId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bids');
        }

        const data = await response.json();
        setBids(
          data.bids.map((bid) => ({
            amount: bid.amount,
            createdAt: new Date(bid.createdAt),
            buyer: bid.buyerId === userId ? 'You' : `Bidder ${bid.buyerId.slice(-4)}`,
          }))
        );

        if (data.bids.length > 0) {
          setCurrentPrice(Math.max(...data.bids.map((b) => b.amount)));
        }

        setAuctionStatus(data.auctionStatus);
        setTimeLeft(data.timeLeft);
      } catch (error) {
        console.error('Failed to fetch bids:', error);
        setError('Failed to load bid history');
      }
    };

    // Start the auction
    const startAuction = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auctions/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            productId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to start auction:', errorData.error);
        }
      } catch (error) {
        console.error('Error starting auction:', error);
      }
    };

    startAuction();
    fetchBidsAndStatus();

    // Cleanup
    return () => {
      if (socket.current) {
        socket.current.emit('leaveProductRoom', productId);
        socket.current.disconnect();
      }
    };
  }, [product?._id, userId]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const productId = product?._id;
    const numericBidAmount = parseFloat(bidAmount);
    if (isNaN(numericBidAmount) || numericBidAmount <= currentPrice) {
      setError('Your bid must be higher than the current price');
      return;
    }

    if (auctionStatus !== 'active') {
      setError('Auction is closed');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          buyerId: userId,
          amount: numericBidAmount,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.errors) {
          const errorMessages = responseData.errors.map((err) => err.msg).join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(responseData.error || 'Failed to place bid');
      }

      setBidAmount('');
    } catch (error) {
      console.error('Error placing bid:', error);
      setError(error.message);
    }
  };

  if (!product) {
    return (
      <div className="bid-page-container">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/material')}>Back to marketplace</button>
      </div>
    );
  }

  return (
    <div className="bid-page-container">
      <div className="bid-page-header">
        <h1>Bidding for {product.name}</h1>
        <div className="bid-page-status">
          Status:{' '}
          <span className={`bid-page-status-${auctionStatus}`}>
            {auctionStatus === 'active' ? 'Active' : 'Closed'}
          </span>
          <div className="bid-page-timer">Time remaining: {formatTime(timeLeft)}</div>
        </div>
      </div>

      <div className="bid-page-content">
        <div className="bid-page-product">
          <img
            src={product.photo ? `http://localhost:5000${product.photo}` : 'https://via.placeholder.com/150'}
            alt={product.name}
            className="bid-page-product-image"
          />
          <div className="bid-page-product-info">
            <h2>{product.name}</h2>
            <p className="bid-page-product-description">Fresh product directly from {product.seller}</p>
            <div className="bid-page-current-price">
              Current price: <span>{currentPrice.toFixed(2)} DA</span>
            </div>
          </div>
        </div>

        <div className="bid-page-main">
          {auctionStatus === 'active' ? (
            <form onSubmit={handleBidSubmit} className="bid-page-form">
              {error && <div className="bid-page-error">{error}</div>}
              <div className="bid-page-form-group">
                <label htmlFor="bidAmount">Your bid (DA)</label>
                <input
                  type="number"
                  id="bidAmount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={(currentPrice + 0.01).toFixed(2)}
                  step="0.01"
                  required
                />
                <small>Must be higher than {currentPrice.toFixed(2)} DA</small>
              </div>
              <button type="submit" className="bid-page-submit">
                Submit bid
              </button>
            </form>
          ) : (
            <div className="bid-page-closed">
              <h3>Auction is closed</h3>
              {bids.length > 0 ? (
                <p>The winning bid is {Math.max(...bids.map((b) => b.amount)).toFixed(2)} DA</p>
              ) : (
                <p>No bids were placed</p>
              )}
            </div>
          )}

          <div className="bid-page-history">
            <h3>Bid history</h3>
            {error && <div className="bid-page-error">{error}</div>}
            {bids.length > 0 ? (
              <ul className="bid-page-history-list">
                {bids
                  .sort((a, b) => b.amount - a.amount)
                  .map((bid, index) => (
                    <li key={index} className="bid-page-history-item">
                      <span className="bid-page-amount">{bid.amount.toFixed(2)} DA</span>
                      <span className="bid-page-time">
                        {bid.createdAt.toLocaleTimeString()} - {bid.buyer}
                      </span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No bids yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bid;