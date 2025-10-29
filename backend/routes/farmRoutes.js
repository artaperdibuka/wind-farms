import express from "express";
import Farm from "../models/Farm.js";

const router = express.Router();

// ✅ Merr të gjitha fermat
router.get("/", async (req, res) => {
  try {
    const farms = await Farm.find();
    res.json(farms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Shto një fermë të re
router.post("/", async (req, res) => {
  try {
    const newFarm = new Farm(req.body);
    const savedFarm = await newFarm.save();
    res.json(savedFarm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Fshi një fermë sipas ID-së
router.delete("/:id", async (req, res) => {
  try {
    await Farm.findByIdAndDelete(req.params.id);
    res.json({ message: "Ferma u fshi me sukses" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
