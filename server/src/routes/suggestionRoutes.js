import express from "express";
import { analyzeMood } from "../services/aiService.js";
import Suggestions from "../models/Suggestions.js";
import crypto from "crypto";
import authMiddleware from "../middlewares/authMiddleware.js";
import ChatMessages from "../models/ChatMessages.js";

const router = express.Router();
function hashMoods(moods){
  const str = JSON.stringify(moods);
  return crypto.createHash("md5").update(str).digest("hex");
}
console.log("");
//POST /api/ai/suggestion
router.post("/suggestion", authMiddleware, async (req, res) => {
  try {

    const { userId, moods } = req.body;
    const moodHash = hashMoods(moods);
    
    const lastSuggestion = await Suggestions
      .findOne({ userId })
      .sort({ createdAt: -1 });
    
    const avgMood = Math.round((moods.reduce((sum, item) => sum + item.mood, 0) / moods.length) * 100) / 100;
    const avgEnergy = Math.round((moods.reduce((sum, item) => sum + item.energy, 0) / moods.length) * 100) / 100 ;

    if (lastSuggestion && lastSuggestion.moodHash === moodHash) {
      return res.json( lastSuggestion );
    }

    if (!userId || !moods) {
      return res.status(400).json({
        error: "Missing userId or moods"
      });
    }

    const chatHistory = await ChatMessages.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    chatHistory.reverse();
    const aiResult = await analyzeMood(moods, chatHistory);
    const newSuggestion = await Suggestions.create({
      userId,
      moodHash,
      avgMood,
      avgEnergy,
      ...aiResult
    });

    res.json(newSuggestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI suggestion failed" });
  }
});


export default router;