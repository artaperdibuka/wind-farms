import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/style.css";
import { FaSearch, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../config/api';

const MapView = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // Mapping countries to English
  const countryToEnglish = {
    Kosova: "Kosovo",
    Shqipëria: "Albania",
    "Maqedonia e Veriut": "North Macedonia",
    "Mali i Zi": "Montenegro",
    Serbia: "Serbia",
    "Bosnja dhe Hercegovina": "Bosnia and Herzegovina",
    Kroacia: "Croatia",
    Sllovenia: "Slovenia",
    Bullgaria: "Bulgaria",
    Rumania: "Romania",
    Greqia: "Greece",
  };

  const toEnglish = (name) => {
    return countryToEnglish[name] || name;
  };

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        console.log("🔄 Fetching farms from API...");
        const apiUrl = `${API_BASE_URL}/api/farms`;
        console.log("🌐 API URL:", apiUrl);
        
        const res = await axios.get(apiUrl);
        console.log("📊 Response data type:", typeof res.data);
        
        // CHECK IF RESPONSE IS AN ARRAY BEFORE SETTING STATE
        if (Array.isArray(res.data)) {
          console.log("✅ Farms fetched:", res.data.length);
          setFarms(res.data);
        } else {
          console.error("❌ Response is not an array:", res.data);
          setFarms([]); // Set empty array if not an array
        }
      } catch (err) {
        console.error("❌ Error fetching farms:", err);
        setFarms([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, []);

  if (loading) return <div className="loading-text">Loading farms...</div>;

  const deleteFarm = async (id) => {
    if (!window.confirm("Are you sure you want to delete this farm?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/farms/${id}`);
      setFarms(farms.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Error deleting farm:", err);
    }
  };

  const icon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
  });

  // ENSURE farms IS AN ARRAY BEFORE FILTERING
  const filteredFarms = Array.isArray(farms) 
    ? farms.filter((farm) => {
        if (!filter || filter.trim() === "") return true;
        if (!farm.country) return false;

        const farmCountry = farm.country.toString().toLowerCase().trim();
        const farmCountryEnglish = toEnglish(farm.country).toLowerCase().trim();
        const searchText = filter.toLowerCase().trim();

        return (
          farmCountry.includes(searchText) ||
          farmCountryEnglish.includes(searchText)
        );
      })
    : []; // Return empty array if farms is not an array

  return (
    <div className="map-container">
      <div className="map-search-container">
        <FaSearch className="map-search-icon" />
        <input
          type="text"
          placeholder="Search farms by country (Kosovo, Albania, etc)..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="map-search-input"
        />
      </div>

      <div className="map-content">
        <MapContainer
          center={[42.5, 20.9]}
          zoom={7}
          style={{ height: "80vh", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ENSURE filteredFarms IS AN ARRAY */}
          {Array.isArray(filteredFarms) && filteredFarms.map((farm) => (
            <Marker
              key={farm._id}
              position={[farm.latitude, farm.longitude]}
              icon={icon}
            >
              <Popup>
                <div className="farm-popup">
                  <b>{farm.name}</b>
                  <br />
                  📍 {toEnglish(farm.country)}
                  <br />⚡ Capacity: {farm.capacity} MW
                  <br />
                  🏭 Production: {farm.production} GWh
                  <br />
                  <button className="view-btn"
                    onClick={() => navigate(`/farm/${farm._id}`)}
                  >
                    View Chart
                  </button>
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

      <div className="copyright-footer">
        <p>© 2025 All rights reserved to Arta Përdibuka.</p>
      </div>
    </div>
  );
};

export default MapView;
