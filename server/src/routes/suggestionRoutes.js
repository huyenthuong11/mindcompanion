import express from "express";
import { analyzeMood } from "../services/aiService.js";

const router = express.Router();

//POST /api/ai/suggestion
router.post("/suggestion", async (req, res) => {
  console.log("AI route called - suggestionRoutes.js:8");
  const journalData = req.body;

  const aiResult = await analyzeMood(journalData);

  res.json({ result: aiResult });

});

export default router;