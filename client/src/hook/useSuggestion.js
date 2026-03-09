import { useState, useEffect } from "react";
import api from "../lib/axios";

export default function useSuggestion(userId) {
  const [aiResult, setAiResult] = useState({
    avgMood: 0,
    avgEnergy: 0,
    emotion: "",
    energy: "",
    analysis: "",
    suggestions: []
  });

  const [loading, setLoading] = useState(true);

  const getAiResult = async () => {
    try {
      const response = await api.get("/moods/get", {
        params: { userId }
      });

      const moods = response.data
        .slice(0, 10)
        .map(n => ({
          mood: n.mood,
          energy: n.energy,
          note: n.note,
          date: n.createdAt
        }));
        console.log(moods);
      if (moods.length === 0) {
        setAiResult({
            avgMood: 3,
            avgEnergy: 3,
            emotion: "Bình thường",
            energy: "Bình thường",
            analysis: "Bạn chưa có dữ liệu tâm trạng nào.",
            suggestions: [
              "Hãy ghi lại tâm trạng đầu tiên của bạn hôm nay.",
              "Viết vài dòng về ngày của bạn.",
              "Thử đi dạo 10 phút để thư giãn."
            ]
        });
        setLoading(false);
        return;
      }

      const aiRep = await api.post("/ai/suggestion", {
        userId,
        moods
      });

      setAiResult(aiRep.data);

    } catch (err) {
      console.error("AI reply error: - useSuggestion.js:56", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("user - useSuggestion.js:63", userId)
    if (!userId) {
      setLoading(false);
      return;
    }
    console.log("CALL AI  useChatbot.js:32 - useSuggestion.js:68");
    getAiResult();
  }, [userId]);

  const analysis = aiResult.analysis;
  const suggestions = aiResult.suggestions;
  const avgMood = aiResult.avgMood;
  const avgEnergy = aiResult.avgEnergy;
  const emotion = aiResult.emotion;
  const energy = aiResult.energy;
  return { avgMood, avgEnergy, energy, emotion, analysis, suggestions, loading, refreshSuggestion: getAiResult };
}