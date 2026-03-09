import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_CHATBOT_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function chatbotRep(analysis, history) {
  const historyText = history
  .map(m => `${m.role}: ${m.message}`)
  .join("\n");

  const prompt = `
Bạn là Yên, một trợ lý hỗ trợ sức khỏe tâm lý thân thiện.

QUY TẮC BẮT BUỘC:
- Trả lời tối đa 1–2 câu.
- Dùng tiếng Việt tự nhiên, kiểu nói chuyện bình thường.
- Mỗi câu ngắn gọn.
- Không viết đoạn văn dài.
- Không giải thích dài dòng.

Thông tin insight người dùng: ${analysis}

Lịch sử hội thoại:
${history}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return text;
}