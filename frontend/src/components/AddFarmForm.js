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

  // FULL LIST OF BALKAN COUNTRIES
  const balkanCountries = [
    "Select a country...",
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
    
    if (form.country === "" || form.country === "Select a country...") {
      return toast.error("Please select a country!");
    }
    
    if (form.latitude < -90 || form.latitude > 90) return toast.error("Latitude must be between -90 and 90");
    if (form.longitude < -180 || form.longitude > 180) return toast.error("Longitude must be between -180 and 180");

    try {
      const res = await axios.post("http://localhost:5000/api/farms", {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        capacity: parseFloat(form.capacity),
        production: parseFloat(form.production),
      });
      onAdd(res.data);
      toast.success("Farm added successfully!");
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
      toast.error("Error while adding farm");
    }
  };

  return (
    <div className="form-container">
      {/* Single-row form - CENTERED */}
      <form onSubmit={handleSubmit} className="farm-form">
        {/* Farm Name */}
        <div className="form-group">
          <FaWind className="form-icon icon-wind" />
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="Farm Name" 
            required 
            className="form-input"
          />
        </div>

        {/* Country */}
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
              <option key={index} value={country === "Select a country..." ? "" : country}>
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

        {/* Capacity */}
        <div className="form-group form-group-small">
          <FaBolt className="form-icon icon-bolt" />
          <input 
            name="capacity" 
            type="number" 
            value={form.capacity} 
            onChange={handleChange} 
            placeholder="Capacity (MW)" 
            required 
            className="form-input"
          />
        </div>

        {/* Production */}
        <div className="form-group form-group-small">
          <FaIndustry className="form-icon icon-industry" />
          <input 
            name="production" 
            type="number" 
            value={form.production} 
            onChange={handleChange} 
            placeholder="Production (GWh)" 
            required 
            className="form-input"
          />
        </div>

        {/* Add Button */}
        <button type="submit" className="submit-btn">
          <FaPlus />
          Add Farm
        </button>
      </form>
    </div>
  );
};

export default AddFarmForm;
