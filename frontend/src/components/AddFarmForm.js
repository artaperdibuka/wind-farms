import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FaWind, 
  FaGlobeEurope, 
  FaMapMarkerAlt, 
  FaBolt, 
  FaIndustry,
  FaPlus 
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../styles/style.css";

const AddFarmForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    country: "",
    latitude: "",
    longitude: "",
    capacity: "",
    production: "",
  });

  // LISTA E PLOTË E SHTETEVE TË BALKANIT
  const balkanCountries = [
    "Zgjidhni shtetin...",
    "Kosovo",
    "Albania",
    "North Macedonia",
    "Montenegro",
    "Serbia",
    "Croatia",
    "Bosnia and Herzegovina",
    "Slovenia",
    "Bulgaria",
    "Romania",
    "Greece"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.country === "" || form.country === "Zgjidhni shtetin...") {
      return toast.error("Ju lutemi zgjidhni një shtet!");
    }
    
    if (form.latitude < -90 || form.latitude > 90) return toast.error("Latitude duhet të jetë midis -90 dhe 90");
    if (form.longitude < -180 || form.longitude > 180) return toast.error("Longitude duhet të jetë midis -180 dhe 180");

    try {
      const res = await axios.post("http://localhost:5000/api/farms", {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        capacity: parseFloat(form.capacity),
        production: parseFloat(form.production),
      });
      onAdd(res.data);
      toast.success("Ferma u shtua me sukses!");
      setForm({
        name: "",
        country: "",
        latitude: "",
        longitude: "",
        capacity: "",
        production: "",
      });
    } catch (err) {
      console.error("Error adding farm:", err.response?.data || err.message);
      toast.error("Gabim gjatë shtimit të fermës");
    }
  };

  return (
    <div className="form-container">
      {/* Forma në një rresht - NË MES */}
      <form onSubmit={handleSubmit} className="farm-form">
        {/* Emri i Fermës */}
        <div className="form-group">
          <FaWind className="form-icon icon-wind" />
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="Emri i fermës" 
            required 
            className="form-input"
          />
        </div>

        {/* Shteti */}
        <div className="form-group">
          <FaGlobeEurope className="form-icon icon-globe" />
          <select 
            name="country" 
            value={form.country} 
            onChange={handleChange} 
            required
            className="form-select"
          >
            {balkanCountries.map((country, index) => (
              <option key={index} value={country === "Zgjidhni shtetin..." ? "" : country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Latitude */}
        <div className="form-group form-group-small">
          <FaMapMarkerAlt className="form-icon icon-marker-red" />
          <input 
            name="latitude" 
            type="number" 
            step="any" 
            value={form.latitude} 
            onChange={handleChange} 
            placeholder="Latitude" 
            required 
            className="form-input"
          />
        </div>

        {/* Longitude */}
        <div className="form-group form-group-small">
          <FaMapMarkerAlt className="form-icon icon-marker-orange" />
          <input 
            name="longitude" 
            type="number" 
            step="any" 
            value={form.longitude} 
            onChange={handleChange} 
            placeholder="Longitude" 
            required 
            className="form-input"
          />
        </div>

        {/* Kapaciteti */}
        <div className="form-group form-group-small">
          <FaBolt className="form-icon icon-bolt" />
          <input 
            name="capacity" 
            type="number" 
            value={form.capacity} 
            onChange={handleChange} 
            placeholder="Kapacitet (MW)" 
            required 
            className="form-input"
          />
        </div>

        {/* Prodhim */}
        <div className="form-group form-group-small">
          <FaIndustry className="form-icon icon-industry" />
          <input 
            name="production" 
            type="number" 
            value={form.production} 
            onChange={handleChange} 
            placeholder="Prodhim (GWh)" 
            required 
            className="form-input"
          />
        </div>

        {/* Butoni Shto */}
        <button type="submit" className="submit-btn">
          <FaPlus />
          Shto Fermë
        </button>
      </form>

    </div>
  );
};

export default AddFarmForm;