import OpenAI from "openai";
const genAI = new OpenAI({
  apiKey: process.env.GROG_CHATBOT_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function chatbotRep(analysis, userMessage, chatHistory) {
  const formattedHistory = chatHistory.map(m => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: m.message
  }));

  const now = new Date();
  const currentTime = now.toLocaleString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const systemInstruction = `
Bạn là Yên, trợ lý sức khỏe tâm lý. 
Tính cách: Thân thiện, dịu dàng, đồng cảm, nói chuyện như bạn bè thân thiết.
Insight hiện tại về người dùng: ${analysis}
Bối cảnh hiện tại: ${currentTime}.

QUY TẮC PHẢN HỒI:
1. Độ dài: 1-3 câu ngắn gọn. Tuyệt đối không viết đoạn văn.
2. Ngôn ngữ: Tiếng Việt tự nhiên (ví dụ dùng: "mình", "bạn", "nè", "hì", "nhé").
3. Không giải thích, không liệt kê, không nhắc lại từ ngữ chuyên môn từ Insight.
4. Ưu tiên sự thấu cảm hơn là đưa ra lời khuyên máy móc.
`;

  const result = await genAI.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      { role: "system", content: systemInstruction },
      ...formattedHistory,
      { role: "user", content: userMessage }
    ]
  });

  return result.choices[0].message.content;
}