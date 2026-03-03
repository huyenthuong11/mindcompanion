import express from "express";
import {
    createMoodEntry,
    getMoodEntries,
    deleteMoodEntry
} from "../controllers/moodController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

//POST /api/moods
router.post("/create", authMiddleware, createMoodEntry);

//GET /api/moods
router.get("/get", authMiddleware, getMoodEntries);

//DELETE /api/moods/:id
router.delete("/delete/:id", authMiddleware, deleteMoodEntry);

export default router;