MindCompanion là một ứng dụng hỗ trợ sức khỏe tâm lý toàn diện, kết hợp giữa việc theo dõi tâm trạng hàng ngày và trí tuệ nhân tạo (AI) để cung cấp những lời khuyên cá nhân hóa. Dự án tập trung vào trải nghiệm người dùng với giao diện tối giản, tinh tế và các tính năng phân tích dữ liệu trực quan.
Tính năng chính: 
- Theo dõi tâm trạng (Mood Tracking): Ghi lại cảm xúc hàng ngày thông qua hệ thống màu sắc và mức năng lượng trực quan.
- Phân tích chuyên sâu (Analytics): Trực quan hóa dữ liệu tâm lý qua các biểu đồ (Analytics Cards), giúp người dùng nhận ra xu hướng cảm xúc của bản thân.
- Trợ lý AI (Agentic AI Chatbot): Tích hợp chatbot thông minh hỗ trợ tư vấn, lắng nghe và đưa ra các gợi ý cải thiện sức khỏe tinh thần dựa trên ngữ cảnh.
- Ghi chú tâm lý (Psychology Notes): Không gian an toàn để người dùng viết nhật ký và lưu trữ các quan sát về tâm lý cá nhân.
- Kho nội dung chữa lành (Wellness Hub):: Dự án tích hợp kho nội dung đa phương tiện được phân loại khoa học để hỗ trợ người dùng giải tỏa căng thẳng ngay lập tức.
Công nghệ sử dụng:
- Frontend:
  - Framework: Next.js (App Router).
  - Styling: Material UI kết hợp CSS Modules.
  - Quản lý trạng thái: React Context API (AuthContext).
-  Backend
  - Runtime: Node.js
  - Framework: Express.js
  - Cơ sở dữ liệu: MongoDB (kết nối thông qua Mongoose)
  - AI Integration: Groq API
  - Middleware: CORS, Express JSON, Static Uploads (xử lý hình ảnh)
Cấu trúc thư mục:
- 
client
├──public
└──src/
    ├──app/                  
    ├──components/           
    ├──context/              
    ├──hook/                
    ├──lib/
    └──locales/
- server
   ├──config
   └──src/
       ├──controllers/
       ├──middlewares/
       ├──models/
       ├──routes/
       ├──services/
       ├──uploads/

Hướng Dẫn Chạy Dự Án
Cài đặt các gói phụ thuộc:
        npm install
Cấu hình môi trường: Tạo file .env với các thông số:
        PORT=5000
        MONGO_URI: Đường dẫn kết nối MongoDB.
        GROG_API_KEY=Mã khóa API từ groq
        GROG_CHATBOT_API_KEY=Mã khóa API từ groq
        GROG_RESOURCE_RECOMMEND=Mã khóa API từ groq
Khởi chạy Server:
        npm start
Trạng thái dự án:
  - Core Features: Đã hoàn thiện các tính năng chính
  - Video Hub: Đã tích hợp danh sách video giải trí hỗ trợ sức khỏe tinh thần.
  - Internationalization (i18n): Tính năng đa ngôn ngữ hiện đang trong giai đoạn phát triển và sẽ được hoàn thiện trong các bản cập nhật sau.
        
