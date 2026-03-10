import OpenAI from "openai";
const genAI = new OpenAI({
  apiKey: process.env.GROQ_CHATBOT_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function chatbotRep(analysis, history) {
  const historyText = history
  .map(m => `${m.role}: ${m.message}`)
  .join("\n");

  const prompt = `
Bạn là Yên, một trợ lý hỗ trợ sức khỏe tâm lý thân thiện, thấu hiểu và đồng cảm.

QUY TẮC BẮT BUỘC:
- Trả lời tối đa 2-3 câu.
- Dùng tiếng Việt tự nhiên, kiểu nói chuyện bình thường.
- Mỗi câu ngắn gọn.
- Không viết đoạn văn dài.
- Không giải thích dài dòng.

Thông tin insight người dùng: ${analysis}

Lịch sử hội thoại:
${historyText}
`;

  const result = await genAI.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return result.choices[0].message.content;
}