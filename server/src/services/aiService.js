import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function analyzeMood(data) {
  
  const prompt = `
Bạn là trợ lý sức khỏe tinh thần.

Dữ liệu 3 ngày gần nhất:

${JSON.stringify(data)}

Hãy:
1. Phân tích trạng thái tinh thần, tìm ra insight cốt lõi
2. Xác định cảm xúc chính
3. Xác định năng lượng chính
4. Gợi ý 3 hoạt động cải thiện một cách ngắn gọn nhất
Câu trả lời phải 100% tiếng việt và chỉ trả về JSON:
{
emotion:"",
energy:"",
analysis:"",
suggestions:[]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const clean = text.replace(/```json|```/g, "");

  return JSON.parse(clean);
}