import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/style.css";
import { FaSearch, FaTrash } from "react-icons/fa";

const MapView = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // Mapping për të kthyer emrat e shteteve në anglisht nëse janë në shqip
  const countryToEnglish = {
    'Kosova': 'Kosovo',
    'Shqipëria': 'Albania', 
    'Maqedonia e Veriut': 'North Macedonia',
    'Mali i Zi': 'Montenegro',
    'Serbia': 'Serbia',
    'Bosnja dhe Hercegovina': 'Bosnia and Herzegovina',
    'Kroacia': 'Croatia',
    'Sllovenia': 'Slovenia',
    'Bullgaria': 'Bulgaria',
    'Rumania': 'Romania',
    'Greqia': 'Greece'
  };

  // Funksion për të kthyer në anglisht
  const toEnglish = (name) => {
    return countryToEnglish[name] || name;
  };

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/farms");
        setFarms(res.data);
      } catch (err) {
        console.error("Gabim gjatë marrjes së fermave:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, []);

  if (loading) return <div className="loading-text">Po ngarkohen fermat...</div>;

  const deleteFarm = async (id) => {
    if (!window.confirm("A je i sigurt që do të fshish këtë fermë?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/farms/${id}`);
      setFarms(farms.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Gabim gjatë fshirjes së fermës:", err);
    }
  };

  const icon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
  });

  // Filtrimi punon me të dyja gjuhët
  const filteredFarms = farms.filter((farm) => {
    if (!filter || filter.trim() === '') return true;
    if (!farm.country) return false;
    
    const farmCountry = farm.country.toString().toLowerCase().trim();
    const farmCountryEnglish = toEnglish(farm.country).toLowerCase().trim();
    const searchText = filter.toLowerCase().trim();
    
    return farmCountry.includes(searchText) || farmCountryEnglish.includes(searchText);
  });

  return (
    <div className="map-container">
      <div className="map-search-container">
        <FaSearch className="map-search-icon" />
        <input
          type="text"
          placeholder="Kërko fermat sipas shteteve (Kosovo, Albania, etc)..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="map-search-input"
        />
      </div>

      <MapContainer
        center={[42.5, 20.9]}
        zoom={7}
        style={{ height: "80vh", width: "100%" }}
      >
        {/* PËRDOR KËTË TILELAYER PËR EMRA ANGLISHT */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredFarms.map((farm) => (
          <Marker
            key={farm._id}
            position={[farm.latitude, farm.longitude]}
            icon={icon}
          >
            <Popup>
              <div className="farm-popup">
                <b>{farm.name}</b>
                <br />
                📍 {toEnglish(farm.country)} {/* Shfaq në anglisht */}
                <br />
                ⚡ Capacity: {farm.capacity} MW
                <br />
                🏭 Production: {farm.production} GWh
                <br />
                <button
                  onClick={() => deleteFarm(farm._id)}
                  className="delete-btn"
                >
                  <FaTrash /> Delete Farm
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;