import React from 'react';
import '../styles/Dashboard.css';
import NavBbar from '../components/NavBbar';
import { useEffect, useState } from 'react';

import axios from 'axios';
export default function Dashboard() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="agri-dashboard-container">
      <NavBbar />
      <header className="agri-dashboard-header">
        <div className="agri-header-content">
          <div className="agri-header-left">
            <h1>AgriX</h1>
            <p>Smart Farming Platform</p>
          </div>
          <div className="agri-header-right">
            <div className="agri-date-display">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 9.08997H20.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.6947 13.7H15.7037" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.6947 16.7H15.7037" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9955 13.7H12.0045" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9955 16.7H12.0045" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.29431 13.7H8.30329" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.29431 16.7H8.30329" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{formattedDate}</span>
            </div>
            <div className="agri-real-time-indicator">
              <span className="agri-pulse-dot"></span>
              Live Data
            </div>
          </div>
        </div>
      </header>

      <main className="agri-dashboard-main">
        <AlertBanner />
        <div className="agri-dashboard-grid">
          <div className="agri-grid-section agri-full-width">
            <CropRecommendations />
          </div>
          <div className="agri-grid-section agri-full-width">
            <WeatherForecast />
          </div>
          <div className="agri-grid-section agri-full-width">
            <IoTSensors />
          </div>
          <div className="agri-grid-section agri-large">
            <AgriculturalStats />
          </div>
          <div className="agri-grid-section agri-large">
            <YieldChart />
          </div>
          <div className="agri-grid-section agri-large">
            <CircularStats />
          </div>
          <div className="agri-grid-section agri-large">
            <MarketTrends />
          </div>
          <div className="agri-grid-section agri-full-width">
            <RevenuePrediction />
          </div>
        </div>
      </main>
    </div>
  );
}

