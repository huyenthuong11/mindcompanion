import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeMood(data) {
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  console.log("Gemini key: - aiService.js:7", process.env.GEMINI_API_KEY);

  const prompt = `
Bạn là trợ lý sức khỏe tinh thần.

Dữ liệu 3 ngày gần nhất:

${JSON.stringify(data)}

Hãy:
1. Phân tích trạng thái tinh thần
2. Xác định cảm xúc chính
3. Gợi ý 3 hoạt động cải thiện một cách ngắn gọn nhất

Chỉ trả về JSON:
{
emotion:"",
analysis:"",
suggestions:[]
}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}