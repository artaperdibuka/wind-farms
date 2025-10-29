import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Farm from "./models/Farm.js"; // Sigurohu që shtegu është i saktë

dotenv.config();

// Lidhu me MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const importFarms = async () => {
  await connectDB();
  
  const results = [];
  let importedCount = 0;
  let errorCount = 0;

  console.log("📖 Duke lexuar CSV file...");

  fs.createReadStream("data.csv")
    .pipe(csv())
    .on("data", (data) => {
      // Filtro vetëm për Ballkan dhe ferma operative
      const balkanCountries = [
        'Albania', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia',
        'Greece', 'Kosovo', 'Montenegro', 'North Macedonia',
        'Romania', 'Serbia', 'Slovenia'
      ];

      if (balkanCountries.includes(data['Country/Area']) && 
          data['Status'] === 'operating' &&
          parseFloat(data['Capacity (MW)']) >= 10) {
        
        results.push({
          name: data['Project Name'] || 'Wind Farm',
          country: data['Country/Area'],
          latitude: parseFloat(data['Latitude']),
          longitude: parseFloat(data['Longitude']),
          capacity: parseFloat(data['Capacity (MW)']),
          production: parseFloat(data['Capacity (MW)']) * 2.5, // Estimated
          status: data['Status'],
          operator: data['Operator'] || ''
        });
      }
    })
    .on("end", async () => {
      console.log(`📊 Gjetëm ${results.length} ferma për import...`);

      try {
        // Përdor insertMany në vend të create për çdo rresht
        // Kjo është shumë më e shpejtë
        const insertedFarms = await Farm.insertMany(results, { 
          ordered: false // Vazhdo edhe nëse ka disa gabime
        });
        
        importedCount = insertedFarms.length;
        console.log(`✅ U importuan ${importedCount} ferma me sukses!`);
        
      } catch (err) {
        console.error("❌ Gabim gjatë importimit:", err.message);
        errorCount = err.writeErrors ? err.writeErrors.length : 0;
        
        // Nëse disa u importuan, trego numrin
        if (err.insertedDocs && err.insertedDocs.length > 0) {
          console.log(`⚠️  U importuan ${err.insertedDocs.length} ferma, ${errorCount} dështuan`);
        }
      } finally {
        await mongoose.connection.close();
        console.log("🔌 Lidhja u mbyll");
        process.exit(0);
      }
    })
    .on("error", (err) => {
      console.error("❌ Gabim në leximin e CSV:", err);
      process.exit(1);
    });
};

// Ekzekuto
importFarms();