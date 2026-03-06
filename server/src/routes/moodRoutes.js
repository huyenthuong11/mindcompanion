import express from "express";
import {
    createMoodEntry,
    getMoodEntries,
    deleteMoodEntry
} from "../controllers/moodController.js";

const router = express.Router();

//POST /api/moods/create
router.post("/create", createMoodEntry);

//GET /api/moods/get
router.get("/get", getMoodEntries);

//DELETE /api/moods/delete/:id
router.delete("/delete/:id", deleteMoodEntry);

export default router;