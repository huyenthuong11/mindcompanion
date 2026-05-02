import OpenAI from "openai";
const genAI = new OpenAI({
  apiKey: process.env.GROG_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function analyzeMood(data, chatHistory) {
  const historyText = chatHistory
  .map(m => `${m.role}: ${m.message}`)
  .join("\n");
  const prompt = `
Bạn là trợ lý sức khỏe tinh thần.

Dữ liệu 3 ngày gần nhất:

${JSON.stringify(data)}

Cuộc đối thoại với chatbot trong 3 ngày gần nhất: ${historyText}

Hãy:
1. Phân tích trạng thái tinh thần, tìm ra insight cốt lõi
2. Xác định cảm xúc chính trong tối đa 8 từ
3. Xác định năng lượng chính trong tối đa 8 từ
4. Gợi ý 3 hoạt động cải thiện một cách ngắn gọn nhất
Câu trả lời phải 100% tiếng việt và chỉ trả về JSON:
{
emotion:"",
energy:"",
analysis:"",
suggestions:[]
}
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
  const text = result.choices[0].message.content;;
  const clean = text.replace(/```json|```/g, "");
  return JSON.parse(clean);
}