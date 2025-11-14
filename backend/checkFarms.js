// checkMongoIDs.js
import mongoose from 'mongoose';
import Farm from './models/Farm.js';
import dotenv from 'dotenv';

dotenv.config();

const checkMongoIDs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const farms = await Farm.find();
    console.log(`📊 Total farms in MongoDB: ${farms.length}`);
    
    console.log("🆔 All IDs in MongoDB:");
    farms.forEach((farm, index) => {
      console.log(`${index + 1}. ${farm._id} - ${farm.name}`);
    });
    
    // Kontrollo nëse ID specifike ekziston
    const specificFarm = await Farm.findById('69026fb9a29119567d110d58');
    console.log(`\n🔍 Farm with ID 69026fb9a29119567d110d58 exists: ${!!specificFarm}`);
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
  }
};

checkMongoIDs();