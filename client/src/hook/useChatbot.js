import { useState, useEffect } from "react";
import api from "../lib/axios";


export default function useChatbot(userId, newestMessage) {
    const [loading, setLoading] = useState(true);
    const [chatMessage, setChatMessage] = useState({
        message: "",
        role: "",
        createdAt: ""
    });
    const getChatbotRep = async () => {
        try {
            
            const response = await api.post("ai/chatbot", {
                userId,
                newestMessage
            })

            setChatMessage(response.data);
        } catch (err) {
            console.error("AI reply error:  useSuggestion.js:56 - useChatbot.js:22", err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (!userId || !newestMessage) {
            setLoading(false);
            return;
        }
        getChatbotRep();
    }, [userId, newestMessage]);


    return { chatMessage, loading };
}