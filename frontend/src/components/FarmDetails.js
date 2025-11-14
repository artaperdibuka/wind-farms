import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import API_BASE_URL from "../config/api"; 


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

  if (loading) return <p>Po ngarkohen të dhënat e fermës...</p>;
  if (error) return <p>{error}</p>;
  if (!farm) return <p>Ferma nuk u gjet.</p>;

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
    <div style={{ padding: "20px", width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Detajet e Fermës: {farm.name}</h2>
      <p>📍 Shteti: {farm.country}</p>
      <p>⚡ Kapaciteti: {capacityValue} MW</p>
      <p>🏭 Prodhimi total: {productionValue} GWh</p>

      <h3>Grafiku i Prodhimit (24 orë aproksim)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={productionData}>
          <XAxis dataKey="hour" label={{ value: 'Ora', position: 'insideBottomRight', offset: -5 }} />
          <YAxis label={{ value: 'MW', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="power" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FarmDetails;
