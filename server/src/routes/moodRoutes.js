import express from "express";
import {
    createMoodEntry,
    getMoodEntries,
    deleteMoodEntry,
    getTodayMoodEntry,
    getMoodEntryById
} from "../controllers/moodController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

//POST /api/moods/create
router.post("/create", authMiddleware, createMoodEntry);

//GET /api/moods/get
router.get("/get", authMiddleware, getMoodEntries);

//DELETE /api/moods/delete/:id
router.delete("/delete/:id", authMiddleware, deleteMoodEntry);

//GET /api/moods/getTodayEntries
router.get("/getTodayEntries", authMiddleware, getTodayMoodEntry);

//GET /api/moods/getById/:id
router.get("/getById/:id", authMiddleware, getMoodEntryById);
export default router;