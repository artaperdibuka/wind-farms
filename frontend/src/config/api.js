// src/config/api.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://wind-farms.onrender.com'
  : 'http://localhost:5000';

console.log("🔧 API_BASE_URL:", API_BASE_URL);
export default API_BASE_URL;