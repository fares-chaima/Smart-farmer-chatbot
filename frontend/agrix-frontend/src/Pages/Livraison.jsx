import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Livraison.css';

// Initialize Socket.io client
const socket = io('http://localhost:3002', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Delivery page banner component
const LivraisonBanner = () => {
  return (
    <div className="livraison-banner">
      <div className="banner-content">
        <h1>Agricultural Transport & Delivery</h1>
      </div>
    </div>
  );
};

// Component to update map view when position changes
const MapViewUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

// Component to get user's current location
const LocationMarker = ({ onLocationFound }) => {
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });

    map.on('locationfound', (e) => {
      onLocationFound(e.latlng);
    });

    map.on('locationerror', (e) => {
      console.log('Location error:', e.message);
      // Fallback to default Algiers position
      onLocationFound({ lat: 36.7525, lng: 3.0420 });
    });

    return () => {
      map.off('locationfound');
      map.off('locationerror');
    };
  }, [map, onLocationFound]);

  return null;
};

// Custom icons for Leaflet
const customIcons = {
  delivery: new L.Icon({
    iconUrl: '../assets/icons/delivery-truck.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  user: new L.Icon({
    iconUrl: '../assets/icons/user-location.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
};

// Vehicle types specific to agriculture
const VEHICLE_TYPES = [
  { value: 'Refrigerated Truck', label: 'Refrigerated Truck' },
  { value: 'Insulated Van', label: 'Insulated Van' },
  { value: 'Flatbed Truck', label: 'Flatbed Truck' },
  { value: 'Tanker Truck', label: 'Tanker Truck' },
  { value: 'Tractor with Trailer', label: 'Tractor with Trailer' },
  { value: 'Covered Pickup', label: 'Covered Pickup' },
];

// Agricultural product types
const PRODUCT_TYPES = [
  { value: 'Fruits and Vegetables', label: 'Fruits and Vegetables' },
  { value: 'Cereals', label: 'Cereals' },
  { value: 'Dairy Products', label: 'Dairy Products' },
  { value: 'Livestock', label: 'Livestock' },
  { value: 'Farming Equipment', label: 'Farming Equipment' },
  { value: 'Fertilizers and Seeds', label: 'Fertilizers and Seeds' },
];

const Livraison = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [drivers, setDrivers] = useState([]);
  const [posts, setPosts] = useState([]); // New state for posts
  const [filteredItems, setFilteredItems] = useState([]); // Combined drivers and posts
  const [selectedItem, setSelectedItem] = useState(null); // Selected driver or post
  const [userPosition, setUserPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([36.7525, 3.0420]); // Algiers by default
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [route, setRoute] = useState(null);
  const [estimatedArrival, setEstimatedArrival] = useState(null);
  const [deliveryPost, setDeliveryPost] = useState({
    vehicle: '',
    capacity: '',
    availability: '',
    price: '',
    area: '',
    productTypes: [],
    refrigeration: false,
    description: '',
    photoVehicle: null,
  });

  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const userId = 'user123'; // Placeholder user ID (replace with actual user ID in production)

  // Fetch drivers and posts from backend
  const fetchData = useCallback(async () => {
    try {
      // Fetch drivers
      const driverResponse = await axios.get('http://localhost:3002/api/drivers');
      const formattedDrivers = driverResponse.data.map((driver) => ({
        type: 'driver',
        id: driver._id,
        name: driver.name,
        rating: driver.rating,
        vehicle: driver.vehicle,
        availability: driver.availability,
        position: [driver.position.lat, driver.position.lng],
        price: driver.price,
        reviews: driver.reviews,
        area: driver.area,
        deliveries: driver.deliveries,
        photo: driver.photo || '/assets/default-profile.jpg',
      }));
      setDrivers(formattedDrivers);

      // Fetch posts
      const postResponse = await axios.get('http://localhost:3002/api/posts');
      const formattedPosts = postResponse.data.map((post) => ({
        type: 'post',
        id: post._id,
        name: 'Transport Offer', // Generic name for posts
        rating: null, // Posts don't have ratings
        vehicle: post.vehicle,
        availability: post.availability,
        position: [36.7525, 3.0420], // Default position (update if posts have location)
        price: `${post.price} DZD`,
        reviews: null, // Posts don't have reviews
        area: post.area,
        deliveries: null, // Posts don't have deliveries
        photo: post.photoVehicle || '/assets/default-vehicle.jpg',
        productTypes: post.productTypes,
        refrigeration: post.refrigeration,
        capacity: post.capacity,
        description: post.description,
      }));
      setPosts(formattedPosts);

      // Combine drivers and posts
      const combinedItems = [...formattedDrivers, ...formattedPosts];
      setFilteredItems(combinedItems);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter drivers and posts based on search term
  const filterItems = useCallback(() => {
    const filtered = [...drivers, ...posts].filter(
      (item) =>
        item.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [drivers, posts, searchTerm]);

  useEffect(() => {
    filterItems();
  }, [searchTerm, filterItems]);

  // Auto-scroll to bottom in chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle user location
  const handleLocationFound = (position) => {
    const { lat, lng } = position;
    setUserPosition([lat, lng]);
    setMapCenter([lat, lng]);
  };

  // Fetch route and estimated arrival time from backend
  useEffect(() => {
    if (selectedItem && selectedItem.type === 'driver' && userPosition) {
      const fetchRoute = async () => {
        try {
          const response = await axios.post('http://localhost:3002/api/tracking', {
            driverId: selectedItem.id,
            userId: userId,
            startLat: selectedItem.position[0],
            startLng: selectedItem.position[1],
            endLat: userPosition[0],
            endLng: userPosition[1],
          });
          // Convert routePoints to Leaflet format
          const routePoints = response.data.routePoints.map((point) => [point.lat, point.lng]);
          setRoute(routePoints);
          setEstimatedArrival(response.data.estimatedArrival);
        } catch (error) {
          console.error('Error fetching route:', error);
        }
      };
      fetchRoute();
    }
  }, [selectedItem, userPosition]);

  // Handle real-time messaging with Socket.io
  useEffect(() => {
    if (selectedItem && selectedItem.type === 'driver') {
      // Join chat room
      socket.emit('joinRoom', { userId, driverId: selectedItem.id });

      // Fetch previous messages
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3002/api/messages/${userId}/${selectedItem.id}`
          );
          // Map backend messages to frontend format
          const formattedMessages = response.data.map((msg) => ({
            sender: msg.senderId === userId ? 'Me' : selectedItem.name,
            text: msg.text,
            time: new Date(msg.time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
          setMessages(formattedMessages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();

      // Listen for new messages
      socket.on('newMessage', (message) => {
        const formattedMessage = {
          sender: message.senderId === userId ? 'Me' : selectedItem.name,
          text: message.text,
          time: new Date(message.time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...prev, formattedMessage]);
      });

      // Cleanup
      return () => {
        socket.off('newMessage');
      };
    }
  }, [selectedItem]);

  // Handle delivery post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare delivery post data (excluding photoVehicle file)
      const postData = {
        vehicle: deliveryPost.vehicle,
        capacity: parseInt(deliveryPost.capacity),
        availability: deliveryPost.availability,
        price: parseInt(deliveryPost.price),
        area: deliveryPost.area,
        productTypes: deliveryPost.productTypes,
        refrigeration: deliveryPost.refrigeration,
        description: deliveryPost.description,
        photoVehicle: deliveryPost.photoVehicle, // URL from upload
      };

      // Post to backend
      await axios.post('http://localhost:3002/api/posts', postData);
      alert('Your agricultural delivery offer has been successfully posted!');
      // Refresh posts after submission
      await fetchData();
      setDeliveryPost({
        vehicle: '',
        capacity: '',
        availability: '',
        price: '',
        area: '',
        productTypes: [],
        refrigeration: false,
        description: '',
        photoVehicle: null,
      });
    } catch (error) {
      console.error('Error posting offer:', error);
      alert('Failed to post offer');
    }
  };

  // Handle vehicle photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('photoVehicle', file);
      try {
        const response = await axios.post('http://localhost:3002/api/posts/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setDeliveryPost({ ...deliveryPost, photoVehicle: response.data.filePath });
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo');
      }
    }
  };

  // Handle message submission
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedItem && selectedItem.type === 'driver') {
      const message = {
        senderId: userId,
        receiverId: selectedItem.id,
        text: newMessage,
      };
      try {
        // Send message via Socket.io
        socket.emit('sendMessage', message);
        // Update local messages
        setMessages((prev) => [
          ...prev,
          {
            sender: 'Me',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setMapCenter(item.position);
  };

  const handleProductTypeChange = (e) => {
    const value = e.target.value;
    let updatedProductTypes;

    if (deliveryPost.productTypes.includes(value)) {
      updatedProductTypes = deliveryPost.productTypes.filter((type) => type !== value);
    } else {
      updatedProductTypes = [...deliveryPost.productTypes, value];
    }

    setDeliveryPost({ ...deliveryPost, productTypes: updatedProductTypes });
  };

  return (
    <div className="livraison-page">
      <Navbar />
      <LivraisonBanner />

      <div className="livraison-container">
        <div className="livraison-tabs">
          <button
            className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Find Agricultural Transporter
          </button>
          <button
            className={`tab-button ${activeTab === 'post' ? 'active' : ''}`}
            onClick={() => setActiveTab('post')}
          >
            Offer Transport Service
          </button>
          <button
            className={`tab-button ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
            disabled={!selectedItem || selectedItem.type !== 'driver'}
          >
            Track Delivery
          </button>
        </div>

        {activeTab === 'search' && (
          <div className="livraison-content">
            <div className="livreurs-list">
              <h2 className="section-title">Available Agricultural Transporters</h2>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search by area or vehicle type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-button" onClick={filterItems}>
                  Search
                </button>
              </div>

              <div className="filter-options">
                <select
                  className="filter-select"
                  onChange={(e) => setSearchTerm(e.target.value)}
                >
                  <option value="">Vehicle Type</option>
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="livreurs-container">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`livreur-card ${selectedItem?.id === item.id ? 'selected' : ''}`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className="livreur-header">
                        <div className="livreur-photo">
                          <img src={item.photo} alt={item.name} />
                        </div>
                        <div className="livreur-info">
                          <h3>{item.name}</h3>
                          {item.type === 'driver' && (
                            <span className="rating">
                              ★ {item.rating}{' '}
                              <span className="reviews-count">({item.reviews})</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="livreur-details">
                        <p>
                          <strong>Vehicle:</strong> {item.vehicle}
                        </p>
                        <p>
                          <strong>Area:</strong> {item.area}
                        </p>
                        <p>
                          <strong>Availability:</strong> {item.availability}
                        </p>
                        <p>
                          <strong>Price:</strong> {item.price}
                        </p>
                        {item.type === 'post' && (
                          <>
                            <p>
                              <strong>Capacity:</strong> {item.capacity} kg
                            </p>
                            <p>
                              <strong>Product Types:</strong>{' '}
                              {item.productTypes.join(', ')}
                            </p>
                            <p>
                              <strong>Refrigeration:</strong>{' '}
                              {item.refrigeration ? 'Yes' : 'No'}
                            </p>
                            {item.description && (
                              <p>
                                <strong>Description:</strong> {item.description}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      {item.type === 'driver' && (
                        <button
                          className="contact-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setActiveTab('track');
                          }}
                        >
                          Contact
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-results">No agricultural transporters or offers found</div>
                )}
              </div>
            </div>

            <div className="livraison-map">
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="map-container"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {filteredItems.map((item) => (
                  <Marker
                    key={item.id}
                    position={item.position}
                    icon={customIcons.delivery}
                    eventHandlers={{
                      click: () => handleSelectItem(item),
                    }}
                  >
                    <Popup>
                      <div className="popup-content">
                        <h3>{item.name}</h3>
                        <p>{item.vehicle}</p>
                        <p>{item.availability}</p>
                        {item.type === 'driver' && (
                          <button
                            className="popup-contact-button"
                            onClick={() => {
                              setSelectedItem(item);
                              setActiveTab('track');
                            }}
                          >
                            Contact
                          </button>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {userPosition && (
                  <Marker position={userPosition} icon={customIcons.user}>
                    <Popup>Your current location</Popup>
                  </Marker>
                )}

                {route && (
                  <Polyline
                    positions={route}
                    color="#0b3018"
                    weight={4}
                    dashArray="5, 5"
                  />
                )}

                <LocationMarker onLocationFound={handleLocationFound} />
                <MapViewUpdater center={mapCenter} />
              </MapContainer>
            </div>
          </div>
        )}

        {activeTab === 'post' && (
          <div className="poster-offre">
            <h2 className="section-title">Offer Agricultural Transport Service</h2>
            <form onSubmit={handlePostSubmit} className="delivery-form">
              <div className="form-section">
                <h3>Vehicle Information</h3>

                <div className="form-group">
                  <label>Vehicle Type *</label>
                  <select
                    value={deliveryPost.vehicle}
                    onChange={(e) =>
                      setDeliveryPost({ ...deliveryPost, vehicle: e.target.value })
                    }
                    required
                  >
                    <option value="">Select vehicle type</option>
                    {VEHICLE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Capacity (kg) *</label>
                    <input
                      type="number"
                      value={deliveryPost.capacity}
                      onChange={(e) =>
                        setDeliveryPost({ ...deliveryPost, capacity: e.target.value })
                      }
                      required
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Price (DZD) *</label>
                    <input
                      type="number"
                      value={deliveryPost.price}
                      onChange={(e) =>
                        setDeliveryPost({ ...deliveryPost, price: e.target.value })
                      }
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Availability *</label>
                  <input
                    type="text"
                    value={deliveryPost.availability}
                    onChange={(e) =>
                      setDeliveryPost({ ...deliveryPost, availability: e.target.value })
                    }
                    placeholder="Ex: Available now, Available tomorrow..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Coverage Area *</label>
                  <input
                    type="text"
                    value={deliveryPost.area}
                    onChange={(e) =>
                      setDeliveryPost({ ...deliveryPost, area: e.target.value })
                    }
                    placeholder="Ex: Algiers, Oran, Blida..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Vehicle Photo</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="vehicle-photo"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                    <label htmlFor="vehicle-photo">
                      {deliveryPost.photoVehicle
                        ? typeof deliveryPost.photoVehicle === 'string'
                          ? deliveryPost.photoVehicle
                          : deliveryPost.photoVehicle.name
                        : 'Choose a photo'}
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Agricultural Specifications</h3>

                <div className="form-group">
                  <label>Product Types *</label>
                  <div className="checkbox-group">
                    {PRODUCT_TYPES.map((type) => (
                      <div key={type.value} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`produit-${type.value}`}
                          value={type.value}
                          checked={deliveryPost.productTypes.includes(type.value)}
                          onChange={handleProductTypeChange}
                        />
                        <label htmlFor={`produit-${type.value}`}>{type.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="refrigeration"
                      checked={deliveryPost.refrigeration}
                      onChange={(e) =>
                        setDeliveryPost({ ...deliveryPost, refrigeration: e.target.checked })
                      }
                    />
                    <label htmlFor="refrigeration">Vehicle equipped with refrigeration</label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Additional Description</label>
                  <textarea
                    value={deliveryPost.description}
                    onChange={(e) =>
                      setDeliveryPost({ ...deliveryPost, description: e.target.value })
                    }
                    placeholder="Describe your service, transport conditions, etc."
                    rows="4"
                  />
                </div>
              </div>

              <button type="submit" className="submit-button">
                Publish Transport Offer
              </button>
            </form>
          </div>
        )}

        {activeTab === 'track' && selectedItem && selectedItem.type === 'driver' && (
          <div className="suivi-livraison">
            <div className="suivi-header">
              <div className="livreur-profile">
                <img src={selectedItem.photo} alt={selectedItem.name} />
                <div>
                  <h2 className="section-title">Tracking with {selectedItem.name}</h2>
                  <div className="livreur-info">
                    <p>
                      <strong>Vehicle:</strong> {selectedItem.vehicle}
                    </p>
                    <p>
                      <strong>Contact:</strong> +213 XXX XXX XXX
                    </p>
                    <p>
                      <strong>Status:</strong> On the way to you
                    </p>
                    {estimatedArrival && (
                      <p className="arrival-time">
                        <strong>Estimated Time:</strong> {estimatedArrival} minutes
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="suivi-content">
              <div className="suivi-map-container">
                <div className="suivi-map">
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    <Marker position={selectedItem.position} icon={customIcons.delivery}>
                      <Popup>
                        {selectedItem.name} - {selectedItem.vehicle}
                      </Popup>
                    </Marker>

                    {userPosition && (
                      <Marker position={userPosition} icon={customIcons.user}>
                        <Popup>Your location</Popup>
                      </Marker>
                    )}

                    {route && (
                      <Polyline
                        positions={route}
                        color="#0b3018"
                        weight={4}
                        dashArray="5, 5"
                      />
                    )}

                    <MapViewUpdater center={mapCenter} />
                  </MapContainer>
                </div>
              </div>

              <div className="chat-container">
                <div className="chat-messages" ref={chatContainerRef}>
                  {messages.length > 0 ? (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`message ${msg.sender === 'Me' ? 'sent' : 'received'}`}
                      >
                        {msg.sender !== 'Me' && (
                          <div className="message-sender">{msg.sender}</div>
                        )}
                        <p>{msg.text}</p>
                        <span className="message-time">{msg.time}</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-messages">No messages exchanged</p>
                  )}
                </div>
                <form onSubmit={handleMessageSubmit} className="chat-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <button type="submit" className="send-button">
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Livraison;