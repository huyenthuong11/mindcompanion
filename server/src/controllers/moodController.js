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

//Lấy mood entry hôm nay
export const getTodayMoodEntry = async (req, res) => {
    try {
        const {userId} = req.query;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const totalEntries = await moodEntryModel.find(
            {
                userId: userId,
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            }
        );

        const tagCounts = {
            work: 0,
            relationship: 0,
            personal: 0
        };
        
        totalEntries.forEach(entry => {
            if (entry.tags.some(t => ['work', 'money'].includes(t))) tagCounts.work++;
            if (entry.tags.some(t => ['family', 'relationship', 'love'].includes(t))) tagCounts.relationship++;
            if (entry.tags.some(t => ['health', 'future'].includes(t))) tagCounts.personal++;
        });

        const totalTag = tagCounts.work + tagCounts.relationship + tagCounts.personal;
        
        const calculateScore = (count) => {
            if (totalEntries === 0) return 3;
            return (count / totalTag) * 7 + 3; 
        };
        

        const scores = {
            work: calculateScore(tagCounts.work),
            relationship: calculateScore(tagCounts.relationship),
            personal: calculateScore(tagCounts.personal)
        };

        res.status(200).json({
            scores: scores
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to retrieve mood entries"})
    }
}

export const getMoodEntryById = async (req, res) => {
    try {
        const {userId} = req.query;
        const entry = await moodEntryModel.findOne({
            userId,
            _id: req.params.id
        });
        if (!entry) {
            return res.status(404).json({ message: "Mood entry not found" });
        }
        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve mood entry" });
    }
};