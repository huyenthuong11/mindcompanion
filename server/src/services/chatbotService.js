import OpenAI from "openai";
import Library from "../models/Library.js"

async function getResourcesFromDB(query) {
    try {
        const keywords = query.split(' ').join('|');
        const regex = new RegExp(keywords, 'i');
        const resources = await Library.find({
            $or: [
                { title: { $regex: regex } },
                { type: { $regex: regex } }
            ]
        }).limit(3);

        return resources;
    } catch (error) {
        return "Lỗi truy vấn dữ liệu.";
    }
}

const tools = [
    {
        type: "function",
        function: {
            name: "search_resources_from_db",
            description: "Tìm kiếm danh sách tài nguyên từ database của thư viện",
            parameters: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Từ khóa tìm kiếm (chủ đề, thể loại video, nhạc)",
                    },
                },
                required: ["query"],
            },
        },
    },
];
const genAI = new OpenAI({
  apiKey: process.env.GROG_CHATBOT_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function chatbotRep(analysis, userMessage, chatHistory) {

  const formattedHistory = chatHistory.map(m => ({
    role: m.role === "user" ? "user" : "assistant",
    content: m.message
  }));

  const now = new Date();
  const currentTime = now.toLocaleString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const systemInstruction = `
Bạn là Yên, trợ lý sức khỏe tâm lý.
Tính cách: Thân thiện, dịu dàng, đồng cảm, nói chuyện như bạn bè thân thiết.
Insight hiện tại về người dùng: ${analysis}
Bối cảnh hiện tại: ${currentTime}.

QUY TẮC PHẢN HỒI:
1. Độ dài: 1-3 câu ngắn gọn.
2. Ngôn ngữ: Tiếng Việt tự nhiên.
3. Không giải thích dài.
4. Ưu tiên sự thấu cảm.
5. Nếu người dùng hỏi tài nguyên, hãy gọi tool search_resources_from_db và trả về tên và loại tài nguyên phù hợp.
`;

  const messages = [
    { role: "system", content: systemInstruction },
    ...formattedHistory,
    { role: "user", content: userMessage }
  ];

  const response = await genAI.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages,
    tools
  });

  const message = response.choices[0].message;

  if (message.tool_calls) {

    const toolCall = message.tool_calls[0];
    const args = JSON.parse(toolCall.function.arguments);

    let toolResult;

    if (toolCall.function.name === "search_resources_from_db") {
      toolResult = await getResourcesFromDB(args.query);
    }

    const secondResponse = await genAI.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        ...messages,
        message,
        {
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult)
        }
      ]
    });

    return secondResponse.choices[0].message.content;
  }

  return message.content;
}