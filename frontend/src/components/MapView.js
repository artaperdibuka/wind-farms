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
        console.log("🔄 Duke marrë fermat nga API...");
        const apiUrl = `${API_BASE_URL}/api/farms`;
        console.log("🌐 URL e përdorur:", apiUrl);
        
        const res = await axios.get(apiUrl);
        console.log("📊 Response data type:", typeof res.data);
        
        // KONTROLLO NËSE ËSHTË ARRAY PARA SE TË VË NË STATE
        if (Array.isArray(res.data)) {
          console.log("✅ Fermat e marra:", res.data.length);
          setFarms(res.data);
        } else {
          console.error("❌ Response nuk është array:", res.data);
          setFarms([]); // Vendos array bosh nëse nuk është array
        }
      } catch (err) {
        console.error("❌ Gabim gjatë marrjes së fermave:", err);
        setFarms([]); // Vendos array bosh në rast errori
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
      // ✅ KORREKT - përdor API_BASE_URL
      await axios.delete(`${API_BASE_URL}/api/farms/${id}`);
      setFarms(farms.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Gabim gjatë fshirjes së fermës:", err);
    }
  };

  const icon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
  });

  // ✅ SIGUROHU QË farms ËSHTË ARRAY PARA FILTER
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
    : []; // Nëse farms nuk është array, kthe array bosh

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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✅ SIGUROHU QË filteredFarms ËSHTË ARRAY */}
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
                  Shiko Diagramin
                </button>
                <br />
                <button
                  onClick={() => deleteFarm(farm._id)}
                  className="delete-btn"
                >
                  <FaTrash /> Fshije Fermën
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