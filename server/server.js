import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 
import mongoose from "mongoose";
import "./config/env.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import moodRoutes from "./src/routes/moodRoutes.js";
import suggestionRoutes from "./src/routes/suggestionRoutes.js"
import chatbotRoutes from "./src/routes/chatbotRoutes.js"
//load env
dotenv.config();

const app = express();
console.log("ENV TEST: - server.js:15", process.env.GEMINI_API_KEY);

//image
app.use("/uploads", express.static("uploads"));

//middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/ai", suggestionRoutes);
app.use("/api/ai", chatbotRoutes);

//connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected - server.js:28"))
.catch((err) => console.log("MongoDB error - server.js:29", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} - server.js:34`);
});

