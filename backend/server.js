// server.js
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
    
    // CORS për production
    app.use(cors({
      origin: [
        'https://your-frontend-app.vercel.app',
        'http://localhost:3000' // për development
      ],
      credentials: true
    }));
    
    app.use(express.json()); 
    app.use("/api/farms", farmRoutes); 
    
    // Health check route
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