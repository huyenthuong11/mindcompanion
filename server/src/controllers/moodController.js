import moodEntryModel from "../models/MoodEntries.js";

//tạo mood entry mới
export const createMoodEntry = async (req, res) => {
    try {
        const { userId, mood, energy, note, tags } = req.body;
        
        const entry = await moodEntryModel.create({
            userId,
            mood,
            energy,
            note, 
            tags
        });
        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ message: "Failed to create mood entry" });
    }
};

//Lấy danh sách mood entry của user
export const getMoodEntries = async (req, res) => {
    try {
        const {userId} = req.query;
        const entries = await moodEntryModel.find({ 
            userId
        })
            .sort({ createdAt: -1 })
            .limit(30);
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve mood entries" });
    }
};

//Xóa mood entry
export const deleteMoodEntry = async (req, res) => {
    try {
        const {userId} = req.body;
        const entries = await moodEntryModel.findOneAndDelete({ 
            userId,
            _id: req.params.id
        })
        if (!entries) {
            return res.status(404).json({ message: "Mood entry not found" });
        }
        res.status(200).json({ message: "Mood entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete mood entry" });
    }
};