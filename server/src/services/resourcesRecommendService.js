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

const genAI = new OpenAI({
    apiKey: process.env.GROG_RESOURCE_RECOMMEND,
    baseURL: "https://api.groq.com/openai/v1"
});

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

export async function recommendResources(analysis) {
    const prompt = `
        Bạn là 'Yên - Chuyên gia điều phối tài nguyên tinh thần'. 
        Nhiệm vụ của bạn là phân tích sâu sắc trạng thái tâm lý người dùng và kích hoạt công cụ tìm kiếm để lấy dữ liệu.
        QUY TẮC SUY LUẬN TỪ KHÓA:
        1. Nếu người dùng Stress/Áp lực (công việc, học tập): Search các từ khóa về 'healing_music', 'giảm căng thẳng', 'tập trung'.
        2. Nếu người dùng Buồn/Cô đơn/Thất vọng: Search các từ khóa về 'funny_video', 'vui vẻ', 'truyền cảm hứng'.
        3. Nếu người dùng Mệt mỏi/Kiệt sức (Energy thấp): Search các từ khóa về 'healing_video', 'thiền', 'thư giãn sâu'.
        4. Nếu người dùng Tích cực/Hào hứng: Search các từ khóa về 'exercise', 'năng lượng', 'vận động'.

        YÊU CẦU ĐẦU RA:
        - Chỉ được gọi tool 'search_resources_from_db'.
        - Sau khi nhận dữ liệu từ tool, KHÔNG ĐƯỢC giải thích gì thêm, chỉ trả về kết quả JSON cuối cùng.
        `;
    try {
        const messages = [
            { role: "system", content: prompt },
            { role: "user", content: `Phân tích trạng thái người dùng: "${analysis}". Hãy tìm tài nguyên phù hợp.` }
        ];
        const response = await genAI.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: messages,
            tools: tools,
            tool_choice: { type: "function", function: { name: "search_resources_from_db" } }
        });

        const toolCall = response.choices[0].message.tool_calls[0];
        if (toolCall) {
            const { query } = JSON.parse(toolCall.function.arguments);
            const resources = await getResourcesFromDB(query);
            return {
                success: true,
                metadata: {
                    analysis_used: analysis,
                    search_query: query,
                    timestamp: new Date().toISOString()
                },
                resources: resources
            };
        }

        return { success: false, resources: [], message: "AI không tìm thấy tool phù hợp" };
    } catch (error) {
        console.error("Agent Error:", error);
        return { success: false, error: error.message };
    }



}