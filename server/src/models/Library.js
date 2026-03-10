import mongoose from "mongoose";

const librarySchema = new mongoose.Schema(
    {
        title: String,
        type: {
            type: String,
            enum: ["healing_music", "funny_video", "exercise", "healing_video"],
        },
        videoId: String
    },
    {   
        timestamps: true 
    }
);

export default mongoose.model("librarySchema", librarySchema);