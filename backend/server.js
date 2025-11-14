import express from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import farmRoutes from "./routes/farmRoutes.js";

dotenv.config(); 

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    const app = express();
    
    // CORS FIX - lejo të gjitha origins për development
    app.use(cors({
      origin: "*", // Lejo të gjitha domains
      // Ose specifiko të gjitha domains që do t'i përdorësh:
      // origin: [
      //   'https://ballakan-wind-farms.vercel.app',
      //   'http://localhost:3000',
      //   'http://localhost:49283',
      //   'http://127.0.0.1:3000',
      //   'http://192.168.1.*' // për network access
      // ],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }));
    
    app.use(express.json()); 
    app.use("/api/farms", farmRoutes); 
    
    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', message: 'Server is running' });
    });
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();