import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 
import mongoose from "mongoose";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import moodRoutes from "./src/routes/moodRoutes.js";


//load env
dotenv.config();

const app = express();


//middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/moods", moodRoutes);

//connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected - server.js:25"))
.catch((err) => console.log("MongoDB error - server.js:26", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} - server.js:31`);
});

app.listen(3000, () => {
  console.log("Server running... - server.js:35");
})