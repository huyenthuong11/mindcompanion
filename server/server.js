import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 
import mongoose from "mongoose";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import moodRoutes from "./src/routes/moodRoutes.js";
import suggestionRoutes from "./src/routes/suggestionRoutes.js"

//load env
dotenv.config();

const app = express();
console.log("ENV TEST: - server.js:14", process.env.GEMINI_API_KEY);

//middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/ai", suggestionRoutes);

//connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected - server.js:26"))
.catch((err) => console.log("MongoDB error - server.js:27", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} - server.js:32`);
});

