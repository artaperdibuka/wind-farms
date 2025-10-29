import mongoose from "mongoose";

// Skema për fermën e erës
const farmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  capacity: { type: Number, required: true },
  production: { type: Number, required: true },
}, { timestamps: true });

const Farm = mongoose.model("Farm", farmSchema);

export default Farm;
