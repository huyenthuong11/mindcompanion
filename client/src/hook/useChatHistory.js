import api from "../lib/axios";
import { useState, useEffect } from "react";
export default function useChatHistory(userId, limit) {
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const getChatHistory = async () => {
        try{
            const response = await api.get("/ai/getChatHistory", {
                params: {userId, limit}
            });
            setChatHistory(response.data);
        } catch (err) {
            console.error("Get history error - useChatHistory.js:13", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(!userId) {
            setChatHistory([]);
            setLoading(false);
            return;
        }
        getChatHistory();
    }, [userId]);

    return { chatHistory, loading, refreshHistory: getChatHistory };
}