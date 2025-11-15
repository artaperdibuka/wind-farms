import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import API_BASE_URL from "../config/api"; 
import "../styles/FarmDetails.css"; // Import CSS file

function FarmDetails() {
  const { id } = useParams();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🆔 FarmDetails - ID nga URL:", id);
    
    const fetchFarm = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🔍 Duke kërkuar fermën me ID:", id);
        
        const res = await axios.get(`${API_BASE_URL}/api/farms/${id}`);
        console.log("✅ Farm e gjetur:", res.data);
        
        setFarm(res.data);
      } catch (err) {
        console.error("❌ Gabim gjatë marrjes së fermës:", err);
        setError(`Ferma me ID ${id} nuk u gjet.`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFarm();
  }, [id]);

  if (loading) return <div className="loading">Po ngarkohen të dhënat e fermës...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!farm) return <div className="error">Ferma nuk u gjet.</div>;

  // Siguro që production të jetë numër valid
  const productionValue = !isNaN(farm.production) ? farm.production : 0;
  const capacityValue = !isNaN(farm.capacity) ? farm.capacity : 10; // default 10 MW

  // Gjenerim të dhënash testuese për 24 orë nëse nuk ka productionHistory
  const productionData = farm.productionHistory && farm.productionHistory.length > 0
    ? farm.productionHistory
    : Array.from({ length: 24 }, (_, i) => ({
        hour: `${i + 1}`,
        power: Math.round(productionValue / 24 + Math.random() * (capacityValue / 10)) // aproksim
      }));

  return (
    <div className="farm-details-container">
      <div className="farm-header">
        <h2>Detajet e Fermës: {farm.name}</h2>
        <div className="farm-info-grid">
          <div className="info-item">
            <span className="info-label">📍 Shteti:</span>
            <span className="info-value">{farm.country}</span>
          </div>
          <div className="info-item">
            <span className="info-label">⚡ Kapaciteti:</span>
            <span className="info-value">{capacityValue} MW</span>
          </div>
          <div className="info-item">
            <span className="info-label">🏭 Prodhimi total:</span>
            <span className="info-value">{productionValue} GWh</span>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h3>Grafiku i Prodhimit (24 orë aproksim)</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productionData}>
              <XAxis 
                dataKey="hour" 
                label={{ value: 'Ora', position: 'insideBottomRight', offset: -5 }} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ value: 'MW', angle: -90, position: 'insideLeft' }} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <CartesianGrid stroke="#f0f0f0" strokeDasharray="5 5" />
              <Line 
                type="monotone" 
                dataKey="power" 
                stroke="#8884d8" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default FarmDetails;