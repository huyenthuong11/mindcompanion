import express from "express";
import { chatbotRep } from "../services/chatbotService.js";
import ChatMessages from "../models/ChatMessages.js";
import Suggestions from "../models/Suggestions.js";
const router = express.Router();

//POST /api/ai/chatbot
router.post("/chatbot", async(req, res) =>{
    try {
        const {userId, newestMessage} = req.body;
        const lastUserMessage = await ChatMessages
            .findOne({userId, role: "user"})
            .sort({ createdAt: -1 })
            .lean();
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
        const filteredHistory = history.filter(
            m => m.message.length > 3
        );
        
        filteredHistory.reverse();
        let newAiChatMessage;
        let aiReply;
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        const wordCount = newestMessage.trim().split(/\s+/).length;
        const declineWords = [
            "không",
            "tớ không",
            "ko",
            "không đâu",
            "thôi",
            "không có gì",
            "k có gì",
            "bỏ đi",
            "được rồi",
            "kệ đi"
        ];
        const msg = newestMessage.toLowerCase().trim();
        if (wordCount < 2 || newestMessage.length <= 3 || declineWords.includes(msg)) {
            const replies = [
                "Mình luôn ở đây lắng nghe bạn nhé",
                "Ừm, nếu sau này bạn muốn nói thì mình vẫn ở đây nhé",
                "Không sao đâu, khi nào muốn tâm sự mình vẫn nghe nè",
                "Mình vẫn ở đây nếu bạn cần"
            ];
            aiReply = replies[Math.floor(Math.random() * replies.length)];
        } else if (newestMessage === lastUserMessage?.message && newestMessage.length < 10) {
            const replies = [
                "Mình vẫn trả lời giống lúc nãy thôi 😄",
                "Bạn hỏi lại à?",
                "Yên vẫn ở đây nè.",
                "Bạn đang chọc mình à?"
            ];
            aiReply = replies[Math.floor(Math.random() * replies.length)];
        } else {
            await delay(300);
            aiReply = await chatbotRep(analysis, filteredHistory);
        }
        newAiChatMessage = await ChatMessages.create({
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
router.get("/getChatHistory", async(req, res) => {
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
router.delete("/delete/:id", async (req, res) => {
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