function AlertBanner() {
  const [conseils, setConseils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8002/agriculture/advice/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(async res => {
      const text = await res.text();
      if (!res.ok) {
        throw new Error(`Erreur serveur: ${res.status} - ${text}`);
      }
      const data = JSON.parse(text);
      console.log("Données reçues:", data);
      setConseils(data.conseils || []);
    })
    .catch(err => {
      console.error("Erreur lors de la récupération des conseils:", err.message);
      setError("Impossible de charger les conseils.");
    })
    .finally(() => setLoading(false));
  }, []);

  return (
    <div className="agri-alert-banner">
    
      <div className="agri-alert-content">
        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : conseils.length > 0 ? (
          conseils.map(conseil => (
            <div key={conseil.id} className={`agri-alert-card agri-alert-${conseil.type}`}>
              <div className="agri-alert-icon">{conseil.icon}</div>
              <div className="agri-alert-text">
                <h3>{conseil.title_en}</h3>
                <p>{conseil.subtitle_en}</p>
              </div>
              <button className="agri-alert-action">{conseil.action} →</button>
            </div>
          ))
        ) : (
          <p>Aucun conseil disponible pour le moment.</p>
        )}
      </div>
    </div>
  );
}
function CropRecommendations() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8002/get_agriculture_recommendations/") // adapter l'URL selon ta config Django
      .then((res) => {
        if (!res.ok) throw new Error("Erreur API");
        return res.json();
      })
      .then((data) => {
        setCrops(data.recommended_crops);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="agri-crop-recommendations">
      <div className="agri-section-header">
        <div className="agri-section-title">
          {/* Ton SVG ici */}
          <h2>Crop Recommendations</h2>
        </div>
        <div className="agri-section-actions">
          <button className="agri-filter-button">Filter</button>
          <button className="agri-view-all-button">View All</button>
        </div>
      </div>
      <div className="agri-section-content">
        <div className="agri-crop-grid">
          {crops.map((crop, index) => (
            <div key={index} className="agri-crop-card">
              <div className="agri-crop-image"></div>
              <div className="agri-crop-details">
                <div>
                  <h3>{crop.name}</h3>
                  <p>{crop.detail}</p>
                </div>
                <div className="agri-crop-badges">
                  {crop.badges.map((badge, i) => (
                    <span key={i} className={`agri-badge agri-badge-${badge.type}`}>
                      {badge.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function generateAgriculturalImpact(forecasts) {
  let rainDays = forecasts.filter(f => parseFloat(f.rain) > 2).length;
  let sunnyDays = forecasts.filter(f => f.icon === '☀️').length;
  let avgTemp = forecasts.reduce((sum, f) => sum + parseFloat(f.temp), 0) / forecasts.length;

  let message = "Agricultural Impact: ";

  if (rainDays >= 2) {
    message += "Significant rainfall is expected, which is beneficial for natural irrigation. ";
  } else {
    message += "Low rainfall expected, consider manual irrigation. ";
  }

  if (sunnyDays >= 3) {
    message += "Sunny days will support crop photosynthesis. ";
  }

  if (avgTemp > 20) {
    message += "Warm temperatures will promote rapid germination.";
  } else {
    message += "Moderate temperatures are ideal for spring sowing.";
  }

  return message;
}


function WeatherForecast() {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8002/get_weather_forecast/')  // Remplace par l'URL réelle vers ta fonction Django
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          // Transforme les données API en format pour l'affichage
          const mappedForecasts = data.forecast.map((day, index) => ({
            day: index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
            date: new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
            icon: getWeatherIcon(day.condition),
            temp: `${Math.round(day.avg_temp)}°C`,
            rain: `${day.rain} mm`
          }));
          setForecasts(mappedForecasts);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors de la récupération des données météo.");
        setLoading(false);
      });
  }, []);

  // Fonction simple pour associer condition météo à un emoji
  function getWeatherIcon(condition) {
    const cond = condition.toLowerCase();
    if (cond.includes('sun') || cond.includes('clear')) return '☀️';
    if (cond.includes('cloud')) return '☁️';
    if (cond.includes('rain')) return '🌧️';
    if (cond.includes('storm')) return '⛈️';
    if (cond.includes('snow')) return '❄️';
    if (cond.includes('fog') || cond.includes('mist')) return '🌫️';
    return '🌤️'; // par défaut
  }

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="agri-weather-forecast">
      <div className="agri-section-header">
        <div className="agri-section-title">
          {/* SVG ici */}
          <h2>Weather Forecast</h2>
        </div>
        <button className="agri-detailed-button">Detailed</button>
      </div>
      <div className="agri-section-content">
        <div className="agri-forecast-grid">
          {forecasts.map((forecast, index) => (
            <div key={index} className="agri-forecast-card">
              <div className="agri-forecast-day">{forecast.day}</div>
              <div className="agri-forecast-date">{forecast.date}</div>
              <div className="agri-forecast-icon">{forecast.icon}</div>
              <div className="agri-forecast-temp">{forecast.temp}</div>
              <div className="agri-forecast-rain">{forecast.rain}</div>
            </div>
          ))}
        </div>
        <div className="agri-weather-impact">
  <h3>Agricultural Impact</h3>
  <p>{generateAgriculturalImpact(forecasts)}</p>
</div>

      </div>
    </div>
  );
}


 function YieldChart() {
  const [yieldData, setYieldData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8002/agriculture/evaluation/")
      .then(res => res.json())
      .then(json => {
        const formatted = Object.entries(json).map(([key, value]) => ({
          month: key.replace(/_/g, ' '),
          yield: Number(value)
        }));
        setYieldData(formatted);
      })
      .catch(err => console.error("Erreur fetch:", err));
  }, []);

  return (
    <div className="agri-chart-container">
      <div className="agri-section-header">
        <div className="agri-section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M2 2V19C2 20.66 3.34 22 5 22H22" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 17L9.59 11.64C10.35 10.76 11.7 10.7 12.52 11.53L13.47 12.48C14.29 13.3 15.64 13.25 16.4 12.37L21 7" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>Rendement Agricole</h2>
        </div>
        <select className="agri-chart-filter">
          <option>2025</option>
        
        </select>
      </div>
      <div className="agri-chart-content">
        <div className="agri-chart-y-axis">
            <span>0%</span>
               <span>25%</span>
                <span>50%</span>
                 <span>75%</span>
          <span>100%</span>
   
        
          
        </div>
        <div className="agri-chart-bars">
          {yieldData.map((data, index) => (
            <div key={index} className="agri-chart-bar-container">
              <div 
                className="agri-chart-bar" 
                style={{ height: `${data.yield}%` }}
                data-value={data.yield}
              ></div>
              <span className="agri-chart-label">{data.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function CircularStats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8002/api/iot-sensor/')
      .then(response => {
        setStats(response.data.stats);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données:', error);
      });
  }, []);

  return (
    <div className="agri-circular-stats-container">
      <div className="agri-section-header">
        <div className="agri-section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V16" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 12H16" stroke="#065F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>Indicateurs Clés</h2>
        </div>
      </div>
      <div className="agri-circular-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="agri-circular-stat">
            <div
              className="agri-circular-progress"
              style={{
                background: `conic-gradient(${stat.color} ${stat.value * 3.6}deg, #E5E7EB 0deg)`
              }}
            >
              <div className="agri-circular-inner">
                <span>{stat.value}</span>
              </div>
            </div>
            <h3>{stat.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
function IoTSensors() {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8002/api/iot-sensors/') // ← adapte l'URL selon ton routage Django
      .then((response) => {
        setSensors(response.data.sensors);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données IoT :", error);
      });
  }, []);

  return (
    <div className="agri-iot-sensors">
      <div className="agri-section-header">
        <div className="agri-section-title">
          {/* SVG ... (inchangé) */}
          <h2>IoT Sensor Data</h2>
        </div>
        <div className="agri-section-actions">
          <button className="agri-history-button">History</button>
          <button className="agri-config-button">Configure</button>
        </div>
      </div>
      <div className="agri-section-content">
        <div className="agri-sensor-grid">
          {sensors.map((sensor) => (
            <div key={sensor.id} className="agri-sensor-card">
              <div className={`agri-sensor-icon agri-sensor-${sensor.type}`}>
                <span>{sensor.icon}</span>
              </div>
              <div className="agri-sensor-value">{sensor.value}</div>
              <div className="agri-sensor-label">{sensor.label}</div>
              <div className="agri-sensor-location">{sensor.location}</div>
              <div className={`agri-sensor-status agri-status-${sensor.status}`}>
                {sensor.status === 'optimal' ? 'Optimal' : sensor.status === 'warning' ? 'Warning' : 'Alert'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function AgriculturalStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8002/agriculture/ev/')
      .then(response => {
        const data = response.data.evaluation;

        // --- Extraction JSON brut avec RegExp ---
        const match = data.match(/{[\s\S]*?}/);
        if (!match) throw new Error("JSON non trouvé dans la réponse");

        const jsonClean = match[0].replace(/'/g, '"'); // Nettoyage simple
        const parsed = JSON.parse(jsonClean);

        const transformed = Object.entries(parsed).map(([key, value]) => ({
          title: key,
          value: `${value}%`,
          change: 'vs Before',
          trend: value > 50 ? 'up' : value < 50 ? 'down' : 'stable',
        }));

        setStats(transformed);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des statistiques agricoles :', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement en cours...</div>;

  return (
    <div className="agri-agricultural-stats">
      <div className="agri-section-header">
        <div className="agri-section-title">
          <h2>Statistiques Agricoles</h2>
        </div>
        <button className="agri-export-button">Exporter</button>
      </div>
      <div className="agri-section-content">
        <div className="agri-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="agri-stats-card">
              <div className="agri-stats-title">{stat.title}</div>
              <div className="agri-stats-value">{stat.value}</div>
              <div className={`agri-stats-trend agri-trend-${stat.trend}`}>
                <span>{stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}</span>
                <span>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="agri-stats-footer">
          <a href="#">Voir le rapport complet →</a>
        </div>
      </div>
    </div>
  );
}












function MarketTrends() {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8002/api/market-trends/') // ← adapte l’URL si nécessaire
      .then(response => {
        const formatted = response.data.market_data.map(item => ({
          crop: item.Crop,
          price: item.Price,
          change: item.Change,
          trend: item.Forecast.toLowerCase(), // "Rising" → "rising"
        }));
        setMarketData(formatted);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching market data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading market trends...</div>;
  }

  return (
    <div className="agri-market-trends">
      <div className="agri-section-header">
        <div className="agri-section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M2 2V19C2 20.66 3.34 22 5 22H22" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 17L9.59 11.64C10.35 10.76 11.7 10.7 12.52 11.53L13.47 12.48C14.29 13.3 15.64 13.25 16.4 12.37L21 7" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>Market Trends</h2>
        </div>
        <div className="agri-section-actions">
          <button className="agri-filter-button">Filter</button>
          <button className="agri-details-button">Details</button>
        </div>
      </div>
      <div className="agri-section-content">
        <table className="agri-table">
          <thead>
            <tr className="agri-tr">
              <th className="agri-th">Crop</th>
              <th className="agri-th">Current Price</th>
              <th className="agri-th">Change</th>
              <th className="agri-th">Forecast</th>
              <th className="agri-th">Action</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((item, index) => (
              <tr key={index} className="agri-tr">
                <td className="agri-td">{item.crop}</td>
                <td className="agri-td">{item.price}</td>
                <td className="agri-td">
                  <div className={`agri-change-${item.trend}`}>{item.change}</div>
                </td>
                <td className="agri-td">
                  <span className={`agri-trend-label agri-trend-${item.trend}`}>
                    {item.trend.charAt(0).toUpperCase() + item.trend.slice(1)}
                  </span>
                </td>
                <td className="agri-td">
                  <button className="agri-analyze-button">Analyze</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}







function RevenuePrediction() {
  const [product, setProduct] = useState('wheat');
  const [area, setArea] = useState(1);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPrediction = async () => {
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await fetch('http://127.0.0.1:8002/api/agriculture/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: 'Algeria',
          cultures: [{ Produit: product, Hectares: area }],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Server response:', result);
        throw new Error(result.error || 'Unknown error');
      }

      if (!result.resultats || result.resultats.length === 0) {
        throw new Error('No results returned from server');
      }

      setPrediction(result.resultats[0]);
    } catch (err) {
      console.error('Full error:', err);
      setError('Failed to fetch: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agri-revenue-prediction">
      <div className="agri-section-header">
        <h2>Agricultural Revenue Estimation</h2>
      </div>

      <div className="form-container">
        <div className="agri-form-group">
          <label>Product</label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value.trim())}
            placeholder="e.g. wheat"
          />
        </div>

        <div className="agri-form-group">
          <label>Area (hectares)</label>
          <input
            type="number"
            value={area}
            min="0.1"
            step="0.1"
            onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
          />
        </div>

        <button
          onClick={fetchPrediction}
          disabled={loading || !product.trim() || area <= 0}
          className="predict-button"
        >
          {loading ? 'Calculating...' : 'Estimate Revenue'}
        </button>
      </div>

      {error && (
        <p className="error-message">
          {error}. Please check your input and try again.
        </p>
      )}

      {prediction && (
        <div className="agri-result">
          <h3>Results for {prediction['Produit']}</h3>
          <div className="result-grid">
            <div className="result-item">
              <strong>Yield</strong>
              <span>{prediction['Rendement (t/ha)']} t/ha</span>
            </div>
            <div className="result-item">
              <strong>Production</strong>
              <span>{prediction['Production (t)']} t</span>
            </div>
            <div className="result-item">
              <strong>Price</strong>
              <span>{prediction['Prix (DZD/t)']} DZD/t</span>
            </div>
            <div className="result-item">
              <strong>Revenue</strong>
              <span>{prediction['Revenu (DZD)']} DZD</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}