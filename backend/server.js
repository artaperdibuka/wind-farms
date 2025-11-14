import express from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import farmRoutes from "./routes/farmRoutes.js";

dotenv.config(); 

const startServer = async () => {
  try {
    // Prij të lidhet me MongoDB para se të nisim serverin
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    const app = express();
    app.use(cors()); 
    app.use(express.json()); 
    app.use("/api/farms", farmRoutes); 
    
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();