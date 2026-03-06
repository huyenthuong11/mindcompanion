import api from "../../lib/axios.js";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./page.module.css";

export default function Suggestion() {
    const { user } = useContext(AuthContext);
    const now = new Date();
    const [suggestion, setSuggestion] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(now.getDate() - 3);
    const getSuggestion = async () => {
        try {
            const response = await api.get("/moods/get", {
                params: {
                    userId: user?.id,
                }
            });
            const data = response.data;

            const moods = data
            .slice(-10)
            .map(n=> ({
                mood: n.mood,
                energy: n.energy,
                note: n.note,
                date: n.createdAt
            }));
            const aiSuggest = await api.post("/ai/suggestion", moods);
            setSuggestion(aiSuggest.data.result.suggestions);
        } catch (err) {
            console.error("Failed to fetch moods: - page.js:33", err);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(()=>{
        if(!user?.id) return;
        getSuggestion();
    }, [user?.id])

    return (
        <>
            <div className={styles.cardHeader}>
                Gợi ý hoạt động
            </div>

            <div className={styles.cardMainFrame}>
                <div className={styles.cardAvatar}></div>
                <div className={styles.cardMainContext}>
                    {isLoading ? "Đang phân tích tâm trạng..." : suggestion}
                </div>
            </div>
        </>
    )
}