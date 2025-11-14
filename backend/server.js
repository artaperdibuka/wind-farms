import express from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import farmRoutes from "./routes/farmRoutes.js";

dotenv.config(); 
connectDB(); 
const app = express();
 app.use(cors()); 
 app.use(express.json()); 
 app.use("/api/farms", farmRoutes); 
 app.listen(5000, () => console.log("Server running on port 5000"));


