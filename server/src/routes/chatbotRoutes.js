import express from "express";
import { chatbotRep } from "../services/chatbotService.js";
import Suggestions from "../models/Suggestions.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import ChatMessages from "../models/ChatMessages.js";

const router = express.Router();

//POST /api/ai/chatbot
router.post("/chatbot", authMiddleware, async(req, res) =>{
    try {
        const {userId, newestMessage} = req.body;

        await ChatMessages.create({
            userId,
            message: newestMessage, 
            role: "user"
        })
        
        const suggestion = await Suggestions
        .findOne({userId})
        .sort({ createdAt: -1 })
        
        const analysis = suggestion?.analysis || "";

        const history = await ChatMessages
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();
            
        
        history.reverse();
        const aiReply = await chatbotRep(analysis, newestMessage, history);
        
        const newAiChatMessage = await ChatMessages.create({
            userId,
            message: aiReply,
            role: "bot"
        }); 
        res.json(newAiChatMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI rep failed" });
    }
});

//GET /api/ai/getChatHistory
router.get("/getChatHistory", authMiddleware, async(req, res) => {
    try{
        const {userId, limit} = req.query;
        console.time("getHistory");
        const tempEntries = await ChatMessages
        .find({userId})
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        const entries = tempEntries.reverse();
        console.timeEnd("getHistory");
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve chat entries" });
    }
});

//DELETE /api/ai/delete/:id
router.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        const {userId} = req.body;
        const entries = await ChatMessages.findOneAndDelete({ 
            userId,
            _id: req.params.id
        })
        if (!entries) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.status(200).json({ message: "Message entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete message entry" });
    }
});

export default router;